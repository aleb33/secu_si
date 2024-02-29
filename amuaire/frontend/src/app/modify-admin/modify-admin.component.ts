import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-modify-admin',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, CommonModule, HttpClientModule],
  templateUrl: './modify-admin.component.html',
  styleUrl: './modify-admin.component.css'
})
export class ModifyAdminComponent implements OnInit {

  public isPButtonClicked: boolean = false;
  user: string | null = '';

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.user = this.route.snapshot.paramMap.get('user');
    // Remplacez l'URL par votre propre URL
    if (this.user !== null) {
      console.log(this.user);
      var apiUrl = 'http://localhost:8000/api/modify-admin/' + decodeURIComponent(this.user);
      console.log(apiUrl);
      // Faire la requête GET  
      this.http.get(apiUrl)
        .subscribe((data: any) => {
          // Traiter les données reçues, par exemple, les assigner à une propriété du composant
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

  downgradeUser(event: Event) {
    if (this.isPButtonClicked == true) {
      this.isPButtonClicked = false;
    } else {
      this.isPButtonClicked = true;
    }

    event.preventDefault();
  }

  sendData() {
    var emailReg = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/i);
    var passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;


    // Remplacez l'URL par votre propre URL
    const apiUrl = 'http://localhost:8000/api/modify-admin/' + this.user + '/'; 

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
      "AdresseMail_selected": this.user,
      "AdresseMail_new": email,
      "Nom_new": nom,
      "Prenom_new": prenom,
      "Telephone_new": telephone,
      "Password_new": password,
      "ChangeRole_new": this.isPButtonClicked
    }


    // Faire la requête POST
    this.http.post(apiUrl, data_sent)
      .subscribe((data: any) => {
        // afficher le resultat de la requete
        console.log('Informations : ', data);
        this.router.navigate(['/']);
      }, error => {
        console.error('Erreur lors du chargement des données du profil:', error);
      });
  }
}
