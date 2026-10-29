import { Injectable, signal } from '@angular/core';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserProfile } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  profile = signal<UserProfile | null>(null);
  ready: Promise<void>;

  constructor() {
    this.ready = new Promise(resolve => {
      onAuthStateChanged(auth, async u => {
        this.profile.set(u ? await this.load(u.uid) : null);
        resolve();
      });
    });
  }

  /** Charge le profil ; si le compte est désactivé, déconnecte l'utilisateur. */
  private async load(uid: string): Promise<UserProfile | null> {
    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) return null;
    const p = { uid, favorites: [], ...snap.data() } as UserProfile;
    if (p.active === false) { await signOut(auth); return null; }
    return p;
  }

  async register(email: string, password: string, d: { nom: string; prenom: string; age: number; photo: string }) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', cred.user.uid), {
      ...d, email, role: 'user', active: true, favorites: [], createdAt: Date.now()
    });
    this.profile.set(await this.load(cred.user.uid));
  }

  async login(email: string, password: string) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const p = await this.load(cred.user.uid);
    if (!p) throw new Error('Ce compte est désactivé ou introuvable. Contactez un administrateur.');
    this.profile.set(p);
  }

  logout() { return signOut(auth); }

  async saveFavorites(favorites: any[]) {
    const p = this.profile();
    if (!p) return;
    await updateDoc(doc(db, 'users', p.uid), { favorites });
    this.profile.set({ ...p, favorites });
  }
}
