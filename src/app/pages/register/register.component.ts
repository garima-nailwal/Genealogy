import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { DropdownService } from 'src/app/dropdown.service';
import { UserService,OtpRequest, OtpVerification } from 'src/app/user.service';
import { ModalService } from 'src/app/modal.service';

interface City {
  name: string;
  code: string;
}

// interface RelationshipResponse {
//   success: string;
//   message: string;
//   data?: any;
// }

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})



export class RegisterComponent implements OnInit {
  currentStep: number = 1;
  isSubmitting: boolean = false;
  registerForm!: FormGroup;
  error: string = '';
  formData: any;
  genderOptions: any[] = [];  

  testDate:any;
  steps: string[] = ['Personal', 'Social', 'Contact', 'Location'];
  mode: 'register' | 'add-member' = 'register';
  // displayRelationshipModal: boolean = false;
  isModalVisible: boolean = false;
  userId: number | null = null;  // Will be used as parent_id


  relationshipTypes: { id: number; relationship_type: string }[] = [];
  occupationTypes: { id: number; occupation_name: string }[] = [];
  maritialStatusTypes: { id: number; maritial_status: string }[] = [];
  religionTypes: { id: number; religion_name: string }[] = [];
  stateTypes: { id: number; state: string }[] = [];
  districtTypes: { id: number; district: string }[] = [];
  casteTypes: { id: number; caste_name: string }[] = [];
 
  showOtpInput = false;
  otp = '';
  otpError = '';
  isLoading = false;

  constructor(private fb: FormBuilder, 
    private router: Router,
    private route: ActivatedRoute,
    private dropdownService: DropdownService,
    private userService: UserService,
    private modalService: ModalService) {}

  ngOnInit(): void {

    this.userId = JSON.parse(localStorage.getItem('id') || 'null');

    this.route.queryParams.subscribe(params => {
      this.mode = params['mode'] === 'add-member' ? 'add-member' : 'register';
    });

    this.modalService.modalVisibility$.subscribe((isVisible) => {
      this.isModalVisible = isVisible;
      console.log('Modal visibility changed:', this.isModalVisible);
    });
  

    this.fetchGenderOptions();
    this.loadDropdowns();
    // this.initForm();

    
    this.registerForm = this.fb.group({
      // Step 1 - Personal Info
      firstName: ['', Validators.required],
      middleName: ['',Validators.required],
      lastName: ['', Validators.required],
      birthDate: [null, Validators.required],
      gender: [null, Validators.required],

      // Step 2 - Social Info
      maritialstatus: [null, Validators.required],
      occupation: [null, Validators.required],
      religion: [null, Validators.required],

      // Step 3 - Contact Info
      caste: [null, Validators.required],
      mobile: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{10}$')],
      ],
      email: [
        '',
        [Validators.required, Validators.email],
      ],

      // Step 4 - Location Info
      state: [null, Validators.required],
      district: [null, Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      pincode: ['', Validators.required],
      relationshipTypes: [null, this.mode === 'add-member' ? Validators.required : []]

    });

    //Handle Mode and Force District Loading if State is Pre-selected
    this.route.queryParams.subscribe(params => {
    this.mode = params['mode'] === 'add-member' ? 'add-member' : 'register';
    console.log('Mode Detected+:', this.mode);

    const stateControl = this.registerForm.get('state');
    if (stateControl?.value) {
      console.log('Triggering district load for state:', stateControl.value);
      this.loadDistrictsByState(stateControl.value);
    }
  });

    if (this.mode === 'add-member') {
      this.dropdownService.getRelationshipTypes().subscribe({
        next: (res) => this.relationshipTypes = res.data.filter(item => item.id > 2).sort((a, b) => a.id - b.id), // Sort the array by id in ascending order,
        error: (err) => console.error('Relationship load error:', err)
      });
    } 

    

    this.registerForm.get('state')?.valueChanges.subscribe((stateId) => {
      console.log('Selected State ID:', stateId);
      if (stateId) {
        this.loadDistrictsByState(stateId);
      } else {
        this.districtTypes = [];
        this.registerForm.get('district')?.setValue(null);
      }
    });

   

  }

