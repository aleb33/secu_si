import { Component, OnInit, ViewChild } from '@angular/core';
import { NavBarUserComponent } from '../nav-bar/nav-bar-user.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {Router} from "@angular/router"
import { HttpClient, HttpClientModule } from '@angular/common/http';

export interface UserData {
  AdresseMail: string;
  Nom: string;
  Prenom: string;
  Telephone: string;
}

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [NavBarUserComponent, MatPaginatorModule, MatSortModule, MatTableModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule, HttpClientModule],
  templateUrl: './home-admin.component.html',
  styleUrl: './home-admin.component.css'
})


export class HomeAdminComponent implements OnInit {

  displayedColumns: string[] = ['prenom', 'nom', 'email', 'telephone', 'actions'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.getUsers()
  }

  getUsers() {
    var url = "http://localhost:8000/api/get-users"


    // On recupere la liste des utilisateurs
    this.http.get(url)
      .subscribe(
        (data: any) => {
          this.dataSource = new MatTableDataSource(data);
        }, error => {
          console.error('Erreur lors du chargement des données du profil:', error);
        });

  }

  deleteUser(row: UserData) {
    var url = "http://localhost:8000/api/delete-user"

    const data = {
      "AdresseMail_selected": row.AdresseMail
    }

    this.http.post(url, data)
      .subscribe(
        (data: any) => {
          this.getUsers()
        }, error => {
          console.error('Erreur lors du chargement des données du profil:', error);
        });
  }

  editUser(row: UserData) {
    var url = "http://localhost:8000/api/get-user/" + row.AdresseMail

    this.http.get(url)
      .subscribe(
        (data: any) => {
          if (data.Role == "Administrateur") {
            return this.router.navigate(['/modify-admin', encodeURIComponent(row.AdresseMail.replace('.', '%2E'))]);
          } else {
            return this.router.navigate(['/modify-user', encodeURIComponent(row.AdresseMail.replace('.', '%2E'))]);
          }
        }, error => {
          console.error('Erreur lors du chargement des données du profil:', error);
        });
  }

  addUser() {
    this.router.navigate(['/add-user']);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    event.preventDefault();
  }
}