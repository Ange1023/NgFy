import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MediaItemComponent } from '../../shared/components/media-item/media-item.component';
import { addIcons } from 'ionicons';
import { addCircleOutline } from 'ionicons/icons';
import { NavController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { PlaylistModalComponent } from "src/app/shared/components/playlist-modal/playlist-modal.component";
import { PlaylistService } from 'src/app/services/playlist.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonicModule, MediaItemComponent]
})
export class Tab2Page {

  items: any[] = [];
  userSongsNumber: number = 0;
  favoriteSongsNumber: number = 0;
  playlists: any[] = [];

  constructor(
    private navCtrl: NavController,
    private userService: UserService,
    private playlistService: PlaylistService,
    private modalCtrl: ModalController
  ) {
    addIcons({addCircleOutline})
  }


  ionViewWillEnter() {
    this.loadUserPlaylists();
    this.loadPlaylists();
  }

  loadPlaylists() {
    this.playlistService.getAllPlaylists().subscribe({
      next: (playlists) => {
        this.items = playlists.data;
      }
    });
  }

  loadUserPlaylists() {
    this.userService.getUserPlaylists().subscribe({
      next: (playlists) => {
        this.userSongsNumber = playlists?.my_songs ?? 0;
        this.favoriteSongsNumber = playlists?.favorites ?? 0;
      }
    });
  }

  ngOnInit() {
    this.playlistService.playlistChanged$.subscribe(() => {
      this.loadPlaylists();
    });
  }

  async openPlaylistModal(item_id?: string) {

    const playlist = this.items.find(item => item._id === item_id);

    const modal = await this.modalCtrl.create({
      component: PlaylistModalComponent,
      breakpoints: [0,0.28,1],
      componentProps: {
        playlistName: playlist?.name ?? '',
        playlistId: playlist?._id ?? '',
      },
      initialBreakpoint: 0.28, 
      showBackdrop: true,
    });
    await modal.present();

    const { data, role } = await modal.onDidDismiss();

    console.log('Modal dismissed with role:', role, 'and data:', data);
    

    if (role === 'save' && data) {
      this.onCreatePlaylist(data.name);
    } else if (role === 'edit' && data) {
      this.onEditPlaylist(data);
    }
  }

  onEditPlaylist(data: { name: string, id: string }) {
    this.playlistService.updatePlaylist(data.id, data.name).subscribe({
      next: (response) => {
        console.log('Playlist updated successfully:', response);
        this.loadPlaylists();
      },
      error: (error) => {
        console.error('Error updating playlist:', error);
      }
    });
  }

  onDeletePlaylist(item_id: string) {
    this.playlistService.deletePlaylist(item_id).subscribe({
      next: (response) => {
        console.log('Playlist deleted successfully:');
      },
      error: (error) => {
        console.error('Error deleting playlist:', error);
      }
    });
  }

  onCreatePlaylist(name: string) {
    this.playlistService.createPlaylist(name).subscribe({
      next: (response) => {
        console.log('Playlist created successfully:', response);
      }
    });
  }

  onItemClick(item_id: number | string, item_name: string = '', item_numberOfTracks: number = 0) {
    this.navCtrl.navigateForward(['tabs', 'tab2', item_id], {
      animationDirection: 'forward',
      state: { extraData: { foo: 'bar', name: item_name, numberOfTracks: item_numberOfTracks } }
    });
  }
}
