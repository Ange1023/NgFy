import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { MediaItemComponent } from 'src/app/shared/components/media-item/media-item.component';
import { addIcons } from 'ionicons';
import { add, alertCircleOutline, optionsOutline} from 'ionicons/icons';
import { SongService } from 'src/app/services/song.service';
import { SongModalComponent } from 'src/app/shared/components/song-modal/song-modal.component';
import { UserService } from 'src/app/services/user.service';
import { ModalController } from '@ionic/angular';
import { AudioService } from 'src/app/services/audio.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SearchService } from 'src/app/services/search.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonicModule, MediaItemComponent, FormsModule],
})
export class Tab1Page implements OnInit {
  items: any[] = [];
  currentPage = 1;
  limit = 20;
  isLoading = false;
  hasMoreData = true;
  totalPages = 1; 
  favoriteSongs: any[] = [];
  isAuthor: boolean = false;
  isCategoryModalOpen = false;
  categories: any[] = [];
  selectedCategory: string = '';
  searchQuery: string = '';

  private searchSubject = new Subject<string>();

  constructor(
    private navCtrl: NavController,
    private songService: SongService,
    private userService: UserService,
    private modalCtrl: ModalController,
    private audioService: AudioService,
    private searchService: SearchService
  ) {
    addIcons({ add, optionsOutline, alertCircleOutline});

    this.searchSubject.pipe(
      debounceTime(400) 
    ).subscribe(query => {
      this.searchSongs(query);
    });
  }

  ngOnInit() {
    this.userService.userProfile$.subscribe({
      next: (profile) => {
        if (!profile) return;
        this.isAuthor = profile.user.author ?? false;
      }
    });

    this.songService.getCategoriesSong().subscribe(res => {
      this.categories = res.data.categories;
    });


    this.userService.getUserFavoriteSongs().subscribe({
      next: (songs) => {
        this.favoriteSongs = songs;
        this.loadInitialSongs(); 
      }
    });
  }

  loadInitialSongs() {
    if (this.isLoading) return;

    this.items = [];
    this.currentPage = 1;
    this.hasMoreData = true;

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

    const favoriteIds = this.favoriteSongs.map(song => song._id);

    const newItems = response.data.data.map((song: any) => ({
      id: song._id,
      runtime: song.duration,
      image: song.poster_image,
      name: song.title,
      autor: song.artist,
      isFavorite: favoriteIds.includes(song._id),
    }));

    this.items = [...this.items, ...newItems];
    this.totalPages = response.data.totalPages; 
    this.hasMoreData = this.currentPage < this.totalPages;

    console.log(`Loaded ${newItems.length} items. Total: ${this.items.length}`);
    console.log(`Has more data: ${this.hasMoreData}`);
  }


  openModal(songData?: any, isEdit: boolean = false) {

    this.modalCtrl.create({
      component: SongModalComponent,
      componentProps: {
        songData: songData || null,
        isEdit: isEdit
      },
      breakpoints: [0, 1],
      initialBreakpoint: 1,
      showBackdrop: true,
    }).then(modal => {
      modal.present();
    });
  }

  onSongClick(songId: string) {
    console.log('Click en canción:', songId);

    let nextSongId  = null;

    if (this.items){
      const ids= this.items.map(item => item.id);
      this.audioService.setPlaylist(ids, songId);

      nextSongId = this.audioService.getNextSongId();

      const navExtras = {
        state: { nextSongId }
      };
    }

    this.navCtrl.navigateForward(['tabs', 'tab1', songId], {
      animationDirection: 'forward',
      state: { nextSongId }
    });
  }

  openCategorySelect(selectRef: any) {
    selectRef.open();
  }

  onCategorySelected(event: any) {
  this.selectedCategory = event.detail.value;
  this.searchQuery = ''; 
  this.searchSongs('', this.selectedCategory); 
  }
    
  onSearchInput(event: any) {
    const query = event.target.value;
    this.searchQuery = query;
    this.selectedCategory = ''; 
    this.searchSubject.next(query);
  }

  searchSongs(query: string, category?: string) {
    if (!query && !category) {
      this.loadInitialSongs();
      return;
    }
    this.isLoading = true;
    this.searchService.searchSongs(1, this.limit, query, category).subscribe({
      next: (response) => {
        this.items = response.data.data.map((song: any) => ({
          id: song._id,
          runtime: song.duration,
          image: song.poster_image,
          name: song.title,
          autor: song.artist,
          isFavorite: this.favoriteSongs.some(f => f._id === song._id),
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error searching songs:', error);
        this.isLoading = false;
      }
    });
  }

  onClick() {
    console.log('Add button clicked');
    this.openModal();
  }

}