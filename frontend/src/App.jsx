import { useMemo, useState } from "react";
import "./App.css";

const initialForm = {
  Locality: "",
  Property_Type: "",
  BHK: "",
  Size_in_SqFt: "",
  Year_Built: "",
  Furnished_Status: "",
  Floor_No: "",
  Total_Floors: "",
  Nearby_Schools: "",
  Nearby_Hospitals: "",
  Facing: "",
  Availability_Status: "",
};

const requiredFields = Object.keys(initialForm);

const options = {
  Locality: ["Central", "East", "North", "North-East", "South", "South-East", "South-West", "West"],
  Property_Type: ["Apartment", "Independent House", "Villa"],
  BHK: [1, 2, 3, 4, 5],
  Furnished_Status: ["Furnished", "Semi-furnished", "Unfurnished"],
  Facing: ["East", "North", "South", "West"],
  Availability_Status: ["Ready_to_Move", "Under_Construction"],
};

function formatLakhs(value) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value);
}

function App() {
  const [form, setForm] = useState(initialForm);
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const age = useMemo(() => {
    if (form.Year_Built === "" || form.Year_Built === null) return null;
    return Math.max(0, 2025 - Number(form.Year_Built));
  }, [form.Year_Built]);

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setPredictedPrice(null);
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const missing = requiredFields.some((key) => form[key] === "" || form[key] === null);
    if (missing) {
      setError("Every box on the sheet needs a value before an estimate can be drawn.");
      return;
    }

    setError(null);
    setLoading(true);

    // Temporary frontend-only estimate.
    // Replace this block with a POST request to your FastAPI backend
    // once the ML model/API is ready.
    await new Promise((resolve) => setTimeout(resolve, 700));

    const basePerSqFt = {
      Central: 14500,
      East: 9500,
      North: 7800,
      "North-East": 8200,
      South: 10500,
      "South-East": 12000,
      "South-West": 7600,
      West: 8500,
    }[form.Locality];

    const furnishingMultiplier = {
      Furnished: 1.08,
      "Semi-furnished": 1,
      Unfurnished: 0.93,
    }[form.Furnished_Status];

    const propertyMultiplier = {
      Apartment: 1,
      Villa: 1.16,
      "Independent House": 1.08,
    }[form.Property_Type];

    const estimated = (
      Number(form.Size_in_SqFt) *
      basePerSqFt *
      furnishingMultiplier *
      propertyMultiplier *
      (1 + Number(form.BHK) * 0.025)
    ) / 100000;

    setPredictedPrice(estimated);
    setLoading(false);
  };

  const reset = () => {
    setForm(initialForm);
    setPredictedPrice(null);
  };

  return (
    <main className="app-shell">
      <nav className="topbar">
        <div className="brand">
          <div className="brand-mark">₹</div>
          <div>
            <strong>PropPredict</strong>
            <span>Bangalore, Karnataka</span>
          </div>
        </div>
        <div className="topbar-badge">
          <span className="status-dot" />
          Model pending — demo estimate
        </div>
      </nav>

      <section className="hero">
        <div>
          <p className="eyebrow">FILE NO. BLR-2026 · RESIDENTIAL VALUATION</p>
          <h1>Draft a price estimate for your Bangalore home</h1>
          <p className="hero-copy">
            Fill in the property specs below the way you'd read them off a floor plan.
            Once your model is live, this form will post straight to it.
          </p>
        </div>

        <div className="hero-stats">
          <div><strong>4,144</strong><span>listings trained on</span></div>
          <div><strong>8</strong><span>Bangalore zones</span></div>
          <div><strong>3</strong><span>property types</span></div>
        </div>
      </section>

      <section className="workspace">
        <form className="form-card" onSubmit={handleSubmit}>
          <div className="card-heading">
            <div>
              <div className="sheet-code" style={{ marginBottom: 4 }}>DWG A-100</div>
              <h2>Property specification sheet</h2>
            </div>
            <button type="button" className="reset-button" onClick={reset}>CLEAR SHEET</button>
          </div>

          <div className="form-section">
            <div className="section-title">
              <span className="sheet-ref">A-101</span>
              <div><h3>Location</h3><p>Which zone is the property in?</p></div>
            </div>

            <div className="field-grid">
              <Field label="BANGALORE ZONE">
                <select value={form.Locality} onChange={(e) => update("Locality", e.target.value)}>
                  <option value="" disabled>Select a zone</option>
                  {options.Locality.map((item) => <option key={item}>{item}</option>)}
                </select>
              </Field>
            </div>
          </div>

          <div className="form-section">
            <div className="section-title">
              <span className="sheet-ref">A-102</span>
              <div><h3>Unit</h3><p>Type, layout and floor area</p></div>
            </div>

            <div className="field-grid three">
              <Field label="PROPERTY TYPE">
                <select value={form.Property_Type} onChange={(e) => update("Property_Type", e.target.value)}>
                  <option value="" disabled>Select a type</option>
                  {options.Property_Type.map((item) => <option key={item}>{item}</option>)}
                </select>
              </Field>

              <Field label="BEDROOMS (BHK)">
                <select value={form.BHK} onChange={(e) => update("BHK", e.target.value ? Number(e.target.value) : "")}>
                  <option value="" disabled>Select BHK</option>
                  {options.BHK.map((item) => <option key={item} value={item}>{item} BHK</option>)}
                </select>
              </Field>

              <Field label="SIZE, SQ FT">
                <input
                  type="number"
                  min="501"
                  max="4999"
                  placeholder="e.g. 1200"
                  value={form.Size_in_SqFt}
                  onChange={(e) => update("Size_in_SqFt", e.target.value)}
                />
              </Field>
            </div>
          </div>

          <div className="form-section">
            <div className="section-title">
              <span className="sheet-ref">A-103</span>
              <div><h3>Structure</h3><p>Construction year and floor position</p></div>
            </div>

            <div className="field-grid four">
              <Field label="YEAR BUILT">
                <input
                  type="number"
                  min="1990"
                  max="2023"
                  placeholder="e.g. 2015"
                  value={form.Year_Built}
                  onChange={(e) => update("Year_Built", e.target.value)}
                />
              </Field>

              <Field label="AGE, YEARS">
                <div className="readonly-input">{age === null ? "—" : age}</div>
              </Field>

              <Field label="FLOOR NO.">
                <input
                  type="number"
                  min="0"
                  max="30"
                  placeholder="e.g. 5"
                  value={form.Floor_No}
                  onChange={(e) => update("Floor_No", e.target.value)}
                />
              </Field>

              <Field label="TOTAL FLOORS">
                <input
                  type="number"
                  min="1"
                  max="30"
                  placeholder="e.g. 15"
                  value={form.Total_Floors}
                  onChange={(e) => update("Total_Floors", e.target.value)}
                />
              </Field>
            </div>

            <div className="field-grid two compact-top">
              <Field label="FURNISHING">
                <select value={form.Furnished_Status} onChange={(e) => update("Furnished_Status", e.target.value)}>
                  <option value="" disabled>Select furnishing</option>
                  {options.Furnished_Status.map((item) => <option key={item}>{item}</option>)}
                </select>
              </Field>

              <Field label="FACING">
                <select value={form.Facing} onChange={(e) => update("Facing", e.target.value)}>
                  <option value="" disabled>Select facing</option>
                  {options.Facing.map((item) => <option key={item}>{item}</option>)}
                </select>
              </Field>
            </div>
          </div>

          <div className="form-section">
            <div className="section-title">
              <span className="sheet-ref">A-104</span>
              <div><h3>Site context</h3><p>What's within reach of the property?</p></div>
            </div>

            <div className="field-grid two">
              <Field label="NEARBY SCHOOLS" hint="RANGE 1–10">
                <input
                  type="number"
                  min="1"
                  max="10"
                  placeholder="e.g. 5"
                  value={form.Nearby_Schools}
                  onChange={(e) => update("Nearby_Schools", e.target.value)}
                />
              </Field>

              <Field label="NEARBY HOSPITALS" hint="RANGE 1–10">
                <input
                  type="number"
                  min="1"
                  max="10"
                  placeholder="e.g. 5"
                  value={form.Nearby_Hospitals}
                  onChange={(e) => update("Nearby_Hospitals", e.target.value)}
                />
              </Field>
            </div>
          </div>

          <div className="form-section last">
            <div className="section-title">
              <span className="sheet-ref">A-105</span>
              <div><h3>Status</h3><p>When can it be occupied?</p></div>
            </div>

            <div className="availability-options">
              {options.Availability_Status.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={`availability-card ${form.Availability_Status === item ? "selected" : ""}`}
                  onClick={() => update("Availability_Status", item)}
                >
                  <span className="availability-icon">{item === "Ready_to_Move" ? "OK" : "UC"}</span>
                  <span>{item === "Ready_to_Move" ? "Ready to move" : "Under construction"}</span>
                </button>
              ))}
            </div>
          </div>

          {error && <p className="form-error">{error}</p>}

          <button className="predict-button" type="submit" disabled={loading}>
            {loading ? "Calculating estimate…" : "Run estimate"}
          </button>
          <p className="model-note">RESULT WILL BE POWERED BY YOUR TRAINED MODEL</p>
        </form>

        <aside className="result-panel">
          <div className="result-content">
            <div className="panel-top">
              <p className="eyebrow light">ESTIMATED VALUE</p>
              <p className="sheet-code light">EST-01</p>
            </div>

            {predictedPrice !== null ? (
              <>
                <div className="price">₹{formatLakhs(predictedPrice)} <small>LAKH</small></div>
                <p className="result-caption">Based on the specification sheet at left</p>

                <div className="result-divider" />

                <div className="summary-list">
                  <Summary label="ZONE" value={form.Locality} />
                  <Summary label="UNIT" value={`${form.BHK} BHK ${form.Property_Type}`} />
                  <Summary label="AREA" value={`${Number(form.Size_in_SqFt).toLocaleString("en-IN")} sq ft`} />
                  <Summary label="FINISH" value={form.Furnished_Status} />
                </div>

                <div className="api-note">
                  <span>NOTE</span>
                  <p>This is a placeholder calculation. Once the FastAPI endpoint is live, this figure will come from the trained model instead.</p>
                </div>
              </>
            ) : (
              <div className="empty-result">
                <div className="house-icon" />
                <h2>Nothing drafted yet</h2>
                <p>Complete the specification sheet and run the estimate to see a value here.</p>
              </div>
            )}
          </div>

          <div className="title-block">
            <div><strong>PROPPREDICT</strong>Bangalore valuation tool</div>
            <div><strong>SCALE</strong>NTS</div>
            <div><strong>SOURCE</strong>Bangalore listings, 2026</div>
          </div>
        </aside>
      </section>

      <footer>
        <span>PropPredict</span>
        <span>House price estimation · Bangalore</span>
      </footer>
    </main>
  );
}

function Field({ label, hint, children }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

function Summary({ label, value }) {
  return (
    <div className="summary-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default App;
