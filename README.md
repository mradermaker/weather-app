# Weather App

A responsive weather application built with Vue 3 and TypeScript.
It provides current weather data, hourly forecasts, and daily forecasts
based on user-selected locations.

## Features

- City search with geocoding
- Current weather overview
- Hourly forecast (next hours from now)
- Daily forecast (7 days)
- Light / Dark theme with system preference fallback
- Accessible UI (keyboard navigation, ARIA, semantic HTML)
- Error and loading states
- Persistent settings via localStorage

## Tech Stack

- Vue 3 (Composition API)
- TypeScript
- Vite
- HTML & CSS with CSS variables
- Open-Meteo API

## Accessibility

- Semantic HTML (fieldset, legend, dl, time)
- Screen reader support via ARIA
- Visible focus states
- Keyboard navigation

## Data Source

Weather data is provided by the Open-Meteo API.
No API key is required.

## Development

Install dependencies:

```bash
npm install
```

Start the development server with hot reload:

```bash
npm run dev
```

Type-check, compile and minify for production:

```bash
npm run build
```

Run ESLint:

```bash
npm run lint
```
