// src/app/shared/prime-ng.module.ts
import { NgModule } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown'; 
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {ConfirmationService}  from 'primeng/api';

@NgModule({
  imports: [
    InputTextModule,
    ButtonModule,
    DropdownModule,
    CalendarModule,
    CardModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    
  ],
  exports: [
    InputTextModule,
    ButtonModule,
    DropdownModule,
    CalendarModule,
    CardModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule
    
  ],
  providers:[
    MessageService,
    ConfirmationService
  ]// Export them so they can be used in other modules
})
export class PrimeNGModule {}
