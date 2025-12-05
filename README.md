# MealWave

## Overview

MealWave is a client-side JavaScript web application that helps users check average restaurant wait times before visiting. Users can browse restaurants, view past waiting-time reports, add their own records, add restaurant, save favorites, and read feedback from other users.

Developed for the COMP 1800 course, this project applies User-Centred Design, agile project management, and integrates Firebase services such as Authentication, Firestore, Hosting, and Firebase Storage.

---

## Features

- Browse a list of restaurant with images and average wait times
- Autocomplete search bar on the main page to quickly find restaurants
- Add new restaurants through Google Places API for autocomplete
- Submit wait time records with comments and ratings
- View past wait time and feedback from other users
- Save or remove restaurants from your favorite list
- Create an account to access some features such as adding favorites
- Responsive design for desktop and mobile
- Continue as Guest mode for browsing without signing in

---

## Technologies Used

Example:

- **Frontend**: HTML, CSS (Tailwind), JavaScript
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Database**: Firestore
- **Storage**: Firebase Storage (restaurant and user images)
- **Hosting**: Firebase Hosting
- **APIs**: Google Maps Places API (https://developers.google.com/maps/documentation/javascript/legacy/places)

---

## Usage

1. Open your browser and visit `http://localhost:3000` or `https://mealwave-a7ba8.web.app/`.
2. Browse or search the restaurant listings on the main page.
3. Log in or create an account to submit wait-time records or save favorites.
4. If a restaurant is not found, click on the Add Restaurant to create a new restaurant in MealWave.
5. View restaurant details by clicking on restaurant card
6. Click the “Add a record” button to submit your wait time, rating, and comments.
7. Save a restaurant as a favorite, using the heart button to add or remove a restaurant from the list.
8. View your saved restaurants in the Favorites page.
9. Browse past waiting times and feedback from other users on the restaurant page.

---

## Project Structure

```
MealWave/
├── images/
│   ├── default-avatar.jpg
│   ├── MealWaveLogo.png
│   ├── orange-background.jpg
│
├── src/
│   ├── components/
│   │   ├── BackButton.js
│   │   ├── confirm-modal.js
│   │   └── Navbar.js
│   │
│   ├── css/
│   │   ├── footer.css
│   │   ├── nav.css
│   │   ├── profile.css
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── add-restaurant.js
│   │   ├── autocomplete.js
│   │   ├── authentication.js
│   │   ├── fetch-comments.js
│   │   ├── favorites.js
│   │   ├── firebaseConfig.js
│   │   ├── loginSignup.js
│   │   ├── main.js
│   │   ├── profile.js
│   │   ├── restaurant-info.js
│   │   ├── submit-record.js
│   │
│   └── pages/
│       ├── add-record.html
│       ├── add-restaurant.html
│       ├── favorites.html
│       ├── main.html
│       ├── profile.html
│       ├── restaurant-info.html
│       ├── sign-in.html
│
├── .env
├── .gitignore
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── style-guidelines
└── tailwind.config.js

```

---

## Contributors

- **Armin Hadjifaradji** - BCIT CST Student. Hobbies: Watching movies

- **Xinyue(Ivy) Wang** - BCIT CST Student with a passion for outdoor adventures and user-friendly applications. Fun fact: Loves solving Rubik's Cubes in under a minute.

- **Mittapap** - BCIT CST Student with a passion for solving a challenge problem and user-friendly applications. Fun fact: Loves watching Japanese anime with popcorn.

---

## Acknowledgments

- Some UI patterns and code snippets were adapted from:
  - **MDN Web Docs** (https://developer.mozilla.org/)
  - **Firebase Documentation** (https://firebase.google.com/docs)
  - **W3Schools** (https://www.w3schools.com/)
  - Example code provided in **COMP 1800** instructions (e.g., the autocomplete search bar)
- image from **Unsplash** (https://unsplash.com/) (e.g., salmon picture in welcome page)
- Icons from **Font Awesome** (https://fontawesome.com/)
- Fonts from **Google Fonts** (https://fonts.google.com/)
- Code assistance from **ChatGPT** was used for parts involving the Google Places API (autocomplete setup and dropdown styling).

---

## Limitations and Future Work

### Limitations

- No real-time wait time data
- Limited restaurant data
- No map view for navigation

### Future Work

- Add filtering and sorting options (e.g., cuisine, rating, wait time)
- Add feature to open the restaurant in Google Maps
- Create a map view for better restaurant discovery

---
