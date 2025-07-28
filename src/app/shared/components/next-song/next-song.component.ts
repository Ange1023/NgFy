import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-next-song',
  templateUrl: './next-song.component.html',
  styleUrls: ['./next-song.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class NextSongComponent {
  @Input() id!: string;
  @Input() title!: string;
  @Input() image!: string;
  @Output() songClick = new EventEmitter<string>();

  onClick() {
    this.songClick.emit(this.id);
  }
}