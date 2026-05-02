import { useState, useEffect, useCallback, useRef } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
} from "recharts";

const API = "http://127.0.0.1:5000";

// ════════════════════════════════════════════════════════════════════
//  DESIGN TOKENS
// ════════════════════════════════════════════════════════════════════
const T = {
  bg: "#060810",
  surface: "#0d1117",
  card: "#111827",
  border: "#1f2937",
  border2: "#374151",
  text: "#f9fafb",
  muted: "#6b7280",
  dim: "#374151",

  red: "#ef4444",
  orange: "#f97316",
  amber: "#f59e0b",
  green: "#10b981",
  blue: "#3b82f6",
  purple: "#8b5cf6",
  cyan: "#06b6d4",
  pink: "#ec4899",

  // Severity
  Critical: "#ef4444",
  High: "#f97316",
  Medium: "#f59e0b",
  Low: "#10b981",
  // Health
  Injured: "#f97316",
  Stable: "#10b981",
};

const NAV = [
  { id: "dashboard", label: "Command Center", icon: "◈", accent: T.blue },
  { id: "analytics", label: "Analytics", icon: "◉", accent: T.purple },
  { id: "disasters", label: "Disasters", icon: "⚡", accent: T.red },
  { id: "victims", label: "Victims", icon: "⬡", accent: T.orange },
  { id: "resources", label: "Resources", icon: "◧", accent: T.cyan },
  { id: "donations", label: "Donations", icon: "◈", accent: T.green },
  { id: "volunteers", label: "Volunteers", icon: "◎", accent: T.purple },
  { id: "shelters", label: "Shelters", icon: "⬢", accent: T.amber },
  { id: "rescue_teams", label: "Rescue Teams", icon: "◆", accent: T.cyan },
  { id: "distribute", label: "Distribute", icon: "⇢", accent: T.pink },
];

// ════════════════════════════════════════════════════════════════════
//  GLOBAL STYLES
// ════════════════════════════════════════════════════════════════════
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@700;800&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${T.bg}; color: ${T.text}; font-family: 'Space Grotesk', sans-serif; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: ${T.bg}; }
  ::-webkit-scrollbar-thumb { background: ${T.border2}; border-radius: 2px; }
  ::-webkit-scrollbar-thumb:hover { background: ${T.muted}; }
  input, select, textarea { font-family: 'Space Grotesk', sans-serif; }
  ::selection { background: ${T.blue}33; color: ${T.text}; }

  @keyframes spin    { to { transform: rotate(360deg); } }
  @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes slideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideIn { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:translateX(0)} }
  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes glow    { 0%,100%{box-shadow:0 0 8px currentColor} 50%{box-shadow:0 0 24px currentColor} }
  @keyframes toast   { 0%{opacity:0;transform:translateX(100%)} 10%{opacity:1;transform:translateX(0)} 85%{opacity:1;transform:translateX(0)} 100%{opacity:0;transform:translateX(100%)} }

  .fade-up    { animation: slideUp .25s ease both; }
  .fade-in    { animation: fadeIn .2s ease both; }
  .slide-in   { animation: slideIn .25s ease both; }

  .row-hover:hover { background: ${T.border}22 !important; }
  .nav-btn:hover   { background: ${T.border} !important; color: ${T.text} !important; }
  .btn-hover:hover { filter: brightness(1.12); transform: translateY(-1px); }
  .card-hover:hover{ border-color: ${T.border2} !important; transform: translateY(-2px); }

  .stat-glow-red    { box-shadow: 0 0 30px ${T.red}18; }
  .stat-glow-green  { box-shadow: 0 0 30px ${T.green}18; }
  .stat-glow-blue   { box-shadow: 0 0 30px ${T.blue}18; }
  .stat-glow-purple { box-shadow: 0 0 30px ${T.purple}18; }
  .stat-glow-cyan   { box-shadow: 0 0 30px ${T.cyan}18; }
  .stat-glow-amber  { box-shadow: 0 0 30px ${T.amber}18; }
  .stat-glow-orange { box-shadow: 0 0 30px ${T.orange}18; }
  .stat-glow-pink   { box-shadow: 0 0 30px ${T.pink}18; }

  .progress-bar { height: 6px; border-radius: 3px; background: ${T.border}; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 3px; transition: width .6s cubic-bezier(.4,0,.2,1); }

  input:focus, select:focus { outline: none !important; border-color: ${T.blue} !important; box-shadow: 0 0 0 3px ${T.blue}18 !important; }
  input::placeholder { color: ${T.muted}; }

  table { border-collapse: collapse; width: 100%; }
  th, td { padding: 0; }

  .modal-overlay { position: fixed; inset: 0; background: #00000088; display: flex; align-items: center; justify-content: center; z-index: 9999; backdrop-filter: blur(6px); animation: fadeIn .15s ease; }
  .modal-box { background: ${T.card}; border: 1px solid ${T.border2}; border-radius: 16px; padding: 32px; width: 520px; max-width: 94vw; max-height: 90vh; overflow-y: auto; animation: slideUp .2s ease; }

  .chip { display: inline-flex; align-items: center; gap: 4px; border-radius: 6px; padding: 2px 10px; font-size: 11px; font-weight: 600; letter-spacing: .3px; }
  .tag  { display: inline-block; border-radius: 4px; padding: 1px 8px; font-size: 11px; font-weight: 700; font-family: 'JetBrains Mono', monospace; }

  .mono { font-family: 'JetBrains Mono', monospace; }
  .display { font-family: 'Syne', sans-serif; }

  .grid-2  { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .grid-3  { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
  .grid-4  { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
  .auto-fit-200 { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px,1fr)); gap: 14px; }
  .auto-fit-260 { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px,1fr)); gap: 14px; }
  .auto-fit-180 { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px,1fr)); gap: 14px; }

  @media (max-width: 900px) {
    .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
  }
`;

// ════════════════════════════════════════════════════════════════════
//  UTILITY HOOKS
// ════════════════════════════════════════════════════════════════════

function useToast() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);
  return { toasts, push };
}

function useFetch(endpoint, deps = []) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch(`${API}/${endpoint}`)
      .then((r) => {
        if (!r.ok) throw new Error(r.status);
        return r.json();
      })
      .then((d) => {
        setData(Array.isArray(d) ? d : d || []);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
    // eslint-disable-next-line
  }, [endpoint, ...deps]);
  useEffect(() => {
    load();
  }, [load]);
  return { data, loading, error, refresh: load };
}

// ════════════════════════════════════════════════════════════════════
//  BASE COMPONENTS
// ════════════════════════════════════════════════════════════════════

function Toaster({ toasts }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: t.type === "success" ? "#052e16" : "#450a0a",
            border: `1px solid ${t.type === "success" ? T.green : T.red}55`,
            color: t.type === "success" ? T.green : "#fca5a5",
            borderRadius: 10,
            padding: "12px 18px",
            fontSize: 13,
            fontWeight: 600,
            boxShadow: `0 8px 32px #00000060`,
            animation: "toast 4s ease forwards",
            minWidth: 260,
            maxWidth: 380,
          }}
        >
          <span style={{ fontSize: 16 }}>
            {t.type === "success" ? "✓" : "✕"}
          </span>
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

function Spinner({ size = 28, color = T.blue }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: `2px solid ${T.border}`,
          borderTop: `2px solid ${color}`,
          animation: "spin .7s linear infinite",
        }}
      />
    </div>
  );
}

function EmptyState({ icon = "◉", text = "No records found" }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px", color: T.muted }}>
      <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.4 }}>{icon}</div>
      <div style={{ fontSize: 14 }}>{text}</div>
    </div>
  );
}

function Badge({ text, color }) {
  return (
    <span
      className="chip"
      style={{
        background: color + "22",
        color,
        border: `1px solid ${color}44`,
      }}
    >
      {text}
    </span>
  );
}

function MonoBadge({ text, color = T.muted }) {
  return (
    <span className="tag mono" style={{ background: color + "15", color }}>
      {text}
    </span>
  );
}

function Card({ children, style, hover = false, accent }) {
  return (
    <div
      className={hover ? "card-hover" : ""}
      style={{
        background: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: 12,
        overflow: "hidden",
        transition: "border-color .2s, transform .2s, box-shadow .2s",
        ...(accent ? { borderTop: `2px solid ${accent}` } : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function CardBody({ children, style }) {
  return <div style={{ padding: 24, ...style }}>{children}</div>;
}

function SectionLabel({ children, accent = T.blue }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 16,
      }}
    >
      <div
        style={{ width: 3, height: 16, background: accent, borderRadius: 2 }}
      />
      <span
        className="display"
        style={{
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: 1,
          textTransform: "uppercase",
          color: T.muted,
        }}
      >
        {children}
      </span>
    </div>
  );
}

function StatCard({ label, value, sub, icon, accent, glow = "" }) {
  return (
    <div
      className={`card-hover ${glow}`}
      style={{
        background: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: 12,
        padding: "22px 24px",
        position: "relative",
        overflow: "hidden",
        transition: "all .2s",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at top left, ${accent}08, transparent 60%)`,
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
            <div
              style={{
                fontSize: 11,
                color: T.muted,
                letterSpacing: 1,
                textTransform: "uppercase",
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              {label}
            </div>
            <div
              className="display"
              style={{
                fontSize: "clamp(18px, 2.4vw, 34px)",
                fontWeight: 800,
                color: T.text,
                lineHeight: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {value ?? "—"}
            </div>
            {sub && (
              <div
                style={{
                  fontSize: 12,
                  color: accent,
                  marginTop: 6,
                  fontWeight: 500,
                }}
              >
                {sub}
              </div>
            )}
          </div>
          {icon && (
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: accent + "18",
                border: `1px solid ${accent}33`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                color: accent,
              }}
            >
              {icon}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PageTitle({ icon, title, subtitle, accent = T.blue }) {
  return (
    <div
      style={{
        marginBottom: 28,
        paddingBottom: 24,
        borderBottom: `1px solid ${T.border}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 4,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: accent + "18",
            border: `1px solid ${accent}33`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            color: accent,
          }}
        >
          {icon}
        </div>
        <h1
          className="display"
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: T.text,
            letterSpacing: -0.5,
          }}
        >
          {title}
        </h1>
      </div>
      {subtitle && (
        <p style={{ fontSize: 13, color: T.muted, marginLeft: 48 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

function TopBar({ children, extra }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        flexWrap: "wrap",
        gap: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {children}
      </div>
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {extra}
      </div>
    </div>
  );
}

// ── Form Components ─────────────────────────────────────────────────

function FLabel({ children, required }) {
  return (
    <label
      style={{
        display: "block",
        fontSize: 11,
        color: T.muted,
        fontWeight: 600,
        letterSpacing: 0.5,
        textTransform: "uppercase",
        marginBottom: 6,
      }}
    >
      {children}
      {required && <span style={{ color: T.red, marginLeft: 2 }}>*</span>}
    </label>
  );
}

function FInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  mono = false,
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <FLabel required={required}>{label}</FLabel>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={{
          width: "100%",
          background: "#0d1117",
          border: `1px solid ${T.border}`,
          borderRadius: 8,
          padding: "10px 14px",
          color: T.text,
          fontSize: 14,
          transition: "all .15s",
          fontFamily: mono ? "'JetBrains Mono', monospace" : "inherit",
        }}
      />
    </div>
  );
}

function FSelect({ label, name, value, onChange, options, required }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <FLabel required={required}>{label}</FLabel>}
      <select
        name={name}
        value={value}
        onChange={onChange}
        style={{
          width: "100%",
          background: "#0d1117",
          border: `1px solid ${T.border}`,
          borderRadius: 8,
          padding: "10px 14px",
          color: value ? T.text : T.muted,
          fontSize: 14,
          fontFamily: "inherit",
          cursor: "pointer",
        }}
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o.value} value={o.value} style={{ background: T.card }}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function FRow({ children }) {
  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}
    >
      {children}
    </div>
  );
}

