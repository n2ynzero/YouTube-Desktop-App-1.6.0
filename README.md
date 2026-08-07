# YouTube For Desktop

A custom, lightweight desktop client for YouTube, built with Electron.

## Features

- **Built-in Adblocker** — Automatically blocks pre-roll video ads and hides UI ads/banners for a completely uninterrupted experience.
- **SponsorBlock Integration** — Automatically skips sponsored segments, intros, outros, and more! Highly customizable with color-coded segments drawn directly onto the YouTube progress bar.
- **Discord Rich Presence** — Automatically detects your active YouTube video, displaying the video title, channel name, and live elapsed playback time on your Discord profile.
- **Always on Top** — Pin the window above all other applications using the pin icon in the custom title bar.
- **Minimize to Tray** — Keep the app running in the background system tray without cluttering your taskbar.
- **Hardware acceleration toggle** — Disable it to screen share without a black window, enable it for smoother playback. 
- **Session restore** — Reopens on the page you left off, and remembers window size, position, and maximized state.
- **Custom UI** — Frameless window with a custom title bar and a sleek slide-in settings panel.
- **Navigation shortcuts** — `Alt + Left` / `Alt + Right` to move through history, mouse back/forward buttons, `F5` or `Ctrl + R` to reload.
- **Domain allowlist** — Navigation and popups are restricted to YouTube and its sign-in providers for security.

## Tech Stack

- Electron
- React
- Tailwind CSS
- Webpack

## Install

Download the latest installer from the [Releases](https://github.com/n2ynzero/YouTube-Desktop-App/releases) page and run it.

## Build From Source

Requires Node.js to be installed.

```bash
npm install
npm run build
npm run dist
```

For development, `npm run dev` rebuilds the renderer on change and launches the app. 

## Configuration

`config.json` in the project root controls the window defaults, the Discord application ID, and the navigation allowlist.

User settings — hardware acceleration, window geometry and the last visited page — are stored in `%APPDATA%/youtube-for-desktop/settings.json`.

## Disclaimer

This is an unofficial client and is not affiliated with, endorsed by, or sponsored by YouTube.

## License

MIT

---

Built by [Zero](https://github.com/n2ynzero)
