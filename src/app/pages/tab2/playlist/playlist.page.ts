import { Component, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { MediaItemComponent } from "src/app/shared/components/media-item/media-item.component";
import { NavController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { PlaylistService } from 'src/app/services/playlist.service';
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
    private router: Router
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

  onSongClick(songId: number | string) {
    this.navCtrl.navigateForward(['tabs', 'tab2', this.playlistId , songId], {
      animationDirection: 'forward' 
    });
  }

  onEditItem(){
    console.log('Edit item clicked');
  }

  onDeleteItem(){
    console.log('Delete item clicked');
  }

  onAddToPlaylist() {
    console.log('Add to playlist clicked for song ID:');
  }

  onRemoveFromPlaylist() {
    console.log('Remove from playlist clicked for song ID:');
  }

  goBack() {
    this.navCtrl.back();
  }
}