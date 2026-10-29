# MovieMatch – Ionic + Angular + Firebase

## Installation
```bash
npm install
npx ng serve            # test navigateur (http://localhost:4200)
```
## Configuration
1. **TMDB** : créez une clé sur themoviedb.org → `src/environments/environment.ts` (`tmdbKey`).
2. **Firebase** : créez un projet, activez *Authentication > E-mail/Mot de passe* et *Firestore*,
   copiez la config web dans `environment.ts`, puis collez `firestore.rules` dans *Firestore > Règles*.
3. **Compte administrateur** : inscrivez-vous dans l'appli, puis dans la console Firestore ouvrez
   `users/<votre uid>` et changez le champ `role` en `admin`.
4. Si Firestore demande un index, suivez le lien affiché dans la console du navigateur.

## Mobile (caméra native)
```bash
npm run build && npx cap add android && npx cap sync && npx cap open android
```

## Matching (seuil : 75 %, `matchThreshold`)
Score = 25 % films communs (Jaccard) + 30 % genres + 25 % acteurs + 20 % décennies de sortie
(les trois derniers par similarité cosinus des histogrammes). Seuls les utilisateurs actifs
dont le score dépasse le seuil sont affichés.

## Fonctionnalités
- Inscription (nom, prénom, âge, photo caméra) / connexion
- Playlist de films favoris (TMDB + films ajoutés par l'admin)
- Admin : ajout de films, activation/désactivation d'utilisateurs (jamais de suppression)
- Un compte désactivé ne peut plus se connecter
