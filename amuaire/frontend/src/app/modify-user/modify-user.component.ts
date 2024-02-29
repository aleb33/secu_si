import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import {Router} from "@angular/router"

@Component({
  selector: 'app-modify-user',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, HttpClientModule, CommonModule],
  templateUrl: './modify-user.component.html',
  styleUrl: './modify-user.component.css'
})
export class ModifyUserComponent implements OnInit {

  public isPButtonClicked: boolean = false;
  user: string | null = '';

  constructor(private route: ActivatedRoute, private http: HttpClient, private router:Router) { }

  ngOnInit(): void {

    this.user = this.route.snapshot.paramMap.get('user');

    // On recupere l'utilisateur
    if (this.user !== null) {
      var url = "http://localhost:8000/api/modify-user/" + decodeURIComponent(this.user);

      this.http.get(url)
        .subscribe(
          (data: any) => {
            console.log(data);
            //remplir les champs avec data
            (<HTMLInputElement>document.getElementById("nom")).value = data.Nom;
            (<HTMLInputElement>document.getElementById("prenom")).value = data.Prenom;
            (<HTMLInputElement>document.getElementById("email")).value = data.AdresseMail;
            (<HTMLInputElement>document.getElementById("telephone")).value = data.Telephone;
            this.isPButtonClicked = data.ChangeRole;
          }, error => {
            console.error('Erreur lors du chargement des données du profil:', error);
          });
    }

  }

  promoteUser(event: Event) {
    if (this.isPButtonClicked) {
      this.isPButtonClicked = false;
    } else {
      this.isPButtonClicked = true;
    }

    event.preventDefault();
  }

  modifyUser(event: Event) {
    if (this.user === null) {
      return;
    }
    var emailReg = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/i);
    var passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;


    var url = "http://localhost:8000/api/modify-user/" + this.user + "/"; 

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

    var data = {
      "AdresseMail_selected": decodeURIComponent(this.user).replace('%2E', '.'),
      "Nom_new": nom,
      "Prenom_new": prenom,
      "AdresseMail_new": email,
      "Telephone_new": telephone,
      "ChangeRole_new": this.isPButtonClicked,
      "Password_new": password
    };

    this.http.post(url, data)
      .subscribe(
        (data: any) => {
          console.log(data);
          alert("Modification effectuée avec succès");
          this.router.navigate(['/home-admin']);
        }, error => {
          console.error('Erreur lors de la modification du profil:', error);
        });

    event.preventDefault();
  }


}
