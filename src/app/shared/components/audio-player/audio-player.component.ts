import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AudioService } from 'src/app/services/audio.service';
import { Subscription } from 'rxjs';
import { addIcons } from 'ionicons';
import { playSkipForwardSharp, playSkipBackSharp, pauseCircle, playCircle } from 'ionicons/icons';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class AudioPlayerComponent implements OnInit, OnDestroy {
  @Input() audioSrc!: string;
  @Input() songId!: string;

  isPlaying: boolean = false;
  currentTime: number = 0;
  duration: number = 0;
  progress: number = 0;

  private audioSub!: Subscription;

  constructor(private audioService: AudioService) {
    addIcons({
      playCircle,
      pauseCircle,
      playSkipForwardSharp,
      playSkipBackSharp
    });
  }

  ngOnInit() {
    this.subscribeToAudio();
  }

  ngOnDestroy() {
    this.audioSub?.unsubscribe();
  }

  private subscribeToAudio() {
    this.audioSub?.unsubscribe();
    
    this.audioSub = this.audioService.audioState$.subscribe(state => {
      // Only update if it's our song or if the audio is stopped
      if (state.songId === this.songId || (!state.isPlaying && this.isPlaying)) {
        this.isPlaying = state.isPlaying;
        this.currentTime = state.currentTime;
        this.duration = state.duration;
        this.progress = this.duration ? (this.currentTime / this.duration) * 100 : 0;
      }
    });
  }

  togglePlay() {
    if (this.isPlaying) {
      this.audioService.pause();
    } else {
      this.audioService.play(this.songId, this.audioSrc);
    }
  }

  seek(event: any) {
    const seekTime = (event.detail.value / 100) * this.duration;
    this.audioService.seek(seekTime);
  }

  nextSong() {
    // Implement your playlist logic here
  }

  previousSong() {
    // Implement your playlist logic here
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }
}