import { Component, OnInit, inject, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { NavController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { heartOutline, add } from 'ionicons/icons';
import { SongService } from 'src/app/services/song.service';
import { ActivatedRoute } from '@angular/router';
import { AudioPlayerComponent } from 'src/app/shared/components/audio-player/audio-player.component';
import { UserService } from 'src/app/services/user.service';
import { NextSongComponent } from 'src/app/shared/components/next-song/next-song.component';
import { ModalController } from '@ionic/angular';
import { PlaylistService } from 'src/app/services/playlist.service';
import { PlaylistSelectorModalComponent } from 'src/app/shared/components/playlist-selector-modal/playlist-selector-modal.component';

@Component({
  selector: 'app-song',
  templateUrl: './song.page.html',
  styleUrls: ['./song.page.scss'],
  standalone: true,
  imports: [IonicModule, AudioPlayerComponent, NextSongComponent]
})
export class SongPage implements OnInit {

  private activatedRoute = inject(ActivatedRoute);
  private songId!: string | null;

  isFavorite: boolean = false;
  isAnimatingFavorite: boolean = false;

  item: any = {
    id: '',
    runtime: '',
    image: '',
    name: '',
    artist: '',
    url: ''
  };

  next_song: any = {
    id: '',
    title: '',
    image: ''
  };

  constructor(
    private navCtrl: NavController,
    private songService: SongService,
    private userService: UserService,
    private modalCtrl: ModalController,
    private playlistService: PlaylistService
  ) {
    addIcons({
      heartOutline,
      add
      
    });
  }

  @ViewChild('marquee') marqueeRef!: ElementRef<HTMLDivElement>;
  @ViewChild('container') containerRef!: ElementRef<HTMLDivElement>;
  shouldAnimate = false;

  
  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.songId = params.get('id');
      if (this.songId) {
        this.songService.getSongById(this.songId).subscribe({
          next: (response) => {
            const songData = response.data.song;
            const nextSongData = response.data.similar;
            console.log('Song data:', response.data);
            
            this.item = {
              id: songData._id,
              runtime: songData.duration,
              image: songData.poster_image,
              name: songData.title,
              artist: songData.artist,
              url: songData.url
            };

            this.next_song = {
              id: nextSongData._id,
              title: nextSongData.title,
              image: nextSongData.poster_image
            };

            this.userService.getUserFavoriteSongs().subscribe({
              next: (favorites) => {
                this.isFavorite = favorites.some((song: any) => song._id === this.songId);
              }
            });

            setTimeout(() => {
              const marquee = this.marqueeRef?.nativeElement;
              const container = this.containerRef?.nativeElement;
              if (marquee && container) {
                this.shouldAnimate = marquee.scrollWidth > container.offsetWidth;
              }
            });
          },
          error: (error) => {
            console.error('Error al cargar la canción:', error);
          }
        });
      }
    });
  }

  toggleFavorite(event: Event) {
    event.stopPropagation();
    this.isFavorite = !this.isFavorite;
    this.isAnimatingFavorite = true;
    setTimeout(() => {
      this.isAnimatingFavorite = false;
    }, 400);
    this.userService.toggleFavoriteSong(this.songId!).subscribe({
      next: (response) => {
        console.log(this.isFavorite ? 'Agregado a favoritos' : 'Eliminado de favoritos', response);
      }
    });
  }

  onNextSongClick(songId: string) {
    console.log('Next song clicked:', songId);
    
  }

  openAddToPlaylistModal() {
    this.modalCtrl.create({
      component: PlaylistSelectorModalComponent,
      componentProps: { songId: this.item.id },
      breakpoints: [0, 1],
      initialBreakpoint: 1,
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

  addSongToPlaylist(playlistId: string, songId: string) {
    this.playlistService.addSognToPlaylist(playlistId, songId).subscribe({
      next: response => {
        console.log('Song added to playlist:', response);
      },
      error: err => {
        console.error('Error adding song to playlist:', err);
      }
    });
  }

  goBack() {
    this.navCtrl.back();
  }
}
