import React, { useState } from "react";

import "./Settings.css";

const fonts = [
  "Plus Jakarta Sans",
  "Inter",
  "Poppins",
  "DM Sans",
  "Space Grotesk",
  "Manrope",
];

const fontPreviews = {
  "Plus Jakarta Sans": "The quick brown fox",
  Inter: "The quick brown fox",
  Poppins: "The quick brown fox",
  "DM Sans": "The quick brown fox",
  "Space Grotesk": "The quick brown fox",
  Manrope: "The quick brown fox",
};

const warmThemes = [
  { name: "Terracotta", coral: "#E85D2E", peach: "#F4A261" },
  { name: "Sunset", coral: "#E63946", peach: "#F4845F" },
  { name: "Berry", coral: "#9B5DE5", peach: "#C77DFF" },
  { name: "Ocean", coral: "#0077B6", peach: "#48CAE4" },
  { name: "Forest", coral: "#2D6A4F", peach: "#74C69D" },
];
function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`custom-switch-btn ${checked ? "active" : ""}`}
      style={{
        backgroundColor: checked ? "var(--coral)" : "var(--border-color)",
      }}
    >
      <div className="custom-switch-thumb" />
    </button>
  );
}
export default function Settings() {
  const [font, setFont] = useState("Plus Jakarta Sans");
  const [themeMode, setThemeMode] = useState("light");
  const [animation, setAnimation] = useState("full");
  const [activeTheme, setActiveTheme] = useState("Terracotta");
  const [activeSection, setActiveSection] = useState("appearance");

  const [notifs, setNotifs] = useState({
    budgetAlert: true,
    expenseReminder: true,
    bills: true,
    weeklyReport: false,
    unusualSpending: true,
  });

  const handleThemeChange = (theme) => {
    setActiveTheme(theme.name);
    document.documentElement.style.setProperty("--coral", theme.coral);
    document.documentElement.style.setProperty("--peach", theme.peach);
  };

  const sections = [
    { id: "appearance", label: "Appearance", emoji: "🎨" },
    { id: "font", label: "Font", emoji: "✍️" },
    { id: "notifications", label: "Notifications", emoji: "🔔" },
    { id: "profile", label: "Profile", emoji: "👤" },
    { id: "security", label: "Security", emoji: "🔐" },
  ];

  return (
    <div className="container py-4 max-w-lg">
      {/* Page Title */}
      <div className="mb-4">
        <h1 className="fw-bold h2 mb-1" style={{ color: "var(--text-main)" }}>
          Settings ⚙️
        </h1>
        <p className="text-muted small">Customize your CashMate experience</p>
      </div>

      <div className="row g-4">
        {/* Sidebar */}
        <div className="col-12 col-md-3">
          <div className="settings-card p-2 d-flex flex-column gap-1">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`btn text-start sidebar-btn fw-bold text-nowrap ${
                  activeSection === s.id ? "active" : ""
                }`}
              >
                <span className="me-2">{s.emoji}</span> {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="col-12 col-md-9">
          {/* 1. Appearance Section */}
          {activeSection === "appearance" && (
            <div className="settings-card p-4 mb-3">
              <h2 className="h5 fw-bold mb-4">🎨 Appearance</h2>

              {/* Theme Mode */}
              <div className="mb-4">
                <label className="form-label text-muted small fw-semibold">
                  Theme Mode
                </label>
                <div className="row g-2">
                  {["light", "dark", "system"].map((mode) => (
                    <div key={mode} className="col-4">
                      <button
                        onClick={() => setThemeMode(mode)}
                        className={`btn w-100 p-3 theme-option-btn text-center ${
                          themeMode === mode ? "selected" : ""
                        }`}
                      >
                        <div className="fs-4 mb-1">
                          {mode === "light"
                            ? "☀️"
                            : mode === "dark"
                            ? "🌙"
                            : "💻"}
                        </div>
                        <span className="text-capitalize small fw-bold d-block">
                          {mode}
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Themes */}
              <div className="mb-4">
                <label className="form-label text-muted small fw-semibold">
                  Color Theme
                </label>
                <div className="d-flex flex-wrap gap-2">
                  {warmThemes.map((t) => {
                    const isSelected = activeTheme === t.name;
                    return (
                      <button
                        key={t.name}
                        onClick={() => handleThemeChange(t)}
                        className={`btn theme-option-btn d-flex align-items-center gap-2 px-3 py-2 ${
                          isSelected ? "selected" : ""
                        }`}
                      >
                        <span
                          className="rounded-circle d-inline-block"
                          style={{
                            width: "14px",
                            height: "14px",
                            background: `linear-gradient(135deg, ${t.coral}, ${t.peach})`,
                          }}
                        />
                        <span className="small fw-semibold">{t.name}</span>
                        {isSelected && (
                          <span style={{ color: "var(--coral)" }}>✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Animation Level */}
              <div>
                <label className="form-label text-muted small fw-semibold">
                  Animation Level
                </label>
                <div className="row g-2">
                  {["full", "reduced", "off"].map((level) => (
                    <div key={level} className="col-4">
                      <button
                        onClick={() => setAnimation(level)}
                        className={`btn w-100 p-3 theme-option-btn text-center ${
                          animation === level ? "selected" : ""
                        }`}
                      >
                        <div className="fs-4 mb-1">
                          {level === "full"
                            ? "✨"
                            : level === "reduced"
                            ? "⚡"
                            : "🔇"}
                        </div>
                        <span className="text-capitalize small fw-bold d-block">
                          {level}
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. Font Customization */}
          {activeSection === "font" && (
            <div className="settings-card p-4 mb-3">
              <h2 className="h5 fw-bold mb-2">✍️ Font Customization</h2>
              <p className="text-muted small mb-4">
                Choose a font and the entire app updates instantly.
              </p>
              <div className="d-flex flex-column gap-2">
                {fonts.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFont(f)}
                    className={`btn theme-option-btn text-start p-3 d-flex justify-content-between align-items-center ${
                      font === f ? "selected" : ""
                    }`}
                  >
                    <div>
                      <div
                        className="fw-bold"
                        style={{ fontFamily: `'${f}', sans-serif` }}
                      >
                        {f}
                      </div>
                      <div
                        className="small text-muted"
                        style={{ fontFamily: `'${f}', sans-serif` }}
                      >
                        {fontPreviews[f]} — ₹12,550 saved this month
                      </div>
                    </div>
                    {font === f && (
                      <span
                        className="badge rounded-circle p-2"
                        style={{ backgroundColor: "var(--coral)" }}
                      >
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. Notifications */}
          {activeSection === "notifications" && (
            <div className="settings-card p-4 mb-3">
              <h2 className="h5 fw-bold mb-4">🔔 Notification Preferences</h2>
              <div className="d-flex flex-column gap-3">
                {[
                  {
                    key: "budgetAlert",
                    label: "Budget Alerts",
                    desc: "Get notified when you exceed budget limits",
                  },
                  {
                    key: "expenseReminder",
                    label: "Expense Reminders",
                    desc: "Daily reminders to log your expenses",
                  },
                  {
                    key: "bills",
                    label: "Bill Reminders",
                    desc: "Upcoming bill payment alerts",
                  },
                  {
                    key: "weeklyReport",
                    label: "Weekly Reports",
                    desc: "Receive weekly spending summary",
                  },
                  {
                    key: "unusualSpending",
                    label: "Unusual Spending",
                    desc: "Alert on spending anomalies",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="d-flex justify-content-between align-items-center p-3 rounded-3"
                    style={{ backgroundColor: "var(--bg-alt)" }}
                  >
                    <div>
                      <div className="fw-semibold small">{item.label}</div>
                      <div className="text-muted extra-small">{item.desc}</div>
                    </div>
                    <Toggle
                      checked={notifs[item.key]}
                      onChange={(v) =>
                        setNotifs((n) => ({ ...n, [item.key]: v }))
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Profile Section */}
          {activeSection === "profile" && (
            <div className="settings-card p-4 mb-3">
              <h2 className="h5 fw-bold mb-4">👤 Profile Information</h2>

              <div className="d-flex align-items-center gap-3 mb-4">
                <div
                  className="rounded-4 d-flex align-items-center justify-content-center fs-2"
                  style={{
                    width: "60px",
                    height: "60px",
                    background:
                      "linear-gradient(135deg, var(--coral), var(--peach))",
                  }}
                >
                  👩
                </div>
                <div>
                  <div className="fw-bold">Priya Sharma</div>
                  <div className="text-muted small">priya@example.com</div>
                  <button className="btn btn-link p-0 text-decoration-none extra-small fw-bold style-coral">
                    Change photo
                  </button>
                </div>
              </div>

              <div className="row g-3 mb-4">
                {[
                  { label: "Full Name", value: "Priya Sharma" },
                  { label: "Email", value: "priya@example.com" },
                  { label: "Monthly Income (₹)", value: "35000" },
                  { label: "Currency", value: "INR (₹)" },
                ].map((field) => (
                  <div key={field.label} className="col-12 col-md-6">
                    <label className="form-label small fw-bold mb-1">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      className="form-control input-custom"
                      defaultValue={field.value}
                    />
                  </div>
                ))}
              </div>

              <button className="btn btn-primary-gradient">
                💾 Save Changes
              </button>
            </div>
          )}

          {/* 5. Security Section */}
          {activeSection === "security" && (
            <div className="settings-card p-4 mb-3">
              <h2 className="h5 fw-bold mb-4">🔐 Security & Privacy</h2>
              <div className="d-flex flex-column gap-3">
                {[
                  {
                    emoji: "🔑",
                    label: "Change Password",
                    desc: "Update your account password",
                  },
                  {
                    emoji: "📱",
                    label: "Two-Factor Authentication",
                    desc: "Add an extra layer of security",
                  },
                  {
                    emoji: "🛡️",
                    label: "Privacy Settings",
                    desc: "Control your data and privacy",
                  },
                  {
                    emoji: "📋",
                    label: "Active Sessions",
                    desc: "Manage where you're logged in",
                  },
                ].map((item) => (
                  <button
                    key={item.label}
                    className="btn theme-option-btn text-start p-3 d-flex align-items-center gap-3"
                  >
                    <span className="fs-4">{item.emoji}</span>
                    <div className="flex-grow-1">
                      <div className="fw-semibold small">{item.label}</div>
                      <div className="text-muted extra-small">{item.desc}</div>
                    </div>
                    <span className="text-muted">→</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={() => alert("Logout button clicked")}
            className="btn w-100 py-3 fw-bold rounded-4 border-2"
            style={{
              borderColor: "rgba(232, 93, 46, 0.3)",
              color: "var(--coral)",
              backgroundColor: "rgba(232, 93, 46, 0.04)",
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}