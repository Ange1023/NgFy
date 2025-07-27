import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { ellipsisVertical, heart, heartOutline, chevronForwardOutline} from 'ionicons/icons';
import { UserService } from 'src/app/services/user.service';
import { ModalController } from '@ionic/angular';
import { MediaItemModalComponent } from '../media-item-modal/media-item-modal.component';


@Component({
  selector: 'app-media-item',
  templateUrl: './media-item.component.html',
  styleUrls: ['./media-item.component.scss'],
  standalone: true,
  imports: [IonicModule]
})


export class MediaItemComponent implements OnInit {

  @Input() runtime: number = 0;
  @Input() image: string ='https://i.postimg.cc/xTSJhVPn/Chat-GPT-Image-26-jun-2025-06-32-14-p-m.png' ;
  @Input() name: string = '';
  @Input() autor: string = '';
  @Input() isOwner: boolean = false;
  @Input() isFavorite: boolean = false;
  @Input() numberOfTracks: number = 0;
  @Input() isPlaylist: boolean = false;
  @Input() isPreview: boolean = false;
  @Input() id: string = '';
  @Input() location: 'my-songs' | 'favorites' | 'playlist'| string = '';

  @Output() itemClick = new EventEmitter<void>();
  @Output() editItem = new EventEmitter<void>();
  @Output() deleteItem = new EventEmitter<void>();
  @Output() addToPlaylist = new EventEmitter<void>();
  @Output() removeFromPlaylist = new EventEmitter<void>();
  @Output() editPlaylist = new EventEmitter<void>();
  @Output() deletePlaylist = new EventEmitter<void>();


  constructor(
    private userService: UserService,
    private modalCtrl: ModalController
  ) {
    addIcons({ heart, heartOutline, ellipsisVertical, chevronForwardOutline });
  
  }

  formatRuntime(seconds: number): string {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }

  ngOnInit() {

  }

  isAnimatingFavorite = false;

  async openOptionsModal(event: Event) {
    event.stopPropagation();

    let options: { name: string; key: string; danger?: boolean }[] = [];

    if (this.location === 'my-songs') {
      options = [
        { name: 'Editar canción', key: 'editItem' },
        { name: 'Agregar a playlist', key: 'addToPlaylist' },
        { name: 'Eliminar canción', key: 'deleteItem', danger: true },
      ];
    } else if (this.location === 'playlist') {
      options = [
        { name: 'Editar playlist', key: 'editPlaylist' },
        { name: 'Borrar playlist', key: 'deletePlaylist', danger: true }
      ];
    } else if (this.location === 'favorites') {
      options = [
        // { name: 'Agregar a playlist', key: 'addToPlaylist' },
        { name: 'Eliminar de favoritos', key: 'toggleFavorite', danger: true }
      ];
    } else {
      options = [
        { name: 'Editar canción', key: 'editItem' },
        { name: 'Agregar a playlist', key: 'addToPlaylist' },
        { name: 'Eliminar de la playlist', key: 'removeFromPlaylist', danger: true },
      ]
    }

    const modal = await this.modalCtrl.create({
      component: MediaItemModalComponent,
      componentProps: { options },
      breakpoints: [0,0.2,1],
      initialBreakpoint: 0.2, 
      showBackdrop: true,
    });
    await modal.present();

    const { data} = await modal.onDidDismiss();

    if (data) {
      this.handleModalAction(data);
    }
  }

  handleModalAction(actionKey: string) {
    switch (actionKey) {
      case 'editItem':
        this.editItem.emit();
        break;
      case 'addToPlaylist':
        this.addToPlaylist.emit();
        break;
      case 'deleteItem':
        this.deleteItem.emit();
        break;
      case 'editPlaylist':
        this.editPlaylist.emit();
        break;
      case 'deletePlaylist':
        this.deletePlaylist.emit();
        break;
      case 'toggleFavorite':
        this.toggleFavorite();
        break;
      case 'removeFromPlaylist':
        this.removeFromPlaylist.emit();
        break;
      default:
        console.warn('Acción no reconocida:', actionKey);
    }
  }

  toggleFavorite(event?: Event) {
    event?.stopPropagation();
    this.isFavorite = !this.isFavorite;
    
    this.isAnimatingFavorite = true;
    setTimeout(() => {
      this.isAnimatingFavorite = false;
    }, 400);
    
    this.userService.toggleFavoriteSong(this.id).subscribe({
    next: (response) => {
      const msg = this.isFavorite ? 'Agregado a favoritos:' : 'Eliminado de favoritos:';
      console.log(msg, response);
    }
  });
  }

}
