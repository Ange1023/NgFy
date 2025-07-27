import { Component, OnInit } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule]
})

export class ChangePasswordModalComponent {
  form = new FormGroup({
    oldPassword: new FormControl('', Validators.required),
    newPassword: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required)
  });

  constructor(
    private modalCtrl: ModalController,
    private userService: UserService
  ) {}

  submit() {

    if (this.form.valid) {

      const { oldPassword, newPassword, confirmPassword } = this.form.value;
      if (newPassword === confirmPassword) {
        this.userService.changePassword(oldPassword!, newPassword!).subscribe({
          next: () => {
            this.modalCtrl.dismiss();
          },
          error: (err) => {
            console.error('Error changing password:', err);
          }
        });
      } else {
        console.error('New passwords do not match');
      }
    } else {
      console.error('Form is invalid');
    }
    
  }
}
