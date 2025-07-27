import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

export interface AudioState {
  songId: string | null;
  src: string | null;
  audio: HTMLAudioElement | null;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
}

@Injectable({ providedIn: 'root' })

export class AudioService {
  private audioStateSubject = new BehaviorSubject<AudioState>({
    songId: null,
    src: null,
    audio: null,
    currentTime: 0,
    duration: 0,
    isPlaying: false
  });

  audioState$ = this.audioStateSubject.asObservable().pipe(
    distinctUntilChanged((prev, curr) => 
      prev.songId === curr.songId &&
      prev.isPlaying === curr.isPlaying &&
      Math.abs(prev.currentTime - curr.currentTime) < 0.1 &&
      Math.abs(prev.duration - curr.duration) < 0.1
    )
  );

  private cleanupAudio(audio: HTMLAudioElement | null) {
    if (!audio) return;
    
    audio.pause();
    audio.removeEventListener('timeupdate', this.timeUpdateHandler);
    audio.removeEventListener('loadedmetadata', this.loadedMetadataHandler);
    audio.removeEventListener('play', this.playHandler);
    audio.removeEventListener('pause', this.pauseHandler);
    audio.removeEventListener('ended', this.endedHandler);
  }

  private timeUpdateHandler = () => {
    const audio = this.audioStateSubject.value.audio;
    if (audio) {
      this.audioStateSubject.next({
        ...this.audioStateSubject.value,
        currentTime: audio.currentTime
      });
    }
  };

  private loadedMetadataHandler = () => {
    const audio = this.audioStateSubject.value.audio;
    if (audio) {
      this.audioStateSubject.next({
        ...this.audioStateSubject.value,
        duration: audio.duration
      });
    }
  };

  private playHandler = () => {
    this.audioStateSubject.next({
      ...this.audioStateSubject.value,
      isPlaying: true
    });
  };

  private pauseHandler = () => {
    this.audioStateSubject.next({
      ...this.audioStateSubject.value,
      isPlaying: false
    });
  };

  private endedHandler = () => {
    this.audioStateSubject.next({
      ...this.audioStateSubject.value,
      isPlaying: false,
      currentTime: 0
    });
  };

  play(songId: string, audioSrc: string) {
    let state = this.audioStateSubject.value;

    // Clean up previous audio if it's a different song
    if (state.songId !== songId && state.audio) {
      this.cleanupAudio(state.audio);
    }

    // Create new audio element if needed
    if (state.songId !== songId || !state.audio) {
      const audio = new Audio(audioSrc);

      audio.addEventListener('timeupdate', this.timeUpdateHandler);
      audio.addEventListener('loadedmetadata', this.loadedMetadataHandler);
      audio.addEventListener('play', this.playHandler);
      audio.addEventListener('pause', this.pauseHandler);
      audio.addEventListener('ended', this.endedHandler);

      audio.currentTime = 0;
      audio.play();

      this.audioStateSubject.next({
        songId,
        src: audioSrc,
        audio,
        currentTime: 0,
        duration: audio.duration || 0,
        isPlaying: true
      });
    } else {
      state.audio?.play();
      this.audioStateSubject.next({
        ...state,
        isPlaying: true
      });
    }
  }

  pause() {
    const state = this.audioStateSubject.value;
    state.audio?.pause();
    this.audioStateSubject.next({
      ...state,
      isPlaying: false
    });
  }

  seek(time: number) {
    const state = this.audioStateSubject.value;
    if (state.audio) {
      state.audio.currentTime = time;
      this.audioStateSubject.next({
        ...state,
        currentTime: time
      });
    }
  }
}