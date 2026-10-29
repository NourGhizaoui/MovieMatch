import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { heart, heartOutline, film, people, person, shield, camera, logOutOutline, trash, add } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonicModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor() {
    addIcons({ heart, heartOutline, film, people, person, shield, camera, logOutOutline, trash, add });
  }
}
