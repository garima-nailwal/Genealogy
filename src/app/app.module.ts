import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { TopbarComponent } from './components/topbar/topbar.component';
import { HomeComponent } from './pages/home/home.component';

import { SharedModule } from './shared/shared.module';
import { PrimeNGModule } from './shared/prime-ng.module';
import { RegisterComponent } from './pages/register/register.component';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component'; 
import { HttpClientModule } from '@angular/common/http';
import { ModalService } from './modal.service';


@NgModule({
  declarations: [
    AppComponent,
    TopbarComponent,
    HomeComponent,
    RegisterComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    RouterModule,
    PrimeNGModule,
    HttpClientModule
  ],
  providers: [ModalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
