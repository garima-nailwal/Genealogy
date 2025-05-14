import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OtpRequest {
  email?: string;
  phone?: string;
}

export interface OtpVerification {
  email?: string;
  phone?: string;
  otp: string;
}
@Injectable({
  providedIn: 'root'
})


export class UserService {

  private baseUrl = 'http://genology.local/api';

  constructor(private http: HttpClient) {}

  submitUserRegistration(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/user`, data);
  }

  // linkRelationship(data: any): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/user-relationship`, data);
  // }

  addFamilyRelationship(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/relative`, payload);
  }

  // createFamilyMember(payload: any): Observable<any> {
  //   return this.http.post<any>('/api/createFamilyMember', payload);
  // }

  // OTP Methods
  sendRegistrationOtp(data: OtpRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/otp/send`, data);
  }

  verifyRegistrationOtp(data: OtpVerification): Observable<any> {
    return this.http.post(`${this.baseUrl}/verify-registration-otp`, data);
  }
  

  requestLoginOtp(data: OtpRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/request-login-otp`, data);
  }

  verifyLoginOtp(data: OtpVerification): Observable<any> {
    return this.http.post(`${this.baseUrl}/verify-login-otp`, data);
  }
}
