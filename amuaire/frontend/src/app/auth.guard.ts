import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
    private http = inject(HttpClient);
    private cookieService = inject(CookieService);
    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const expectedRole: string[] = route.data['expectedRole'];

            if (this.cookieService.get('jwt') == null || this.cookieService.get('jwt') == "") {
                this.router.navigate(['/']);
                resolve(false);
            } else {
                const url = 'http://localhost:8000/api/verify-token';
                this.http.post<any>(url, { token: this.cookieService.get('jwt') })
                    .subscribe(
                        (data) => {
                            if (!expectedRole.includes(data.role)) {
                                this.router.navigate(['/']);
                                resolve(false);
                            } else {
                                resolve(true);
                            }
                        },
                        (err) => {
                            this.router.navigate(['/']);
                            resolve(false);
                        }
                    );
            }
        });
    }
}