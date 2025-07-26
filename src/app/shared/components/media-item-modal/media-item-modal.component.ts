import { Component, Input, Output, EventEmitter} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

export interface ModalOption {
  name: string;
  action: () => void;
  danger?: boolean;
}

@Component({
  selector: 'app-media-item-modal',
  templateUrl: './media-item-modal.component.html',
  styleUrls: ['./media-item-modal.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class MediaItemModalComponent {
  @Input() options: { name: string; key: string; danger?: boolean }[] = [];
  @Output() optionSelected = new EventEmitter<string>();

  constructor(private modalController: ModalController) {}

  selectOption(key: string) {
    this.optionSelected.emit(key);
    this.modalController.dismiss(key);
  }
}