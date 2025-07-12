import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { musicalNotes, personCircleSharp, person } from 'ionicons/icons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matQueueMusicOutline } from '@ng-icons/material-icons/outline';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, NgIcon],
  viewProviders: [provideIcons({matQueueMusicOutline})]
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor() {
    addIcons({ musicalNotes, person, personCircleSharp });
  }
}
