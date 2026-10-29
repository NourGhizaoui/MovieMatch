import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { MatchingService, MatchResult } from '../../services/matching.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [IonicModule],
  templateUrl: './matches.page.html',
  styleUrls: ['./matches.page.scss']
})
export class MatchesPage {
  matches: MatchResult[] = [];
  hidden = 0;
  loading = false;
  threshold = environment.matchThreshold;
  criteria: { key: 'films' | 'genres' | 'acteurs' | 'epoques'; label: string }[] = [
    { key: 'films', label: 'Films' }, { key: 'genres', label: 'Genres' },
    { key: 'acteurs', label: 'Acteurs' }, { key: 'epoques', label: 'Époques' }
  ];
  constructor(public auth: AuthService, private ms: MatchingService) {}

  ionViewWillEnter() { return this.run(); }
  async refresh(ev: any) { await this.run(); ev.target.complete(); }

  private async run() {
    const me = this.auth.profile();
    if (!me?.favorites.length) { this.matches = []; return; }
    this.loading = true;
    try {
      const all = await this.ms.findMatches(me);
      this.matches = all.filter(r => r.score >= this.threshold);
      this.hidden = all.length - this.matches.length;
    } catch { this.matches = []; }
    this.loading = false;
  }
}
