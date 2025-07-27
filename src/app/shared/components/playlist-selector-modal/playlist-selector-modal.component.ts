import { Component, OnInit, Input } from '@angular/core';
import { PlaylistService } from 'src/app/services/playlist.service';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-playlist-selector-modal',
  templateUrl: './playlist-selector-modal.component.html',
  styleUrls: ['./playlist-selector-modal.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class PlaylistSelectorModalComponent  implements OnInit {  

  @Input() songId!: string;

  playlists: any[] = [];
  constructor(
    private playlistService: PlaylistService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.loadPlaylists();
  }

  onPlaylistSelect(playlistId: string) {
    console.log('Selected playlist ID:', playlistId);
    this.modalCtrl.dismiss({ playlistId, songId: this.songId }, 'select');
  }

  loadPlaylists() {
    this.playlistService.getAllPlaylists().subscribe({
      next: (playlists) => {
        this.playlists = playlists.data;
      },
      error: (error) => {
        console.error('Error loading playlists:', error);
      }
    });
  }

}
