import { Component, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { MediaItemComponent } from "src/app/shared/components/media-item/media-item.component";
import { NavController } from '@ionic/angular';

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

  item = [
    { id: 1,name: 'Tears for fears', image: 'https://ionicframework.com/docs/img/demos/thumbnail.svg', numberOfTracks: 10 },
    { id: 2, name: 'Red Hot Chili Papers', image: 'https://ionicframework.com/docs/img/demos/thumbnail.svg', numberOfTracks: 5 },
    { id: 3, name: 'Nombre largo para ver si explota el componente', image: 'https://ionicframework.com/docs/img/demos/thumbnail.svg',numberOfTracks: 8 },
    { id: "favorites", name: 'Favorites', image: '../../../../assets/my-favorites.png', numberOfTracks: 12 },
    { id: "my-songs", name: 'Your songs', image: '../../../../assets/my-songs.png', numberOfTracks: 7 }
  ]

  items= [
    {
      runtime: 120,
      image: 'https://ionicframework.com/docs/img/demos/thumbnail.svg',
      name: 'Spitting Off the Edge Of the World',
      autor: 'Yeah Yeah Yeahs'
    },
    {
      runtime: 150,
      image: 'https://ionicframework.com/docs/img/demos/thumbnail.svg',
      name: 'Nombre largo para ver si explota el componente o se corta',
      autor: 'Otro nombre largo para ver si explota el componente o se corta'
    },
    {
      runtime: 90,
      image: 'https://ionicframework.com/docs/img/demos/thumbnail.svg',
      name: 'Item 3',
      autor: 'Autor 3'
    },
    {
      runtime: 120,
      image: 'https://ionicframework.com/docs/img/demos/thumbnail.svg',
      name: 'Spitting Off the Edge Of the World',
      autor: 'Autor 1'
    },
    {
      runtime: 150,
      image: 'https://ionicframework.com/docs/img/demos/thumbnail.svg',
      name: 'Item 2',
      autor: 'Autor 2'
    },
    {
      runtime: 90,
      image: 'https://ionicframework.com/docs/img/demos/thumbnail.svg',
      name: 'Item 3',
      autor: 'Autor 3'
    },
    {
      runtime: 120,
      image: 'https://ionicframework.com/docs/img/demos/thumbnail.svg',
      name: 'Spitting Off the Edge Of the World',
      autor: 'Autor 1'
    },
    {
      runtime: 150,
      image: 'https://ionicframework.com/docs/img/demos/thumbnail.svg',
      name: 'Item 2',
      autor: 'Autor 2'
    },
    {
      runtime: 90,
      image: 'https://ionicframework.com/docs/img/demos/thumbnail.svg',
      name: 'Item 3',
      autor: 'Autor 3'
    }
  ];
  
  constructor(private navCtrl: NavController) {

  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      console.log('PlaylistPage ngOnInit', params);
      
      this.playlistId = params.get('id');
      this.playlist = this.item.find(i => i.id == this.playlistId);
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
