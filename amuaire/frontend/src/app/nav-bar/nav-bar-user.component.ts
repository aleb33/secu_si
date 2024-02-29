import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-nav-bar-user',
  standalone: true,
  imports: [
    MatToolbarModule, 
    MatIconModule, 
    MatInputModule,
    MatButtonModule,
    HttpClientModule,
    CommonModule
  ],
  templateUrl: './nav-bar-user.component.html',
  styleUrl: './nav-bar-user.component.css'
})
export class NavBarUserComponent implements OnInit {
 
  constructor(private router:Router, private http:HttpClient, private cookieService: CookieService) { }

  ngOnInit() {
    
  }


  modifyProfil(){
    this.router.navigate(['/modify-profil']);
  }

  logout(){
    // appeler la route de déconnexion + redirection vers la page de connexion
  }
}
