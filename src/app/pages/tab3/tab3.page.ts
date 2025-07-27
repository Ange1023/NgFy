import { Component, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { addIcons } from 'ionicons';
import { chevronForwardOutline, exitOutline, logoFacebook } from 'ionicons/icons';
import { IonicModule, IonInput } from '@ionic/angular';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matEditOutline, matSendOutline } from '@ng-icons/material-icons/outline';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService} from 'src/app/services/user.service';
import { ChangePasswordModalComponent } from 'src/app/shared/components/change-password-modal/change-password-modal.component';
import { DeleteAccountModalComponent } from 'src/app/shared/components/delete-account-modal/delete-account-modal.component';

addIcons({ exitOutline, chevronForwardOutline });

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonicModule, NgIcon, ReactiveFormsModule, ChangePasswordModalComponent, DeleteAccountModalComponent],
  standalone: true,
  viewProviders: [provideIcons({ matEditOutline, matSendOutline })]
})
export class Tab3Page {
  @ViewChildren(IonInput) inputs!: QueryList<IonInput>;

  editName = false;
  editEmail = false;
  editUsername = false;
  editLastName = false; 

  editedName = false;
  editedEmail = false;
  editedUsername = false;
  editedLastName = false; 
  clickedSend = false;

  profileForm = new FormGroup({
    username: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.minLength(3)]),
    name: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.minLength(3)]),
    last_name: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.minLength(2)]),
    email: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email])
  });

  constructor(
    private authService: AuthService, 
    private router: Router,
    private userService: UserService
  ) {
  }

  ngOnInit(){
    this.userService.userProfile$.subscribe(profile => {
      console.log('Profile data received:', profile);
      
      if (profile && profile.user) {

        profile = profile.user

        this.profileForm.patchValue({
          username: profile.user_name,
          name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email
        });
      }
    });

    this.profileForm.get('username')?.valueChanges.subscribe(value => {
      if (this.editUsername) this.editedUsername = true;
    });
    this.profileForm.get('name')?.valueChanges.subscribe(value => {
      if (this.editName) this.editedName = true;
    });
    this.profileForm.get('last_name')?.valueChanges.subscribe(value => { 
      if (this.editLastName) this.editedLastName = true;
    });
    this.profileForm.get('email')?.valueChanges.subscribe(value => {
      if (this.editEmail) this.editedEmail = true;
    });
  }

  async logout() {
    await this.authService.signOut();
    this.router.navigate(['/sign-in']);
  }

  submitAndClose(field: string) {
    this.submitProfile();
    this.clickedSend = false;
    this.onInputBlur(field);
  }

  enableEdit(field: string) {
    this.editName = false;
    this.editEmail = false;
    this.editUsername = false;
    this.editLastName = false; 

    switch(field) {
      case 'name': 
        this.editName = true;
        break;
      case 'email':
        this.editEmail = true;
        break;
      case 'username':
        this.editUsername = true;
        break;
      case 'last_name': 
        this.editLastName = true;
        break;
    }

    setTimeout(() => {
      const inputToFocus = this.inputs.find(input => {
        const label = input.label;
        return (field === 'name' && label === 'Name') ||
              (field === 'email' && label === 'Email') ||
              (field === 'username' && label === 'Username') ||
              (field === 'last_name' && label === 'Last Name'); 
      });
      if (inputToFocus) {
        inputToFocus.setFocus();
      }
    }, 100);
  }

  onInputBlur(field: string) {
    if (this.clickedSend) return;
    switch(field) {
      case 'username':
        this.editUsername = false;
        this.editedUsername = false;
        this.profileForm.get('username')?.disable();
        break;
      case 'name':
        this.editName = false;
        this.editedName = false;
        this.profileForm.get('name')?.disable();
        break;
      case 'last_name': 
        this.editLastName = false;
        this.editedLastName = false;
        this.profileForm.get('last_name')?.disable();
        break;
      case 'email':
        this.editEmail = false;
        this.editedEmail = false;
        this.profileForm.get('email')?.disable();
        break;
    }
  }

  submitProfile() {
    console.log('Submitting profile with data:', this.profileForm.value);

    const payload = {
      email: this.profileForm.get('email')?.value,
      first_name: this.profileForm.get('name')?.value,
      last_name: this.profileForm.get('last_name')?.value,
      user_name: this.profileForm.get('username')?.value,
    };

    this.userService.updateUserProfile(payload).subscribe({
      next: (response) => {
        console.log('Profile updated successfully:', response);
      },
      error: (error) => {
        console.error('Error updating profile:', error);
      }
    });
  }

  handleInputClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }
}
