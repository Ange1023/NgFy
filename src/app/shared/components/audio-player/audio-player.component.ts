import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { playSkipForwardSharp, playSkipBackSharp, pauseCircle, playCircle} from 'ionicons/icons';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class AudioPlayerComponent implements OnInit {
  @Input() audioSrc!: string;
  @Output() playEvent = new EventEmitter<void>();
  @Output() pauseEvent = new EventEmitter<void>();
  
  isPlaying: boolean = false;
  currentTime: number = 0;
  duration: number = 0;
  progress: number = 0;
  
  private audio: HTMLAudioElement = new Audio();

  constructor() {
    addIcons({
      playCircle,
      pauseCircle,
      playSkipForwardSharp,
      playSkipBackSharp
    });
  }

  ngOnInit() {
    if (this.audioSrc) {
      this.setupAudio();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['audioSrc'] && changes['audioSrc'].currentValue) {
      this.setupAudio();
    }
  }

  private setupAudio() {
    this.audio.src = this.audioSrc;
    
    this.audio.addEventListener('loadedmetadata', () => {
      this.duration = this.audio.duration;
    });
    
    this.audio.addEventListener('timeupdate', () => {
      this.currentTime = this.audio.currentTime;
      this.progress = (this.currentTime / this.duration) * 100;
    });
    
    this.audio.addEventListener('ended', () => {
      this.isPlaying = false;
    });
  }

  togglePlay() {
    if (this.isPlaying) {
      this.audio.pause();
      this.pauseEvent.emit();
    } else {
      this.audio.play();
      this.playEvent.emit();
    }
    this.isPlaying = !this.isPlaying;
  }

  seek(event: any) {
    const seekTime = (event.detail.value * this.duration) / 100;
    this.audio.currentTime = seekTime;
    this.currentTime = seekTime;
  }

  nextSong(){
    console.log('Next song');
    // Logic to go to the next song
  }

  previousSong(){
    console.log('Previous song');
    // Logic to go to the previous song
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }
  
}