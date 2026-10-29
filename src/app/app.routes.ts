import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage) },
  { path: 'register', loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage) },
  {
    path: 'tabs',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/tabs/tabs.page').then(m => m.TabsPage),
    children: [
      { path: 'movies', loadComponent: () => import('./pages/movies/movies.page').then(m => m.MoviesPage) },
      { path: 'playlist', loadComponent: () => import('./pages/playlist/playlist.page').then(m => m.PlaylistPage) },
      { path: 'matches', loadComponent: () => import('./pages/matches/matches.page').then(m => m.MatchesPage) },
      {
  path: 'profile',
  loadComponent: () =>
    import('./pages/profile/profile.page').then(m => m.ProfilePage)
},
      { path: 'admin', canActivate: [adminGuard], loadComponent: () => import('./pages/admin/admin.page').then(m => m.AdminPage) },
      { path: '', redirectTo: 'movies', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];