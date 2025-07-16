import { Component, OnInit, inject, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { NavController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { heartOutline } from 'ionicons/icons';
import { ActivatedRoute } from '@angular/router';
import { AudioPlayerComponent } from 'src/app/shared/components/audio-player/audio-player.component';

@Component({
  selector: 'app-song',
  templateUrl: './song.page.html',
  styleUrls: ['./song.page.scss'],
  standalone: true,
  imports: [IonicModule, AudioPlayerComponent]
})
export class SongPage implements OnInit, AfterViewInit {

  item = {
    runtime: 120,
    image: 'https://ionicframework.com/docs/img/demos/thumbnail.svg',
    name: 'Spitting Off the Edge Of the World',
    autor: 'Yeah Yeah Yeahs'
  }
  private activatedRoute = inject(ActivatedRoute);
  private songId!: string | null;
  song: string | null = null;

  audioUrl = '../../../assets/audio.mp3'

  constructor(private navCtrl: NavController ) { 
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
      this.song = this.songId;
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const marquee = this.marqueeRef?.nativeElement;
      const container = this.containerRef?.nativeElement;
      if (marquee && container) {
        this.shouldAnimate = marquee.scrollWidth > container.offsetWidth;
      }
    });
  }

  goBack() {
    this.navCtrl.back();
  }
}
