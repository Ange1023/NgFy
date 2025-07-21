import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { addIcons } from 'ionicons';
import { exitOutline } from 'ionicons/icons';
import { IonicModule } from '@ionic/angular';

addIcons({ exitOutline});

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonicModule],
  standalone: true,
})
export class Tab3Page {
  constructor(private authService: AuthService, private router: Router) {}

  async logout() {
    await this.authService.signOut();
    this.router.navigate(['/sign-in']);
  }
}