# School

A Firebase-backed multi-page school web portal with login, a dashboard drawer, and student tools.

## Features
- Email/password login with Firebase Auth and persistent session (`localStorage`)
- Tracks per-user `lastLogin` timestamp and `loginCount` in Firestore
- Dashboard with a slide-out drawer navigation
- Pages for timetable, study materials/references, notifications, media (images & video), and user info
- Static HTML/CSS/JS with a custom drawer component

## Tech Stack
- HTML/CSS, vanilla JavaScript, jQuery, Firebase (Auth, Firestore)

## Project Structure
```
index.html            # login page
dashboard.html         # post-login home with drawer
drawer.js / drawer.css # drawer navigation
app.js                # login + user tracking
firebase-init.js      # Firebase config
timetable.html        # schedule page
ref.html              # study materials
notification.html     # notifications
img_vid.html          # media gallery
user_info.html        # user profile/editor
styles.css            # shared styles
CNAME                 # GitHub Pages domain
```

## Installation
No build steps — host the folder statically and keep the Firebase config pointing at your project.

## Usage
Serve the directory (e.g. `python -m http.server`), open `index.html`, and log in with a Firebase Auth account. Successful login redirects to `dashboard.html`.