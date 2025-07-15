import { Component } from '@angular/core';
import {IonicModule} from '@ionic/angular';
import { MediaItemComponent } from 'src/app/shared/components/media-item/media-item.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonicModule, MediaItemComponent],
})
export class Tab1Page {
  items = [
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
  constructor() {}

}
