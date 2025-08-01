import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { checkmarkCircle, closeCircle, warning, informationCircle, closeCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  standalone: true,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(20px)' }))
      ])
    ])
  ],
  imports: [IonicModule]
})
export class NotificationComponent implements OnInit {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' | 'info' | 'warning' = 'info';
  @Input() duration: number = 3000; 
  @Output() dismissed = new EventEmitter<void>();

  show: boolean = false;

  constructor() {
    addIcons({
      checkmarkCircle,
      closeCircle,
      warning,
      informationCircle,
      close: closeCircleOutline
    });
  }

  ngOnInit() {
    this.showNotification();
  }

  showNotification() {
    this.show = true;
    if (this.duration > 0) {
      setTimeout(() => {
        this.dismiss();
      }, this.duration);
    }
  }

  dismiss() {
    this.show = false;
    setTimeout(() => {
      this.dismissed.emit();
    }, 300); // Espera a que termine la animación
  }

  getIcon(): string {
    switch (this.type) {
      case 'success': return 'checkmark-circle';
      case 'error': return 'close-circle';
      case 'warning': return 'warning';
      case 'info': 
      default: return 'information-circle';
    }
  }

  getColor(): string {
    switch (this.type) {
      case 'success': return 'success';
      case 'error': return 'danger';
      case 'warning': return 'warning';
      case 'info': 
      default: return 'primary';
    }
  }
}