  loadDropdowns(): void {

   // Load relationshipTypes ONLY if not already loaded in add-member mode
  if (this.mode !== 'add-member') {
    this.dropdownService.getRelationshipTypes().subscribe({
      next: (res) => this.relationshipTypes = res.data,
      error: (err) => console.error('Relationship load error:', err)
    });
  }

    this.dropdownService.getOccupationTypes().subscribe({
      next: (res) => this.occupationTypes = res.data,
      error: (err) => console.error('Occupation load error:', err)
    });

    this.dropdownService.getMaritialStatusTypes().subscribe({
      next: (res) => this.maritialStatusTypes = res.data,
      error: (err) => console.error('Marital Status load error:', err)
    });

    this.dropdownService.getReligionTypes().subscribe({
      next: (res) => this.religionTypes = res.data,
      error: (err) => console.error('Religion load error:', err)
    });

    this.dropdownService.getStateTypes().subscribe({
      next: (res) => this.stateTypes = res.data,
      error: (err) => console.error('State load error:', err)
    });

    this.dropdownService.getCasteTypes().subscribe({
      next: (res) => this.casteTypes = res.data,
      error: (err) => console.error('Caste load error:', err)
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  confirmSelection() {
    // Handle the confirmation logic here
    console.log('Relationship Selected');
    this.modalService.closeModal(); // Close the modal after confirmation
  }

  openModal() {
    this.modalService.openModal();
  }

  closeModal() {
    this.modalService.closeModal(); // Close the modal via service
  }
  // Add family member logic
  // 
  
  addFamilyMember(): void {
    if (this.registerForm.invalid) {
      return;
    }
  
    const formData = this.registerForm.value;
    console.log('User ID from localStorage:', this.userId);
  
    // Ensure that relationshipType is selected
    if (!formData.relationshipTypes) {
      console.error('Relationship Type is missing');
      alert('Please select a valid relationship type.');
      return;
    }
  
    // Prepare the payload to be sent
    const familyMemberPayload = {
      first_name: formData.firstName,
      middle_name: formData.middleName,
      last_name: formData.lastName,
      birth_date: formData.birthDate,
      gender: formData.gender === 'M' ? 1 : formData.gender === 'F' ? 2 : 3,
      email: formData.email,
      mobile_number: formData.mobile,
      state_id: Number(formData.state),
      district_id: Number(formData.district),
      religion_id: Number(formData.religion),
      caste_id: Number(formData.caste),
      occupation_id: Number(formData.occupation),
      maritial_status: Number(formData.maritialstatus),
      permanent_address: formData.address,
      city: formData.city,
      pincode: formData.pincode,
      relationship_id: Number(formData.relationshipTypes),  // The selected relationship type
      // Include parent_id only when mode is 'add-member'
      // console.log('User ID from localStorage:', this.userId),
      primary_user_id: this.userId,  // This is the logged-in user's ID
    };
  
    // Send the request to create the family member
    this.userService.submitUserRegistration(familyMemberPayload).subscribe(
      (response: any) => {
        console.log('Family member created:', response);
        
        if (response.data && response.data.user_id) {
          const relativeId = response.data.user_id;  // Use the new user_id of the family member
  
          // Now, link the family member to the primary user
          const relationshipPayload = {
            primary_user_id: this.userId,  // This is the logged-in user (parent)
            relative_id: relativeId,  // The new family member's ID
            relationship_id: formData.relationshipTypes,  // The selected relationship type
          };
  
          // Send the relationship data to the backend
          this.userService.addFamilyRelationship(relationshipPayload).subscribe(
            (relationshipResponse: any) => {
              console.log('Family relationship added:', relationshipResponse);
              alert('Family Member Added Successfully!');
              this.router.navigate(['/dashboard']);
            },
            (error: any) => {
              console.error('Error adding family relationship:', error);
              alert('Error adding family relationship. Please try again.');
            }
          );
        } else {
          console.error('User ID is missing from response.');
          alert('Failed to add family member. Please try again.');
        }
      },
      (error: any) => {
        console.error('Error creating family member:', error);
        alert('Error creating family member. Please try again.');
      }
    );
  }
  

  nextStep(): void {
    if (this.validateCurrentStep()) {
      this.currentStep++;
    }
    console.log('nextStep:', this.currentStep);
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
 

  validateCurrentStep(): boolean {
    const stepFields: { [key: number]: string[] } = {
      1: ['firstName', 'lastName','middleName', 'birthDate', 'gender'],
      2: ['maritialstatus', 'occupation', 'religion'],
      3: ['caste','mobile', 'email'],
      4: ['state', 'district', 'address', 'city', 'pincode'],
      
    };

    const fieldsToValidate = stepFields[this.currentStep];
    let valid = true;

    fieldsToValidate.forEach((field) => {
      const control = this.registerForm.get(field);
      if (control) {
        control.markAsTouched();
        control.updateValueAndValidity();
        if (control.invalid) valid = false;
      }
      console.log('Current step function:', valid);
    });

    return valid;
  }

  onSubmit(): void {

    if (this.mode === 'add-member') {
      this.addFamilyMember();
    } else {

    if (this.validateCurrentStep()) {
      this.isSubmitting = true;
      const formData = this.registerForm.value;
  
      const payload = {
        first_name: formData.firstName,
        middle_name: formData.middleName,
        last_name: formData.lastName,
        birth_date: formData.birthDate,
        gender: formData.gender === 'M' ? 1 : formData.gender === 'F' ? 2 : 3,  // Convert to integer
        email: formData.email,
        mobile_number: formData.mobile,
        state_id: formData.state,
        district_id: formData.district,
        religion_id: formData.religion,
        caste_id: formData.caste,
        occupation_id: formData.occupation,
        maritial_status: formData.maritialstatus,
        permanent_address: formData.address,
        city: formData.city,
        pincode: formData.pincode
      };
  
      console.log('Payload Being Sent:', payload);
      
      this.userService.submitUserRegistration(payload).subscribe({
        next: (response) => {
          console.log('API Response:', response);
  
          if (response.status === 'success') {
            // Handle relationship linking if in add-member mode
            if (this.mode === 'add-member' && formData.relationshipTypes) {
              const relationshipPayload = {
                user_id: response.data.user_id,  // Make sure your API returns this user_id
                relationship_id: formData.relationshipTypes
              };
  
            } else {
              // alert('User Registered Successfully!');
              // this.router.navigate(['/dashboard']);
              const otpRequest: OtpRequest = {
                email: formData.email
              };
    
              console.log('Sending OTP request:', otpRequest);
              this.userService.sendRegistrationOtp(otpRequest).subscribe({
                next: (otpResponse) => {
                  console.log('OTP response:', otpResponse);
                  this.isLoading = false;
                  this.showOtpInput = true;
                  this.error = '';
                  this.formData = formData;
                },
                error: (error) => {
                  console.error('OTP error:', error);
                  this.isLoading = false;
                  this.error = error.error?.message || 'Failed to send OTP. Please try again.';
                }
              });

            }
  
          } else {
            alert('Registration Failed: ' + (response.msgArr?.[0] || 'Unknown error'));
          }
  
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('API Error:', err);
          alert('Something went wrong. Please try again.');
          this.isSubmitting = false;
        }
      });
    }
  }  
}

  calculateAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }
    
  fetchGenderOptions(){
    this.genderOptions = [
      { label: 'Select Gender', value: null },
      { label: 'Male', value: 'M' },
      { label: 'Female', value: 'F' },
      { label: 'Other', value: 'O' }
    ];
  }

  loadDistrictsByState(stateId: number): void {
    this.dropdownService.getDistrictsByState(stateId).subscribe({
      next: (res) => {
      console.log('Raw District Response:', res);
      
      this.districtTypes = res.data},
      
      error: (err) => console.error('District load error:', err)
    });
  }

  validateOtp(): boolean {
    if (!this.otp || this.otp.length !== 6) {
      this.otpError = 'Please enter a valid 6-digit OTP';
      return false;
    }
    return true;
  }

  validateForm(): boolean {
    if (this.registerForm.invalid) {
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      return false;
    }
    return true;
  }

  handleRegistration() {
    if (this.validateForm()) {
      this.isLoading = true;
      const formData = this.registerForm.value;
      
      const registrationData = {
        first_name: formData.firstName,
        middle_name: formData.middleName,
        last_name: formData.lastName,
        birth_date: formData.birthDate,
        gender: formData.gender === 'M' ? 1 : formData.gender === 'F' ? 2 : 3,
        email: formData.email,
        mobile_number: formData.mobile,
        state_id: formData.state,
        district_id: formData.district,
        religion_id: formData.religion,
        caste_id: formData.caste,
        occupation_id: formData.occupation,
        maritial_status: formData.maritialstatus,
        permanent_address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
        // status: 'Pending'
      };

      console.log('Sending registration data:', registrationData);

      this.userService.submitUserRegistration(registrationData).subscribe({
        next: (response) => {
          console.log('Registration response:', response);
          // After successful registration, send OTP
          const otpRequest: OtpRequest = {
            email: formData.email
          };

          console.log('Sending OTP request:', otpRequest);
          this.userService.sendRegistrationOtp(otpRequest).subscribe({
            next: (otpResponse) => {
              console.log('OTP response:', otpResponse);
              this.isLoading = false;
              this.showOtpInput = true;
              this.error = '';
              this.formData = formData;
            },
            error: (error) => {
              console.error('OTP error:', error);
              this.isLoading = false;
              this.error = error.error?.message || 'Failed to send OTP. Please try again.';
            }
          });
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.isLoading = false;
          this.error = error.error?.message || 'Registration failed. Please try again.';
        }
      });
    }
  }

      handleOtpVerification() {
        if (this.validateOtp()) {
          this.isLoading = true;
          const otpVerification: OtpVerification = {
            email: this.formData.email,
            otp: this.otp
          };

          this.userService.verifyRegistrationOtp(otpVerification).subscribe({
            next: (response) => {
              this.isLoading = false;
              this.router.navigate(['/dashboard']);
            },
            error: (error) => {
              this.isLoading = false;
              this.otpError = error.error?.message || 'Invalid OTP. Please try again.';
            }
          });
        }
      }

}





