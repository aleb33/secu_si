import { Routes, RouterModule } from '@angular/router';
import { HomeUserComponent } from './home-user/home-user.component';
import { HomeAdminComponent } from './home-admin/home-admin.component';
import { ModifyProfilComponent } from './modify-profil/modify-profil.component';
import { ModifyAdminComponent } from './modify-admin/modify-admin.component';
import { ModifyUserComponent } from './modify-user/modify-user.component';
import { AddUserComponent } from './add-user/add-user.component';
import { NgModule } from '@angular/core';
import { AuthGuardService } from './auth.guard';
import { RedirectUserComponent } from './redirect-user/redirect-user.component';
import { provideClientHydration } from '@angular/platform-browser';

export const routes: Routes = [
    // mettre en place (aller soit dans home-user soit dans home-admin)
    { path: '', component: RedirectUserComponent },
    { path: 'home-user', component: HomeUserComponent, canActivate: [AuthGuardService], data: { expectedRole: ['Utilisateur'] } }, 
    { path: 'home-admin', component: HomeAdminComponent, canActivate: [AuthGuardService], data: { expectedRole: ['Administrateur'] } },
    { path: 'modify-profil', component: ModifyProfilComponent, canActivate: [AuthGuardService], data: { expectedRole: ['Utilisateur',"Administrateur"] } },
    { path: 'modify-admin/:user', component: ModifyAdminComponent, canActivate: [AuthGuardService], data: { expectedRole: ['Administrateur'] } },
    { path: 'modify-user/:user', component: ModifyUserComponent, canActivate: [AuthGuardService], data: { expectedRole: ['Administrateur'] } }, 
    { path: 'add-user', component: AddUserComponent, canActivate: [AuthGuardService], data: { expectedRole: ['Administrateur'] } },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule], 
    providers: [provideClientHydration()]
})

export class AppRouteModule { }