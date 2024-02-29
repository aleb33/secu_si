import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-modify-profil',
  standalone: true,
  imports: [ MatFormFieldModule, MatInputModule, MatButtonModule ],
  templateUrl: './modify-profil.component.html',
  styleUrl: './modify-profil.component.css'
})
export class ModifyProfilComponent implements OnInit {
  
    constructor(private http: HttpClient, private cookieService: CookieService, private router: Router) { }
  
    ngOnInit(): void {
      this.loadData();
    }

    loadData() {
      // Remplacez l'URL par votre propre URL
      const apiUrl = 'http://localhost:8000/api/profil';

      // Faire la requête GET
      this.http.post(apiUrl, {token : this.cookieService.get('jwt')})
        .subscribe((data: any) => {
          // Traiter les données reçues, par exemple, les assigner à une propriété du composant
          console.log('Données du profil:', data);
          (<HTMLInputElement>document.getElementById("nom")).value = data.Nom;
          (<HTMLInputElement>document.getElementById("prenom")).value = data.Prenom;
          (<HTMLInputElement>document.getElementById("email")).value = data.AdresseMail;
          (<HTMLInputElement>document.getElementById("telephone")).value = data.Telephone;
        }, error => {
          console.error('Erreur lors du chargement des données du profil:', error);
        });
    }

    sendData() {
      var emailReg = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/i);
      var passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;


      // Remplacez l'URL par votre propre URL
      const apiUrl = 'http://localhost:8000/api/modify-profil';

      // recuperer les valeurs des inputs
      var nom = (<HTMLInputElement>document.getElementById("nom")).value;
      var prenom = (<HTMLInputElement>document.getElementById("prenom")).value;
      var email = (<HTMLInputElement>document.getElementById("email")).value;
      var telephone = (<HTMLInputElement>document.getElementById("telephone")).value;
      var password = (<HTMLInputElement>document.getElementById("password")).value;
      var confirmPassword = (<HTMLInputElement>document.getElementById("confirmPassword")).value;

      // verifier que les champs sont remplis correctement
      if (confirmPassword != password) {
        alert("Les mots de passe ne correspondent pas");
      } else if (passwordReg.test(password) == false) {
        alert("Le mot de passe ne respecte pas les critères de sécurité");
      } else if (nom == "" || prenom == "" || email == "" || telephone == "") {
        alert("Veuillez remplir tous les champs");
      } else if (telephone.length != 10) {
        alert("Le numéro de téléphone doit contenir 10 chiffres");
      } else if (isNaN(Number(telephone))) {
        alert("Le numéro de téléphone doit contenir uniquement des chiffres");
      } else if (emailReg.test(email) == false) {
        alert("L'adresse email n'est pas valide");
      }

      const data_sent = {
        "token": this.cookieService.get("jwt"),
        "AdresseMail_new": email,
        "Nom_new": nom,
        "Prenom_new": prenom,
        "Telephone_new": telephone,
        "Password_new": password
      }

  
      // Faire la requête POST
      this.http.post(apiUrl, data_sent)
        .subscribe((data: any) => {
          // afficher le resultat de la requete
          console.log('Informations : ', data);
        }, error => {
          console.error('Erreur lors du chargement des données du profil:', error);
        });

      this.router.navigate(["/"])
    }
}
