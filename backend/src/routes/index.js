import { Router } from "express";
import apprenticeships from "./apprenticeships.js";
import qualifications from "./qualifications.js";
import units from "./units.js";
import shortCourses from "./shortCourses.js";
import learners from "./learners.js";
import learningPlans from "./learningPlans.js";
import apprenticeshipEnrollments from "./apprenticeshipEnrollments.js";
import qualEnrollments from "./qualEnrollments.js";
import unitEnrollments from "./unitEnrollments.js";
import shortCourseEnrollments from "./shortCourseEnrollments.js";
import planItems from "./planItems.js";
import ksbs from "./ksbs.js";
import assignments from "./assignments.js";
import learnerKsbs from "./learnerKsbs.js";
import learnerAssignments from "./learnerAssignments.js";
import learnerAssignmentKsbs from "./learnerAssignmentKsbs.js";
import otjHours from "./otjHours.js";
import otjKsbLinks from "./otjKsbLinks.js";
import gateways from "./gateways.js";
import { createJunctionRouter } from "../lib/junctionRouter.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

router.use("/apprenticeships", apprenticeships);
router.use("/qualifications", qualifications);
router.use("/units", units);
router.use("/short-courses", shortCourses);
router.use("/learners", learners);
router.use("/learning-plans", learningPlans);
router.use("/apprenticeship-enrollments", apprenticeshipEnrollments);
router.use("/qual-enrollments", qualEnrollments);
router.use("/unit-enrollments", unitEnrollments);
router.use("/short-course-enrollments", shortCourseEnrollments);
router.use("/plan-items", planItems);
router.use("/ksbs", ksbs);
router.use("/assignments", assignments);
router.use("/learner-ksbs", learnerKsbs);
router.use("/learner-assignments", learnerAssignments);
router.use("/learner-assignment-ksbs", learnerAssignmentKsbs);
router.use("/otj-hours", otjHours);
router.use("/otj-ksb-links", otjKsbLinks);
router.use("/gateways", gateways);

router.use(
  "/apprenticeship-qualifications",
  createJunctionRouter({
    model: "apprenticeshipQualification",
    keys: ["apprenticeship_id", "qualification_id"],
  }),
);
router.use(
  "/apprenticeship-short-courses",
  createJunctionRouter({
    model: "apprenticeshipShortCourse",
    keys: ["apprenticeship_id", "short_course_id"],
  }),
);
router.use(
  "/qualification-units",
  createJunctionRouter({
    model: "qualificationUnit",
    keys: ["qualification_id", "unit_id"],
  }),
);
router.use(
  "/ksb-unit-mappings",
  createJunctionRouter({
    model: "ksbUnitMapping",
    keys: ["ksb_id", "unit_id"],
  }),
);
router.use(
  "/ksb-assignment-mappings",
  createJunctionRouter({
    model: "ksbAssignmentMapping",
    keys: ["ksb_id", "assignment_id"],
  }),
);
router.use(
  "/ksb-short-course-mappings",
  createJunctionRouter({
    model: "ksbShortCourseMapping",
    keys: ["ksb_id", "short_course_id"],
  }),
);
router.use(
  "/ksb-qualification-mappings",
  createJunctionRouter({
    model: "ksbQualificationMapping",
    keys: ["ksb_id", "qualification_id"],
  }),
);

export default router;
