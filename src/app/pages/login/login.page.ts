
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonicModule, AlertController } from '@ionic/angular';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule, FormsModule, RouterLink],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
  email = '';
  password = '';
  busy = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}

  async login(): Promise<void> {
    // Vérifier les champs
    if (!this.email.trim() || !this.password) {
      await this.showAlert(
        'Champs obligatoires',
        'Veuillez saisir votre adresse e-mail et votre mot de passe.'
      );
      return;
    }

    this.busy = true;

    try {
      await this.auth.login(this.email.trim(), this.password);

      await this.router.navigateByUrl('/tabs/movies', {
        replaceUrl: true
      });

    } catch (error: any) {
      console.error('Erreur de connexion :', error);

      const code = error?.code;

      let message = 'Une erreur est survenue. Veuillez réessayer.';

      if (
        code === 'auth/invalid-credential' ||
        code === 'auth/wrong-password' ||
        code === 'auth/user-not-found' ||
        code === 'auth/invalid-email'
      ) {
        message = 'Adresse e-mail ou mot de passe incorrect.';
      } else if (code === 'auth/too-many-requests') {
        message = 'Trop de tentatives. Réessayez plus tard.';
      } else if (code === 'auth/network-request-failed') {
        message = 'Problème de connexion Internet.';
      }

      await this.showAlert('Échec de connexion', message);

    } finally {
      this.busy = false;
    }
  }

  private async showAlert(
    title: string,
    message: string
  ): Promise<void> {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: [
        {
          text: 'OK',
          role: 'confirm'
        }
      ],
      backdropDismiss: false
    });

    await alert.present();
  }
}
