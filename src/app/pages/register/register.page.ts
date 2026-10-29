import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [IonicModule, FormsModule, RouterLink],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage {
  nom = ''; prenom = ''; age: number | null = null; email = ''; password = '';
  photo = ''; busy = false;
  constructor(private auth: AuthService, private router: Router, private toast: ToastController) {}

  async takePhoto() {
    try {
      const img = await Camera.getPhoto({
        quality: 40, width: 320, allowEditing: false,
        resultType: CameraResultType.DataUrl, source: CameraSource.Camera
      });
      this.photo = img.dataUrl || '';
    } catch { /* annulé par l'utilisateur */ }
  }

  private async say(message: string, color = 'danger') {
    (await this.toast.create({ message, duration: 3500, color })).present();
  }

  async submit() {
    if (!this.nom || !this.prenom || !this.age || !this.email || this.password.length < 6)
      return this.say('Renseignez tous les champs (mot de passe : 6 caractères minimum).');
    if (!this.photo) return this.say('Prenez une photo avec la caméra.');
    this.busy = true;
    try {
      await this.auth.register(this.email.trim(), this.password,
        { nom: this.nom, prenom: this.prenom, age: +this.age, photo: this.photo });
      this.router.navigateByUrl('/tabs/movies', { replaceUrl: true });
    } catch (e: any) { this.say(e.message || 'Inscription impossible'); }
    this.busy = false;
  }
}
