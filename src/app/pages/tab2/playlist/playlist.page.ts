import { Component, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { MediaItemComponent } from "src/app/shared/components/media-item/media-item.component";

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.page.html',
  styleUrls: ['./playlist.page.scss'],
  standalone: true,
  imports: [IonicModule, MediaItemComponent]
})
export class PlaylistPage implements OnInit {

  private activatedRoute = inject(ActivatedRoute);
  private playlistId: string | null;
  playlist: { id: number; name: string; image: string; numberOfTracks: number } | undefined;

  item = [
    { id: 1,name: 'Tears for fears', image: 'https://ionicframework.com/docs/img/demos/thumbnail.svg', numberOfTracks: 10 },
    { id: 2, name: 'Red Hot Chili Papers', image: 'https://ionicframework.com/docs/img/demos/thumbnail.svg', numberOfTracks: 5 },
    { id: 3, name: 'Item 3', image: 'https://ionicframework.com/docs/img/demos/thumbnail.svg',numberOfTracks: 8 },
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
  
  constructor() { 
  
    this.playlistId = this.activatedRoute.snapshot.paramMap.get('id');
    console.log('Playlist ID:', this.playlistId);
  }

  ngOnInit() {
    this.playlist = this.item.find(i => i.id === Number(this.playlistId));
  }

}
