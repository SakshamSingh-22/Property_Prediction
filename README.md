# Property_Prediction

A project for estimating residential property prices in Bangalore. It has two parts:

- **`data/`** — the housing dataset (CSV) used to train the price prediction model
- **`frontend/`** — a React app where users fill in a property "specification sheet" (locality, type, size, age, amenities, etc.) and get back a price estimate

The frontend currently computes its estimate with a placeholder formula on the client side, designed to be swapped out for a real backend/ML model trained on the data in `data/`.

## Project Structure

```
Property_Prediction/
  data/                # Housing dataset (CSV) used for training
  frontend/
    public/
      blr-bg.jpg        # Background photo used behind the app shell
      favicon.svg
      icons.svg
    src/
      assets/
      App.jsx           # Form, state, and placeholder prediction logic
      App.css            # All styling
      index.css
      main.jsx
    index.html
    package.json
    vite.config.js
    eslint.config.js
  README.md
```

## Data

`data/` contains the CSV dataset used to train the price prediction model (locality, property type, BHK, size, year built, floor, furnishing, facing, nearby schools/hospitals, availability status, and price). This is the source of truth for training whatever model eventually powers the `/predict` endpoint the frontend will call.

## Frontend

### Features

- Full property spec form: locality/zone, property type, BHK, size, year built, floor, furnishing, facing, nearby schools/hospitals, availability status
- Auto-calculated property age from year built
- Client-side validation (all fields required before an estimate can be run)
- Placeholder pricing engine based on per-sq-ft rates by zone, adjusted for furnishing, property type, and BHK
- Responsive layout (desktop, tablet, mobile breakpoints)
- Styled as an architectural "spec sheet" with a dark result panel showing the estimate and a summary of key inputs

### Tech Stack

- React (functional components + hooks)
- Vite
- Plain CSS (`App.css`) — Google Fonts: DM Sans, Space Grotesk, JetBrains Mono

### Getting Started

1. From the project root, move into the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```
4. Open the printed local URL in your browser.

`public/blr-bg.jpg` is already included and used as the background image behind the app shell.

### Connecting a Real Backend

The estimate is currently computed entirely in the browser inside `handleSubmit` in `frontend/src/App.jsx` (see the `// Temporary frontend-only estimate` block). To wire up a real model trained on `data/`:

1. Train a model on the dataset in `data/` and stand up a prediction endpoint (e.g. FastAPI) that accepts the same fields as `initialForm` in `App.jsx`.
2. Replace the placeholder calculation block with a `fetch`/`axios` POST call to that endpoint.
3. Set `predictedPrice` from the response instead of the local formula.
4. Update the "Model pending — demo estimate" badge in the top nav and the note in the result panel once the real model is live.

### Form Fields

| Field | Type | Notes |
|---|---|---|
| Locality | select | 8 Bangalore zones (Central, East, North, North-East, South, South-East, South-West, West) |
| Property Type | select | Apartment, Independent House, Villa |
| BHK | select | 1–5 |
| Size (Sq Ft) | number | 501–4999 |
| Year Built | number | 1990–2023 |
| Age (yrs) | read-only | Derived from Year Built (relative to 2025) |
| Floor No. | number | 0–30 |
| Total Floors | number | 1–30 |
| Furnished Status | select | Furnished, Semi-furnished, Unfurnished |
| Facing | select | East, North, South, West |
| Nearby Schools | number | 1–10 |
| Nearby Hospitals | number | 1–10 |
| Availability Status | toggle cards | Ready to Move, Under Construction |

## Notes

- All prices are displayed in ₹ Lakhs.
- The prediction formula in the frontend is a rough placeholder for demo purposes only and should not be used for real valuations until a trained model is connected.
