# Mentor Roulette Tracker

A web-based tracker designed to help FFXIV players log and monitor their progress on their Mentor Roulette grind.

## Features

- **Progress Tracking**: Easily log runs, progress, duty type, duty name, job, clear status, and custom notes.
- **Detailed Statistics**: Real-time role breakdowns (Tanks, Healers, DPS), job usage, duty type breakdown, top 5 most common duties, overall clear rates, and hourly activity distribution charts.
- **Firebase Sync**: Supports cloud saving and syncing through Firebase Integration with Google Sign-In.
- **Import/Export**: Export progress to JSON file, CSV, or sharing string. Import functionality to restore data.
- **Localization**: Supports English (EN) and Russian (RU).

## Installation & Running Locally

1. Clone this repository.
2. Build/serve it locally (e.g. using `http-server` or `serve` on port `8080`):
   ```bash
   npx http-server -p 8080
   ```
3. Open `http://localhost:8080` in your web browser.

## Credits & Attributions

- **Icons**: Game-themed SVG icons are provided by the open-source [xivapi/classjob-icons](https://github.com/xivapi/classjob-icons) project on GitHub.
