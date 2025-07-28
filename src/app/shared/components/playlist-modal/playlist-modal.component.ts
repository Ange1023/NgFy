import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-playlist-modal',
  templateUrl: './playlist-modal.component.html',
  styleUrls: ['./playlist-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule]
})
export class PlaylistModalComponent {
  @Input() playlistName: string = '';
  @Input() playlistId?: string;

  form = {
    name: ''
  };

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    if (this.playlistName) {
      this.form.name = this.playlistName;
    }
  }

  isFormValid(): boolean {
    return this.form.name.trim() !== '';
  }

  onSave() {
    const isEdit = !!this.playlistId && this.playlistId !== '';
    this.modalCtrl.dismiss(
      { name: this.form.name, id: this.playlistId },
      isEdit ? 'edit' : 'save'
    );
  }

  closeModal() {
    this.form.name = '';
    this.modalCtrl.dismiss(null, 'cancel');
  }
}