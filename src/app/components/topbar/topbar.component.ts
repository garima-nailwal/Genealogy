import { Component} from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent{
  
  isRegisterPage: boolean = false;
  isDashboardPage: boolean = false;
  isHomePage: boolean = false;

  constructor(public router: Router) {
    this.router.events.subscribe(() => {
      this.isRegisterPage = this.router.url.includes('/register');
      this.isDashboardPage = this.router.url.includes('/dashboard');
      this.isHomePage = this.router.url === '/';
    });
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }

  // navigateToDashboard() {
  //   this.router.navigate(['/dashboard']);
  // }
}