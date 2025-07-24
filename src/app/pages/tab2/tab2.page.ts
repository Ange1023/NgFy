import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MediaItemComponent } from '../../shared/components/media-item/media-item.component';
import { addIcons } from 'ionicons';
import { addCircleOutline } from 'ionicons/icons';
import { NavController } from '@ionic/angular';
import { SongService } from '../../services/song.service';
import { UserService } from 'src/app/services/user.service';


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

  artistName: string = '';
  userSongsNumber: number = 0;
  favoriteSongsNumber: number = 0;

  constructor(
    private navCtrl: NavController,
    private songService: SongService,
    private userService: UserService
  ) {
    addIcons({addCircleOutline})
  }


  ionViewWillEnter() {
    this.userService.getUserPlaylists().subscribe({
      next: (playlists) => {
        this.userSongsNumber = playlists?.my_songs ?? 0;
        this.favoriteSongsNumber = playlists?.favorites ?? 0;
      },
      error: (error) => {
        this.userSongsNumber = 0;
        this.favoriteSongsNumber = 0;
      }
    });
  }

  onItemClick(item_id: number | string) {
  console.log('Click en:', item_id);
  
  this.navCtrl.navigateForward(['tabs', 'tab2', item_id], {
    animationDirection: 'forward' 
  });

  

}
}
