
# 🎬 MovieMatch

**A movie discovery and recommendation application built with Ionic, Angular, and Firebase.**

MovieMatch allows users to discover movies, manage their favorite movies, and find other users with similar movie preferences.

## ✨ Features

- **User Authentication:** Register and log in using email and password.
- **User Profiles:** Manage personal information, including first name, last name, age, and profile photo.
- **Movie Favorites:** Create and manage a personal playlist of favorite movies.
- **Movie Catalog:** Browse movies and access movies added by the administrator.
- **Smart Matching:** Discover users with similar movie preferences using a matching score.
- **Admin Dashboard:** Add movies and activate or deactivate user accounts.
- **Account Security:** Deactivated accounts cannot access the application.
- **Mobile Support:** Android integration with native camera support through Capacitor.

## 🛠️ Technologies

- **Frontend:** Ionic, Angular, TypeScript, HTML, SCSS
- **Backend Services:** Firebase Authentication, Cloud Firestore
- **Mobile:** Capacitor, Android
- **Movie Data:** TMDB API
- **Tools:** Git, GitHub, Visual Studio Code

## ⚙️ Prerequisites

Before running the application, install:

- Node.js and npm
- Git
- Angular CLI
- Android Studio

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/MovieMatch.git
cd MovieMatch
```

Replace `YOUR-USERNAME` with your GitHub username.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Firebase

1. Create a project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Email/Password** authentication.
3. Create a Cloud Firestore database.
4. Configure the Firebase settings in `src/environments/environment.ts`.
5. Apply the security rules from `firestore.rules` in the Firestore Rules section.

**Security note:** Never publish private keys, service account credentials, or passwords. Configure appropriate Firebase security rules before deploying the application.

### 4. Configure the movie data source

If the project uses the TMDB API, create an API key through [The Movie Database](https://www.themoviedb.org/) and configure the required setting in `src/environments/environment.ts`.

If the project uses local movie data instead, this step is not required.

### 5. Run the application

```bash

ionic serve
```


Open the URL displayed in the terminal, usually:

http://localhost:8100

## 📱 Android Setup

To build and run the Android version:

```bash
npm run build
npx cap sync android
npx cap open android
```

Open the project in Android Studio and run it on an emulator or a connected Android device.

If the Android platform has not been added yet, run `npx cap add android` once before syncing.

## 🤝 Matching Algorithm

MovieMatch calculates a similarity score based on users' movie preferences.

The configured scoring model uses:

- **25%** — Common favorite movies, using Jaccard similarity
- **30%** — Genre similarity
- **25%** — Actor similarity
- **20%** — Release-decade similarity

The configured matching threshold is **75%**. Only active users who meet the threshold are displayed.

## 👩‍💻 Author

**Nour Ghizaoui**

- LinkedIn: [nour-ghizaoui](https://linkedin.com/in/nour-ghizaoui)
- Email: nourghizaoui01@gmail.com

---

⭐ If you find this project interesting, feel free to explore the repository!
