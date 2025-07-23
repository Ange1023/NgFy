import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { MediaItemComponent } from 'src/app/shared/components/media-item/media-item.component';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { SongService } from 'src/app/services/song.service';
import { SongModalComponent } from 'src/app/shared/components/song-modal/song-modal.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonicModule, MediaItemComponent, SongModalComponent],
})
export class Tab1Page implements OnInit {
  items: any[] = [];
  currentPage = 1;
  limit = 20;
  isLoading = false;
  hasMoreData = true;
  totalPages = 1; // Añadir esta propiedad

  constructor(
    private navCtrl: NavController,
    private songService: SongService
  ) {
    addIcons({ add });
  }

  ngOnInit() {
    this.loadInitialSongs();
  }

  loadInitialSongs() {
    if (this.isLoading) return;

    this.isLoading = true;
    
    this.songService.getPaginateSongs(this.currentPage, this.limit).subscribe({
      next: (response) => {
        this.processResponse(response);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading songs:', error);
        this.isLoading = false;
      }
    });
  }

  loadMoreData(event: any) {
    if (!this.hasMoreData || this.isLoading) {
      event.target.complete();
      return;
    }

    this.currentPage++;
    this.isLoading = true;

    console.log(`Loading page ${this.currentPage} of ${this.totalPages}`);

    this.songService.getPaginateSongs(this.currentPage, this.limit).subscribe({
      next: (response) => {
        this.processResponse(response);
        event.target.complete();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading more songs:', error);
        event.target.complete();
        this.isLoading = false;
      }
    });
  }

  private processResponse(response: any) {
    const newItems = response.data.data.map((song: any) => ({
      id: song._id,
      runtime: song.duration,
      image: song.poster_image,
      name: song.title,
      autor: song.artist
    }));

    this.items = [...this.items, ...newItems];
    this.totalPages = response.data.totalPages; // Asegúrate que la API devuelve esto
    this.hasMoreData = this.currentPage < this.totalPages;

    console.log(`Loaded ${newItems.length} items. Total: ${this.items.length}`);
    console.log(`Has more data: ${this.hasMoreData}`);
  }


  onSongClick(songId: number | string) {
    console.log('Click en canción:', songId);
    this.navCtrl.navigateForward(['tabs', 'tab1', songId], {
      animationDirection: 'forward' 
    });
  }

  onClick() {
    console.log('Add button clicked');
  }
}