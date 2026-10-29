import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { PlaylistService } from '../../services/playlist.service';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [IonicModule],
  templateUrl: './playlist.page.html',
  styleUrls: ['./playlist.page.scss']
})
export class PlaylistPage {
  constructor(public auth: AuthService, public playlist: PlaylistService) {}
}
