import React from "react";
import { Home, Plus, Users } from "lucide-react";
import { ChevronRight } from "lucide-react";

export default function LearnersPage({ state }) {
  const { learners, setView, setModal, getLearnerEnrollments } = state;

  return (
    <main className="main">
      <div className="page-header">
        <div className="breadcrumb">
          <Home size={12} />
          <span>Workspace</span>
          <span className="sep">/</span>
          <span>Learners</span>
        </div>
        <h1 className="page-title">Learners</h1>
        <p className="page-subtitle">
          Browse, manage, and build learning plans for individual learners.
        </p>
      </div>

      <div className="toolbar">
        <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>
          {learners.length} {learners.length === 1 ? "learner" : "learners"}
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setModal({ type: "create-learner" })}
        >
          <Plus size={14} /> Add Learner
        </button>
      </div>

      {learners.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">
            <Users size={24} />
          </div>
          <div className="empty-title">No learners yet</div>
          <div className="empty-text">
            Add learners to begin building their learning plans.
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setModal({ type: "create-learner" })}
          >
            <Plus size={14} /> Add learner
          </button>
        </div>
      ) : (
        <div>
          {learners.map((l) => {
            const e = getLearnerEnrollments(l.id);
            const totalEnrollments =
              e.apprenticeships.length +
              e.qualifications.filter((q) => !q.parent_enrollment_id).length +
              e.shortCourses.filter((s) => !s.parent_enrollment_id).length +
              e.units.filter((u) => !u.parent_enrollment_id).length;
            return (
              <div
                key={l.id}
                className="learner-row"
                onClick={() =>
                  setView({ page: "learner-profile", learnerId: l.id })
                }
              >
                <div className="avatar">
                  {(l.full_name || "?")
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div>
                  <div className="learner-name">{l.full_name}</div>
                  <div className="learner-meta">
                    ULN: {l.uln || "—"} · {l.employer || "No employer set"}
                  </div>
                </div>
                <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>
                  {totalEnrollments > 0
                    ? `${totalEnrollments} ${totalEnrollments === 1 ? "enrollment" : "enrollments"}`
                    : "No enrollments"}
                </div>
                <span
                  className={`status-pill ${l.learner_status || "planned"}`}
                >
                  {l.learner_status || "planned"}
                </span>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--ink-light)",
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  {l.tutor_or_case_owner || "Unassigned"}
                </div>
                <ChevronRight size={16} color="var(--ink-light)" />
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
