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
  const [assignments, setAssignments] = useState(() =>
    loadSaved("assignments", []),
  );

  // TEMPLATE COMPOSITION JUNCTIONS
  const [apprenticeshipQualifications, setApprenticeshipQualifications] =
    useState(() => loadSaved("apprenticeshipQualifications", []));
  const [apprenticeshipShortCourses, setApprenticeshipShortCourses] = useState(
    () => loadSaved("apprenticeshipShortCourses", []),
  );
  const [qualificationUnits, setQualificationUnits] = useState(() =>
    loadSaved("qualificationUnits", []),
  );

  // TEMPLATE-LEVEL KSB MAPPINGS
  const [ksbUnitMappings, setKsbUnitMappings] = useState(() =>
    loadSaved("ksbUnitMappings", []),
  );
  const [ksbAssignmentMappings, setKsbAssignmentMappings] = useState(() =>
    loadSaved("ksbAssignmentMappings", []),
  );
  const [ksbShortCourseMappings, setKsbShortCourseMappings] = useState(() =>
    loadSaved("ksbShortCourseMappings", []),
  );
  const [ksbQualificationMappings, setKsbQualificationMappings] = useState(() =>
    loadSaved("ksbQualificationMappings", []),
  );

  // LEARNERS
  const [learners, setLearners] = useState(() => loadSaved("learners", []));
  const [learningPlans, setLearningPlans] = useState(() =>
    loadSaved("learningPlans", []),
  );

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
  const [learnerAssignmentKsbs, setLearnerAssignmentKsbs] = useState(() =>
    loadSaved("learnerAssignmentKsbs", []),
  );
  const [otjHours, setOtjHours] = useState(() => loadSaved("otjHours", []));
  const [otjKsbLinks, setOtjKsbLinks] = useState(() =>
    loadSaved("otjKsbLinks", []),
  );
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
          assignments,
          apprenticeshipQualifications,
          apprenticeshipShortCourses,
          qualificationUnits,
          ksbUnitMappings,
          ksbAssignmentMappings,
          ksbShortCourseMappings,
          ksbQualificationMappings,
          learners,
          learningPlans,
          planItems,
          apprenticeshipEnrollments,
          qualEnrollments,
          unitEnrollments,
          shortCourseEnrollments,
          learnerKsbs,
          learnerAssignments,
          learnerAssignmentKsbs,
          otjHours,
          otjKsbLinks,
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
    assignments,
    apprenticeshipQualifications,
    apprenticeshipShortCourses,
    qualificationUnits,
    ksbUnitMappings,
    ksbAssignmentMappings,
    ksbShortCourseMappings,
    ksbQualificationMappings,
    learners,
    learningPlans,
    planItems,
    apprenticeshipEnrollments,
    qualEnrollments,
    unitEnrollments,
    shortCourseEnrollments,
    learnerKsbs,
    learnerAssignments,
    learnerAssignmentKsbs,
    otjHours,
    otjKsbLinks,
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
    assignments,
    setAssignments,

    // Template composition junctions
    apprenticeshipQualifications,
    setApprenticeshipQualifications,
    apprenticeshipShortCourses,
    setApprenticeshipShortCourses,
    qualificationUnits,
    setQualificationUnits,

    // Template-level KSB mappings
    ksbUnitMappings,
    setKsbUnitMappings,
    ksbAssignmentMappings,
    setKsbAssignmentMappings,
    ksbShortCourseMappings,
    setKsbShortCourseMappings,
    ksbQualificationMappings,
    setKsbQualificationMappings,

    // Learners
    learners,
    setLearners,
    learningPlans,
    setLearningPlans,

    // Plan items
    planItems,
    setPlanItems,

    // Enrollments
    apprenticeshipEnrollments,
    setApprenticeshipEnrollments,
    qualEnrollments,
    setQualEnrollments,
    unitEnrollments,
    setUnitEnrollments,
    shortCourseEnrollments,
    setShortCourseEnrollments,

    // Progress tracking
    learnerKsbs,
    setLearnerKsbs,
    learnerAssignments,
    setLearnerAssignments,
    learnerAssignmentKsbs,
    setLearnerAssignmentKsbs,
    otjHours,
    setOtjHours,
    otjKsbLinks,
    setOtjKsbLinks,
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
