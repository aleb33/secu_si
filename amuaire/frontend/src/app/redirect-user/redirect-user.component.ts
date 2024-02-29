import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-redirect-user',
  standalone: true,
  imports: [],
  templateUrl: './redirect-user.component.html',
  styleUrl: './redirect-user.component.css'
})
export class RedirectUserComponent implements OnInit {

  constructor(private router: Router, private http: HttpClient, private cookieService: CookieService) { }

  ngOnInit() {

    return new Promise<Boolean>((resolve, reject) => {
      const url = 'http://localhost:8000/api/verify-token';

      const data = {
        'token': this.cookieService.get('jwt')
      }

      this.http.post<any>(url, data)
        .subscribe(
          (data) => {
            if (data.role == "Administrateur") {
              this.router.navigate(['/home-admin']);
              resolve(true);
            } else {
              this.router.navigate(['/home-user']);
              resolve(true);
            }
          },
          (err) => {
            if (typeof (window) !== 'undefined') {
              window.location.href = "http://localhost:3000/";
            }
            resolve(false);
          }
        );
    });
  }
}
