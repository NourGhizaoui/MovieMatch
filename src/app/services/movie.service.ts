import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { environment } from '../../environments/environment';
import { Movie } from '../models';

const API = 'https://api.themoviedb.org/3';
const IMG = 'https://image.tmdb.org/t/p/w342';

@Injectable({ providedIn: 'root' })
export class MovieService {
  private genreMap: Record<number, string> | null = null;
  constructor(private http: HttpClient) {}

  private get<T>(path: string, params: Record<string, string> = {}) {
    return firstValueFrom(this.http.get<T>(`${API}${path}`, {
      params: { api_key: environment.tmdbKey, language: 'fr-FR', ...params }
    }));
  }

  private async genres() {
    if (!this.genreMap) {
      const r: any = await this.get('/genre/movie/list');
      this.genreMap = Object.fromEntries(r.genres.map((g: any) => [g.id, g.name]));
    }
    return this.genreMap!;
  }

  /** Films TMDB (populaires ou recherche) */


/** Films TMDB (populaires ou recherche) */
async tmdb(query = ''): Promise<Movie[]> {
  const g = await this.genres();

  const r: any = query
    ? await this.get('/search/movie', { query })
    : await this.get('/movie/popular');

  const movies: Movie[] = r.results.map((m: any): Movie => ({
    id: String(m.id),
    title: m.title,
    year: m.release_date
      ? Number(m.release_date.slice(0, 4))
      : 0,
    poster: m.poster_path
      ? IMG + m.poster_path
      : '',
    source: 'tmdb',
    genres: (m.genre_ids || [])
      .map((id: number) => g[id])
      .filter(Boolean),
    overview: m.overview || '',
    cast: []
  }));

  // Récupérer les acteurs principaux de chaque film
  return Promise.all(
    movies.map(movie =>
      this.withCast(movie).catch(error => {
        console.error(
          `Erreur lors du chargement des acteurs de ${movie.title}:`,
          error
        );

        return movie;
      })
    )
  );
}



  /** Films ajoutés par l'administrateur (Firestore) */
  async local(query = ''): Promise<Movie[]> {
    const s = await getDocs(collection(db, 'movies'));
    const q = query.toLowerCase();
    return s.docs.map(d => d.data() as Movie).filter(m => !q || m.title.toLowerCase().includes(q));
  }

  async addLocal(m: Omit<Movie, 'id' | 'source'>) {
    const id = 'c_' + Date.now();
    await setDoc(doc(db, 'movies', id), { ...m, id, source: 'local' });
  }

  /** Complète un film TMDB avec ses acteurs principaux (utile pour le matching). */
  async withCast(m: Movie): Promise<Movie> {
    if (m.source === 'local' || m.cast.length) return m;
    const r: any = await this.get(`/movie/${m.id}/credits`);
    return { ...m, cast: r.cast.slice(0, 6).map((c: any) => c.name) };
  }
}
