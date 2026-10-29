
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';

import { AuthService } from '../../services/auth.service';
import { MovieService } from '../../services/movie.service';
import { PlaylistService } from '../../services/playlist.service';
import { Movie } from '../../models';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [IonicModule],
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss']
})
export class MoviesPage implements OnInit {

  movies: Movie[] = [];
  loading = false;

  // État du popup de détails
  detailsOpen = false;
  selectedMovie: Movie | null = null;

  // Genre sélectionné
  selectedGenre = 'Tous';

  constructor(
    private ms: MovieService,
    public playlist: PlaylistService,
    private auth: AuthService,
    private router: Router,
    private toast: ToastController
  ) {}

  ngOnInit(): void {
    this.load('');
  }

  // Genres disponibles dans les films chargés
  get availableGenres(): string[] {
    return [
      'Tous',
      ...new Set(
        this.movies.flatMap(movie => movie.genres || [])
      )
    ];
  }

  // Films filtrés selon le genre sélectionné
  get filteredMovies(): Movie[] {
    if (this.selectedGenre === 'Tous') {
      return this.movies;
    }

    return this.movies.filter(movie =>
      movie.genres?.includes(this.selectedGenre)
    );
  }

  // Sélectionner un genre
  selectGenre(genre: string): void {
    this.selectedGenre = genre;
  }

  // Charger les films locaux et TMDB
  async load(q: string): Promise<void> {
    this.loading = true;

    try {
      const [local, tmdb] = await Promise.all([
        this.ms.local(q).catch(() => [] as Movie[]),

        this.ms.tmdb(q).catch(async () => {
          const message = await this.toast.create({
            message: 'API TMDB indisponible. Vérifiez votre clé API.',
            duration: 3000,
            color: 'danger'
          });

          await message.present();

          return [] as Movie[];
        })
      ]);

      this.movies = [...local, ...tmdb];

      // Vérification des données dans la console
      console.log('Films locaux :', local);
      console.log('Films TMDB :', tmdb);
      console.log(
        'Synopsis du quatrième film :',
        this.movies[3]?.overview
      );

      // Réinitialiser le genre si aucun film ne correspond
      if (
        this.selectedGenre !== 'Tous' &&
        !this.availableGenres.includes(this.selectedGenre)
      ) {
        this.selectedGenre = 'Tous';
      }

    } catch (error) {
      console.error('Erreur de chargement :', error);

      const message = await this.toast.create({
        message: 'Impossible de charger les films.',
        duration: 2500,
        color: 'danger'
      });

      await message.present();

    } finally {
      this.loading = false;
    }
  }

  // Ouvrir le popup
  openDetails(movie: Movie): void {
    this.selectedMovie = movie;
    this.detailsOpen = true;
  }

  // Fermer le popup
  closeDetails(): void {
    this.detailsOpen = false;
    this.selectedMovie = null;
  }

  // Ajouter ou retirer un favori
  async toggle(movie: Movie): Promise<void> {
    try {
      await this.playlist.toggle(movie);

    } catch (error) {
      console.error('Erreur favoris :', error);

      const message = await this.toast.create({
        message: 'Action impossible pour le moment.',
        duration: 2500,
        color: 'danger'
      });

      await message.present();
    }
  }

  // Déconnexion
  async logout(): Promise<void> {
    try {
      await this.auth.logout();

      await this.router.navigateByUrl('/login', {
        replaceUrl: true
      });

    } catch (error) {
      console.error('Erreur de déconnexion :', error);

      const message = await this.toast.create({
        message: 'Impossible de se déconnecter.',
        duration: 2500,
        color: 'danger'
      });

      await message.present();
    }
  }
}
