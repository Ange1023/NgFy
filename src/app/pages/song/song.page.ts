import { Component, OnInit, inject, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { NavController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { heartOutline, addSharp } from 'ionicons/icons';
import { SongService } from 'src/app/services/song.service';
import { ActivatedRoute } from '@angular/router';
import { AudioPlayerComponent } from 'src/app/shared/components/audio-player/audio-player.component';
import { UserService } from 'src/app/services/user.service';
import { NextSongComponent } from 'src/app/shared/components/next-song/next-song.component';
import { ModalController } from '@ionic/angular';
import { PlaylistService } from 'src/app/services/playlist.service';
import { PlaylistSelectorModalComponent } from 'src/app/shared/components/playlist-selector-modal/playlist-selector-modal.component';
import { Router } from '@angular/router';

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
  private nextSongId!: string | null;

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
    private playlistService: PlaylistService,
    private router: Router
  ) {
    addIcons({
      heartOutline,
      addSharp,
    });
  }

  @ViewChild('marquee') marqueeRef!: ElementRef<HTMLDivElement>;
  @ViewChild('container') containerRef!: ElementRef<HTMLDivElement>;
  shouldAnimate = false;


  ngOnInit() {
    const nav = this.router.getCurrentNavigation();
    this.nextSongId = nav?.extras.state?.['nextSongId'];

    this.activatedRoute.paramMap.subscribe(params => {
      this.songId = params.get('id');
      if (!this.songId) return;

      this.loadSong(this.songId);
      this.checkIfFavorite(this.songId);

      if (this.nextSongId) {
        this.loadNextSong(this.nextSongId);
      }
    });
  }

  private loadSong(songId: string) {
    this.songService.getSongById(songId).subscribe({
      next: ({ data }) => {
        const song = data.song;
        this.item = {
          id: song._id || songId,
          runtime: song.duration,
          image: song.poster_image,
          name: song.title,
          artist: song.artist,
          url: song.url
        };

        setTimeout(() => {
          const marquee = this.marqueeRef?.nativeElement;
          const container = this.containerRef?.nativeElement;
          this.shouldAnimate = !!(marquee && container && marquee.scrollWidth > container.offsetWidth);
        });
      },
      error: err => console.error('Error al cargar la canción:', err)
    });
  }

  private loadNextSong(nextSongId: string) {
    this.songService.getSongById(nextSongId).subscribe({
      next: ({ data }) => {
        const song = data.song;
        this.next_song = {
          id: song._id || nextSongId,
          title: song.title,
          image: song.poster_image
        };
      },
      error: err => console.error('Error al cargar la siguiente canción:', err)
    });
  }

  private checkIfFavorite(songId: string) {
    this.userService.getUserFavoriteSongs().subscribe({
      next: favorites => {
        this.isFavorite = favorites.some((s: any) => s._id === songId);
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
