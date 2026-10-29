import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

defineCustomElements(window); // nécessaire pour la caméra dans le navigateur

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(IonicModule.forRoot({})),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient()
  ]
}).catch(err => console.error(err));
