export interface Movie {
  id: string;
  title: string;
  year: number;
  poster: string;
  genres: string[];
  cast: string[];
  overview?: string;
  source: 'tmdb' | 'local';
}
export interface UserProfile {
  uid: string;
  email: string;
  nom: string;
  prenom: string;
  age: number;
  photo: string;
  role: 'user' | 'admin';
  active: boolean;
  favorites: Movie[];
}
