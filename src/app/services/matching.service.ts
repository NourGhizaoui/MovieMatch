import { Injectable } from '@angular/core';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';
import { Movie, UserProfile } from '../models';

export interface MatchResult {
  user: UserProfile;
  score: number; // 0-100
  detail: { films: number; genres: number; acteurs: number; epoques: number };
  common: string[];
}

// Pondération des critères (total = 1)
const W = { films: 0.25, genres: 0.30, acteurs: 0.25, epoques: 0.20 };

@Injectable({ providedIn: 'root' })
export class MatchingService {
  private counts(items: string[]) {
    const m = new Map<string, number>();
    items.forEach(i => m.set(i, (m.get(i) || 0) + 1));
    return m;
  }
  /** Similarité cosinus entre deux histogrammes */
  private cosine(a: Map<string, number>, b: Map<string, number>) {
    let dot = 0, na = 0, nb = 0;
    a.forEach((v, k) => { dot += v * (b.get(k) || 0); na += v * v; });
    b.forEach(v => (nb += v * v));
    return na && nb ? dot / Math.sqrt(na * nb) : 0;
  }
  /** Indice de Jaccard entre deux ensembles */
  private jaccard(a: string[], b: string[]) {
    const A = new Set(a), B = new Set(b);
    const inter = [...A].filter(x => B.has(x)).length;
    const union = new Set([...A, ...B]).size;
    return union ? inter / union : 0;
  }
  private decade(m: Movie) { return m.year ? `${Math.floor(m.year / 10) * 10}s` : '?'; }

  compare(me: Movie[], other: Movie[]) {
    const films = this.jaccard(me.map(m => m.id), other.map(m => m.id));
    const genres = this.cosine(this.counts(me.flatMap(m => m.genres)), this.counts(other.flatMap(m => m.genres)));
    const acteurs = this.cosine(this.counts(me.flatMap(m => m.cast)), this.counts(other.flatMap(m => m.cast)));
    const epoques = this.cosine(this.counts(me.map(m => this.decade(m))), this.counts(other.map(m => this.decade(m))));
    const score = films * W.films + genres * W.genres + acteurs * W.acteurs + epoques * W.epoques;
    const ids = new Set(other.map(m => m.id));
    const pct = (x: number) => Math.round(x * 100);
    return {
      score: pct(score),
      detail: { films: pct(films), genres: pct(genres), acteurs: pct(acteurs), epoques: pct(epoques) },
      common: me.filter(m => ids.has(m.id)).map(m => m.title)
    };
  }

  async findMatches(me: UserProfile): Promise<MatchResult[]> {
    const snap = await getDocs(query(collection(db, 'users'), where('active', '==', true)));
    return snap.docs
      .map(d => ({ uid: d.id, ...d.data() } as UserProfile))
      .filter(u => u.uid !== me.uid && u.favorites?.length)
      .map(u => ({ user: u, ...this.compare(me.favorites, u.favorites) }))
      .sort((a, b) => b.score - a.score);
  }
}
