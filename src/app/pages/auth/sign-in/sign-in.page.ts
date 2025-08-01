import { Component, OnInit } from '@angular/core';
import { FormsModule, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, IonicModule, RouterModule]
})
export class SignInPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private notification: NotificationService
  ) { }

  ngOnInit() {}

  submit() {
    if (this.form.valid) {

      const email = this.form.value.email ?? '';
      const password = this.form.value.password ?? '';
      const credentials = { email, password };

      this.authService.signIn(credentials).subscribe({
        next: (response) => {
          console.log('Sign in successful', response);
          this.userService.fetchAndStoreUserProfile();
          this.router.navigate(['tabs', 'tab1']); 
        },
        error: (error) => {
          console.error('Sign in failed', error);
          this.notification.show({
            message: 'Email or password is incorrect',
            type: 'error'
          });
        },
        complete: () => {
          console.log('Sign in request completed');
        }
      });
    }
  }
}