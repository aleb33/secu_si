function submitRegisterForm() {
    // Récupérer les données du formulaire
    var firstname = document.getElementById("firstname").value;
    var lastname = document.getElementById("lastname").value;
    var phone = document.getElementById("phone").value;
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var password2 = document.getElementById("confirmPassword").value;

    //vérifier si le prénom à au moins 1 caractère qui est une lettre
    if (firstname.length < 1 || !/[a-zA-Z]/.test(firstname)) {
        alert("Veuillez entrer un prénom valide.");
        document.getElementById("firstname").value = "";
        return;
    }

    //vérifier si le nom à au moins 1 caractère qui est une lettre
    if (lastname.length < 1 || !/[a-zA-Z]/.test(lastname)) {
        alert("Veuillez entrer un nom valide.");
        document.getElementById("lastname").value = "";
        return;
    }


    // Validation de l'adresse e-mail avec une expression régulière
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) {
        alert("Veuillez entrer une adresse e-mail valide.");
        // document.getElementById("username").value = "";
        return;
    }

    if (password !== password2) {
        alert("Les mots de passe ne correspondent pas");
        document.getElementById("password").value = "";
        document.getElementById("confirmPassword").value = "";
        return;
    }

    var isLengthValid = password.length >= 8;
    var isNumberValid = /[0-9]/.test(password);
    var isUppercaseValid = /[A-Z]/.test(password);

    var regexTelephone = /^(?:\+33|0)[1-9](?:[0-9]{8}|[0-9]{9})$/;
    if (!regexTelephone.test(phone)) {
        alert("Veuillez entrer un numéro de téléphone valide.");
        document.getElementById("phone").value = "";
        return;
    }

    if (!isLengthValid || !isNumberValid || !isUppercaseValid) {
        // Mot de passe ne respecte pas les critères
        alert("Le mot de passe doit avoir au moins 8 caractères et contenir des chiffres et des majuscules.");
        document.getElementById("password").value = "";
        document.getElementById("confirmPassword").value = "";
        return;
    }

    var data = {
        username: username,
        password: password,
        firstname: firstname,
        lastname: lastname,
        phone: phone,
    };

    fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.status === 401) {
                // Si le statut est 401, afficher une alerte indiquant que l'utilisateur existe déjà
                alert("L'utilisateur existe déjà.");
            } else if (response.status === 200) {
                // Si le statut est 200, traiter la réponse JSON
                window.location.href = '/';
                return response.json();
            } else {
                // Gérer d'autres statuts de réponse si nécessaire
                throw new Error('Erreur lors de l\'inscription');
            }
        })
        .then(data => {
            // Rediriger l'utilisateur vers la page de connexion
            window.location.href = '/';
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

//add a function if the user click on connexion button redirect to login page
function main() {
    const connect_button = document.getElementById('connectBtn');

    function connect() {
        window.location.href = '/';
    }
    connect_button.addEventListener('click', connect);
}

main();