function ActionBtn({
  onClick,
  children,
  color = T.blue,
  outline = false,
  size = "md",
  icon,
  loading: ld = false,
  disabled = false,
}) {
  const pad =
    size === "sm" ? "6px 14px" : size === "lg" ? "12px 28px" : "9px 20px";
  const fz = size === "sm" ? 12 : 14;
  return (
    <button
      onClick={onClick}
      disabled={disabled || ld}
      className="btn-hover"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: outline ? "transparent" : color,
        color: outline ? color : "#fff",
        border: `1.5px solid ${color}`,
        borderRadius: 8,
        padding: pad,
        fontWeight: 700,
        fontSize: fz,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "inherit",
        transition: "all .15s",
        opacity: disabled || ld ? 0.6 : 1,
        whiteSpace: "nowrap",
      }}
    >
      {ld ? (
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            border: `2px solid transparent`,
            borderTop: `2px solid currentColor`,
            animation: "spin .6s linear infinite",
          }}
        />
      ) : (
        icon
      )}
      {children}
    </button>
  );
}

function SearchInput({ value, onChange, placeholder }) {
  return (
    <div style={{ position: "relative" }}>
      <span
        style={{
          position: "absolute",
          left: 11,
          top: "50%",
          transform: "translateY(-50%)",
          color: T.muted,
          fontSize: 13,
          pointerEvents: "none",
        }}
      >
        ⌕
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Search…"}
        style={{
          background: "#0d1117",
          border: `1px solid ${T.border}`,
          borderRadius: 8,
          padding: "9px 14px 9px 33px",
          color: T.text,
          fontSize: 13,
          fontFamily: "inherit",
          transition: "all .15s",
          minWidth: 200,
        }}
      />
    </div>
  );
}

function FilterSelect({ value, onChange, options, placeholder = "All" }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        background: "#0d1117",
        border: `1px solid ${T.border}`,
        borderRadius: 8,
        padding: "9px 14px",
        color: value ? T.text : T.muted,
        fontSize: 13,
        fontFamily: "inherit",
        cursor: "pointer",
      }}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value} style={{ background: T.card }}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

// ── Modal ────────────────────────────────────────────────────────────

