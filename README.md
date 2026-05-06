# MindScape

MindScape is a React-based emotional wellness app that helps users track, understand, and regulate their emotional state through mood check-ins, reflective journaling, sentiment analysis, and guided breathing exercises.

## Overview

The app combines structured mood logging with free-form journaling and lightweight sentiment analysis to create a private, self-reflection experience centered on emotional awareness and regulation.[1][2] It includes a landing page, authentication flow, dashboard, mood check-in screen, journal workspace, a breathing-focused Zen Mode overlay, and a mascot-driven visual identity through the Rō component.

## Features

- **Landing experience** with product messaging around CBT principles, sentiment AI, and emotional self-tracking.
- **Authentication UI** with login/sign-up mode switching, loading simulation, and mascot feedback.
- **Mood check-in** using valence and energy sliders plus contextual tags such as sleep, work, exercise, gaming, and study.
- **Journal analysis** powered by the `sentiment` package to score entries and generate response states such as comfort, excited, or balanced.
- **Voice input support** using the browser Speech Recognition API when available.
- **Zen Mode breathing overlay** that guides users through a box-breathing cycle using timed inhale, hold, and exhale prompts.
- **Dashboard visualization** using Recharts for trend display and JSON export of saved logs.
- **Local persistence** of logs using `localStorage`, allowing user data to remain on-device.

## Tech Stack

- **Frontend:** React.
- **Styling:** Custom CSS in `index.css` with glassmorphism-inspired UI, animations, and theme variables.
- **Icons:** `lucide-react`.
- **Charts:** `recharts` for dashboard trend visualization.
- **Sentiment analysis:** `sentiment` npm package for lexicon-based scoring of journal entries.
- **Persistence:** Browser `localStorage` for log saving and retrieval.
- **Voice input:** Web Speech API via `window.SpeechRecognition` / `window.webkitSpeechRecognition`.

## Project Structure

```text
src/
├── App.jsx
├── index.css
├── main.jsx
└── components/
    ├── Auth.jsx
    ├── Dashboard.jsx
    ├── Journal.jsx
    ├── LandingPage.jsx
    ├── MoodCheckIn.jsx
    ├── RoMascot.jsx
    └── ZenMode.jsx
```

The main app controls screen routing with local React state and renders different views such as landing, auth, dashboard, check-in, and journal based on the current `view` value.

## How It Works

### 1. Landing and access

Users first see the landing page and then move into the authentication screen through an `onEnter` callback. The auth screen simulates login before transferring control back to the main application shell through `onLogin`.

### 2. Mood logging

The mood check-in screen captures emotional state through two axes: **valence** and **energy**. Users can also attach context tags, and each submission is saved into the log list before redirecting back to the dashboard.

### 3. Journal reflection

The journal allows users to write or dictate entries and then analyzes the text with the `sentiment` library. Based on the score, the app responds with a supportive message and may recommend a breathing intervention when negative affect is detected.

### 4. Regulation support

Zen Mode provides a focused breathing experience using a timed inhale-hold-exhale-hold loop to support calm and regulation. It is triggered from the journal when an entry suggests the user may benefit from decompression.

### 5. Dashboard and export

The dashboard visualizes log trends with a line chart and offers export functionality by downloading saved logs as JSON. When no logs exist, it falls back to sample data for display.

## Installation

```bash
npm install
```

Install the main dependencies used by the codebase:

```bash
npm install react lucide-react recharts sentiment
```

If the project was created with Vite, start it with:

```bash
npm run dev
```

If it was created with Create React App, use:

```bash
npm start
```

## Notes

- Journal sentiment analysis depends on the `sentiment` package being installed.
- Voice input requires a browser that supports the Web Speech API, such as Chrome or Edge.
- Logs are stored only in the browser through `localStorage` and are not synced to a backend.
- The dashboard expects log objects with fields such as date, valence, and energy for charting.

## Future Improvements

- Replace local state navigation with React Router.
- Add real authentication and user profiles.
- Store journal history persistently alongside mood logs.
- Improve accessibility and mobile responsiveness.
- Expand sentiment analysis beyond polarity into richer emotion classification.
- Add backend sync, encrypted storage, or optional cloud backup.

## Disclaimer

MindScape is positioned as an AI-assisted self-reflection tool and not a medical device, and the interface explicitly advises users in crisis to contact emergency services.
