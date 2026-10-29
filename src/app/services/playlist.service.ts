import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { MovieService } from './movie.service';
import { Movie } from '../models';

@Injectable({ providedIn: 'root' })
export class PlaylistService {
  constructor(private auth: AuthService, private movies: MovieService) {}

  isFav(m: Movie) { return !!this.auth.profile()?.favorites.some(f => f.id === m.id); }

  async toggle(m: Movie) {
    const favs = this.auth.profile()!.favorites;
    if (this.isFav(m)) return this.auth.saveFavorites(favs.filter(f => f.id !== m.id));
    const full = await this.movies.withCast(m);
    return this.auth.saveFavorites([...favs, full]);
  }
}
