import { useState, useCallback } from "react";
import { useApiResource } from "./useApiResource.js";
import { useApiJunctionResource } from "./useApiJunctionResource.js";

export function useLmsState() {
  // ============================================
  // GLOBAL STATE — mirrors the data model
  // ============================================
  const [view, setView] = useState({ page: "library" });

  // TEMPLATES (API-backed)
  const apprenticeshipsApi = useApiResource("/apprenticeships");
  const qualificationsApi = useApiResource("/qualifications");
  const unitsApi = useApiResource("/units");
  const shortCoursesApi = useApiResource("/short-courses");

  const apprenticeships = apprenticeshipsApi.items;
  const setApprenticeships = apprenticeshipsApi.setItems;
  const qualifications = qualificationsApi.items;
  const setQualifications = qualificationsApi.setItems;
  const units = unitsApi.items;
  const setUnits = unitsApi.setItems;
  const shortCourses = shortCoursesApi.items;
  const setShortCourses = shortCoursesApi.setItems;

  // KSBs + ASSIGNMENT TEMPLATES (API-backed)
  const ksbsApi = useApiResource("/ksbs");
  const assignmentsApi = useApiResource("/assignments");

  const ksbs = ksbsApi.items;
  const setKsbs = ksbsApi.setItems;
  const assignments = assignmentsApi.items;
  const setAssignments = assignmentsApi.setItems;

  // TEMPLATE COMPOSITION JUNCTIONS (API-backed, composite keys)
  const apprenticeshipQualificationsApi = useApiJunctionResource(
    "/apprenticeship-qualifications",
    ["apprenticeship_id", "qualification_id"],
  );
  const apprenticeshipShortCoursesApi = useApiJunctionResource(
    "/apprenticeship-short-courses",
    ["apprenticeship_id", "short_course_id"],
  );
  const qualificationUnitsApi = useApiJunctionResource("/qualification-units", [
    "qualification_id",
    "unit_id",
  ]);

  const apprenticeshipQualifications = apprenticeshipQualificationsApi.items;
  const setApprenticeshipQualifications =
    apprenticeshipQualificationsApi.setItems;
  const apprenticeshipShortCourses = apprenticeshipShortCoursesApi.items;
  const setApprenticeshipShortCourses = apprenticeshipShortCoursesApi.setItems;
  const qualificationUnits = qualificationUnitsApi.items;
  const setQualificationUnits = qualificationUnitsApi.setItems;

  // TEMPLATE-LEVEL KSB MAPPINGS (API-backed, composite keys)
  const ksbUnitMappingsApi = useApiJunctionResource("/ksb-unit-mappings", [
    "ksb_id",
    "unit_id",
  ]);
  const ksbAssignmentMappingsApi = useApiJunctionResource(
    "/ksb-assignment-mappings",
    ["ksb_id", "assignment_id"],
  );
  const ksbShortCourseMappingsApi = useApiJunctionResource(
    "/ksb-short-course-mappings",
    ["ksb_id", "short_course_id"],
  );
  const ksbQualificationMappingsApi = useApiJunctionResource(
    "/ksb-qualification-mappings",
    ["ksb_id", "qualification_id"],
  );

  const ksbUnitMappings = ksbUnitMappingsApi.items;
  const setKsbUnitMappings = ksbUnitMappingsApi.setItems;
  const ksbAssignmentMappings = ksbAssignmentMappingsApi.items;
  const setKsbAssignmentMappings = ksbAssignmentMappingsApi.setItems;
  const ksbShortCourseMappings = ksbShortCourseMappingsApi.items;
  const setKsbShortCourseMappings = ksbShortCourseMappingsApi.setItems;
  const ksbQualificationMappings = ksbQualificationMappingsApi.items;
  const setKsbQualificationMappings = ksbQualificationMappingsApi.setItems;

  // LEARNERS + LEARNING PLANS (API-backed)
  const learnersApi = useApiResource("/learners");
  const learningPlansApi = useApiResource("/learning-plans");

  const learners = learnersApi.items;
  const setLearners = learnersApi.setItems;
  const learningPlans = learningPlansApi.items;
  const setLearningPlans = learningPlansApi.setItems;

  // ENROLLMENTS (API-backed)
  const apprenticeshipEnrollmentsApi = useApiResource(
    "/apprenticeship-enrollments",
  );
  const qualEnrollmentsApi = useApiResource("/qual-enrollments");
  const unitEnrollmentsApi = useApiResource("/unit-enrollments");
  const shortCourseEnrollmentsApi = useApiResource("/short-course-enrollments");

  const apprenticeshipEnrollments = apprenticeshipEnrollmentsApi.items;
  const setApprenticeshipEnrollments = apprenticeshipEnrollmentsApi.setItems;
  const qualEnrollments = qualEnrollmentsApi.items;
  const setQualEnrollments = qualEnrollmentsApi.setItems;
  const unitEnrollments = unitEnrollmentsApi.items;
  const setUnitEnrollments = unitEnrollmentsApi.setItems;
  const shortCourseEnrollments = shortCourseEnrollmentsApi.items;
  const setShortCourseEnrollments = shortCourseEnrollmentsApi.setItems;

  // PLAN ITEMS (API-backed)
  const planItemsApi = useApiResource("/plan-items");
  const planItems = planItemsApi.items;
  const setPlanItems = planItemsApi.setItems;

  // PROGRESS / per-learner (API-backed)
  const learnerKsbsApi = useApiResource("/learner-ksbs");
  const learnerAssignmentsApi = useApiResource("/learner-assignments");
  const learnerAssignmentKsbsApi = useApiResource("/learner-assignment-ksbs");
  const otjHoursApi = useApiResource("/otj-hours");
  const otjKsbLinksApi = useApiResource("/otj-ksb-links");
  const gatewaysApi = useApiResource("/gateways");

  const learnerKsbs = learnerKsbsApi.items;
  const setLearnerKsbs = learnerKsbsApi.setItems;
  const learnerAssignments = learnerAssignmentsApi.items;
  const setLearnerAssignments = learnerAssignmentsApi.setItems;
  const learnerAssignmentKsbs = learnerAssignmentKsbsApi.items;
  const setLearnerAssignmentKsbs = learnerAssignmentKsbsApi.setItems;
  const otjHours = otjHoursApi.items;
  const setOtjHours = otjHoursApi.setItems;
  const otjKsbLinks = otjKsbLinksApi.items;
  const setOtjKsbLinks = otjKsbLinksApi.setItems;
  const gateways = gatewaysApi.items;
  const setGateways = gatewaysApi.setItems;

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

    // API-backed mutations
    createApprenticeship: apprenticeshipsApi.create,
    updateApprenticeship: apprenticeshipsApi.update,
    deleteApprenticeship: apprenticeshipsApi.remove,
    createQualification: qualificationsApi.create,
    updateQualification: qualificationsApi.update,
    deleteQualification: qualificationsApi.remove,
    createUnit: unitsApi.create,
    updateUnit: unitsApi.update,
    deleteUnit: unitsApi.remove,
    createShortCourse: shortCoursesApi.create,
    updateShortCourse: shortCoursesApi.update,
    deleteShortCourse: shortCoursesApi.remove,
    createLearner: learnersApi.create,
    updateLearner: learnersApi.update,
    deleteLearner: learnersApi.remove,
    createLearningPlan: learningPlansApi.create,
    updateLearningPlan: learningPlansApi.update,
    deleteLearningPlan: learningPlansApi.remove,
    createApprenticeshipEnrollment: apprenticeshipEnrollmentsApi.create,
    updateApprenticeshipEnrollment: apprenticeshipEnrollmentsApi.update,
    deleteApprenticeshipEnrollment: apprenticeshipEnrollmentsApi.remove,
    createQualEnrollment: qualEnrollmentsApi.create,
    updateQualEnrollment: qualEnrollmentsApi.update,
    deleteQualEnrollment: qualEnrollmentsApi.remove,
    createUnitEnrollment: unitEnrollmentsApi.create,
    updateUnitEnrollment: unitEnrollmentsApi.update,
    deleteUnitEnrollment: unitEnrollmentsApi.remove,
    createShortCourseEnrollment: shortCourseEnrollmentsApi.create,
    updateShortCourseEnrollment: shortCourseEnrollmentsApi.update,
    deleteShortCourseEnrollment: shortCourseEnrollmentsApi.remove,
    createPlanItem: planItemsApi.create,
    updatePlanItem: planItemsApi.update,
    deletePlanItem: planItemsApi.remove,
    createKsb: ksbsApi.create,
    updateKsb: ksbsApi.update,
    deleteKsb: ksbsApi.remove,
    createAssignment: assignmentsApi.create,
    updateAssignment: assignmentsApi.update,
    deleteAssignment: assignmentsApi.remove,
    createApprenticeshipQualification: apprenticeshipQualificationsApi.create,
    updateApprenticeshipQualification: apprenticeshipQualificationsApi.update,
    deleteApprenticeshipQualification: apprenticeshipQualificationsApi.remove,
    createApprenticeshipShortCourse: apprenticeshipShortCoursesApi.create,
    updateApprenticeshipShortCourse: apprenticeshipShortCoursesApi.update,
    deleteApprenticeshipShortCourse: apprenticeshipShortCoursesApi.remove,
    createQualificationUnit: qualificationUnitsApi.create,
    updateQualificationUnit: qualificationUnitsApi.update,
    deleteQualificationUnit: qualificationUnitsApi.remove,
    createKsbUnitMapping: ksbUnitMappingsApi.create,
    updateKsbUnitMapping: ksbUnitMappingsApi.update,
    deleteKsbUnitMapping: ksbUnitMappingsApi.remove,
    createKsbAssignmentMapping: ksbAssignmentMappingsApi.create,
    updateKsbAssignmentMapping: ksbAssignmentMappingsApi.update,
    deleteKsbAssignmentMapping: ksbAssignmentMappingsApi.remove,
    createKsbShortCourseMapping: ksbShortCourseMappingsApi.create,
    updateKsbShortCourseMapping: ksbShortCourseMappingsApi.update,
    deleteKsbShortCourseMapping: ksbShortCourseMappingsApi.remove,
    createKsbQualificationMapping: ksbQualificationMappingsApi.create,
    updateKsbQualificationMapping: ksbQualificationMappingsApi.update,
    deleteKsbQualificationMapping: ksbQualificationMappingsApi.remove,
    createLearnerKsb: learnerKsbsApi.create,
    updateLearnerKsb: learnerKsbsApi.update,
    deleteLearnerKsb: learnerKsbsApi.remove,
    createLearnerAssignment: learnerAssignmentsApi.create,
    updateLearnerAssignment: learnerAssignmentsApi.update,
    deleteLearnerAssignment: learnerAssignmentsApi.remove,
    createLearnerAssignmentKsb: learnerAssignmentKsbsApi.create,
    updateLearnerAssignmentKsb: learnerAssignmentKsbsApi.update,
    deleteLearnerAssignmentKsb: learnerAssignmentKsbsApi.remove,
    createOtjHours: otjHoursApi.create,
    updateOtjHours: otjHoursApi.update,
    deleteOtjHours: otjHoursApi.remove,
    createOtjKsbLink: otjKsbLinksApi.create,
    updateOtjKsbLink: otjKsbLinksApi.update,
    deleteOtjKsbLink: otjKsbLinksApi.remove,
    createGateway: gatewaysApi.create,
    updateGateway: gatewaysApi.update,
    deleteGateway: gatewaysApi.remove,
  };
}
