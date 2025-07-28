import { Component, OnInit } from '@angular/core';
import { FormsModule, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterModule, IonicModule], 
})
export class SignUpPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    user_name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    first_name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    last_name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    author: new FormControl(false) 
  });

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  submit (){
    console.log(this.form.value);
    this.authService.signUp(this.form.value).subscribe({
      next: (response) => {
        console.log('Sign up successful', response);
        this.router.navigate(['/sign-in']); 
      },
      error: (error) => {
        console.error('Sign up failed', error);
      },
      complete: () => {
        console.log('Sign up request completed');
      }
    });
  }
}
