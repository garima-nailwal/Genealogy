import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/modal.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  constructor(private router: Router, private modalService: ModalService) {}

  navigateToRegister() {
    console.log('Button clicked - opening modal');
    this.router.navigate(['/register'],{ queryParams: { mode: 'add-member' } });
    this.modalService.openModal(); // Open the modal when button is clicked

  }
}
