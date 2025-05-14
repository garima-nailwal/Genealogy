import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, OtpRequest, OtpVerification } from '../../user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  
  contactInfo = '';
  contactType: 'email' | 'phone' = 'email';
  error = '';
  isLoading = false;
  buttonState: 'generate' | 'verify' | 'continue' = 'generate';
  otp = '';
  otpError = '';

  features = [
    { title: 'Build Family Trees', description: 'Create and visualize your family connections' },
    { title: 'Share Stories', description: 'Preserve and share family memories and photos' },
    { title: 'Find Relatives', description: 'Connect with distant family members' },
    { title: 'Research Ancestry', description: 'Discover your roots and heritage' }
  ];

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  get buttonText(): string {
    switch (this.buttonState) {
      case 'generate':
        return 'Generate OTP';
      case 'verify':
        return 'Verify OTP';
      case 'continue':
        return 'Continue';
      default:
        return 'Generate OTP';
    }
  }

  handleContactTypeChange(type: 'email' | 'phone') {
    this.contactType = type;
    this.contactInfo = '';
    this.error = '';
    this.buttonState = 'generate';
    this.otp = '';
    this.otpError = '';
  }

  validateContact(): boolean {
    if (!this.contactInfo.trim()) {
      this.error = `Please enter your ${this.contactType}`;
      return false;
    }
    if (this.contactType === 'email' && !/\S+@\S+\.\S+/.test(this.contactInfo)) {
      this.error = 'Please enter a valid email address';
      return false;
    }
    if (this.contactType === 'phone' && !/^\d{10}$/.test(this.contactInfo)) {
      this.error = 'Please enter a valid 10-digit mobile number';
      return false;
    }
    return true;
  }

  validateOtp(): boolean {
    if (!this.otp || this.otp.length !== 6) {
      this.otpError = 'Please enter a valid 6-digit OTP';
      return false;
    }
    return true;
  }

  handleLogin() {
    if (this.validateContact()) {
      this.isLoading = true;
      const otpRequest: OtpRequest = {
        [this.contactType]: this.contactInfo
      };

      this.userService.requestLoginOtp(otpRequest).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.buttonState = 'verify';
          this.error = '';
        },
        error: (error) => {
          this.isLoading = false;
          this.error = error.error?.message || 'Failed to send OTP. Please try again.';
        }
      });
    }
  }

  handleOtpVerification() {
    if (this.validateOtp()) {
      this.isLoading = true;
      const otpVerification: OtpVerification = {
        [this.contactType]: this.contactInfo,
        otp: this.otp
      };

      this.userService.verifyLoginOtp(otpVerification).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.buttonState = 'continue';
          this.otpError = '';
        },
        error: (error) => {
          this.isLoading = false;
          this.otpError = error.error?.message || 'Invalid OTP. Please try again.';
        }
      });
    }
  }

  handleContinue() {
    this.router.navigate(['/dashboard']);
  }

  handleButtonAction() {
    if (this.isLoading) return;

    switch (this.buttonState) {
      case 'generate':
        this.handleLogin();
        break;
      case 'verify':
        this.handleOtpVerification();
        break;
      case 'continue':
        this.handleContinue();
        break;
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}