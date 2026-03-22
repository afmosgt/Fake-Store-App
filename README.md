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

## What To Explore In The App

Use this quick path to understand the full experience:

1. Home page (`/`)
- Read the overview and use navigation shortcuts.

2. Product listing (`/products`)
- Browse live FakeStoreAPI data.
- Open product cards to inspect details.
- Try loading/retry behavior by refreshing during network issues.

3. Product details (`/products/:productId`)
- Review title, category, rating, description, and price.
- Use action buttons to move into edit and delete flows.

4. Add product (`/add-product`)
- Test validation errors by submitting empty fields.
- Submit valid data and observe test-mode success messaging.

5. Edit product (`/products/:productId/edit`)
- Modify fields and submit updates.
- Confirm success message explains non-persistent API behavior.

6. Delete product (`/products/:productId/delete`)
- Open the confirmation modal and complete a delete request.
- Confirm success messaging and accessibility-friendly dialog behavior.

7. Additional features (`/additional-features`)
- Explore category badges, summary cards, and featured products.

## How It Works

### Routing

The app uses React Router for client-side navigation:

- `/`: Home
- `/products`: Product listing
- `/products/:productId`: Product details
- `/add-product`: Add form
- `/products/:productId/edit`: Edit form
- `/products/:productId/delete`: Delete flow
- `/additional-features`: Extra storefront data view

### Data Fetching and Error Handling

- Axios is used for all FakeStoreAPI requests.
- Request timeouts are configured to avoid hanging UI states.
- Error alerts include retry actions on key pages.
- Components use loading states and placeholders while data is fetched.

### Form and Action Behavior

- Add/Edit forms include client-side validation and field-level messages.
- Duplicate submit/delete guards prevent accidental repeated actions.
- Success messages for write actions explicitly explain FakeStoreAPI test behavior.

### Accessibility and Responsiveness

- Skip link and focus-visible styles improve keyboard navigation.
- Live regions announce loading state changes for assistive technologies.
- Modal labeling and navigation controls are screen-reader friendly.
- Bootstrap grid plus custom breakpoints support smaller screens.

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
