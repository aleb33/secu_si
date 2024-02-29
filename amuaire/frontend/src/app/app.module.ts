import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
    declarations: [],
    imports: [
        BrowserModule,
        HttpClientModule, // Import the HttpClientModule here
    ],
    providers: [CookieService],
    bootstrap: []
})
export class AppModule { }
