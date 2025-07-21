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

  @Input() runtime: number = 0;
  @Input() image: string = '';
  @Input() name: string = '';
  @Input() autor: string = '';
  @Input() isOwner: boolean = false;
  @Input() isFavorite: boolean = false;
  @Input() numberOfTracks: number = 0;
  @Input() isPlaylist: boolean = false;
  @Input() isPreview: boolean = false;
  @Input() id: string = '';
  @Output() itemClick = new EventEmitter<void>();

  constructor() {
    addIcons({ heart, heartOutline, ellipsisVertical, chevronForwardOutline });
  }

  formatRuntime(seconds: number): string {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }

  ngOnInit() {}

}
