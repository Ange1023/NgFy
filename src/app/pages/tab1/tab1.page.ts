import { Component } from '@angular/core';
import {IonicModule} from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { MediaItemComponent } from 'src/app/shared/components/media-item/media-item.component';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { SongService } from 'src/app/services/song.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonicModule, MediaItemComponent],
})
export class Tab1Page {
  items: any[] = [];

  constructor(
    private navCtrl: NavController,
    private songService: SongService) {
    addIcons({
      add
    });
  }

  ngOnInit() {
    this.songService.getPaginateSongs(1, 10).subscribe({
      next: (response) => {
  
        console.log('Canciones cargadas:', response.data);
        this.items = response.data.data.map((song: any) => ({
          id: song._id,
          runtime: song.duration,
          image: song.poster_image,
          name: song.title,
          autor: song.artist
        }));
        
      },
      error: (error) => {
        console.error('Error al cargar canciones:', error);
      }
    });
  }

  onSongClick(songId: number | string) {
    console.log('Click en canción:', songId);
    this.navCtrl.navigateForward(['tabs', 'tab1', songId], {
      animationDirection: 'forward' 
    });
  }

  onClick() {
    console.log('Add button clicked');
    }
}
