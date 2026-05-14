import React from "react";
import { Library, Users, Settings } from "lucide-react";

export default function Sidebar({ state }) {
  const { view, setView } = state;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">
          Atelier <em>LMS</em>
        </div>
        <div className="brand-sub">Apprenticeship Studio</div>
      </div>
      <nav className="nav">
        <div className="nav-label">Workspace</div>
        <button
          className={`nav-item ${view.page === "library" ? "active" : ""}`}
          onClick={() => setView({ page: "library" })}
        >
          <Library size={16} /> Template Library
        </button>
        <button
          className={`nav-item ${view.page === "learners" || view.page.startsWith("learner") ? "active" : ""}`}
          onClick={() => setView({ page: "learners" })}
        >
          <Users size={16} /> Learners
        </button>
        <div className="nav-label" style={{ marginTop: 24 }}>
          System
        </div>
        <button className="nav-item">
          <Settings size={16} /> Settings
        </button>
      </nav>
      <div
        style={{
          padding: "20px 28px",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          fontSize: 11,
          color: "rgba(255,255,255,0.4)",
          fontFamily: "JetBrains Mono, monospace",
        }}
      >
        Admin · Demo workspace
      </div>
    </aside>
  );
}