function Modal({ title, onClose, children, accent = T.blue, width = 520 }) {
  useEffect(() => {
    const esc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);
  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal-box"
        style={{ width, borderTop: `2px solid ${accent}` }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 3,
                height: 22,
                background: accent,
                borderRadius: 2,
              }}
            />
            <h3
              className="display"
              style={{ fontSize: 20, fontWeight: 800, color: T.text }}
            >
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: `1px solid ${T.border}`,
              color: T.muted,
              fontSize: 16,
              cursor: "pointer",
              borderRadius: 6,
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── DataTable ────────────────────────────────────────────────────────

function exportCSV(data, filename) {
  if (!data?.length) return;
  const keys = Object.keys(data[0]);
  const csv = [
    keys.join(","),
    ...data.map((r) =>
      keys.map((k) => `"${String(r[k] ?? "").replace(/"/g, '""')}"`).join(","),
    ),
  ].join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = filename;
  a.click();
}

function DataTable({
  columns,
  rows,
  loading,
  emptyIcon,
  emptyText,
  onExport,
  actions,
  perPage = 12,
}) {
  const [page, setPage] = useState(1);
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState(1);

  const sorted = sortCol
    ? [...(rows || [])].sort((a, b) => {
        const av = a[sortCol] ?? "",
          bv = b[sortCol] ?? "";
        return typeof av === "number"
          ? (av - bv) * sortDir
          : String(av).localeCompare(String(bv)) * sortDir;
      })
    : rows || [];

  const total = sorted.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const slice = sorted.slice((page - 1) * perPage, page * perPage);
  useEffect(() => setPage(1), [rows, sortCol, sortDir]);

  if (loading) return <Spinner />;
  if (!rows || rows.length === 0)
    return <EmptyState icon={emptyIcon} text={emptyText} />;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 12,
            color: T.muted,
            fontFamily: "'JetBrains Mono',monospace",
          }}
        >
          {total.toLocaleString()} records · Page {page}/{pages}
        </span>
        <div style={{ display: "flex", gap: 6 }}>
          {actions}
          {onExport && (
            <ActionBtn
              size="sm"
              onClick={() => exportCSV(rows, "export.csv")}
              color={T.border2}
              outline
              icon="↓"
            >
              CSV
            </ActionBtn>
          )}
        </div>
      </div>
      <div
        style={{
          overflowX: "auto",
          borderRadius: 8,
          border: `1px solid ${T.border}`,
        }}
      >
        <table>
          <thead>
            <tr
              style={{
                background: "#0d1117",
                borderBottom: `1px solid ${T.border}`,
              }}
            >
              {columns.map((c, i) => (
                <th
                  key={i}
                  onClick={
                    c.sortKey
                      ? () => {
                          setSortCol(c.sortKey);
                          setSortDir(sortCol === c.sortKey ? -sortDir : 1);
                        }
                      : undefined
                  }
                  style={{
                    padding: "11px 16px",
                    textAlign: "left",
                    fontSize: 11,
                    fontWeight: 700,
                    color: T.muted,
                    letterSpacing: 0.8,
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    userSelect: "none",
                    cursor: c.sortKey ? "pointer" : "default",
                  }}
                >
                  {c.label}
                  {c.sortKey && (
                    <span style={{ marginLeft: 4, opacity: 0.5 }}>
                      {sortCol === c.sortKey
                        ? sortDir === 1
                          ? "↑"
                          : "↓"
                        : "↕"}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.map((row, ri) => (
              <tr
                key={ri}
                className="row-hover fade-in"
                style={{
                  borderBottom: `1px solid ${T.border}22`,
                  transition: "background .1s",
                }}
              >
                {columns.map((c, ci) => (
                  <td
                    key={ci}
                    style={{
                      padding: "12px 16px",
                      color: T.text,
                      fontSize: 13,
                      verticalAlign: "middle",
                    }}
                  >
                    {c.render
                      ? c.render(row)
                      : (row[c.key] ?? (
                          <span style={{ color: T.muted }}>—</span>
                        ))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 4,
            marginTop: 14,
          }}
        >
          <ActionBtn
            size="sm"
            onClick={() => setPage(1)}
            disabled={page === 1}
            color={T.border2}
            outline
          >
            «
          </ActionBtn>
          <ActionBtn
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            color={T.border2}
            outline
          >
            ‹
          </ActionBtn>
          {[...Array(Math.min(5, pages))].map((_, i) => {
            let pg =
              page <= 3
                ? i + 1
                : page >= pages - 2
                  ? pages - 4 + i
                  : page - 2 + i;
            if (pg < 1 || pg > pages) return null;
            return (
              <ActionBtn
                key={pg}
                size="sm"
                onClick={() => setPage(pg)}
                color={page === pg ? T.blue : T.border2}
                outline={page !== pg}
              >
                {pg}
              </ActionBtn>
            );
          })}
          <ActionBtn
            size="sm"
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page === pages}
            color={T.border2}
            outline
          >
            ›
          </ActionBtn>
          <ActionBtn
            size="sm"
            onClick={() => setPage(pages)}
            disabled={page === pages}
            color={T.border2}
            outline
          >
            »
          </ActionBtn>
        </div>
      )}
    </div>
  );
}

// ── Chart helpers ────────────────────────────────────────────────────

const TTP = {
  contentStyle: {
    background: T.card,
    border: `1px solid ${T.border2}`,
    borderRadius: 8,
    color: T.text,
    fontSize: 13,
  },
  cursor: { fill: `${T.border}44` },
};
const AXIS_TICK = { fill: T.muted, fontSize: 11 };

// ════════════════════════════════════════════════════════════════════
//  PAGE: DASHBOARD
// ════════════════════════════════════════════════════════════════════

function DashboardPage({
  disasters,
  victims,
  resources,
  donations,
  volunteers,
  shelters,
  teams,
}) {
  const totalDon = donations.reduce((s, d) => s + (d.amount || 0), 0);
  const critDis = disasters.filter(
    (d) => d.severity_level === "Critical",
  ).length;
  const critVic = victims.filter((v) => v.health_status === "Critical").length;
  const injVic = victims.filter((v) => v.health_status === "Injured").length;
  const totalRes = resources.reduce(
    (s, r) => s + (r.quantity_available || 0),
    0,
  );
  const lowRes = resources.filter((r) => r.quantity_available < 100).length;

  // Chart data
  const vicPerDis = disasters
    .map((d) => ({
      name: d.disaster_type.slice(0, 7),
      loc: d.location?.slice(0, 8),
      victims: victims.filter((v) => v.disaster_id === d.disaster_id).length,
      fill: T[d.severity_level] || T.blue,
    }))
    .sort((a, b) => b.victims - a.victims)
    .slice(0, 8);

  const sevData = ["Critical", "High", "Medium", "Low"]
    .map((s) => ({
      name: s,
      value: disasters.filter((d) => d.severity_level === s).length,
      fill: T[s],
    }))
    .filter((d) => d.value > 0);

  const healthData = [
    { name: "Critical", value: critVic, fill: T.red },
    { name: "Injured", value: injVic, fill: T.orange },
    { name: "Stable", value: victims.length - critVic - injVic, fill: T.green },
  ].filter((d) => d.value > 0);

  const donPerDis = disasters
    .map((d) => {
      const total = donations
        .filter((x) => x.disaster_id === d.disaster_id)
        .reduce((s, x) => s + (x.amount || 0), 0);
      return { name: d.disaster_type.slice(0, 7), amount: total };
    })
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8);

  const shelterOcc = shelters.map((s) => ({
    name: s.shelter_name.slice(0, 10),
    occupied: victims.filter((v) => v.shelter_id === s.shelter_id).length,
    available:
      s.capacity - victims.filter((v) => v.shelter_id === s.shelter_id).length,
  }));

  const resData = resources.slice(0, 8).map((r) => ({
    name: r.resource_type?.slice(0, 10),
    qty: r.quantity_available,
  }));

  return (
    <div className="fade-up">
      <PageTitle
        icon="◈"
        title="Command Center"
        accent={T.blue}
        subtitle="Real-time overview of all active disaster relief operations across India"
      />

      {/* Alert bar */}
      {critDis > 0 && (
        <div
          style={{
            background: `${T.red}12`,
            border: `1px solid ${T.red}44`,
            borderRadius: 10,
            padding: "12px 18px",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            style={{
              fontSize: 16,
              color: T.red,
              animation: "pulse 2s infinite",
            }}
          >
            ⚠
          </span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#fca5a5" }}>
            {critDis} Critical disaster{critDis > 1 ? "s" : ""} active ·{" "}
            {critVic} victims in critical condition · {lowRes} resources running
            low
          </span>
        </div>
      )}

      {/* Stats grid */}
      <div className="auto-fit-180" style={{ marginBottom: 20 }}>
        <StatCard
          label="Active Disasters"
          value={disasters.length}
          sub={`${critDis} Critical`}
          icon="⚡"
          accent={T.red}
          glow="stat-glow-red"
        />
        <StatCard
          label="Total Victims"
          value={victims.length}
          sub={`${critVic} Critical · ${injVic} Injured`}
          icon="⬡"
          accent={T.orange}
          glow="stat-glow-orange"
        />
        <StatCard
          label="Funds Raised"
          value={`₹${(totalDon / 100000).toFixed(1)}L`}
          sub={`${donations.length} donors`}
          icon="◈"
          accent={T.green}
          glow="stat-glow-green"
        />
        <StatCard
          label="Resources"
          value={totalRes.toLocaleString()}
          sub={`${lowRes} low stock`}
          icon="◧"
          accent={T.blue}
          glow="stat-glow-blue"
        />
        <StatCard
          label="Volunteers"
          value={volunteers.length}
          sub={`${teams.length} teams`}
          icon="◎"
          accent={T.purple}
          glow="stat-glow-purple"
        />
        <StatCard
          label="Shelters"
          value={shelters.length}
          sub={`${shelters.reduce((s, x) => s + x.capacity, 0)} total capacity`}
          icon="⬢"
          accent={T.amber}
          glow="stat-glow-amber"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid-2" style={{ marginBottom: 14 }}>
        <Card accent={T.blue}>
          <CardBody>
            <SectionLabel accent={T.blue}>Victims per Disaster</SectionLabel>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={vicPerDis} margin={{ left: -10 }}>
                <XAxis
                  dataKey="name"
                  tick={AXIS_TICK}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />
                <Tooltip {...TTP} />
                {vicPerDis.map((d, i) => (
                  <Bar
                    key={i}
                    dataKey="victims"
                    fill={d.fill}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
                <Bar dataKey="victims" fill={T.orange} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card accent={T.red}>
          <CardBody>
            <SectionLabel accent={T.red}>
              Disaster Severity Distribution
            </SectionLabel>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={sevData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={{ stroke: T.muted, strokeWidth: 1 }}
                >
                  {sevData.map((d, i) => (
                    <Cell key={i} fill={d.fill} />
                  ))}
                </Pie>
                <Tooltip {...TTP} />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid-2" style={{ marginBottom: 14 }}>
        <Card accent={T.green}>
          <CardBody>
            <SectionLabel accent={T.green}>
              Donations per Disaster (₹)
            </SectionLabel>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={donPerDis} margin={{ left: 10 }}>
                <XAxis
                  dataKey="name"
                  tick={AXIS_TICK}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={AXIS_TICK}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  {...TTP}
                  formatter={(v) => [`₹${Number(v).toLocaleString("en-IN")}`]}
                />
                <Bar dataKey="amount" fill={T.green} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card accent={T.orange}>
          <CardBody>
            <SectionLabel accent={T.orange}>Victim Health Status</SectionLabel>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={healthData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={35}
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={{ stroke: T.muted, strokeWidth: 1 }}
                >
                  {healthData.map((d, i) => (
                    <Cell key={i} fill={d.fill} />
                  ))}
                </Pie>
                <Legend
                  formatter={(v) => (
                    <span style={{ color: T.muted, fontSize: 12 }}>{v}</span>
                  )}
                />
                <Tooltip {...TTP} />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* Charts Row 3 */}
      <div className="grid-2" style={{ marginBottom: 14 }}>
        <Card accent={T.amber}>
          <CardBody>
            <SectionLabel accent={T.amber}>Shelter Occupancy</SectionLabel>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={shelterOcc} margin={{ left: -10 }}>
                <XAxis
                  dataKey="name"
                  tick={AXIS_TICK}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />
                <Tooltip {...TTP} />
                <Bar
                  dataKey="occupied"
                  fill={T.orange}
                  stackId="s"
                  name="Occupied"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="available"
                  fill={T.green}
                  stackId="s"
                  name="Available"
                  radius={[4, 4, 0, 0]}
                />
                <Legend
                  formatter={(v) => (
                    <span style={{ color: T.muted, fontSize: 12 }}>{v}</span>
                  )}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card accent={T.cyan}>
          <CardBody>
            <SectionLabel accent={T.cyan}>Top Resources Available</SectionLabel>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={resData} layout="vertical" margin={{ left: 20 }}>
                <XAxis
                  type="number"
                  tick={AXIS_TICK}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ ...AXIS_TICK, fontSize: 10 }}
                  width={90}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip {...TTP} />
                <Bar dataKey="qty" fill={T.cyan} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* Recent Disasters quick table */}
      <Card accent={T.red}>
        <CardBody>
          <SectionLabel accent={T.red}>
            Active Disasters · Quick View
          </SectionLabel>
          <DataTable
            rows={disasters}
            perPage={6}
            columns={[
              {
                label: "Type",
                key: "disaster_type",
                sortKey: "disaster_type",
                render: (r) => (
                  <span style={{ fontWeight: 600 }}>{r.disaster_type}</span>
                ),
              },
              { label: "Location", key: "location", sortKey: "location" },
              {
                label: "Date",
                key: "disaster_date",
                render: (r) => (
                  <span
                    className="mono"
                    style={{ fontSize: 12, color: T.muted }}
                  >
                    {r.disaster_date?.slice(0, 10)}
                  </span>
                ),
              },
              {
                label: "Severity",
                render: (r) => (
                  <Badge
                    text={r.severity_level}
                    color={T[r.severity_level] || T.muted}
                  />
                ),
              },
              {
                label: "Victims",
                render: (r) => (
                  <MonoBadge
                    text={
                      victims.filter((v) => v.disaster_id === r.disaster_id)
                        .length
                    }
                    color={T.orange}
                  />
                ),
              },
              {
                label: "Donations",
                render: (r) => (
                  <span
                    style={{ color: T.green, fontWeight: 600, fontSize: 12 }}
                  >
                    ₹
                    {donations
                      .filter((d) => d.disaster_id === r.disaster_id)
                      .reduce((s, x) => s + (x.amount || 0), 0)
                      .toLocaleString("en-IN")}
                  </span>
                ),
              },
            ]}
          />
        </CardBody>
      </Card>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  PAGE: ANALYTICS
// ════════════════════════════════════════════════════════════════════

function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/analytics`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div>
        <PageTitle icon="◉" title="Analytics" accent={T.purple} />
        <Spinner />
      </div>
    );
  if (!data)
    return (
      <div>
        <PageTitle icon="◉" title="Analytics" accent={T.purple} />
        <div
          style={{
            background: `${T.red}12`,
            border: `1px solid ${T.red}33`,
            borderRadius: 10,
            padding: 20,
            color: "#fca5a5",
            fontSize: 14,
          }}
        >
          ⚠ Could not connect to backend. Make sure the Flask API at {API} is
          running.
        </div>
      </div>
    );

  const {
    disaster_summary = [],
    shelter_occupancy = [],
    resource_availability = [],
    donation_by_disaster = [],
    team_summary = [],
  } = data;

  const topDonors = donation_by_disaster
    .sort((a, b) => b.total_amount - a.total_amount)
    .slice(0, 7);

  return (
    <div className="fade-up">
      <PageTitle
        icon="◉"
        title="Analytics Dashboard"
        accent={T.purple}
        subtitle="Oracle VIEWs · PL/SQL Functions · Aggregated Insights"
      />

      {/* Disaster Summary View */}
      <Card accent={T.purple} style={{ marginBottom: 14 }}>
        <CardBody>
          <SectionLabel accent={T.purple}>
            Disaster Summary View (Oracle VIEW)
          </SectionLabel>
          <DataTable
            rows={disaster_summary}
            onExport={() => exportCSV(disaster_summary, "disaster_summary.csv")}
            columns={[
              {
                label: "Disaster",
                key: "disaster_type",
                sortKey: "disaster_type",
              },
              { label: "Location", key: "location", sortKey: "location" },
              {
                label: "Severity",
                render: (r) => (
                  <Badge
                    text={r.severity_level}
                    color={T[r.severity_level] || T.muted}
                  />
                ),
              },
              {
                label: "Victims",
                key: "total_victims",
                sortKey: "total_victims",
                render: (r) => (
                  <MonoBadge text={r.total_victims} color={T.orange} />
                ),
              },
              {
                label: "Teams",
                key: "total_teams",
                sortKey: "total_teams",
                render: (r) => (
                  <MonoBadge text={r.total_teams} color={T.blue} />
                ),
              },
              {
                label: "Donations",
                key: "total_donations",
                sortKey: "total_donations",
                render: (r) => (
                  <span style={{ color: T.green, fontWeight: 600 }}>
                    ₹{Number(r.total_donations).toLocaleString("en-IN")}
                  </span>
                ),
              },
            ]}
          />
        </CardBody>
      </Card>

      {/* Charts */}
      <div className="grid-2" style={{ marginBottom: 14 }}>
        <Card accent={T.green}>
          <CardBody>
            <SectionLabel accent={T.green}>Donations by Disaster</SectionLabel>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topDonors} margin={{ left: 10 }}>
                <XAxis
                  dataKey="label"
                  tick={{ ...AXIS_TICK, fontSize: 10 }}
                  tickFormatter={(v) => v.slice(0, 10)}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={AXIS_TICK}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  {...TTP}
                  formatter={(v) => [`₹${Number(v).toLocaleString("en-IN")}`]}
                />
                <Bar
                  dataKey="total_amount"
                  fill={T.green}
                  radius={[4, 4, 0, 0]}
                  name="Total Donated"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
        <Card accent={T.cyan}>
          <CardBody>
            <SectionLabel accent={T.cyan}>
              Teams & Volunteers per Disaster
            </SectionLabel>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={team_summary} margin={{ left: -10 }}>
                <XAxis
                  dataKey="label"
                  tick={{ ...AXIS_TICK, fontSize: 10 }}
                  tickFormatter={(v) => v.slice(0, 10)}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />
                <Tooltip {...TTP} />
                <Bar
                  dataKey="team_count"
                  fill={T.blue}
                  radius={[4, 4, 0, 0]}
                  name="Teams"
                />
                <Bar
                  dataKey="total_volunteers"
                  fill={T.purple}
                  radius={[4, 4, 0, 0]}
                  name="Volunteers"
                />
                <Legend
                  formatter={(v) => (
                    <span style={{ color: T.muted, fontSize: 12 }}>{v}</span>
                  )}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* Shelter Occupancy */}
      <Card accent={T.amber} style={{ marginBottom: 14 }}>
        <CardBody>
          <SectionLabel accent={T.amber}>
            Shelter Occupancy View (Oracle VIEW)
          </SectionLabel>
          <div className="grid-2">
            <div>
              <DataTable
                rows={shelter_occupancy}
                onExport={() =>
                  exportCSV(shelter_occupancy, "shelter_occupancy.csv")
                }
                columns={[
                  { label: "Shelter", key: "shelter_name" },
                  { label: "Capacity", key: "capacity" },
                  {
                    label: "Occupied",
                    key: "current_occupancy",
                    render: (r) => (
                      <MonoBadge text={r.current_occupancy} color={T.orange} />
                    ),
                  },
                  {
                    label: "Free",
                    key: "available_slots",
                    render: (r) => (
                      <MonoBadge text={r.available_slots} color={T.green} />
                    ),
                  },
                  {
                    label: "Occupancy",
                    render: (r) => (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <div className="progress-bar" style={{ width: 80 }}>
                          <div
                            className="progress-fill"
                            style={{
                              width: `${Math.min(r.occupancy_pct, 100)}%`,
                              background:
                                r.occupancy_pct > 90
                                  ? T.red
                                  : r.occupancy_pct > 60
                                    ? T.amber
                                    : T.green,
                            }}
                          />
                        </div>
                        <span
                          className="mono"
                          style={{ fontSize: 11, color: T.muted }}
                        >
                          {r.occupancy_pct}%
                        </span>
                      </div>
                    ),
                  },
                ]}
              />
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={shelter_occupancy} margin={{ left: 0 }}>
                <XAxis
                  dataKey="shelter_name"
                  tick={{ ...AXIS_TICK, fontSize: 9 }}
                  tickFormatter={(v) => v.slice(0, 8)}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />
                <Tooltip {...TTP} />
                <Bar
                  dataKey="current_occupancy"
                  fill={T.orange}
                  stackId="s"
                  name="Occupied"
                />
                <Bar
                  dataKey="available_slots"
                  fill={T.green}
                  stackId="s"
                  name="Available"
                  radius={[4, 4, 0, 0]}
                />
                <Legend
                  formatter={(v) => (
                    <span style={{ color: T.muted, fontSize: 12 }}>{v}</span>
                  )}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      {/* Resource Availability View */}
      <Card accent={T.cyan}>
        <CardBody>
          <SectionLabel accent={T.cyan}>
            Resource Availability View (Oracle VIEW)
          </SectionLabel>
          <DataTable
            rows={resource_availability}
            onExport={() => exportCSV(resource_availability, "resources.csv")}
            columns={[
              {
                label: "Resource",
                key: "resource_type",
                sortKey: "resource_type",
              },
              { label: "Disaster", key: "disaster_type" },
              { label: "Location", key: "location" },
              {
                label: "Qty Left",
                key: "quantity_available",
                sortKey: "quantity_available",
                render: (r) => (
                  <span
                    className="mono"
                    style={{
                      fontWeight: 700,
                      color: r.quantity_available < 100 ? T.red : T.green,
                    }}
                  >
                    {r.quantity_available}
                  </span>
                ),
              },
              {
                label: "Status",
                render: (r) => (
                  <Badge
                    text={r.stock_status}
                    color={
                      r.stock_status === "Out of Stock"
                        ? T.red
                        : r.stock_status === "Low"
                          ? T.orange
                          : r.stock_status === "Moderate"
                            ? T.amber
                            : T.green
                    }
                  />
                ),
              },
            ]}
          />
        </CardBody>
      </Card>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  PAGE: DISASTERS
// ════════════════════════════════════════════════════════════════════

function DisastersPage({ toast }) {
  const { data, loading, refresh } = useFetch("disasters");
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState("");
  const [sevFil, setSevFil] = useState("");
  const [typeFil, setTypeFil] = useState("");
  const [form, setForm] = useState({
    id: "",
    type: "",
    location: "",
    date: "",
    severity: "",
  });
  const [submitting, setSub] = useState(false);
  const hc = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const types = [...new Set(data.map((d) => d.disaster_type).filter(Boolean))];

  const rows = data.filter(
    (d) =>
      (!search ||
        `${d.disaster_type} ${d.location}`
          .toLowerCase()
          .includes(search.toLowerCase())) &&
      (!sevFil || d.severity_level === sevFil) &&
      (!typeFil || d.disaster_type === typeFil),
  );

  const submit = async () => {
    if (
      !form.id ||
      !form.type ||
      !form.location ||
      !form.date ||
      !form.severity
    ) {
      toast("Fill all fields", "error");
      return;
    }
    setSub(true);
    const r = await fetch(`${API}/add_disaster`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const d = await r.json();
    setSub(false);
    if (d.error) {
      toast(d.error, "error");
      return;
    }
    toast(`Disaster #${form.id} registered`);
    setModal(false);
    setForm({ id: "", type: "", location: "", date: "", severity: "" });
    refresh();
  };

  const del = async (id) => {
    if (
      !window.confirm(
        `Delete Disaster #${id}? All linked data (victims, teams, resources, donations) will be deleted.`,
      )
    )
      return;
    const r = await fetch(`${API}/delete_disaster/${id}`, { method: "DELETE" });
    const d = await r.json();
    toast(d.message || d.error, d.error ? "error" : "success");
    refresh();
  };

  const critCount = data.filter((d) => d.severity_level === "Critical").length;
  const highCount = data.filter((d) => d.severity_level === "High").length;

  return (
    <div className="fade-up">
      <PageTitle
        icon="⚡"
        title="Disasters"
        accent={T.red}
        subtitle="Register, monitor and manage all active disaster events"
      />

      <div className="auto-fit-180" style={{ marginBottom: 20 }}>
        <StatCard
          label="Total Disasters"
          value={data.length}
          accent={T.blue}
          icon="⚡"
        />
        <StatCard
          label="Critical"
          value={critCount}
          accent={T.red}
          icon="🔴"
          glow="stat-glow-red"
        />
        <StatCard
          label="High Severity"
          value={highCount}
          accent={T.orange}
          icon="🟠"
        />
        <StatCard
          label="States Affected"
          value={
            [...new Set(data.map((d) => d.location).filter(Boolean))].length
          }
          accent={T.purple}
          icon="◈"
        />
      </div>

      <Card>
        <CardBody>
          <TopBar
            children={[
              <SearchInput
                key="s"
                value={search}
                onChange={setSearch}
                placeholder="Search type / location…"
              />,
              <FilterSelect
                key="sev"
                value={sevFil}
                onChange={setSevFil}
                placeholder="All Severities"
                options={["Critical", "High", "Medium", "Low"].map((s) => ({
                  value: s,
                  label: s,
                }))}
              />,
              <FilterSelect
                key="typ"
                value={typeFil}
                onChange={setTypeFil}
                placeholder="All Types"
                options={types.map((t) => ({ value: t, label: t }))}
              />,
            ]}
            extra={[
              <ActionBtn
                key="a"
                onClick={() => setModal(true)}
                color={T.red}
                icon="⚡"
              >
                Register Disaster
              </ActionBtn>,
            ]}
          />
          <DataTable
            loading={loading}
            rows={rows}
            emptyIcon="⚡"
            emptyText="No disasters found"
            onExport={() => exportCSV(rows, "disasters.csv")}
            columns={[
              {
                label: "ID",
                key: "disaster_id",
                sortKey: "disaster_id",
                render: (r) => <MonoBadge text={`#${r.disaster_id}`} />,
              },
              {
                label: "Type",
                key: "disaster_type",
                sortKey: "disaster_type",
                render: (r) => (
                  <span style={{ fontWeight: 600 }}>{r.disaster_type}</span>
                ),
              },
              { label: "Location", key: "location", sortKey: "location" },
              {
                label: "Date",
                key: "disaster_date",
                sortKey: "disaster_date",
                render: (r) => (
                  <span
                    className="mono"
                    style={{ fontSize: 12, color: T.muted }}
                  >
                    {r.disaster_date?.slice(0, 10)}
                  </span>
                ),
              },
              {
                label: "Severity",
                render: (r) => (
                  <Badge
                    text={r.severity_level}
                    color={T[r.severity_level] || T.muted}
                  />
                ),
              },
              {
                label: "Actions",
                render: (r) => (
                  <ActionBtn
                    size="sm"
                    onClick={() => del(r.disaster_id)}
                    color={T.red}
                    outline
                    icon="✕"
                  >
                    Delete
                  </ActionBtn>
                ),
              },
            ]}
          />
        </CardBody>
      </Card>

      {modal && (
        <Modal
          title="Register New Disaster"
          onClose={() => setModal(false)}
          accent={T.red}
        >
          <FRow>
            <FInput
              label="Disaster ID"
              name="id"
              value={form.id}
              onChange={hc}
              placeholder="e.g. 11"
              required
              mono
            />
            <FInput
              label="Date"
              name="date"
              value={form.date}
              onChange={hc}
              type="date"
              required
            />
          </FRow>
          <FInput
            label="Disaster Type"
            name="type"
            value={form.type}
            onChange={hc}
            placeholder="Flood, Earthquake, Cyclone…"
            required
          />
          <FInput
            label="Location"
            name="location"
            value={form.location}
            onChange={hc}
            placeholder="e.g. Kerala, India"
            required
          />
          <FSelect
            label="Severity Level"
            name="severity"
            value={form.severity}
            onChange={hc}
            required
            options={["Low", "Medium", "High", "Critical"].map((s) => ({
              value: s,
              label: s,
            }))}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <ActionBtn
              onClick={submit}
              color={T.red}
              loading={submitting}
              icon="⚡"
            >
              Register
            </ActionBtn>
            <ActionBtn
              onClick={() => setModal(false)}
              color={T.border2}
              outline
            >
              Cancel
            </ActionBtn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  PAGE: VICTIMS
// ════════════════════════════════════════════════════════════════════

function VictimsPage({ toast }) {
  const { data: victims, loading, refresh } = useFetch("victims");
  const { data: disasters } = useFetch("disasters");
  const { data: shelters } = useFetch("shelters");
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState("");
  const [hlthFil, setHlthFil] = useState("");
  const [genFil, setGenFil] = useState("");
  const [submitting, setSub] = useState(false);
  const [form, setForm] = useState({
    id: "",
    first_name: "",
    last_name: "",
    age: "",
    gender: "",
    health_status: "",
    shelter_id: "",
    disaster_id: "",
  });
  const hc = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const rows = victims.filter(
    (v) =>
      (!search ||
        `${v.victim_first_name} ${v.victim_last_name}`
          .toLowerCase()
          .includes(search.toLowerCase())) &&
      (!hlthFil || v.health_status === hlthFil) &&
      (!genFil || v.gender === genFil),
  );

  const add = async () => {
    const req = [
      "id",
      "first_name",
      "last_name",
      "age",
      "gender",
      "health_status",
      "shelter_id",
      "disaster_id",
    ];
    if (req.some((k) => !form[k])) {
      toast("Fill all required fields", "error");
      return;
    }
    setSub(true);
    const r = await fetch(`${API}/add_victim`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const d = await r.json();
    setSub(false);
    if (d.error) {
      toast(d.error, "error");
      return;
    }
    toast(`Victim ${form.first_name} ${form.last_name} registered`);
    setModal(false);
    setForm({
      id: "",
      first_name: "",
      last_name: "",
      age: "",
      gender: "",
      health_status: "",
      shelter_id: "",
      disaster_id: "",
    });
    refresh();
  };

  const del = async (id, name) => {
    if (!window.confirm(`Remove victim ${name} (ID: ${id})?`)) return;
    const r = await fetch(`${API}/delete_victim`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const d = await r.json();
    toast(d.message || d.error, d.error ? "error" : "success");
    refresh();
  };

  const critCount = victims.filter(
    (v) => v.health_status === "Critical",
  ).length;
  const injCount = victims.filter((v) => v.health_status === "Injured").length;
  const stabCount = victims.filter((v) => v.health_status === "Stable").length;

  return (
    <div className="fade-up">
      <PageTitle
        icon="⬡"
        title="Victims Registry"
        accent={T.orange}
        subtitle="Track and manage all disaster victims, their health status and shelter assignments"
      />

      <div className="auto-fit-180" style={{ marginBottom: 20 }}>
        <StatCard
          label="Total Victims"
          value={victims.length}
          accent={T.orange}
          icon="⬡"
        />
        <StatCard
          label="Critical"
          value={critCount}
          accent={T.red}
          icon="🔴"
          glow="stat-glow-red"
        />
        <StatCard
          label="Injured"
          value={injCount}
          accent={T.orange}
          icon="🟠"
        />
        <StatCard
          label="Stable"
          value={stabCount}
          accent={T.green}
          icon="🟢"
          glow="stat-glow-green"
        />
      </div>

      <Card>
        <CardBody>
          <TopBar
            children={[
              <SearchInput
                key="s"
                value={search}
                onChange={setSearch}
                placeholder="Search by name…"
              />,
              <FilterSelect
                key="h"
                value={hlthFil}
                onChange={setHlthFil}
                placeholder="All Health Status"
                options={["Critical", "Injured", "Stable"].map((s) => ({
                  value: s,
                  label: s,
                }))}
              />,
              <FilterSelect
                key="g"
                value={genFil}
                onChange={setGenFil}
                placeholder="All Genders"
                options={["Male", "Female", "Other"].map((s) => ({
                  value: s,
                  label: s,
                }))}
              />,
            ]}
            extra={[
              <ActionBtn
                key="a"
                onClick={() => setModal(true)}
                color={T.orange}
                icon="⬡"
              >
                Register Victim
              </ActionBtn>,
            ]}
          />
          <DataTable
            loading={loading}
            rows={rows}
            emptyIcon="⬡"
            emptyText="No victims found"
            onExport={() => exportCSV(rows, "victims.csv")}
            columns={[
              {
                label: "ID",
                render: (r) => <MonoBadge text={`#${r.victim_id}`} />,
              },
              {
                label: "Name",
                render: (r) => (
                  <span style={{ fontWeight: 600 }}>
                    {r.victim_first_name} {r.victim_last_name}
                  </span>
                ),
              },
              {
                label: "Age",
                key: "age",
                sortKey: "age",
                render: (r) => <span className="mono">{r.age}</span>,
              },
              { label: "Gender", key: "gender", sortKey: "gender" },
              {
                label: "Health",
                render: (r) => (
                  <Badge
                    text={r.health_status}
                    color={T[r.health_status] || T.muted}
                  />
                ),
              },
              {
                label: "Shelter",
                render: (r) => (
                  <MonoBadge text={`S${r.shelter_id}`} color={T.amber} />
                ),
              },
              {
                label: "Disaster",
                render: (r) => (
                  <MonoBadge text={`D${r.disaster_id}`} color={T.red} />
                ),
              },
              {
                label: "Actions",
                render: (r) => (
                  <ActionBtn
                    size="sm"
                    onClick={() =>
                      del(
                        r.victim_id,
                        `${r.victim_first_name} ${r.victim_last_name}`,
                      )
                    }
                    color={T.red}
                    outline
                    icon="✕"
                  >
                    Remove
                  </ActionBtn>
                ),
              },
            ]}
          />
        </CardBody>
      </Card>

      {modal && (
        <Modal
          title="Register Victim"
          onClose={() => setModal(false)}
          accent={T.orange}
        >
          <FRow>
            <FInput
              label="Victim ID"
              name="id"
              value={form.id}
              onChange={hc}
              placeholder="e.g. 151"
              required
              mono
            />
            <FInput
              label="Age"
              name="age"
              value={form.age}
              onChange={hc}
              placeholder="e.g. 32"
              type="number"
              required
            />
          </FRow>
          <FRow>
            <FInput
              label="First Name"
              name="first_name"
              value={form.first_name}
              onChange={hc}
              placeholder="First name"
              required
            />
            <FInput
              label="Last Name"
              name="last_name"
              value={form.last_name}
              onChange={hc}
              placeholder="Last name"
              required
            />
          </FRow>
          <FRow>
            <FSelect
              label="Gender"
              name="gender"
              value={form.gender}
              onChange={hc}
              required
              options={["Male", "Female", "Other"].map((g) => ({
                value: g,
                label: g,
              }))}
            />
            <FSelect
              label="Health Status"
              name="health_status"
              value={form.health_status}
              onChange={hc}
              required
              options={["Stable", "Injured", "Critical"].map((h) => ({
                value: h,
                label: h,
              }))}
            />
          </FRow>
          <FSelect
            label="Assigned Shelter"
            name="shelter_id"
            value={form.shelter_id}
            onChange={hc}
            required
            options={shelters.map((s) => ({
              value: s.shelter_id,
              label: `#${s.shelter_id} — ${s.shelter_name} (${s.location}) · Cap: ${s.capacity}`,
            }))}
          />
          <FSelect
            label="Linked Disaster"
            name="disaster_id"
            value={form.disaster_id}
            onChange={hc}
            required
            options={disasters.map((d) => ({
              value: d.disaster_id,
              label: `#${d.disaster_id} — ${d.disaster_type}, ${d.location} [${d.severity_level}]`,
            }))}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <ActionBtn
              onClick={add}
              color={T.orange}
              loading={submitting}
              icon="⬡"
            >
              Register
            </ActionBtn>
            <ActionBtn
              onClick={() => setModal(false)}
              color={T.border2}
              outline
            >
              Cancel
            </ActionBtn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  PAGE: RESOURCES
// ════════════════════════════════════════════════════════════════════

function ResourcesPage({ toast }) {
  const { data, loading, refresh } = useFetch("resources");
  const [search, setSearch] = useState("");
  const [statFil, setStatFil] = useState("");
  const [rid, setRid] = useState("");
  const [qty, setQty] = useState("");
  const [upd, setUpd] = useState(false);

  const getStatus = (qty) =>
    qty === 0
      ? "Out of Stock"
      : qty < 100
        ? "Low"
        : qty < 500
          ? "Moderate"
          : "Sufficient";
  const getStatusColor = (s) =>
    s === "Out of Stock"
      ? T.red
      : s === "Low"
        ? T.orange
        : s === "Moderate"
          ? T.amber
          : T.green;

  const enriched = data.map((r) => ({
    ...r,
    status: getStatus(r.quantity_available),
  }));

  const rows = enriched.filter(
    (r) =>
      (!search ||
        r.resource_type?.toLowerCase().includes(search.toLowerCase())) &&
      (!statFil || r.status === statFil),
  );

  const totalQty = data.reduce((s, r) => s + (r.quantity_available || 0), 0);
  const lowCount = data.filter((r) => r.quantity_available < 100).length;
  const outCount = data.filter((r) => r.quantity_available === 0).length;

  const update = async () => {
    if (!rid || !qty) {
      toast("Enter Resource ID and Quantity", "error");
      return;
    }
    setUpd(true);
    const r = await fetch(`${API}/update_resource`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource_id: rid, qty }),
    });
    const d = await r.json();
    setUpd(false);
    toast(d.message || d.error, d.error ? "error" : "success");
    if (!d.error) {
      setRid("");
      setQty("");
      refresh();
    }
  };

  return (
    <div className="fade-up">
      <PageTitle
        icon="◧"
        title="Resource Management"
        accent={T.cyan}
        subtitle="Monitor and replenish disaster relief resources and supplies"
      />

      <div className="auto-fit-180" style={{ marginBottom: 20 }}>
        <StatCard
          label="Resource Types"
          value={data.length}
          accent={T.cyan}
          icon="◧"
        />
        <StatCard
          label="Total Units"
          value={totalQty.toLocaleString()}
          accent={T.green}
          icon="✓"
        />
        <StatCard
          label="Low Stock"
          value={lowCount}
          accent={T.orange}
          icon="⚠"
          glow="stat-glow-orange"
        />
        <StatCard
          label="Out of Stock"
          value={outCount}
          accent={T.red}
          icon="✕"
          glow="stat-glow-red"
        />
      </div>

      {/* Add Stock Panel */}
      <Card accent={T.cyan} style={{ marginBottom: 14 }}>
        <CardBody>
          <SectionLabel accent={T.cyan}>
            Add Stock · calls update_resource_proc()
          </SectionLabel>
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "flex-end",
              flexWrap: "wrap",
            }}
          >
            <div>
              <FLabel>Resource ID</FLabel>
              <input
                value={rid}
                onChange={(e) => setRid(e.target.value)}
                placeholder="e.g. 1"
                className="mono"
                style={{
                  background: "#0d1117",
                  border: `1px solid ${T.border}`,
                  borderRadius: 8,
                  padding: "9px 14px",
                  color: T.text,
                  fontSize: 13,
                  width: 120,
                }}
              />
            </div>
            <div>
              <FLabel>Quantity to Add</FLabel>
              <input
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                placeholder="e.g. 500"
                type="number"
                style={{
                  background: "#0d1117",
                  border: `1px solid ${T.border}`,
                  borderRadius: 8,
                  padding: "9px 14px",
                  color: T.text,
                  fontSize: 13,
                  width: 130,
                }}
              />
            </div>
            <ActionBtn onClick={update} color={T.cyan} loading={upd} icon="↑">
              Replenish Stock
            </ActionBtn>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <TopBar
            children={[
              <SearchInput
                key="s"
                value={search}
                onChange={setSearch}
                placeholder="Search resource type…"
              />,
              <FilterSelect
                key="st"
                value={statFil}
                onChange={setStatFil}
                placeholder="All Status"
                options={["Sufficient", "Moderate", "Low", "Out of Stock"].map(
                  (s) => ({ value: s, label: s }),
                )}
              />,
            ]}
            extra={[
              <ActionBtn
                key="e"
                size="sm"
                onClick={() => exportCSV(enriched, "resources.csv")}
                color={T.border2}
                outline
                icon="↓"
              >
                CSV
              </ActionBtn>,
            ]}
          />
          <DataTable
            loading={loading}
            rows={rows}
            emptyIcon="◧"
            emptyText="No resources found"
            columns={[
              {
                label: "ID",
                render: (r) => <MonoBadge text={`#${r.resource_id}`} />,
              },
              {
                label: "Type",
                key: "resource_type",
                sortKey: "resource_type",
                render: (r) => (
                  <span style={{ fontWeight: 600 }}>{r.resource_type}</span>
                ),
              },
              {
                label: "Available",
                key: "quantity_available",
                sortKey: "quantity_available",
                render: (r) => (
                  <span
                    className="mono"
                    style={{
                      fontWeight: 700,
                      color:
                        r.quantity_available < 100
                          ? T.red
                          : r.quantity_available < 500
                            ? T.amber
                            : T.green,
                    }}
                  >
                    {r.quantity_available}
                  </span>
                ),
              },
              {
                label: "Status",
                render: (r) => (
                  <Badge text={r.status} color={getStatusColor(r.status)} />
                ),
              },
              {
                label: "Stock Bar",
                render: (r) => (
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <div className="progress-bar" style={{ width: 100 }}>
                      <div
                        className="progress-fill"
                        style={{
                          width: `${Math.min(r.quantity_available / 25, 100)}%`,
                          background: getStatusColor(r.status),
                        }}
                      />
                    </div>
                  </div>
                ),
              },
              {
                label: "Disaster",
                render: (r) => (
                  <MonoBadge text={`D${r.disaster_id}`} color={T.red} />
                ),
              },
            ]}
          />
        </CardBody>
      </Card>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  PAGE: DONATIONS
// ════════════════════════════════════════════════════════════════════

function DonationsPage({ toast }) {
  const { data, loading, refresh } = useFetch("donations");
  const { data: disasters } = useFetch("disasters");
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState("");
  const [disFil, setDisFil] = useState("");
  const [sub, setSub] = useState(false);
  const [form, setForm] = useState({
    donor_name: "",
    amount: "",
    donation_date: "",
    disaster_id: "",
  });
  const hc = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const total = data.reduce((s, d) => s + (d.amount || 0), 0);
  const corpTotal = data
    .filter((d) => d.amount >= 10000)
    .reduce((s, d) => s + (d.amount || 0), 0);
  const indivTotal = total - corpTotal;
  const avgDon = data.length ? Math.round(total / data.length) : 0;

  const rows = data.filter(
    (d) =>
      (!search || d.donor_name?.toLowerCase().includes(search.toLowerCase())) &&
      (!disFil || d.disaster_id == disFil),
  );

  const add = async () => {
    if (
      !form.donor_name ||
      !form.amount ||
      !form.donation_date ||
      !form.disaster_id
    ) {
      toast("Fill all fields", "error");
      return;
    }
    setSub(true);
    const r = await fetch(`${API}/add_donation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const d = await r.json();
    setSub(false);
    if (d.error) {
      toast(d.error, "error");
      return;
    }
    toast(
      `Donation from ${form.donor_name} recorded — ₹${Number(form.amount).toLocaleString("en-IN")}`,
    );
    setModal(false);
    setForm({ donor_name: "", amount: "", donation_date: "", disaster_id: "" });
    refresh();
  };

  // Monthly trend (simulated from existing data dates)
  const monthMap = {};
  data.forEach((d) => {
    const m = d.donation_date?.slice(0, 7) || "Unknown";
    monthMap[m] = (monthMap[m] || 0) + (d.amount || 0);
  });
  const trendData = Object.entries(monthMap)
    .sort()
    .map(([m, v]) => ({ month: m.slice(5), amount: v }));

  return (
    <div className="fade-up">
      <PageTitle
        icon="◈"
        title="Donations"
        accent={T.green}
        subtitle="Track all donations, corporate and individual, across disaster events"
      />

      <div className="auto-fit-180" style={{ marginBottom: 20 }}>
        <StatCard
          label="Total Raised"
          value={`₹${(total / 100000).toFixed(2)}L`}
          accent={T.green}
          icon="◈"
          glow="stat-glow-green"
        />
        <StatCard
          label="Total Donors"
          value={data.length}
          accent={T.blue}
          icon="⬡"
        />
        <StatCard
          label="Corporate"
          value={`₹${(corpTotal / 100000).toFixed(1)}L`}
          accent={T.purple}
          icon="⬢"
        />
        <StatCard
          label="Individual"
          value={`₹${(indivTotal / 1000).toFixed(1)}K`}
          accent={T.amber}
          icon="◎"
        />
        <StatCard
          label="Average Donation"
          value={`₹${avgDon.toLocaleString("en-IN")}`}
          accent={T.cyan}
          icon="◉"
        />
      </div>

      {/* Trend chart */}
      {trendData.length > 1 && (
        <Card accent={T.green} style={{ marginBottom: 14 }}>
          <CardBody>
            <SectionLabel accent={T.green}>
              Monthly Donation Trend (₹)
            </SectionLabel>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={trendData} margin={{ left: 10 }}>
                <defs>
                  <linearGradient id="donGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={T.green} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={T.green} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  tick={AXIS_TICK}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={AXIS_TICK}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  {...TTP}
                  formatter={(v) => [`₹${Number(v).toLocaleString("en-IN")}`]}
                />
                <Area
                  dataKey="amount"
                  stroke={T.green}
                  strokeWidth={2}
                  fill="url(#donGrad)"
                  name="Donations"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardBody>
          <TopBar
            children={[
              <SearchInput
                key="s"
                value={search}
                onChange={setSearch}
                placeholder="Search donor name…"
              />,
              <FilterSelect
                key="d"
                value={disFil}
                onChange={(v) => setDisFil(v)}
                placeholder="All Disasters"
                options={disasters.map((d) => ({
                  value: d.disaster_id,
                  label: `#${d.disaster_id} — ${d.disaster_type}`,
                }))}
              />,
            ]}
            extra={[
              <ActionBtn
                key="a"
                onClick={() => setModal(true)}
                color={T.green}
                icon="◈"
              >
                Record Donation
              </ActionBtn>,
            ]}
          />
          <DataTable
            loading={loading}
            rows={rows}
            emptyIcon="◈"
            emptyText="No donations recorded"
            onExport={() => exportCSV(rows, "donations.csv")}
            columns={[
              {
                label: "ID",
                render: (r) => <MonoBadge text={`#${r.donation_id}`} />,
              },
              {
                label: "Donor",
                key: "donor_name",
                sortKey: "donor_name",
                render: (r) => (
                  <span style={{ fontWeight: 600 }}>{r.donor_name}</span>
                ),
              },
              {
                label: "Amount",
                key: "amount",
                sortKey: "amount",
                render: (r) => (
                  <span
                    style={{
                      color: T.green,
                      fontWeight: 700,
                      fontFamily: "'JetBrains Mono',monospace",
                    }}
                  >
                    ₹{Number(r.amount).toLocaleString("en-IN")}
                  </span>
                ),
              },
              {
                label: "Date",
                key: "donation_date",
                render: (r) => (
                  <span
                    className="mono"
                    style={{ color: T.muted, fontSize: 12 }}
                  >
                    {r.donation_date?.slice(0, 10)}
                  </span>
                ),
              },
              {
                label: "Disaster",
                render: (r) => {
                  const disasterMatch = disasters.find(
                    (d) => d.disaster_id === r.disaster_id,
                  );
                  return disasterMatch ? (
                    <span>
                      {disasterMatch.disaster_type},{" "}
                      <span style={{ color: T.muted }}>
                        {disasterMatch.location}
                      </span>
                    </span>
                  ) : (
                    <MonoBadge text={`D${r.disaster_id}`} color={T.red} />
                  );
                },
              },
              {
                label: "Type",
                render: (r) => (
                  <Badge
                    text={r.amount >= 10000 ? "Corporate" : "Individual"}
                    color={r.amount >= 10000 ? T.purple : T.amber}
                  />
                ),
              },
            ]}
          />
        </CardBody>
      </Card>

      {modal && (
        <Modal
          title="Record Donation"
          onClose={() => setModal(false)}
          accent={T.green}
        >
          <FInput
            label="Donor Name"
            name="donor_name"
            value={form.donor_name}
            onChange={hc}
            placeholder="e.g. Tata Trust / Rahul Sharma"
            required
          />
          <FRow>
            <FInput
              label="Amount (₹)"
              name="amount"
              value={form.amount}
              onChange={hc}
              placeholder="e.g. 500000"
              type="number"
              required
            />
            <FInput
              label="Donation Date"
              name="donation_date"
              value={form.donation_date}
              onChange={hc}
              type="date"
              required
            />
          </FRow>
          <FSelect
            label="For Disaster"
            name="disaster_id"
            value={form.disaster_id}
            onChange={hc}
            required
            options={disasters.map((d) => ({
              value: d.disaster_id,
              label: `#${d.disaster_id} — ${d.disaster_type}, ${d.location} [${d.severity_level}]`,
            }))}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <ActionBtn onClick={add} color={T.green} loading={sub} icon="◈">
              Record
            </ActionBtn>
            <ActionBtn
              onClick={() => setModal(false)}
              color={T.border2}
              outline
            >
              Cancel
            </ActionBtn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  PAGE: VOLUNTEERS
// ════════════════════════════════════════════════════════════════════

function VolunteersPage({ toast }) {
  const { data, loading, refresh } = useFetch("volunteers");
  const { data: teams } = useFetch("rescue_teams");
  const { data: disasters } = useFetch("disasters");
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState("");
  const [teamFil, setTeamFil] = useState("");
  const [sub, setSub] = useState(false);
  const [form, setForm] = useState({
    volunteer_name: "",
    contact_no: "",
    team_id: "",
  });
  const hc = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const rows = data.filter(
    (v) =>
      (!search ||
        v.volunteer_name?.toLowerCase().includes(search.toLowerCase())) &&
      (!teamFil || v.team_id == teamFil),
  );

  const add = async () => {
    if (!form.volunteer_name || !form.contact_no || !form.team_id) {
      toast("Fill all required fields", "error");
      return;
    }
    setSub(true);
    const r = await fetch(`${API}/add_volunteer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const d = await r.json();
    setSub(false);
    if (d.error) {
      toast(d.error, "error");
      return;
    }
    toast(`${form.volunteer_name} registered as volunteer`);
    setModal(false);
    setForm({ volunteer_name: "", contact_no: "", team_id: "" });
    refresh();
  };

  const teamCounts = teams
    .map((t) => ({
      name: t.team_name.slice(0, 12),
      count: data.filter((v) => v.team_id === t.team_id).length,
    }))
    .filter((t) => t.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return (
    <div className="fade-up">
      <PageTitle
        icon="◎"
        title="Volunteers"
        accent={T.purple}
        subtitle="Manage volunteer registrations and team assignments"
      />

      <div className="auto-fit-180" style={{ marginBottom: 20 }}>
        <StatCard
          label="Total Volunteers"
          value={data.length}
          accent={T.purple}
          icon="◎"
          glow="stat-glow-purple"
        />
        <StatCard
          label="Active Teams"
          value={teams.length}
          accent={T.blue}
          icon="◆"
        />
        <StatCard
          label="Avg / Team"
          value={teams.length ? Math.round(data.length / teams.length) : "—"}
          accent={T.cyan}
          icon="◉"
        />
        <StatCard
          label="Unassigned"
          value={data.filter((v) => !v.team_id).length}
          accent={T.amber}
          icon="◎"
        />
      </div>

      <div className="grid-2" style={{ marginBottom: 14 }}>
        <Card accent={T.purple}>
          <CardBody>
            <SectionLabel accent={T.purple}>Volunteers per Team</SectionLabel>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={teamCounts} margin={{ left: -10 }}>
                <XAxis
                  dataKey="name"
                  tick={{ ...AXIS_TICK, fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />
                <Tooltip {...TTP} />
                <Bar
                  dataKey="count"
                  fill={T.purple}
                  radius={[4, 4, 0, 0]}
                  name="Volunteers"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card accent={T.blue}>
          <CardBody>
            <SectionLabel accent={T.blue}>Teams Overview</SectionLabel>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                maxHeight: 200,
                overflowY: "auto",
              }}
            >
              {teams.slice(0, 8).map((t) => {
                const vols = data.filter((v) => v.team_id === t.team_id).length;
                const dis = disasters.find(
                  (d) => d.disaster_id === t.disaster_id,
                );
                return (
                  <div
                    key={t.team_id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 10px",
                      borderRadius: 8,
                      background: T.surface,
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: T.blue + "18",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                        color: T.blue,
                      }}
                    >
                      ◆
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: T.text,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {t.team_name}
                      </div>
                      <div style={{ fontSize: 11, color: T.muted }}>
                        {t.leader_name} · {dis?.disaster_type || "—"}
                      </div>
                    </div>
                    <MonoBadge text={`${vols}v`} color={T.purple} />
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardBody>
          <TopBar
            children={[
              <SearchInput
                key="s"
                value={search}
                onChange={setSearch}
                placeholder="Search volunteer name…"
              />,
              <FilterSelect
                key="t"
                value={teamFil}
                onChange={setTeamFil}
                placeholder="All Teams"
                options={teams.map((t) => ({
                  value: t.team_id,
                  label: `#${t.team_id} — ${t.team_name}`,
                }))}
              />,
            ]}
            extra={[
              <ActionBtn
                key="a"
                onClick={() => setModal(true)}
                color={T.purple}
                icon="◎"
              >
                Register Volunteer
              </ActionBtn>,
            ]}
          />
          <DataTable
            loading={loading}
            rows={rows}
            emptyIcon="◎"
            emptyText="No volunteers found"
            onExport={() => exportCSV(rows, "volunteers.csv")}
            columns={[
              {
                label: "ID",
                render: (r) => <MonoBadge text={`#${r.volunteer_id}`} />,
              },
              {
                label: "Name",
                key: "volunteer_name",
                sortKey: "volunteer_name",
                render: (r) => (
                  <span style={{ fontWeight: 600 }}>{r.volunteer_name}</span>
                ),
              },
              {
                label: "Contact",
                key: "contact_no",
                render: (r) => (
                  <span
                    className="mono"
                    style={{ color: T.muted, fontSize: 12 }}
                  >
                    {r.contact_no}
                  </span>
                ),
              },
              {
                label: "Team",
                render: (r) => {
                  const t = teams.find((t) => t.team_id === r.team_id);
                  return t ? (
                    <span style={{ color: T.blue }}>{t.team_name}</span>
                  ) : (
                    <span style={{ color: T.muted }}>Unassigned</span>
                  );
                },
              },
              {
                label: "Leader",
                render: (r) => {
                  const t = teams.find((t) => t.team_id === r.team_id);
                  return t ? (
                    <span style={{ color: T.muted, fontSize: 12 }}>
                      {t.leader_name}
                    </span>
                  ) : (
                    <span style={{ color: T.muted }}>—</span>
                  );
                },
              },
            ]}
          />
        </CardBody>
      </Card>

      {modal && (
        <Modal
          title="Register Volunteer"
          onClose={() => setModal(false)}
          accent={T.purple}
        >
          <FInput
            label="Full Name"
            name="volunteer_name"
            value={form.volunteer_name}
            onChange={hc}
            placeholder="e.g. Ravi Kumar"
            required
          />
          <FInput
            label="Contact Number"
            name="contact_no"
            value={form.contact_no}
            onChange={hc}
            placeholder="e.g. 9876512345"
            required
            mono
          />
          <FSelect
            label="Assign to Team"
            name="team_id"
            value={form.team_id}
            onChange={hc}
            required
            options={teams.map((t) => ({
              value: t.team_id,
              label: `#${t.team_id} — ${t.team_name} (Leader: ${t.leader_name})`,
            }))}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <ActionBtn onClick={add} color={T.purple} loading={sub} icon="◎">
              Register
            </ActionBtn>
            <ActionBtn
              onClick={() => setModal(false)}
              color={T.border2}
              outline
            >
              Cancel
            </ActionBtn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  PAGE: SHELTERS
// ════════════════════════════════════════════════════════════════════

function SheltersPage({ toast }) {
  const { data: shelters, loading } = useFetch("shelters");
  const { data: victims } = useFetch("victims");
  const [search, setSearch] = useState("");
  const [statFil, setStatFil] = useState("");

  const enriched = shelters.map((s) => {
    const occ = victims.filter((v) => v.shelter_id === s.shelter_id).length;
    const pct = s.capacity > 0 ? Math.round((occ / s.capacity) * 100) : 0;
    const status =
      pct >= 100
        ? "Full"
        : pct >= 80
          ? "Near Full"
          : pct >= 50
            ? "Moderate"
            : "Available";
    return { ...s, occupancy: occ, pct, available: s.capacity - occ, status };
  });

  const rows = enriched.filter(
    (s) =>
      (!search ||
        `${s.shelter_name} ${s.location}`
          .toLowerCase()
          .includes(search.toLowerCase())) &&
      (!statFil || s.status === statFil),
  );

  const totalCap = shelters.reduce((s, x) => s + x.capacity, 0);
  const totalOcc = victims.length;
  const fullCount = enriched.filter((s) => s.pct >= 100).length;

  return (
    <div className="fade-up">
      <PageTitle
        icon="⬢"
        title="Shelters"
        accent={T.amber}
        subtitle="Monitor shelter occupancy and capacity across all active relief camps"
      />

      <div className="auto-fit-180" style={{ marginBottom: 20 }}>
        <StatCard
          label="Total Shelters"
          value={shelters.length}
          accent={T.amber}
          icon="⬢"
        />
        <StatCard
          label="Total Capacity"
          value={totalCap}
          accent={T.blue}
          icon="⬡"
        />
        <StatCard
          label="Total Occupied"
          value={totalOcc}
          accent={T.orange}
          icon="◎"
        />
        <StatCard
          label="Full / Critical"
          value={fullCount}
          accent={T.red}
          icon="⚠"
          glow="stat-glow-red"
        />
        <StatCard
          label="Overall Occ %"
          value={totalCap ? Math.round((totalOcc / totalCap) * 100) + "%" : "—"}
          accent={T.green}
          icon="◉"
        />
      </div>

      {/* Shelter Cards */}
      <div className="auto-fit-260" style={{ marginBottom: 16 }}>
        {enriched.map((s) => {
          const statusColor =
            s.pct >= 100
              ? T.red
              : s.pct >= 80
                ? T.orange
                : s.pct >= 50
                  ? T.amber
                  : T.green;
          return (
            <Card
              key={s.shelter_id}
              hover
              style={{ borderTop: `2px solid ${statusColor}` }}
            >
              <CardBody>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 12,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: T.text,
                        marginBottom: 2,
                      }}
                    >
                      {s.shelter_name}
                    </div>
                    <div style={{ fontSize: 12, color: T.muted }}>
                      📍 {s.location}
                    </div>
                  </div>
                  <Badge text={s.status} color={statusColor} />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 10,
                    fontSize: 12,
                  }}
                >
                  <span>
                    <span style={{ color: T.muted }}>Occupied</span>{" "}
                    <strong style={{ color: T.orange }}>{s.occupancy}</strong>
                  </span>
                  <span>
                    <span style={{ color: T.muted }}>Free</span>{" "}
                    <strong style={{ color: T.green }}>{s.available}</strong>
                  </span>
                  <span>
                    <span style={{ color: T.muted }}>Cap</span>{" "}
                    <strong style={{ color: T.blue }}>{s.capacity}</strong>
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.min(s.pct, 100)}%`,
                      background: statusColor,
                    }}
                  />
                </div>
                <div
                  style={{
                    textAlign: "right",
                    fontSize: 11,
                    color: T.muted,
                    marginTop: 4,
                    fontFamily: "'JetBrains Mono',monospace",
                  }}
                >
                  {s.pct}%
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardBody>
          <TopBar
            children={[
              <SearchInput
                key="s"
                value={search}
                onChange={setSearch}
                placeholder="Search shelter / location…"
              />,
              <FilterSelect
                key="st"
                value={statFil}
                onChange={setStatFil}
                placeholder="All Status"
                options={["Available", "Moderate", "Near Full", "Full"].map(
                  (s) => ({ value: s, label: s }),
                )}
              />,
            ]}
            extra={[
              <ActionBtn
                key="e"
                size="sm"
                onClick={() => exportCSV(rows, "shelters.csv")}
                color={T.border2}
                outline
                icon="↓"
              >
                CSV
              </ActionBtn>,
            ]}
          />
          <DataTable
            loading={loading}
            rows={rows}
            emptyIcon="⬢"
            emptyText="No shelters found"
            columns={[
              {
                label: "ID",
                render: (r) => <MonoBadge text={`#${r.shelter_id}`} />,
              },
              {
                label: "Name",
                key: "shelter_name",
                sortKey: "shelter_name",
                render: (r) => (
                  <span style={{ fontWeight: 600 }}>{r.shelter_name}</span>
                ),
              },
              { label: "Location", key: "location", sortKey: "location" },
              {
                label: "Capacity",
                key: "capacity",
                sortKey: "capacity",
                render: (r) => <MonoBadge text={r.capacity} color={T.blue} />,
              },
              {
                label: "Occupied",
                key: "occupancy",
                sortKey: "occupancy",
                render: (r) => (
                  <MonoBadge text={r.occupancy} color={T.orange} />
                ),
              },
              {
                label: "Free Slots",
                key: "available",
                sortKey: "available",
                render: (r) => <MonoBadge text={r.available} color={T.green} />,
              },
              {
                label: "Occupancy",
                render: (r) => {
                  const c =
                    r.pct >= 100
                      ? T.red
                      : r.pct >= 80
                        ? T.orange
                        : r.pct >= 50
                          ? T.amber
                          : T.green;
                  return (
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <div className="progress-bar" style={{ width: 80 }}>
                        <div
                          className="progress-fill"
                          style={{
                            width: `${Math.min(r.pct, 100)}%`,
                            background: c,
                          }}
                        />
                      </div>
                      <span
                        className="mono"
                        style={{ fontSize: 11, color: T.muted }}
                      >
                        {r.pct}%
                      </span>
                    </div>
                  );
                },
              },
              {
                label: "Status",
                render: (r) => {
                  const c =
                    r.pct >= 100
                      ? T.red
                      : r.pct >= 80
                        ? T.orange
                        : r.pct >= 50
                          ? T.amber
                          : T.green;
                  return <Badge text={r.status} color={c} />;
                },
              },
            ]}
          />
        </CardBody>
      </Card>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  PAGE: RESCUE TEAMS
// ════════════════════════════════════════════════════════════════════

function RescueTeamsPage({ toast }) {
  const { data, loading, refresh } = useFetch("rescue_teams");
  const { data: volunteers } = useFetch("volunteers");
  const { data: disasters } = useFetch("disasters");
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState("");
  const [disFil, setDisFil] = useState("");
  const [sub, setSub] = useState(false);
  const [form, setForm] = useState({
    team_name: "",
    leader_name: "",
    disaster_id: "",
  });
  const hc = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const enriched = data.map((t) => ({
    ...t,
    volCount: volunteers.filter((v) => v.team_id === t.team_id).length,
    disaster: disasters.find((d) => d.disaster_id === t.disaster_id),
  }));

  const rows = enriched.filter(
    (t) =>
      (!search ||
        `${t.team_name} ${t.leader_name}`
          .toLowerCase()
          .includes(search.toLowerCase())) &&
      (!disFil || t.disaster_id == disFil),
  );

  const add = async () => {
    if (!form.team_name || !form.leader_name || !form.disaster_id) {
      toast("Fill all required fields", "error");
      return;
    }
    setSub(true);
    const r = await fetch(`${API}/add_rescue_team`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const d = await r.json();
    setSub(false);
    if (d.error) {
      toast(d.error, "error");
      return;
    }
    toast(`${form.team_name} deployed`);
    setModal(false);
    setForm({ team_name: "", leader_name: "", disaster_id: "" });
    refresh();
  };

  const totalVols = volunteers.length;
  const avgSize = data.length ? Math.round(totalVols / data.length) : 0;

  return (
    <div className="fade-up">
      <PageTitle
        icon="◆"
        title="Rescue Teams"
        accent={T.cyan}
        subtitle="Deploy and manage rescue and response teams for active disasters"
      />

      <div className="auto-fit-180" style={{ marginBottom: 20 }}>
        <StatCard
          label="Total Teams"
          value={data.length}
          accent={T.cyan}
          icon="◆"
        />
        <StatCard
          label="Total Volunteers"
          value={totalVols}
          accent={T.purple}
          icon="◎"
          glow="stat-glow-purple"
        />
        <StatCard
          label="Avg Team Size"
          value={avgSize}
          accent={T.blue}
          icon="◉"
        />
        <StatCard
          label="Disasters Covered"
          value={[...new Set(data.map((t) => t.disaster_id))].length}
          accent={T.orange}
          icon="⚡"
        />
      </div>

      <Card>
        <CardBody>
          <TopBar
            children={[
              <SearchInput
                key="s"
                value={search}
                onChange={setSearch}
                placeholder="Search team / leader…"
              />,
              <FilterSelect
                key="d"
                value={disFil}
                onChange={setDisFil}
                placeholder="All Disasters"
                options={disasters.map((d) => ({
                  value: d.disaster_id,
                  label: `#${d.disaster_id} — ${d.disaster_type}`,
                }))}
              />,
            ]}
            extra={[
              <ActionBtn
                key="a"
                onClick={() => setModal(true)}
                color={T.cyan}
                icon="◆"
              >
                Deploy Team
              </ActionBtn>,
            ]}
          />
          <DataTable
            loading={loading}
            rows={rows}
            emptyIcon="◆"
            emptyText="No rescue teams found"
            onExport={() => exportCSV(enriched, "rescue_teams.csv")}
            columns={[
              {
                label: "ID",
                render: (r) => <MonoBadge text={`#${r.team_id}`} />,
              },
              {
                label: "Team Name",
                key: "team_name",
                sortKey: "team_name",
                render: (r) => (
                  <span style={{ fontWeight: 600 }}>{r.team_name}</span>
                ),
              },
              { label: "Leader", key: "leader_name", sortKey: "leader_name" },
              {
                label: "Disaster",
                render: (r) =>
                  r.disaster ? (
                    <span>
                      <span style={{ fontWeight: 600 }}>
                        {r.disaster.disaster_type}
                      </span>
                      <span style={{ color: T.muted, fontSize: 11 }}>
                        , {r.disaster.location}
                      </span>
                    </span>
                  ) : (
                    <MonoBadge text={`D${r.disaster_id}`} color={T.red} />
                  ),
              },
              {
                label: "Severity",
                render: (r) =>
                  r.disaster ? (
                    <Badge
                      text={r.disaster.severity_level}
                      color={T[r.disaster.severity_level] || T.muted}
                    />
                  ) : (
                    <span style={{ color: T.muted }}>—</span>
                  ),
              },
              {
                label: "Volunteers",
                key: "volCount",
                sortKey: "volCount",
                render: (r) => (
                  <MonoBadge text={`${r.volCount} vol`} color={T.purple} />
                ),
              },
            ]}
          />
        </CardBody>
      </Card>

      {modal && (
        <Modal
          title="Deploy Rescue Team"
          onClose={() => setModal(false)}
          accent={T.cyan}
        >
          <FInput
            label="Team Name"
            name="team_name"
            value={form.team_name}
            onChange={hc}
            placeholder="e.g. NDRF Delta Team"
            required
          />
          <FInput
            label="Leader Name"
            name="leader_name"
            value={form.leader_name}
            onChange={hc}
            placeholder="e.g. Col. Ravi Sharma"
            required
          />
          <FSelect
            label="Assign to Disaster"
            name="disaster_id"
            value={form.disaster_id}
            onChange={hc}
            required
            options={disasters.map((d) => ({
              value: d.disaster_id,
              label: `#${d.disaster_id} — ${d.disaster_type}, ${d.location} [${d.severity_level}]`,
            }))}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <ActionBtn onClick={add} color={T.cyan} loading={sub} icon="◆">
              Deploy
            </ActionBtn>
            <ActionBtn
              onClick={() => setModal(false)}
              color={T.border2}
              outline
            >
              Cancel
            </ActionBtn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  PAGE: RESOURCE DISTRIBUTION
// ════════════════════════════════════════════════════════════════════

function DistributionPage({ toast }) {
  const { data, loading, refresh } = useFetch("resource_distributions");
  const { data: resources } = useFetch("resources");
  const { data: victims } = useFetch("victims");
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState("");
  const [sub, setSub] = useState(false);
  const [form, setForm] = useState({
    distribution_date: "",
    quantity_distributed: "",
    resource_id: "",
    victim_id: "",
  });
  const hc = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const rows = (data || []).filter(
    (d) =>
      !search ||
      String(d.resource_id).includes(search) ||
      String(d.victim_id).includes(search),
  );

  const totalDist = (data || []).reduce(
    (s, d) => s + (d.quantity_distributed || 0),
    0,
  );

  const add = async () => {
    if (
      !form.distribution_date ||
      !form.quantity_distributed ||
      !form.resource_id ||
      !form.victim_id
    ) {
      toast("Fill all required fields", "error");
      return;
    }
    setSub(true);
    try {
      const r = await fetch(`${API}/add_distribution`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await r.json();
      setSub(false);
      if (d.error) {
        toast(d.error, "error");
        return;
      }
      toast(`Distribution recorded — ${form.quantity_distributed} units`);
      setModal(false);
      setForm({
        distribution_date: "",
        quantity_distributed: "",
        resource_id: "",
        victim_id: "",
      });
      refresh();
    } catch (e) {
      setSub(false);
      toast("Server error", "error");
    }
  };

  return (
    <div className="fade-up">
      <PageTitle
        icon="⇢"
        title="Resource Distribution"
        accent={T.pink}
        subtitle="Track resource distributions to individual victims — backed by Oracle triggers"
      />

      <div className="auto-fit-180" style={{ marginBottom: 20 }}>
        <StatCard
          label="Total Distributions"
          value={(data || []).length}
          accent={T.pink}
          icon="⇢"
        />
        <StatCard
          label="Units Distributed"
          value={totalDist.toLocaleString()}
          accent={T.green}
          icon="◧"
        />
        <StatCard
          label="Resources Available"
          value={resources.length}
          accent={T.cyan}
          icon="◈"
        />
        <StatCard
          label="Victims on Record"
          value={victims.length}
          accent={T.orange}
          icon="⬡"
        />
      </div>

      <Card>
        <CardBody>
          <TopBar
            children={[
              <SearchInput
                key="s"
                value={search}
                onChange={setSearch}
                placeholder="Search by resource or victim ID…"
              />,
            ]}
            extra={[
              <ActionBtn
                key="a"
                onClick={() => setModal(true)}
                color={T.pink}
                icon="⇢"
              >
                Record Distribution
              </ActionBtn>,
            ]}
          />
          <DataTable
            loading={loading}
            rows={rows}
            emptyIcon="⇢"
            emptyText="No distributions recorded"
            onExport={() => exportCSV(rows, "distributions.csv")}
            columns={[
              {
                label: "ID",
                render: (r) => <MonoBadge text={`#${r.distribution_id}`} />,
              },
              {
                label: "Date",
                key: "distribution_date",
                render: (r) => (
                  <span
                    className="mono"
                    style={{ color: T.muted, fontSize: 12 }}
                  >
                    {r.distribution_date?.slice(0, 10)}
                  </span>
                ),
              },
              {
                label: "Qty Dist.",
                key: "quantity_distributed",
                sortKey: "quantity_distributed",
                render: (r) => (
                  <MonoBadge text={r.quantity_distributed} color={T.green} />
                ),
              },
              {
                label: "Resource",
                render: (r) => {
                  const res = resources.find(
                    (x) => x.resource_id === r.resource_id,
                  );
                  return res ? (
                    <span style={{ fontWeight: 600 }}>{res.resource_type}</span>
                  ) : (
                    <MonoBadge text={`R${r.resource_id}`} color={T.cyan} />
                  );
                },
              },
              {
                label: "Victim",
                render: (r) => {
                  const v = victims.find((x) => x.victim_id === r.victim_id);
                  return v ? (
                    <span>
                      {v.victim_first_name} {v.victim_last_name}
                    </span>
                  ) : (
                    <MonoBadge text={`V${r.victim_id}`} color={T.orange} />
                  );
                },
              },
            ]}
          />
        </CardBody>
      </Card>

      {modal && (
        <Modal
          title="Record Resource Distribution"
          onClose={() => setModal(false)}
          accent={T.pink}
        >
          <div
            style={{
              background: `${T.blue}0d`,
              border: `1px solid ${T.blue}22`,
              borderRadius: 8,
              padding: "10px 14px",
              marginBottom: 16,
              fontSize: 12,
              color: T.muted,
            }}
          >
            ℹ This will trigger{" "}
            <span className="mono" style={{ color: T.cyan }}>
              trg_check_resource
            </span>{" "}
            (pre-check) and{" "}
            <span className="mono" style={{ color: T.cyan }}>
              trg_update_resource
            </span>{" "}
            (auto-deduct) on the Oracle side.
          </div>
          <FRow>
            <FInput
              label="Date"
              name="distribution_date"
              value={form.distribution_date}
              onChange={hc}
              type="date"
              required
            />
            <FInput
              label="Quantity"
              name="quantity_distributed"
              value={form.quantity_distributed}
              onChange={hc}
              type="number"
              placeholder="e.g. 20"
              required
              mono
            />
          </FRow>
          <FSelect
            label="Resource"
            name="resource_id"
            value={form.resource_id}
            onChange={hc}
            required
            options={resources.map((r) => ({
              value: r.resource_id,
              label: `#${r.resource_id} — ${r.resource_type} (${r.quantity_available} available)`,
            }))}
          />
          <FSelect
            label="Victim"
            name="victim_id"
            value={form.victim_id}
            onChange={hc}
            required
            options={victims.slice(0, 100).map((v) => ({
              value: v.victim_id,
              label: `#${v.victim_id} — ${v.victim_first_name} ${v.victim_last_name} [${v.health_status}]`,
            }))}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <ActionBtn onClick={add} color={T.pink} loading={sub} icon="⇢">
              Record
            </ActionBtn>
            <ActionBtn
              onClick={() => setModal(false)}
              color={T.border2}
              outline
            >
              Cancel
            </ActionBtn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  ROOT APP
// ════════════════════════════════════════════════════════════════════

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const { toasts, push: toast } = useToast();

  const { data: disasters, refresh: rD } = useFetch("disasters");
  const { data: victims, refresh: rV } = useFetch("victims");
  const { data: resources, refresh: rR } = useFetch("resources");
  const { data: donations, refresh: rDon } = useFetch("donations");
  const { data: volunteers, refresh: rVol } = useFetch("volunteers");
  const { data: shelters, refresh: rS } = useFetch("shelters");
  const { data: teams, refresh: rT } = useFetch("rescue_teams");

  const renderPage = () => {
    const props = { toast };
    switch (page) {
      case "dashboard":
        return (
          <DashboardPage
            disasters={disasters}
            victims={victims}
            resources={resources}
            donations={donations}
            volunteers={volunteers}
            shelters={shelters}
            teams={teams}
          />
        );
      case "analytics":
        return <AnalyticsPage {...props} />;
      case "disasters":
        return <DisastersPage {...props} />;
      case "victims":
        return <VictimsPage {...props} />;
      case "resources":
        return <ResourcesPage {...props} />;
      case "donations":
        return <DonationsPage {...props} />;
      case "volunteers":
        return <VolunteersPage {...props} />;
      case "shelters":
        return <SheltersPage {...props} />;
      case "rescue_teams":
        return <RescueTeamsPage {...props} />;
      case "distribute":
        return <DistributionPage {...props} />;
      default:
        return null;
    }
  };

  const currentNav = NAV.find((n) => n.id === page);

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ display: "flex", minHeight: "100vh", background: T.bg }}>
        {/* ── SIDEBAR ── */}
        <aside
          style={{
            width: collapsed ? 64 : 240,
            background: "#080c14",
            borderRight: `1px solid ${T.border}`,
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
            transition: "width .25s cubic-bezier(.4,0,.2,1)",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: collapsed ? "16px 0" : "20px 20px 16px",
              borderBottom: `1px solid ${T.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "space-between",
            }}
          >
            {!collapsed && (
              <div>
                <div
                  style={{
                    fontSize: 9,
                    color: T.red,
                    letterSpacing: 2.5,
                    fontWeight: 700,
                    marginBottom: 3,
                    fontFamily: "'JetBrains Mono',monospace",
                  }}
                >
                  ⬤ ACTIVE OPS
                </div>
                <div
                  className="display"
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: T.text,
                    letterSpacing: 0.5,
                    lineHeight: 1.1,
                  }}
                >
                  DISASTER RELIEF
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: T.muted,
                    letterSpacing: 1.5,
                    marginTop: 1,
                  }}
                >
                  MANAGEMENT SYSTEM
                </div>
              </div>
            )}
            <button
              onClick={() => setCollapsed((c) => !c)}
              style={{
                background: "none",
                border: `1px solid ${T.border}`,
                color: T.muted,
                cursor: "pointer",
                borderRadius: 6,
                width: 28,
                height: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                flexShrink: 0,
              }}
            >
              {collapsed ? "→" : "←"}
            </button>
          </div>

          {/* Stats mini */}
          {!collapsed && (
            <div
              style={{
                padding: "12px 20px",
                borderBottom: `1px solid ${T.border}`,
              }}
            >
              <div style={{ display: "flex", gap: 8 }}>
                {[
                  { v: disasters.length, label: "DIS", c: T.red },
                  { v: victims.length, label: "VIC", c: T.orange },
                  { v: volunteers.length, label: "VOL", c: T.purple },
                ].map(({ v, label, c }) => (
                  <div key={label} style={{ flex: 1, textAlign: "center" }}>
                    <div
                      className="mono"
                      style={{ fontSize: 16, fontWeight: 700, color: c }}
                    >
                      {v}
                    </div>
                    <div
                      style={{ fontSize: 9, color: T.muted, letterSpacing: 1 }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nav */}
          <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>
            {NAV.map((item) => {
              const active = page === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setPage(item.id)}
                  className="nav-btn"
                  title={collapsed ? item.label : undefined}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: collapsed ? 0 : 10,
                    justifyContent: collapsed ? "center" : "flex-start",
                    width: "100%",
                    textAlign: "left",
                    padding: collapsed ? "10px" : "10px 12px",
                    borderRadius: 8,
                    border: "none",
                    cursor: "pointer",
                    marginBottom: 2,
                    background: active ? `${item.accent}14` : "transparent",
                    color: active ? item.accent : T.muted,
                    fontWeight: active ? 700 : 400,
                    fontSize: 13,
                    fontFamily: "'Space Grotesk',sans-serif",
                    borderLeft: active
                      ? `2px solid ${item.accent}`
                      : `2px solid transparent`,
                    transition: "all .12s",
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      fontSize: 16,
                      flexShrink: 0,
                      color: active ? item.accent : T.muted,
                    }}
                  >
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>
                  )}
                  {!collapsed && active && (
                    <div
                      style={{
                        marginLeft: "auto",
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: item.accent,
                        flexShrink: 0,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          {!collapsed && (
            <div
              style={{
                padding: "14px 20px",
                borderTop: `1px solid ${T.border}`,
              }}
            >
              <div
                className="mono"
                style={{ fontSize: 9, color: T.dim, lineHeight: 1.8 }}
              >
                UCS310 · TIET Patiala
                <br />
                2025–26 · Oracle XE + Flask
                <br />
                <span style={{ color: T.muted }}>v2.0 Production</span>
              </div>
            </div>
          )}
        </aside>

        {/* ── MAIN ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          {/* Top bar */}
          <header
            style={{
              background: "#080c14",
              borderBottom: `1px solid ${T.border}`,
              padding: "14px 32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "sticky",
              top: 0,
              zIndex: 100,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {currentNav && (
                <>
                  <span style={{ fontSize: 18, color: currentNav.accent }}>
                    {currentNav.icon}
                  </span>
                  <span
                    className="display"
                    style={{ fontSize: 15, fontWeight: 700, color: T.text }}
                  >
                    {currentNav.label}
                  </span>
                  <span
                    style={{
                      width: 1,
                      height: 16,
                      background: T.border,
                      marginLeft: 2,
                    }}
                  />
                  <span style={{ fontSize: 12, color: T.muted }}>
                    Disaster Relief Management System
                  </span>
                </>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: `${T.green}12`,
                  border: `1px solid ${T.green}33`,
                  borderRadius: 8,
                  padding: "6px 12px",
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: T.green,
                    animation: "pulse 2s infinite",
                  }}
                />
                <span style={{ fontSize: 12, color: T.green, fontWeight: 600 }}>
                  System Online
                </span>
              </div>
              <div className="mono" style={{ fontSize: 11, color: T.muted }}>
                {new Date().toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>
          </header>

          {/* Content */}
          <main style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
            {renderPage()}
          </main>
        </div>
      </div>

      <Toaster toasts={toasts} />
    </>
  );
}
