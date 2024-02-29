import { Component, NgModule, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NavBarUserComponent } from '../nav-bar/nav-bar-user.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';


export interface UserData {
  AdresseMail: string;
  Nom: string;
  Prenom: string;
  Telephone: string;
}


@Component({
  selector: 'app-home-user',
  standalone: true,
  imports: [NavBarUserComponent, MatPaginatorModule, MatSortModule, MatTableModule, MatInputModule, MatFormFieldModule, HttpClientModule],
  templateUrl: './home-user.component.html',
  styleUrl: './home-user.component.css'
})


export class HomeUserComponent implements OnInit {

  displayedColumns: string[] = ['prenom', 'nom', 'email', 'telephone'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private http: HttpClient, private cookieService: CookieService) { }
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
  }
}
