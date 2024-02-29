import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { Router } from "@angular/router"

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, HttpClientModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent implements OnInit {

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
  }

  addUser(event: Event) {
    var emailReg = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/i);
    var passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    var email = (<HTMLInputElement>document.getElementById("email")).value;
    var prenom = (<HTMLInputElement>document.getElementById("prenom")).value;
    var nom = (<HTMLInputElement>document.getElementById("nom")).value;
    var password = (<HTMLInputElement>document.getElementById("password")).value;
    var telephone = (<HTMLInputElement>document.getElementById("telephone")).value;
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

    var url = "http://localhost:8000/api/get-users";

    var data = {
      "Nom_new": nom,
      "Prenom_new": prenom,
      "AdresseMail_new": email,
      "Telephone_new": telephone,
      "Password_new": password
    };

    this.http.post(url, data)
      .subscribe(
        (data: any) => {
          console.log(data);
          alert("Ajout effectué avec succès");
          this.router.navigate(['/']);
        }, error => {
          console.error('Erreur lors de la modification du profil:', error);
        });
        
    event.preventDefault();
  }

}
