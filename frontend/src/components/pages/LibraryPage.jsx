import React, { useState } from "react";
import {
  Home,
  Plus,
  Award,
  GraduationCap,
  Layers,
  BookOpen,
  Hash,
  Target,
  Clock,
  CheckCircle2,
  Circle,
  ChevronRight,
} from "lucide-react";

export default function LibraryPage({ state }) {
  const [libraryTab, setLibraryTab] = useState("apprenticeship");

  const {
    apprenticeships,
    setApprenticeships,
    qualifications,
    setQualifications,
    units,
    setUnits,
    shortCourses,
    setShortCourses,
    ksbs,
    setModal,
    newId,
    getTemplate,
  } = state;

  const tabs = [
    {
      id: "apprenticeship",
      label: "Apprenticeships",
      icon: Award,
      count: apprenticeships.length,
    },
    {
      id: "qualification",
      label: "Qualifications",
      icon: GraduationCap,
      count: qualifications.length,
    },
    { id: "unit", label: "Units", icon: Layers, count: units.length },
    {
      id: "short_course",
      label: "Short Courses",
      icon: BookOpen,
      count: shortCourses.length,
    },
  ];

  const currentItems = {
    apprenticeship: apprenticeships,
    qualification: qualifications,
    unit: units,
    short_course: shortCourses,
  }[libraryTab];

  const tagClass = {
    apprenticeship: "apprenticeship",
    qualification: "qualification",
    unit: "unit",
    short_course: "short-course",
  }[libraryTab];
  const TagIcon = {
    apprenticeship: Award,
    qualification: GraduationCap,
    unit: Layers,
    short_course: BookOpen,
  }[libraryTab];

  return (
    <main className="main">
      <div className="page-header">
        <div className="breadcrumb">
          <Home size={12} />
          <span>Workspace</span>
          <span className="sep">/</span>
          <span>Library</span>
        </div>
        <h1 className="page-title">
          Template <em>Library</em>
        </h1>
        <p className="page-subtitle">
          Define reusable templates for apprenticeships, qualifications, units,
          and short courses. Templates capture the structure — learner-specific
          details are added at enrollment.
        </p>
      </div>

      <div className="tabs">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`tab ${libraryTab === t.id ? "active" : ""}`}
            onClick={() => setLibraryTab(t.id)}
          >
            <t.icon size={14} /> {t.label}{" "}
            <span className="count">{t.count}</span>
          </button>
        ))}
      </div>

      <div className="toolbar">
        <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>
          {currentItems.length}{" "}
          {currentItems.length === 1 ? "template" : "templates"}
        </div>
        <button
          className="btn btn-primary"
          onClick={() =>
            setModal({ type: "create-template", templateType: libraryTab })
          }
        >
          <Plus size={14} /> New{" "}
          {tabs.find((t) => t.id === libraryTab).label.replace(/s$/, "")}
        </button>
      </div>

      {currentItems.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">
            <TagIcon size={24} />
          </div>
          <div className="empty-title">
            No {tabs.find((t) => t.id === libraryTab).label.toLowerCase()} yet
          </div>
          <div className="empty-text">
            Create the first template to begin building learner pathways.
            Templates can be reused across as many learners as needed.
          </div>
          <button
            className="btn btn-primary"
            onClick={() =>
              setModal({ type: "create-template", templateType: libraryTab })
            }
          >
            <Plus size={14} /> Create{" "}
            {tabs
              .find((t) => t.id === libraryTab)
              .label.replace(/s$/, "")
              .toLowerCase()}
          </button>
        </div>
      ) : (
        <div className="card-grid">
          {currentItems.map((item) => (
            <div
              key={item.id}
              className="card"
              onClick={() =>
                setModal({
                  type: "view-template",
                  templateType: libraryTab,
                  item,
                })
              }
            >
              <div className={`card-tag ${tagClass}`}>
                <TagIcon size={12} />{" "}
                {tabs.find((t) => t.id === libraryTab).label.replace(/s$/, "")}
              </div>
              <div className="card-title">{item.name}</div>
              <div className="card-meta">
                {libraryTab === "apprenticeship" && (
                  <>
                    {item.standard_code && (
                      <span className="card-meta-item">
                        <Hash size={10} />
                        {item.standard_code}
                      </span>
                    )}
                    {item.programme_level && (
                      <span className="card-meta-item">
                        L{item.programme_level}
                      </span>
                    )}
                    {item.programme_length && (
                      <span className="card-meta-item">
                        <Clock size={10} />
                        {item.programme_length}
                      </span>
                    )}
                    <span className="card-meta-item">
                      <Target size={10} />
                      {
                        ksbs.filter((k) => k.apprenticeship_id === item.id)
                          .length
                      }{" "}
                      KSBs
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
