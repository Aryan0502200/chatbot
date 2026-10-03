# Aryan Gemini React Chatbot

React + Vite frontend with a Node/Express backend using Google's `@google/genai` SDK.

## Setup

Requirements: Node.js 18+ and a Gemini API key.

From the project root:

```bash
npm install
```

Create `server/.env`:

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
GEMINI_MODEL=gemini-3.8-flash
PORT=3001
```

Then:

```bash
npm run dev
```

Open http://localhost:5173

The browser talks to `http://localhost:3001/api/chat`.

## Security

The Gemini key is deliberately kept on the server. Do not put it in a `VITE_*` variable or commit `server/.env`.

For production, store `GEMINI_API_KEY` in your hosting provider's server-side environment variables.

## Build

```bash
npm run build
```
