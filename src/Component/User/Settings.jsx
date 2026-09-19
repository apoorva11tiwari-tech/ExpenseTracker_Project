import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

/* =====================================================================
   CashMate – Settings (Tailwind CSS, single file)
   Place at: src/Component/User/Settings.jsx
   Needs: react-router-dom, lucide-react (already used in Dashboard.jsx)
   Tailwind: no config changes needed (only arbitrary-value classes).
   ===================================================================== */

/* ---------- Options ---------- */

const SECTIONS = [
  { id: "appearance", label: "Appearance", icon: "🎨" },
  { id: "font", label: "Font", icon: "✍️" },
  { id: "notifications", label: "Notifications", icon: "🔔" },
  { id: "profile", label: "Profile", icon: "👤" },
  { id: "security", label: "Security", icon: "🔒" },
];

const MODES = [
  { id: "light", label: "Light", icon: "☀️" },
  { id: "dark", label: "Dark", icon: "🌙" },
  { id: "system", label: "System", icon: "💻" },
];

const COLORS = [
  { id: "terracotta", label: "Terracotta", dot: "linear-gradient(135deg,#fb923c,#ea580c)" },
  { id: "sunset", label: "Sunset", dot: "linear-gradient(135deg,#f87171,#dc2626)" },
  { id: "berry", label: "Berry", dot: "linear-gradient(135deg,#c084fc,#9333ea)" },
  { id: "ocean", label: "Ocean", dot: "linear-gradient(135deg,#38bdf8,#0369a1)" },
  { id: "forest", label: "Forest", dot: "linear-gradient(135deg,#4ade80,#166534)" },
];

const MOTIONS = [
  { id: "full", label: "Full", icon: "✨" },
  { id: "reduced", label: "Reduced", icon: "⚡" },
  { id: "off", label: "Off", icon: "🔇" },
];

/* ---------- Colors (applied as CSS variables on the page wrapper) ---------- */

const BASE = {
  light: {
    primary: "#2563eb", page: "#eef4ff", card: "#ffffff", border: "#e3eaf7",
    text: "#16213e", muted: "#4a5878", opt: "#e3edff", optBorder: "#d3e0f5",
  },
  dark: {
    primary: "#6d9bff", page: "#0f1526", card: "#182038", border: "#26314f",
    text: "#eaf0ff", muted: "#a3b1d1", opt: "#212b48", optBorder: "#303c60",
  },
};

// [softBackground, border] for each color theme
const ACCENT = {
  terracotta: { light: ["#fff4f0", "#f0c4b4"], dark: ["#3a2620", "#7a4a3a"] },
  sunset: { light: ["#fff1f1", "#f4b5b5"], dark: ["#3a2124", "#7a3a40"] },
  berry: { light: ["#f7f0ff", "#d9bdf7"], dark: ["#2e2140", "#62438a"] },
  ocean: { light: ["#ecf8ff", "#a9dcf5"], dark: ["#1b3244", "#33627f"] },
  forest: { light: ["#eefaf1", "#afdcbb"], dark: ["#1e3628", "#3c7452"] },
};

/* ---------- Storage + applying to the page ---------- */

const STORAGE_KEY = "cashmate:appearance";
const DEFAULTS = { mode: "light", color: "terracotta", motion: "full" };

function loadAppearance() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return {
      mode: MODES.some((m) => m.id === saved?.mode) ? saved.mode : DEFAULTS.mode,
      color: COLORS.some((c) => c.id === saved?.color) ? saved.color : DEFAULTS.color,
      motion: MOTIONS.some((m) => m.id === saved?.motion) ? saved.motion : DEFAULTS.motion,
    };
  } catch {
    return { ...DEFAULTS };
  }
}

function saveAppearance(value) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* storage blocked – ignore */
  }
}

const isDark = (mode, prefersDark) => mode === "dark" || (mode === "system" && prefersDark);

