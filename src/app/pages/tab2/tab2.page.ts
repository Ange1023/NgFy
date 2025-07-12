import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MediaItemComponent } from '../../shared/components/media-item/media-item.component';
import { addIcons } from 'ionicons';
import { addCircleOutline } from 'ionicons/icons';
import { Router } from '@angular/router';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonicModule, MediaItemComponent]
})
export class Tab2Page {

  items = [
    { id: 1,name: 'Tears for fears', image: 'https://ionicframework.com/docs/img/demos/thumbnail.svg', numberOfTracks: 10 },
    { id: 2, name: 'Red Hot Chili Papers', image: 'https://ionicframework.com/docs/img/demos/thumbnail.svg', numberOfTracks: 5 },
    { id: 3, name: 'Item 3', image: 'https://ionicframework.com/docs/img/demos/thumbnail.svg',numberOfTracks: 8 },
  ]

  constructor(private router: Router) {
    addIcons({addCircleOutline})
  }

  onItemClick(item_id: number) {
  console.log('Click en:', item_id);
  this.router.navigate(['tabs', 'tab2', 'playlist', item_id]);

}
}
