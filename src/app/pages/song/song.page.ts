import { Component, OnInit, inject, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { NavController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { heartOutline } from 'ionicons/icons';
import { SongService } from 'src/app/services/song.service';
import { ActivatedRoute } from '@angular/router';
import { AudioPlayerComponent } from 'src/app/shared/components/audio-player/audio-player.component';

@Component({
  selector: 'app-song',
  templateUrl: './song.page.html',
  styleUrls: ['./song.page.scss'],
  standalone: true,
  imports: [IonicModule, AudioPlayerComponent]
})
export class SongPage implements OnInit {

  private activatedRoute = inject(ActivatedRoute);
  private songId!: string | null;

  item: any = {
    runtime: '',
    image: '',
    name: '',
    artist: '',
    url: ''
  };

  constructor(
    private navCtrl: NavController,
    private songService: SongService) { 
    addIcons({
      heartOutline
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

            this.item = {
              runtime: songData.duration,
              image: songData.poster_image,
              name: songData.title,
              artist: songData.artist,
              url: songData.url
            };

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

  goBack() {
    this.navCtrl.back();
  }
}
