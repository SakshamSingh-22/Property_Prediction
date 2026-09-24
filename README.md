# Property_Prediction
A React front end for estimating residential property prices in Bangalore. Users fill in a property "specification sheet" (locality, type, size, age, amenities, etc.) and get back an estimated value. The estimate is currently computed on the frontend with a placeholder formula, designed to be swapped out for a real backend/ML model.

Features
Full property spec form: locality/zone, property type, BHK, size, year built, floor, furnishing, facing, nearby schools/hospitals, availability status
Auto-calculated property age from year built
Client-side validation (all fields required before an estimate can be run)
Placeholder pricing engine based on per-sq-ft rates by zone, adjusted for furnishing, property type, and BHK
Responsive layout (desktop, tablet, mobile breakpoints)
Styled as an architectural "spec sheet" with a dark result panel showing the estimate and a summary of key inputs
Tech Stack
React (functional components + hooks)
Plain CSS (App.css) — Google Fonts: DM Sans, Space Grotesk, JetBrains Mono
Designed to be served with Vite (or any standard React tooling)
Project Structure
src/
  App.jsx      # Form, state, and placeholder prediction logic
  App.css      # All styling
public/
  blr-bg.jpg   # Background photo used behind the app shell
Getting Started
Install dependencies:
bash
   npm install
Add a background image at public/blr-bg.jpg (referenced by App.css). If it's missing, the app falls back to a plain gradient background.
Run the dev server:
bash
   npm run dev
Open the printed local URL in your browser.
Connecting a Real Backend

The estimate is currently computed entirely in the browser inside handleSubmit in App.jsx (see the // Temporary frontend-only estimate block). To wire up a real model:

Stand up a prediction endpoint (e.g. FastAPI) that accepts the same fields as initialForm in App.jsx.
Replace the placeholder calculation block with a fetch/axios POST call to that endpoint.
Set predictedPrice from the response instead of the local formula.
Update the "Model pending — demo estimate" badge in the top nav and the note in the result panel once the real model is live.
Form Fields
Field	Type	Notes
Locality	select	8 Bangalore zones (Central, East, North, North-East, South, South-East, South-West, West)
Property Type	select	Apartment, Independent House, Villa
BHK	select	1–5
Size (Sq Ft)	number	501–4999
Year Built	number	1990–2023
Age (yrs)	read-only	Derived from Year Built (relative to 2025)
Floor No.	number	0–30
Total Floors	number	1–30
Furnished Status	select	Furnished, Semi-furnished, Unfurnished
Facing	select	East, North, South, West
Nearby Schools	number	1–10
Nearby Hospitals	number	1–10
Availability Status	toggle cards	Ready to Move, Under Construction
Notes
All prices are displayed in ₹ Lakhs.
The prediction formula is a rough placeholder for demo purposes only and should not be used for real valuations until a trained model is connected.