import { Component } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-delete-account-modal',
  templateUrl: './delete-account-modal.component.html',
  styleUrls: ['./delete-account-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule]
})
export class DeleteAccountModalComponent {
  form = new FormGroup({
    key: new FormControl('', Validators.required)
  });

  constructor(
    private modalCtrl: ModalController,
    private userService: UserService
  ) {}

  submit() {
    if (this.form.valid) {

      const { key } = this.form.value;

      if (key !== 'DELETE') return;

      this.userService.deleteUserAccount().subscribe({
        next: () => {
          this.modalCtrl.dismiss();
        },
        error: (err) => {
          console.error('Error deleting account:', err);
          this.modalCtrl.dismiss(this.form.value);
        }
      });
    }
  }
}