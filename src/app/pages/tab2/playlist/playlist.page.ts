import { Component, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { MediaItemComponent } from "src/app/shared/components/media-item/media-item.component";
import { NavController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';

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
  playlist: { id: number | string; name: string; image: string; numberOfTracks: number } | undefined;


  items: any[] = [];
  
  constructor(
    private navCtrl: NavController,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      console.log('PlaylistPage ngOnInit', params);
      
      this.playlistId = params.get('id');

      switch (this.playlistId) {
        case 'favorites':
          
        this.playlist = {
            id: 'favorites',
            name: 'Favorites',
            image: '../../../../assets/my-favorites.png',
            numberOfTracks: 0
          }

          this.userService.getUserFavoriteSongs().subscribe({

            next: (songs) => {

              this.playlist!.numberOfTracks = songs.length;

              this.items = songs.map((song: any) => ({
                id: song._id,
                runtime: song.duration,
                image: song.poster_image,
                name: song.title,
                autor: song.artist
              }));
            }
          });
          break;

        case 'my-songs':

          this.playlist = {
            id: 'my-songs',
            name: 'Your Songs',
            image: '../../../../assets/my-songs.png',
            numberOfTracks: 0
          };

          this.userService.getUserSongs().subscribe({
            next: (songs) => {

              this.playlist!.numberOfTracks = songs.length;

              this.items = songs.map((song: any) => ({
                id: song._id,
                runtime: song.duration,
                image: song.poster_image,
                name: song.title,
                autor: song.artist
              }));
            }
          });
          break;
        default:
          console.log('Playlist ID no reconocido:', this.playlistId);
          break;
      }

    });
  }

  onSongClick(songId: number | string) {
    console.log('Click en canción:', songId);
    this.navCtrl.navigateForward(['tabs', 'tab2', this.playlistId , songId], {
      animationDirection: 'forward' 
    });
  }

  goBack() {
    this.navCtrl.back();
  };

}
