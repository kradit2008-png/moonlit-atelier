# Moonlit Atelier

This folder contains only the static website files for publishing Moonlit Atelier to GitHub Pages.

## Publish the site

1. Sign in to GitHub as `kradit2008-png`.
2. Create a **public** repository named `moonlit-atelier` at [github.com/new?name=moonlit-atelier](https://github.com/new?name=moonlit-atelier). Do not initialize it with a README, license, or .gitignore.
3. This folder is already initialized as a Git repository, with the `main` branch and `origin` remote configured. After creating the GitHub repository and authenticating Git on your computer, open PowerShell here and push:

   ```powershell
   cd "C:\Users\DELL\New folder (2)\moonlit-atelier-site"
   git push -u origin main
   ```

4. On GitHub, open the repository's **Settings > Pages** and set **Build and deployment > Source** to **GitHub Actions**.
5. In **Actions**, wait for **Deploy Moonlit Atelier to GitHub Pages** to finish successfully.
6. The site URL will be `https://kradit2008-png.github.io/moonlit-atelier/`.

The first local commit is already created. For later updates, run `git add .`, `git commit -m "Describe the update"`, and `git push`.

## Add episode videos

The episode player supports MP4 files that you own or have permission to distribute. Each series page shows 12 numbered slots; these are placeholders, not verified episode names. Add a `videos` folder beside `index.html`, then name each file using the series slug and two-digit episode number, for example:

```text
videos/one-piece-episode-01.mp4
videos/one-piece-episode-02.mp4
videos/frieren-episode-01.mp4
```

Clicking an episode opens the in-site video player with audio controls. If a hosted file is not present, visitors can choose a video from their device for local playback; that file is not uploaded or shared. Only add media you have the rights to distribute.

## If the website says "Page not found"

The GitHub repository must exist and the Pages deployment workflow must finish before the site URL works. The repository `https://github.com/kradit2008-png/moonlit-atelier` was not present when this package was prepared, so a 404 at the Pages URL is expected until you create the repository, push these files, and enable the **GitHub Actions** Pages source above.

The repository will be public, so everything in it is publicly visible. This is a static demo: its sample login is not real authentication, and its displayed demo credentials are not protected. Do not put personal credentials or private files in this repository.
