import { useState, useCallback, useEffect } from "react";

// ─── localStorage persistence ────────────────────────────────────────────────
const LS_KEY = "lms_data";

function loadSaved(key, fallback) {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return fallback;
    const saved = JSON.parse(raw);
    return saved[key] ?? fallback;
  } catch {
    return fallback;
  }
}

export function useLmsState() {
  // ============================================
  // GLOBAL STATE — mirrors the data model
  // ============================================
  const [view, setView] = useState({ page: "library" });

  // TEMPLATES (the library)
  const [apprenticeships, setApprenticeships] = useState(() =>
    loadSaved("apprenticeships", []),
  );
  const [qualifications, setQualifications] = useState(() =>
    loadSaved("qualifications", []),
  );
  const [units, setUnits] = useState(() => loadSaved("units", []));
  const [shortCourses, setShortCourses] = useState(() =>
    loadSaved("shortCourses", []),
  );
  const [ksbs, setKsbs] = useState(() => loadSaved("ksbs", []));
  const [assignmentTemplates, setAssignmentTemplates] = useState(() =>
    loadSaved("assignmentTemplates", []),
  );

  // LEARNERS
  const [learners, setLearners] = useState(() => loadSaved("learners", []));

  // ENROLLMENTS (per-learner instances)
  const [apprenticeshipEnrollments, setApprenticeshipEnrollments] = useState(
    () => loadSaved("apprenticeshipEnrollments", []),
  );
  const [qualEnrollments, setQualEnrollments] = useState(() =>
    loadSaved("qualEnrollments", []),
  );
  const [unitEnrollments, setUnitEnrollments] = useState(() =>
    loadSaved("unitEnrollments", []),
  );
  const [shortCourseEnrollments, setShortCourseEnrollments] = useState(() =>
    loadSaved("shortCourseEnrollments", []),
  );

  // LEARNING PLAN ITEMS (top-level pointers)
  const [planItems, setPlanItems] = useState(() => loadSaved("planItems", []));

  // PROGRESS / per-learner
  const [learnerKsbs, setLearnerKsbs] = useState(() =>
    loadSaved("learnerKsbs", []),
  );
  const [learnerAssignments, setLearnerAssignments] = useState(() =>
    loadSaved("learnerAssignments", []),
  );
  const [otjHours, setOtjHours] = useState(() => loadSaved("otjHours", []));
  const [gateways, setGateways] = useState(() => loadSaved("gateways", []));

  // ─── Persist all data to localStorage on every change ──────────────────────
  useEffect(() => {
    try {
      localStorage.setItem(
        LS_KEY,
        JSON.stringify({
          apprenticeships,
          qualifications,
          units,
          shortCourses,
          ksbs,
          assignmentTemplates,
          learners,
          apprenticeshipEnrollments,
          qualEnrollments,
          unitEnrollments,
          shortCourseEnrollments,
          planItems,
          learnerKsbs,
          learnerAssignments,
          otjHours,
          gateways,
        }),
      );
    } catch {
      // storage quota exceeded — silently ignore
    }
  }, [
    apprenticeships,
    qualifications,
    units,
    shortCourses,
    ksbs,
    assignmentTemplates,
    learners,
    apprenticeshipEnrollments,
    qualEnrollments,
    unitEnrollments,
    shortCourseEnrollments,
    planItems,
    learnerKsbs,
    learnerAssignments,
    otjHours,
    gateways,
  ]);

  // Modal state
  const [modal, setModal] = useState(null);

  // ============================================
  // HELPERS
  // ============================================
  const newId = useCallback(
    (prefix) => `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    [],
  );

  const getLearner = useCallback(
    (id) => learners.find((l) => l.id === id),
    [learners],
  );

  const getTemplate = useCallback(
    (type, id) => {
      const map = {
        apprenticeship: apprenticeships,
        qualification: qualifications,
        unit: units,
        short_course: shortCourses,
      };
      return map[type]?.find((t) => t.id === id);
    },
    [apprenticeships, qualifications, units, shortCourses],
  );

  const getLearnerEnrollments = useCallback(
    (learnerId) => {
      return {
        apprenticeships: apprenticeshipEnrollments.filter(
          (e) => e.learner_id === learnerId,
        ),
        qualifications: qualEnrollments.filter(
          (e) => e.learner_id === learnerId,
        ),
        units: unitEnrollments.filter((e) => e.learner_id === learnerId),
        shortCourses: shortCourseEnrollments.filter(
          (e) => e.learner_id === learnerId,
        ),
      };
    },
    [
      apprenticeshipEnrollments,
      qualEnrollments,
      unitEnrollments,
      shortCourseEnrollments,
    ],
  );

  return {
    // View state
    view,
    setView,

    // Templates
    apprenticeships,
    setApprenticeships,
    qualifications,
    setQualifications,
    units,
    setUnits,
    shortCourses,
    setShortCourses,
    ksbs,
    setKsbs,
    assignmentTemplates,
    setAssignmentTemplates,

    // Learners
    learners,
    setLearners,

    // Enrollments
    apprenticeshipEnrollments,
    setApprenticeshipEnrollments,
    qualEnrollments,
    setQualEnrollments,
    unitEnrollments,
    setUnitEnrollments,
    shortCourseEnrollments,
    setShortCourseEnrollments,

    // Plan items
    planItems,
    setPlanItems,

    // Progress tracking
    learnerKsbs,
    setLearnerKsbs,
    learnerAssignments,
    setLearnerAssignments,
    otjHours,
    setOtjHours,
    gateways,
    setGateways,

    // Modal
    modal,
    setModal,

    // Helpers
    newId,
    getLearner,
    getTemplate,
    getLearnerEnrollments,
  };
}
