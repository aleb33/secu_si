const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const speakeasy = require('speakeasy');
const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const app = express();
const corsOptions = {
  origin: ['http://localhost:8000'], // Ajoutez le port approprié
  credentials: true,
};

app.use(express.json());
app.use(cookieParser());

app.use(cors(corsOptions));
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  secret: 'votre_secret', // Il s'agit d'une chaîne aléatoire utilisée pour signer la session ID cookie.
  resave: false,
  saveUninitialized: true
}));

require('dotenv').config({
  path: path.resolve(__dirname, '../.env')
});

//Afficher Port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Créer une nouvelle instance de la base de données SQLite et se connecter
const db = new sqlite3.Database('../../Auth_bdd.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connecté à la base de données SQLite Auth');
  }
});

const db2 = new sqlite3.Database('../../Amuaire_bdd.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connecté à la base de données SQLite Amuaire');
  }
});


// const verifySessionToken = (req, res, next) => {
//   const sessionToken = req.cookies.session;

//   // Vérifier si le cookie de session existe
//   if (!sessionToken || !req.cookies.username) {
//     return res.status(401).send('Non autorisé');
//   }

//   const table = "Utilisateurs";

//   db.get(`SELECT * FROM ${table} WHERE AdresseMail = ?`, [req.cookies.username], (err, user) => {
//     if (!user || err) {
//       return res.status(401).send('Non autorisé');
//     }

//     // Vérifier le token avec le secret de session
//     jwt.verify(sessionToken, user.Secret, (err, decoded) => {
//       if (err) {
//         // Gérer les erreurs de validation du token
//         return res.status(401).send('Token de session invalide');
//       }

//       // Stocker les données du token dans la session ou req.user selon vos besoins
//       req.session.user = decoded;

//       next();
//     });
//   });
// };


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/login.html');
});

app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/views/register.html');
});

app.post('/register', async (req, res) => {
  const {
    username,
    password,
    firstname,
    lastname,
    phone
  } = req.body;

  // Vérifier si l'utilisateur existe déjà dans la Bdd avec le même username
  db.get(`SELECT * FROM Utilisateurs WHERE AdresseMail = ?`, [username], (err, user) => {
    if (user) {
      return res.status(401).send("L'utilisateur existe déjà");
    }

    // Si l'utilisateur n'existe pas, procéder à l'inscription
    const salt = "10";
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    const Role = 'Utilisateur';
    const table = 'Utilisateurs';
    const table2 = 'UserAdmin';
    const secret = speakeasy.generateSecret({
      length: 20
    });

    // Insérer l'utilisateur dans la table SQLite
    db.run(
      `INSERT INTO ${table} (AdresseMail, MotDePasse, Role, Secret) VALUES (?, ?, ?, ?)`,
      [username, hash, Role, secret.base32],
      function (err) {
        if (err) {
          console.log(err);
          return res.status(500).send("Erreur lors de l'enregistrement de l'utilisateur. Veuillez réessayer.");
        }
      }
    );
    db2.run(
      `INSERT INTO ${table2} (AdresseMail, Nom, Prenom, Telephone, ChangeRole, Role) VALUES (? ,? ,?, ?, ?, ?)`,
      [username, lastname, firstname, phone, 0, Role],
      function (err) {
        if (err) {
          console.log(err);
          //Supprimer l'utilisateur de la table Utilisateurs
          db.run(
            `DELETE FROM ${table} WHERE AdresseMail = ?`,
            [username],
            function (err) {
              if (err) {
                console.log(err);
                return res.status(500).send("Erreur lors de l'enregistrement de l'utilisateur. Veuillez réessayer.");
              }
            }
          );
          return res.status(500).send("Erreur lors de l'enregistrement de l'utilisateur. Veuillez réessayer.");
        }
      }
    );
    return res.status(200).send('Vous êtes inscrit');
  });
});

app.post('/login', (req, res) => {
  const {
    username,
    password
  } = req.body;
  const table = 'Utilisateurs';

  // Rechercher l'utilisateur dans la table SQLite
  db.get(`SELECT * FROM ${table} WHERE AdresseMail = ?`, [username], (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Erreur lors de l'authentification. Veuillez réessayer.");
    }

    if (!user) {
      console.log('Utilisateur non trouvé');
      return res.status(402).send('Invalid credentials');
    }

    // Vérifier le mot de passe avec PBKDF2
    const salt = "10";
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    if (user.MotDePasse !== hash) {
      console.log('Mot de passe incorrect');
      // Renvoyer un message d'erreur au client pour indiquer des identifiants invalides
      return res.status(401).send('Mot de passe incorrect');
    }

    //récupérer secret de l'utilisateur
    const secretKey = user.Secret;

    // Les données à inclure dans le JWT
    const payload = {
      username: user.AdresseMail,
    };
    // Définir la clé secrète pour le .env
    process.env.SECRET_KEY = secretKey;

    // Options pour la création du JWT (facultatif)
    const options = {
      expiresIn: '2d',
    };

    // Créer le JWT
    const token = jwt.sign(payload, secretKey, options);

    // Clear the session cookie
    res.clearCookie('session');

    // Stocker le JWT dans un cookie sécurisé
    // res.cookie('jwt', token, {
    //   httpOnly: true,
    //   secure: false, // Changez à true en production si vous utilisez HTTPS
    //   sameSite: 'None', // Modifiez en fonction de vos besoins
    //   domain: 'localhost', // Remplacez par l'adresse IP de votre serveur Node.js
    // });

    res.setHeader('Set-Cookie', 'jwt=' + token + '; SameSite=None');

    console.log(res.getHeaders());

    const fs = require('fs');
    // Écrire dans le fichier .env
    fs.writeFileSync('../.env', `KEY_SECRET=${process.env.SECRET_KEY = secretKey}\n`, 'utf-8');

    // Rediriger l'utilisateur vers le serveur Django
    return res.status(200).send('Vous êtes connecté');
  });
});


// app.get('/meteo', verifySessionToken, (req, res) => {
//   res.sendFile(__dirname + '/views/Meteo.html');
// });