import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      
      {
        path: 'tab1',
        children: [
          {
            path: '',
            loadComponent: () => import('../tab1/tab1.page').then((m) => m.Tab1Page),
          },
          {
            path: ':id',
            loadComponent: () => import('../song/song.page').then( m => m.SongPage)
          },
        ]
      },
      {
        path: 'tab2',
        children: [
          {
            path: '',
            loadComponent: () => import('../tab2/tab2.page').then((m) => m.Tab2Page),
          },
          {
            path: ':id',
            children: [
              {
                path: '',
                loadComponent: () => import('../tab2/playlist/playlist.page').then((m) => m.PlaylistPage),
              },
              {
                path: ':id',
                loadComponent: () => import('../song/song.page').then((m) => m.SongPage)
              }
            ]
          },

        ]
      },
      {
        path: 'tab3',
        loadComponent: () =>
          import('../tab3/tab3.page').then((m) => m.Tab3Page),
      },
      {
        path: '',
        redirectTo: 'tab1',
        pathMatch: 'full',
      },
      
    ],
  },
];
