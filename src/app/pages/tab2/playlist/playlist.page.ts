import { Component, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { MediaItemComponent } from "src/app/shared/components/media-item/media-item.component";
import { NavController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { PlaylistService } from 'src/app/services/playlist.service';
import { PlaylistSelectorModalComponent } from 'src/app/shared/components/playlist-selector-modal/playlist-selector-modal.component';
import { ModalController } from '@ionic/angular';
import { SongModalComponent } from 'src/app/shared/components/song-modal/song-modal.component';
import { SongService } from 'src/app/services/song.service';
import { AudioService } from 'src/app/services/audio.service';


import { Router } from '@angular/router';
@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.page.html',
  styleUrls: ['./playlist.page.scss'],
  standalone: true,
  imports: [IonicModule, MediaItemComponent]
})
export class PlaylistPage implements OnInit {

  private activatedRoute = inject(ActivatedRoute);
  private playlistId!: string | null;

  playlist: { id: string; name: string; image: string; numberOfTracks: number } | undefined;
  extraData: any;
  items: any[] = [];

  constructor(
    private navCtrl: NavController,
    private userService: UserService,
    private playlistService: PlaylistService,
    private router: Router,
    private modalCtrl: ModalController,
    private songService: SongService,
    private audioService: AudioService
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.playlistId = params.get('id');
      this.extraData = this.router.getCurrentNavigation()?.extras.state?.['extraData'];
      this.playlist = {
        id: this.playlistId!,
        name: this.extraData?.name,
        image: '',
        numberOfTracks: 0
      };
      this.loadSongs();
    });

    this.userService.userPlaylistChanged$.subscribe(() => {
      this.loadSongs();
    });

  }

  loadSongs() {
    if (!this.playlistId) return;

    switch (this.playlistId) {
      case 'favorites':
        this.playlist!.image = '../../../assets/my-favorites.png';
        this.userService.getUserFavoriteSongs().subscribe({
          next: songs => {
            this.items = this.mapSongs(songs)
            this.playlist!.numberOfTracks = this.items.length
          }
        });
        break;

      case 'my-songs':
        this.playlist!.image = '../../../assets/my-songs.png';
        this.userService.getUserSongs().subscribe({
          next: songs => {
            this.items = this.mapSongs(songs)
            this.playlist!.numberOfTracks = this.items.length
          }
        });
        break;

      default:
        this.playlist!.image = 'https://ionicframework.com/docs/img/demos/thumbnail.svg';
        this.playlistService.getPlaylistSongs(this.playlistId).subscribe({
          next: response => {
            this.items = this.mapSongs(response)
            this.playlist!.numberOfTracks = this.items.length
          }
        });
        break;
    }
  }

  mapSongs(songs: any[]) {
    return songs.map((song: any) => ({
      id: song._id,
      runtime: song.duration,
      image: song.poster_image,
      name: song.title,
      autor: song.artist
    }));
  }

  onSongClick(songId:string) {

    const itemsIds = this.items.map(item => item.id);
    this.audioService.setPlaylist(itemsIds, songId, this.playlistId!);


    this.navCtrl.navigateForward(['tabs', 'tab2', this.playlistId , songId], {
      animationDirection: 'forward' 
    });
  }

  async onEditItem(songId: string) {
    this.songService.getSongById(songId).subscribe({
      next: async (response) => {
        const song = response.data.song;
        song.runtime = this.formatRuntime(song.runtime);

        const modal = await this.modalCtrl.create({
          component: SongModalComponent,
          componentProps: {
            songData: song,
            isEdit: true
          },
          breakpoints: [0, 1],
          initialBreakpoint: 1,
          showBackdrop: true,
        });
        await modal.present();

        const { data, role } = await modal.onDidDismiss();
        if (role === 'edit' && data) {
          this.loadSongs();
        }
      },
      error: (err) => {
        console.error('Error fetching song:', err);
      }
    });
  }

  onDeleteItem(songId: string){
    this.songService.deleteSong(songId).subscribe({
      next: (response) => {
        console.log('Song deleted successfully:', response);
        this.loadSongs();
      }
    });
  }

  onAddToPlaylist(songId: string) {
    console.log('Add to playlist clicked for song ID:', songId);
    this.openModal(songId);
  }

  onRemoveFromPlaylist(songId: string) {
    console.log('Remove from playlist clicked for song ID:', songId);
    this.removeSongFromPlaylist(this.playlistId!, songId);
  }

  addSongToPlaylist(playlistId: string, songId: string) {
    this.playlistService.addSognToPlaylist(playlistId, songId).subscribe({
      next: response => {
        console.log('Song added to playlist:', response);
        this.loadSongs();
      },
      error: err => {
        console.error('Error adding song to playlist:', err);
      }
    });
  }

  removeSongFromPlaylist(playlistId: string, songId: string) {
    this.playlistService.removeSongFromPlaylist(playlistId, songId).subscribe({
      next: response => {
        console.log('Song removed from playlist:', response);
        this.loadSongs();
      },
      error: err => {
        console.error('Error removing song from playlist:', err);
      }
    });
  }
  

  openModal(songId: string) {
    this.modalCtrl.create({
      component: PlaylistSelectorModalComponent,
      componentProps: { songId: songId },
      breakpoints: [0,0.3, 1],
      initialBreakpoint: 0.3,
      showBackdrop: true,
    }).then(modal => {

      modal.present();

      modal.onDidDismiss().then(data => {
        if (data.data) {
          const { playlistId, songId } = data.data;
          this.addSongToPlaylist(playlistId, songId);
        }
      });
    });
  }

  formatRuntime(seconds: number): string {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }

  goBack() {
    this.navCtrl.back();
  }
}