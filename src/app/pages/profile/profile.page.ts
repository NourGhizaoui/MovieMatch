
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertController,
  IonicModule,
  ToastController
} from '@ionic/angular';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { sendPasswordResetEmail } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

import { AuthService } from '../../services/auth.service';
import { auth, db } from '../../services/firebase';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit {
  nom = '';
  prenom = '';
  age = 18;
  photo = '';

  editing = false;
  saving = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  async ngOnInit(): Promise<void> {
    await this.authService.ready;
    this.loadProfile();
  }

  loadProfile(): void {
    const profile = this.authService.profile();

    if (!profile) {
      this.router.navigateByUrl('/login', { replaceUrl: true });
      return;
    }

    this.nom = profile.nom || '';
    this.prenom = profile.prenom || '';
    this.age = profile.age || 18;
    this.photo = profile.photo || '';
  }

  startEditing(): void {
    this.loadProfile();
    this.editing = true;
  }

  cancelEditing(): void {
    this.loadProfile();
    this.editing = false;
  }

  async changePhoto(): Promise<void> {
    try {
      const image = await Camera.getPhoto({
        quality: 45,
        width: 400,
        height: 400,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
        promptLabelHeader: 'Photo de profil',
        promptLabelPhoto: 'Choisir une photo',
        promptLabelPicture: 'Prendre une photo'
      });

      if (image.dataUrl) {
        this.photo = image.dataUrl;
      }
    } catch (error) {
      console.error('Erreur de sélection de photo :', error);
    }
  }

  async saveProfile(): Promise<void> {
    const profile = this.authService.profile();

    if (!profile) {
      await this.showToast('Utilisateur non connecté.', 'danger');
      return;
    }

    if (!this.prenom.trim() || !this.nom.trim()) {
      await this.showToast('Le prénom et le nom sont obligatoires.', 'warning');
      return;
    }

    const ageNumber = Number(this.age);

    if (!Number.isInteger(ageNumber) || ageNumber < 1 || ageNumber > 120) {
      await this.showToast('Veuillez saisir un âge valide.', 'warning');
      return;
    }

    this.saving = true;

    try {
      const changes = {
        prenom: this.prenom.trim(),
        nom: this.nom.trim(),
        age: ageNumber,
        photo: this.photo
      };

      await updateDoc(doc(db, 'users', profile.uid), changes);

      this.authService.profile.set({
        ...profile,
        ...changes
      });

      this.editing = false;
      await this.showToast('Profil mis à jour avec succès.', 'success');
    } catch (error) {
      console.error('Erreur de mise à jour du profil :', error);
      await this.showToast('Impossible de mettre à jour le profil.', 'danger');
    } finally {
      this.saving = false;
    }
  }

  async resetPassword(): Promise<void> {
    const profile = this.authService.profile();

    if (!profile?.email) {
      await this.showToast('Adresse e-mail introuvable.', 'danger');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Modifier le mot de passe',
      message: `Un lien de réinitialisation sera envoyé à ${profile.email}.`,
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        {
          text: 'Envoyer',
          handler: () => {
            void this.sendResetEmail(profile.email);
          }
        }
      ]
    });

    await alert.present();
  }

  private async sendResetEmail(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
      await this.showToast(
        'E-mail de réinitialisation envoyé.',
        'success'
      );
    } catch (error) {
      console.error('Erreur de réinitialisation :', error);
      await this.showToast(
        'Impossible d’envoyer l’e-mail. Réessayez plus tard.',
        'danger'
      );
    }
  }

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
      this.authService.profile.set(null);
      await this.router.navigateByUrl('/login', { replaceUrl: true });
    } catch (error) {
      console.error('Erreur de déconnexion :', error);
      await this.showToast('Impossible de se déconnecter.', 'danger');
    }
  }

  private async showToast(
    message: string,
    color: 'success' | 'danger' | 'warning'
  ): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      position: 'bottom',
      color
    });

    await toast.present();
  }
}
