import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { MovieService } from '../../services/movie.service';
import { UserProfile } from '../../models';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [IonicModule, FormsModule],
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss']
})
export class AdminPage implements OnInit {
  tab: 'users' | 'movie' = 'users';
  users: UserProfile[] = [];
  f: any = { title: '', year: null, genres: '', cast: '', poster: '', overview: '' };
  constructor(private ms: MovieService, private toast: ToastController) {}

  ngOnInit() { this.loadUsers(); }

  private async say(message: string, color = 'primary') {
    (await this.toast.create({ message, duration: 2500, color })).present();
  }

  async loadUsers() {
    const s = await getDocs(collection(db, 'users'));
    this.users = s.docs.map(d => ({ uid: d.id, ...d.data() } as UserProfile));
  }

  /** Désactive (ou réactive) un compte sans le supprimer. */
  async setActive(u: UserProfile, active: boolean) {
    if (u.active === active) return;
    try {
      await updateDoc(doc(db, 'users', u.uid), { active });
      u.active = active;
      this.say(active ? 'Compte réactivé' : 'Compte désactivé');
    } catch { this.say('Modification refusée', 'danger'); }
  }

  async addMovie() {
    const list = (s: string) => s.split(',').map(x => x.trim()).filter(Boolean);
    if (!this.f.title || !this.f.year) return this.say('Titre et année obligatoires', 'danger');
    try {
      await this.ms.addLocal({
        title: this.f.title, year: +this.f.year, poster: this.f.poster,
        genres: list(this.f.genres), cast: list(this.f.cast), overview: this.f.overview
      });
      this.f = { title: '', year: null, genres: '', cast: '', poster: '', overview: '' };
      this.say('Film ajouté');
    } catch { this.say('Ajout refusé', 'danger'); }
  }
}