// Sets attributes/classes on <html> so the whole app can react to the settings
function applyAppearance({ mode, color, motion }, prefersDark) {
  const root = document.documentElement;
  const dark = isDark(mode, prefersDark);

  root.setAttribute("data-cm-theme", dark ? "dark" : "light");
  root.setAttribute("data-cm-color", color);
  root.setAttribute("data-cm-motion", motion);
  root.classList.toggle("dark", dark); // works with Tailwind's `dark:` (class strategy)

  // Animation level for the whole app
  let style = document.getElementById("cm-motion-style");
  if (motion === "full") {
    style?.remove();
  } else {
    if (!style) {
      style = document.createElement("style");
      style.id = "cm-motion-style";
      document.head.appendChild(style);
    }
    style.textContent =
      motion === "off"
        ? "*,*::before,*::after{animation:none!important;transition:none!important}"
        : "*,*::before,*::after{animation-duration:.1s!important;transition-duration:.1s!important}";
  }
}

/**
 * OPTIONAL: call once in main.jsx / index.js so the saved theme is applied
 * on every page (not only after opening Settings):
 *   import { initAppearance } from "./Component/User/Settings";
 *   initAppearance();
 */
export function initAppearance() {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const run = () => applyAppearance(loadAppearance(), mq.matches);
  run();
  mq.addEventListener("change", run);
}

/* ---------- Small pieces ---------- */

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cm-primary)]";

