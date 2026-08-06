# YouTube For Desktop

A custom, lightweight desktop client for YouTube, built with Electron.

## Features

- **Discord Rich Presence** — Automatically detects your active YouTube video, displaying the video title, channel name, and live elapsed playback time on your Discord profile.
- **Theater Mode Persistence** — Automatically forces and remembers your preferred theater mode setting across sessions.
- **Hardware acceleration toggle** — Disable it to screen share without a black window, enable it for smoother playback. The app restarts to apply the change at the system level.
- **Session restore** — Reopens on the page you left off, and remembers window size, position and maximised state.
- **Custom title bar** — Frameless window with its own controls, hidden automatically during fullscreen playback.
- **Settings sidebar** — Slide-in panel, closable with `Escape` or by clicking outside.
- **Navigation shortcuts** — `Alt + Left` / `Alt + Right` to move through history, mouse back/forward buttons, `F5` or `Ctrl + R` to reload.
- **Error recovery** — Failed page loads and renderer crashes show a retry prompt instead of a blank window.
- **Domain allowlist** — Navigation and popups are restricted to YouTube and its sign-in providers, enforced in the main process.

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
