import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms'; // For ngModel
import { ReactiveFormsModule } from '@angular/forms'; // For Reactive Forms
import { PrimeNGModule } from './prime-ng.module'; 

import { LogoComponent } from './components/logo/logo.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';

@NgModule({
  declarations: [
    LogoComponent,
    ThemeToggleComponent                
  ],
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule, 
    PrimeNGModule,
  ],
  exports: [LogoComponent,
    ThemeToggleComponent,
    FormsModule,
    ReactiveFormsModule,
    PrimeNGModule
  ]            
})

export class SharedModule { }