function OptionCard({ icon, label, selected, onClick, motion }) {
  const anim =
    motion === "full"
      ? "transition-all duration-200 hover:-translate-y-0.5"
      : motion === "reduced"
      ? "transition-colors duration-75"
      : "";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex h-28 flex-col items-center justify-center gap-3 rounded-[22px] border-2 text-[15px] font-bold sm:h-[138px] sm:text-lg ${anim} ${focusRing} ${
        selected
          ? "border-[color:var(--cm-primary)] bg-[color:var(--cm-accent-soft)] text-[color:var(--cm-primary)]"
          : "border-[color:var(--cm-opt-border)] bg-[color:var(--cm-opt)] text-[color:var(--cm-muted)]"
      }`}
    >
      <span className="text-3xl leading-none sm:text-4xl" aria-hidden="true">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function AppearancePanel({ appearance, update }) {
  const groupLabel = "mb-4 text-lg font-semibold text-[color:var(--cm-muted)] sm:text-[21px]";

  return (
    <>
      <h2 className="mb-7 flex items-center gap-3 text-2xl font-extrabold text-[color:var(--cm-text)] sm:text-[32px]">
        <span aria-hidden="true">🎨</span> Appearance
      </h2>

      {/* Theme mode */}
      <section>
        <h3 className={groupLabel}>Theme Mode</h3>
        <div className="grid grid-cols-3 gap-2.5 sm:gap-[18px]">
          {MODES.map((m) => (
            <OptionCard
              key={m.id}
              icon={m.icon}
              label={m.label}
              motion={appearance.motion}
              selected={appearance.mode === m.id}
              onClick={() => update({ mode: m.id })}
            />
          ))}
        </div>
      </section>

      {/* Color theme */}
      <section className="mt-8">
        <h3 className={groupLabel}>Color Theme</h3>
        <div className="flex flex-wrap gap-2.5 sm:gap-[18px]">
          {COLORS.map((c) => {
            const selected = appearance.color === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => update({ color: c.id })}
                aria-pressed={selected}
                className={`inline-flex items-center gap-3 rounded-full border-2 px-4 py-2.5 text-base font-semibold transition-colors sm:px-6 sm:py-3.5 sm:text-xl ${focusRing} ${
                  selected
                    ? "border-[color:var(--cm-primary)] bg-[color:var(--cm-accent-soft)] text-[color:var(--cm-primary)]"
                    : "border-[color:var(--cm-opt-border)] bg-[color:var(--cm-opt)] text-[color:var(--cm-muted)]"
                }`}
              >
                <span
                  className="h-5 w-5 rounded-full shadow-[inset_0_-2px_4px_rgba(0,0,0,0.15)] sm:h-[26px] sm:w-[26px]"
                  style={{ background: c.dot }}
                />
                {c.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Animation level */}
      <section className="mt-8">
        <h3 className={groupLabel}>Animation Level</h3>
        <div className="grid grid-cols-3 gap-2.5 sm:gap-[18px]">
          {MOTIONS.map((a) => (
            <OptionCard
              key={a.id}
              icon={a.icon}
              label={a.label}
              motion={appearance.motion}
              selected={appearance.motion === a.id}
              onClick={() => update({ motion: a.id })}
            />
          ))}
        </div>
      </section>
    </>
  );
}

/* ---------- Page ---------- */

/**
 * Props (all optional):
 *   onLogout  function -> called on Logout click (default: go to "/login")
 *   panels    object   -> plug other members' panels: { font: <FontPanel />, profile: <ProfilePanel /> }
 */
export default function Settings({ onLogout, panels = {} }) {
  const navigate = useNavigate();
  const [active, setActive] = useState("appearance");
  const [appearance, setAppearance] = useState(loadAppearance);
  const [prefersDark, setPrefersDark] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  // Follow the OS theme when mode = "system"
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => setPrefersDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Apply + save whenever something changes
  useEffect(() => {
    applyAppearance(appearance, prefersDark);
    saveAppearance(appearance);
  }, [appearance, prefersDark]);

  const update = (patch) => setAppearance((prev) => ({ ...prev, ...patch }));

  const dark = isDark(appearance.mode, prefersDark);
  const t = BASE[dark ? "dark" : "light"];
  const [accentSoft, accentBorder] = ACCENT[appearance.color][dark ? "dark" : "light"];

  // CSS variables used by the Tailwind classes above
  const vars = {
    "--cm-primary": t.primary,
    "--cm-page": t.page,
    "--cm-card": t.card,
    "--cm-border": t.border,
    "--cm-text": t.text,
    "--cm-muted": t.muted,
    "--cm-opt": t.opt,
    "--cm-opt-border": t.optBorder,
    "--cm-accent-soft": accentSoft,
    "--cm-accent-border": accentBorder,
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    else navigate("/login"); // change to your login route if different
  };

  const activeSection = SECTIONS.find((s) => s.id === active);

  return (
    <div
      style={vars}
      className="min-h-screen bg-[color:var(--cm-page)] px-4 py-6 text-[color:var(--cm-text)] transition-colors sm:px-8 lg:px-12 lg:py-10"
    >
      {/* Header */}
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[44px]">
          Settings <span aria-hidden="true">⚙️</span>
        </h1>
        <p className="mt-1.5 text-base text-[color:var(--cm-muted)] sm:text-xl">
          Customize your CashMate experience
        </p>
      </header>

      <div className="mt-8 grid gap-5 lg:mt-9 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start lg:gap-8">
        {/* Sidebar */}
        <nav
          aria-label="Settings sections"
          className="flex gap-1 overflow-x-auto rounded-3xl border border-[color:var(--cm-border)] bg-[color:var(--cm-card)] p-3 lg:flex-col lg:rounded-[32px]"
        >
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActive(s.id)}
              aria-current={active === s.id ? "page" : undefined}
              className={`flex shrink-0 items-center gap-3 whitespace-nowrap rounded-[20px] border px-4 py-3 text-left text-base font-semibold transition-colors lg:gap-4 lg:px-5 lg:py-4 lg:text-xl ${focusRing} ${
                active === s.id
                  ? "border-[color:var(--cm-accent-border)] bg-[color:var(--cm-accent-soft)] text-[color:var(--cm-primary)]"
                  : "border-transparent text-[color:var(--cm-muted)] hover:bg-[color:var(--cm-opt)]"
              }`}
            >
              <span aria-hidden="true">{s.icon}</span>
              {s.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div>
          <div className="rounded-[32px] border border-[color:var(--cm-border)] bg-[color:var(--cm-card)] p-5 sm:p-9">
            {active === "appearance" ? (
              <AppearancePanel appearance={appearance} update={update} />
            ) : panels[active] ? (
              panels[active]
            ) : (
              <>
                <h2 className="mb-4 text-2xl font-extrabold sm:text-[32px]">{activeSection.label}</h2>
                <p className="text-[color:var(--cm-muted)]">This section is coming soon.</p>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className={`mt-6 flex w-full items-center justify-center gap-3 rounded-full border-2 border-[color:var(--cm-accent-border)] bg-[color:var(--cm-opt)] p-5 text-lg font-bold text-[color:var(--cm-primary)] transition-colors hover:bg-[color:var(--cm-accent-soft)] sm:p-6 sm:text-xl ${focusRing}`}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
