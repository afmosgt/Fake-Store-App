# The Fakest Store

A responsive React storefront built with Vite, React Router, React Bootstrap, and FakeStoreAPI.

## Features

- Product listing with category, rating, and price details.
- Product details page with edit and delete actions.
- Add, edit, and delete forms with client-side validation.
- Timeout-aware API error handling and retry actions.
- Accessibility improvements: skip link, focus styles, live regions, and labeled modal dialog.
- Mobile-friendly layout using Bootstrap grid and custom responsive styling.
- Automated tests with Vitest and Testing Library, including `jest-axe` accessibility checks.

## Important FakeStoreAPI Note

This app uses FakeStoreAPI as a testing API.

- `POST`, `PUT`, and `DELETE` responses can appear successful.
- Underlying data is not permanently changed.

## Tech Stack

- React 19
- Vite 8
- React Router DOM 7
- React Bootstrap + Bootstrap 5
- Axios
- ESLint (`jsx-a11y`, React Hooks, React Refresh)
- Vitest + Testing Library + `jest-axe`

## Getting Started

### Prerequisites

- Node.js 20+ (recommended)
- npm

### Install

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Available Scripts

- `npm run dev`: start local Vite dev server.
- `npm run build`: create a production build in `dist`.
- `npm run preview`: preview the production build locally.
- `npm run lint`: run ESLint checks.
- `npm run test`: run Vitest in watch mode.
- `npm run test:run`: run Vitest once (CI-friendly).

## Quality Checks

Use this sequence before pushing:

```bash
npm run lint
npm run test:run
npm run build
```

## Project Structure

```text
fake-store-app/
	public/
	src/
		__tests__/
		components/
		utils/
		App.jsx
		App.css
		index.css
		main.jsx
	vite.config.js
	package.json
```

## Deployment

This app can be deployed to platforms like Vercel, Netlify, or GitHub Pages (with a Vite-compatible setup).
