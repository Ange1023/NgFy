import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { ellipsisVertical, heart, heartOutline, chevronForwardOutline} from 'ionicons/icons';


@Component({
  selector: 'app-media-item',
  templateUrl: './media-item.component.html',
  styleUrls: ['./media-item.component.scss'],
  standalone: true,
  imports: [IonicModule]
})


export class MediaItemComponent implements OnInit {

  @Input() runtime: string = '';
  @Input() image: string = '';
  @Input() name: string = '';
  @Input() autor: string = '';
  @Input() isOwner: boolean = false;
  @Input() isFavorite: boolean = false;
  @Input() numberOfTracks: number = 0;
  @Input() isPlaylist: boolean = false;
  @Output() itemClick = new EventEmitter<void>();

  constructor() { 
    addIcons({heart, heartOutline, ellipsisVertical, chevronForwardOutline});
  }

  ngOnInit() {}

}
