# GitHub Profile Finder

Simple client-side app to search GitHub users and display profile info using jQuery + AJAX.

## Files
- [index.html](index.html) — main page
- [css/styles.css](css/styles.css) — styles and animations
- [js/script.js](js/script.js) — AJAX logic and rendering

## Usage
Open `index.html` in a browser and enter a GitHub username, `@username`, or paste a full GitHub profile URL (for example `https://github.com/username`). The app will fetch profile info and top repositories.

Notes:
- This is a static frontend app using the public GitHub API (rate-limited when unauthenticated).
- For heavier use, provide an OAuth token or proxy server.
