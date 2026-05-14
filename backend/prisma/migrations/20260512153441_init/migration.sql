-- CreateTable
CREATE TABLE "Apprenticeship" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "template_version" TEXT,
    "standard_code" TEXT,
    "pathway" TEXT,
    "programme_level" TEXT,
    "delivery_mode" TEXT,
    "programme_length" TEXT,
    "epa_length" TEXT,
    "funding_body" TEXT,
    "awarding_body" TEXT,
    "min_otj_hours" TEXT,
    "epa_grade_options" TEXT,
    "sector" TEXT,

    CONSTRAINT "Apprenticeship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Qualification" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "template_version" TEXT,
    "qualification_level" TEXT,
    "awarding_body" TEXT,
    "qualification_duration" TEXT,
    "sector" TEXT,
    "has_units" BOOLEAN NOT NULL DEFAULT false,
    "has_assignments" BOOLEAN NOT NULL DEFAULT false,
    "is_parent_qual" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Qualification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unit_code" TEXT,
    "sequence_number" TEXT,
    "mandatory_or_elective" TEXT,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShortCourse" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "course_code" TEXT,
    "duration" TEXT,
    "sector" TEXT,
    "has_assessment" BOOLEAN NOT NULL DEFAULT false,
    "produces_certificate" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ShortCourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assignment" (
    "id" TEXT NOT NULL,
    "parent_template_type" TEXT NOT NULL,
    "parent_template_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ksb" (
    "id" TEXT NOT NULL,
    "apprenticeship_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'K',
    "description" TEXT,
    "mandatory" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Ksb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprenticeshipQualification" (
    "apprenticeship_id" TEXT NOT NULL,
    "qualification_id" TEXT NOT NULL,
    "mandatory" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ApprenticeshipQualification_pkey" PRIMARY KEY ("apprenticeship_id","qualification_id")
);

-- CreateTable
CREATE TABLE "ApprenticeshipShortCourse" (
    "apprenticeship_id" TEXT NOT NULL,
    "short_course_id" TEXT NOT NULL,
    "mandatory" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ApprenticeshipShortCourse_pkey" PRIMARY KEY ("apprenticeship_id","short_course_id")
);

-- CreateTable
CREATE TABLE "QualificationUnit" (
    "qualification_id" TEXT NOT NULL,
    "unit_id" TEXT NOT NULL,
    "mandatory" BOOLEAN NOT NULL DEFAULT true,
    "sequence" INTEGER,

    CONSTRAINT "QualificationUnit_pkey" PRIMARY KEY ("qualification_id","unit_id")
);

-- CreateTable
CREATE TABLE "KsbUnitMapping" (
    "ksb_id" TEXT NOT NULL,
    "unit_id" TEXT NOT NULL,
    "coverage_notes" TEXT,

    CONSTRAINT "KsbUnitMapping_pkey" PRIMARY KEY ("ksb_id","unit_id")
);

-- CreateTable
CREATE TABLE "KsbAssignmentMapping" (
    "ksb_id" TEXT NOT NULL,
    "assignment_id" TEXT NOT NULL,
    "coverage_notes" TEXT,

    CONSTRAINT "KsbAssignmentMapping_pkey" PRIMARY KEY ("ksb_id","assignment_id")
);

-- CreateTable
CREATE TABLE "KsbShortCourseMapping" (
    "ksb_id" TEXT NOT NULL,
    "short_course_id" TEXT NOT NULL,
    "coverage_notes" TEXT,

    CONSTRAINT "KsbShortCourseMapping_pkey" PRIMARY KEY ("ksb_id","short_course_id")
);

-- CreateTable
CREATE TABLE "KsbQualificationMapping" (
    "ksb_id" TEXT NOT NULL,
    "qualification_id" TEXT NOT NULL,
    "coverage_notes" TEXT,

    CONSTRAINT "KsbQualificationMapping_pkey" PRIMARY KEY ("ksb_id","qualification_id")
);

-- CreateTable
CREATE TABLE "Learner" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "uln" TEXT,
    "date_of_birth" TEXT,
    "employer" TEXT,
    "workplace_manager" TEXT,
    "tutor_or_case_owner" TEXT,
    "sen_requirements" TEXT,
    "learner_status" TEXT NOT NULL DEFAULT 'planned',

    CONSTRAINT "Learner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningPlan" (
    "id" TEXT NOT NULL,
    "learner_id" TEXT NOT NULL,
    "created_date" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',

    CONSTRAINT "LearningPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanItem" (
    "id" TEXT NOT NULL,
    "learner_id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "enrollment_type" TEXT NOT NULL,
    "enrollment_id" TEXT NOT NULL,

    CONSTRAINT "PlanItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprenticeshipEnrollment" (
    "id" TEXT NOT NULL,
    "learner_id" TEXT NOT NULL,
    "apprenticeship_id" TEXT NOT NULL,
    "template_version" TEXT,
    "status" TEXT NOT NULL DEFAULT 'planned',
    "start_date" TEXT,
    "planned_end_date" TEXT,
    "estimated_gateway_date" TEXT,
    "practical_gateway_date" TEXT,
    "epa_date" TEXT,
    "certificate_received_date" TEXT,

    CONSTRAINT "ApprenticeshipEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QualEnrollment" (
    "id" TEXT NOT NULL,
    "learner_id" TEXT NOT NULL,
    "qualification_id" TEXT NOT NULL,
    "parent_enrollment_id" TEXT,
    "template_version" TEXT,
    "status" TEXT NOT NULL DEFAULT 'planned',
    "registration_number" TEXT,
    "registration_date" TEXT,
    "end_date" TEXT,
    "certificate_claim_date" TEXT,

    CONSTRAINT "QualEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitEnrollment" (
    "id" TEXT NOT NULL,
    "learner_id" TEXT NOT NULL,
    "unit_id" TEXT NOT NULL,
    "parent_enrollment_id" TEXT,
    "template_version" TEXT,
    "status" TEXT NOT NULL DEFAULT 'planned',
    "start_date" TEXT,
    "completion_date" TEXT,
    "grade" TEXT,

    CONSTRAINT "UnitEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShortCourseEnrollment" (
    "id" TEXT NOT NULL,
    "learner_id" TEXT NOT NULL,
    "short_course_id" TEXT NOT NULL,
    "parent_enrollment_id" TEXT,
    "template_version" TEXT,
    "status" TEXT NOT NULL DEFAULT 'planned',
    "start_date" TEXT,
    "completion_date" TEXT,
    "certificate_received_date" TEXT,

    CONSTRAINT "ShortCourseEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearnerKsb" (
    "id" TEXT NOT NULL,
    "apprenticeship_enrollment_id" TEXT NOT NULL,
    "ksb_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'not started',

    CONSTRAINT "LearnerKsb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearnerAssignment" (
    "id" TEXT NOT NULL,
    "learner_id" TEXT NOT NULL,
    "parent_enrollment_id" TEXT NOT NULL,
    "parent_enrollment_type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "deadline" TEXT,
    "submission_date" TEXT,
    "mark_or_grade" TEXT,
    "assessor_feedback" TEXT,
    "ksb_links" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "LearnerAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearnerAssignmentKsb" (
    "id" TEXT NOT NULL,
    "learner_assignment_id" TEXT NOT NULL,
    "learner_ksb_id" TEXT NOT NULL,

    CONSTRAINT "LearnerAssignmentKsb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OtjHours" (
    "id" TEXT NOT NULL,
    "apprenticeship_enrollment_id" TEXT NOT NULL,
    "date" TEXT,
    "hours_logged" TEXT NOT NULL,
    "source_type" TEXT,
    "verified_by" TEXT,
    "description" TEXT,

    CONSTRAINT "OtjHours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OtjKsbLink" (
    "id" TEXT NOT NULL,
    "otj_hours_id" TEXT NOT NULL,
    "learner_ksb_id" TEXT NOT NULL,

    CONSTRAINT "OtjKsbLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gateway" (
    "id" TEXT NOT NULL,
    "apprenticeship_enrollment_id" TEXT NOT NULL,
    "gateway_confirmed_date" TEXT,
    "epa_notification_route" TEXT,
    "all_quals_complete" BOOLEAN NOT NULL DEFAULT false,
    "functional_skills_met" BOOLEAN NOT NULL DEFAULT false,
    "min_otj_hours_met" BOOLEAN NOT NULL DEFAULT false,
    "all_ksbs_achieved" BOOLEAN NOT NULL DEFAULT false,
    "all_reviews_signed" BOOLEAN NOT NULL DEFAULT false,
    "iqa_final_complete" BOOLEAN NOT NULL DEFAULT false,
    "employer_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "exam_officer_signoff" BOOLEAN NOT NULL DEFAULT false,
    "mock_epa_completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Gateway_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Assignment_parent_template_type_parent_template_id_idx" ON "Assignment"("parent_template_type", "parent_template_id");

-- CreateIndex
CREATE INDEX "Ksb_apprenticeship_id_idx" ON "Ksb"("apprenticeship_id");

-- CreateIndex
CREATE INDEX "LearningPlan_learner_id_idx" ON "LearningPlan"("learner_id");

-- CreateIndex
CREATE INDEX "PlanItem_learner_id_idx" ON "PlanItem"("learner_id");

-- CreateIndex
CREATE INDEX "PlanItem_plan_id_idx" ON "PlanItem"("plan_id");

-- CreateIndex
CREATE INDEX "PlanItem_enrollment_type_enrollment_id_idx" ON "PlanItem"("enrollment_type", "enrollment_id");

-- CreateIndex
CREATE INDEX "ApprenticeshipEnrollment_learner_id_idx" ON "ApprenticeshipEnrollment"("learner_id");

-- CreateIndex
CREATE INDEX "ApprenticeshipEnrollment_apprenticeship_id_idx" ON "ApprenticeshipEnrollment"("apprenticeship_id");

-- CreateIndex
CREATE INDEX "QualEnrollment_learner_id_idx" ON "QualEnrollment"("learner_id");

-- CreateIndex
CREATE INDEX "QualEnrollment_qualification_id_idx" ON "QualEnrollment"("qualification_id");

-- CreateIndex
CREATE INDEX "QualEnrollment_parent_enrollment_id_idx" ON "QualEnrollment"("parent_enrollment_id");

-- CreateIndex
CREATE INDEX "UnitEnrollment_learner_id_idx" ON "UnitEnrollment"("learner_id");

-- CreateIndex
CREATE INDEX "UnitEnrollment_unit_id_idx" ON "UnitEnrollment"("unit_id");

-- CreateIndex
CREATE INDEX "UnitEnrollment_parent_enrollment_id_idx" ON "UnitEnrollment"("parent_enrollment_id");

-- CreateIndex
CREATE INDEX "ShortCourseEnrollment_learner_id_idx" ON "ShortCourseEnrollment"("learner_id");

-- CreateIndex
CREATE INDEX "ShortCourseEnrollment_short_course_id_idx" ON "ShortCourseEnrollment"("short_course_id");

-- CreateIndex
CREATE INDEX "ShortCourseEnrollment_parent_enrollment_id_idx" ON "ShortCourseEnrollment"("parent_enrollment_id");

-- CreateIndex
CREATE INDEX "LearnerKsb_apprenticeship_enrollment_id_idx" ON "LearnerKsb"("apprenticeship_enrollment_id");

-- CreateIndex
CREATE INDEX "LearnerKsb_ksb_id_idx" ON "LearnerKsb"("ksb_id");

-- CreateIndex
CREATE UNIQUE INDEX "LearnerKsb_apprenticeship_enrollment_id_ksb_id_key" ON "LearnerKsb"("apprenticeship_enrollment_id", "ksb_id");

-- CreateIndex
CREATE INDEX "LearnerAssignment_learner_id_idx" ON "LearnerAssignment"("learner_id");

-- CreateIndex
CREATE INDEX "LearnerAssignment_parent_enrollment_type_parent_enrollment__idx" ON "LearnerAssignment"("parent_enrollment_type", "parent_enrollment_id");

-- CreateIndex
CREATE INDEX "LearnerAssignmentKsb_learner_assignment_id_idx" ON "LearnerAssignmentKsb"("learner_assignment_id");

-- CreateIndex
CREATE INDEX "LearnerAssignmentKsb_learner_ksb_id_idx" ON "LearnerAssignmentKsb"("learner_ksb_id");

-- CreateIndex
CREATE UNIQUE INDEX "LearnerAssignmentKsb_learner_assignment_id_learner_ksb_id_key" ON "LearnerAssignmentKsb"("learner_assignment_id", "learner_ksb_id");

-- CreateIndex
CREATE INDEX "OtjHours_apprenticeship_enrollment_id_idx" ON "OtjHours"("apprenticeship_enrollment_id");

-- CreateIndex
CREATE INDEX "OtjKsbLink_otj_hours_id_idx" ON "OtjKsbLink"("otj_hours_id");

-- CreateIndex
CREATE INDEX "OtjKsbLink_learner_ksb_id_idx" ON "OtjKsbLink"("learner_ksb_id");

-- CreateIndex
CREATE UNIQUE INDEX "OtjKsbLink_otj_hours_id_learner_ksb_id_key" ON "OtjKsbLink"("otj_hours_id", "learner_ksb_id");

-- CreateIndex
CREATE UNIQUE INDEX "Gateway_apprenticeship_enrollment_id_key" ON "Gateway"("apprenticeship_enrollment_id");

-- AddForeignKey
ALTER TABLE "Ksb" ADD CONSTRAINT "Ksb_apprenticeship_id_fkey" FOREIGN KEY ("apprenticeship_id") REFERENCES "Apprenticeship"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprenticeshipQualification" ADD CONSTRAINT "ApprenticeshipQualification_apprenticeship_id_fkey" FOREIGN KEY ("apprenticeship_id") REFERENCES "Apprenticeship"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprenticeshipQualification" ADD CONSTRAINT "ApprenticeshipQualification_qualification_id_fkey" FOREIGN KEY ("qualification_id") REFERENCES "Qualification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprenticeshipShortCourse" ADD CONSTRAINT "ApprenticeshipShortCourse_apprenticeship_id_fkey" FOREIGN KEY ("apprenticeship_id") REFERENCES "Apprenticeship"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprenticeshipShortCourse" ADD CONSTRAINT "ApprenticeshipShortCourse_short_course_id_fkey" FOREIGN KEY ("short_course_id") REFERENCES "ShortCourse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QualificationUnit" ADD CONSTRAINT "QualificationUnit_qualification_id_fkey" FOREIGN KEY ("qualification_id") REFERENCES "Qualification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QualificationUnit" ADD CONSTRAINT "QualificationUnit_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KsbUnitMapping" ADD CONSTRAINT "KsbUnitMapping_ksb_id_fkey" FOREIGN KEY ("ksb_id") REFERENCES "Ksb"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KsbUnitMapping" ADD CONSTRAINT "KsbUnitMapping_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KsbAssignmentMapping" ADD CONSTRAINT "KsbAssignmentMapping_ksb_id_fkey" FOREIGN KEY ("ksb_id") REFERENCES "Ksb"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KsbAssignmentMapping" ADD CONSTRAINT "KsbAssignmentMapping_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "Assignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KsbShortCourseMapping" ADD CONSTRAINT "KsbShortCourseMapping_ksb_id_fkey" FOREIGN KEY ("ksb_id") REFERENCES "Ksb"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KsbShortCourseMapping" ADD CONSTRAINT "KsbShortCourseMapping_short_course_id_fkey" FOREIGN KEY ("short_course_id") REFERENCES "ShortCourse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KsbQualificationMapping" ADD CONSTRAINT "KsbQualificationMapping_ksb_id_fkey" FOREIGN KEY ("ksb_id") REFERENCES "Ksb"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KsbQualificationMapping" ADD CONSTRAINT "KsbQualificationMapping_qualification_id_fkey" FOREIGN KEY ("qualification_id") REFERENCES "Qualification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningPlan" ADD CONSTRAINT "LearningPlan_learner_id_fkey" FOREIGN KEY ("learner_id") REFERENCES "Learner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanItem" ADD CONSTRAINT "PlanItem_learner_id_fkey" FOREIGN KEY ("learner_id") REFERENCES "Learner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanItem" ADD CONSTRAINT "PlanItem_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "LearningPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprenticeshipEnrollment" ADD CONSTRAINT "ApprenticeshipEnrollment_learner_id_fkey" FOREIGN KEY ("learner_id") REFERENCES "Learner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprenticeshipEnrollment" ADD CONSTRAINT "ApprenticeshipEnrollment_apprenticeship_id_fkey" FOREIGN KEY ("apprenticeship_id") REFERENCES "Apprenticeship"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QualEnrollment" ADD CONSTRAINT "QualEnrollment_learner_id_fkey" FOREIGN KEY ("learner_id") REFERENCES "Learner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QualEnrollment" ADD CONSTRAINT "QualEnrollment_qualification_id_fkey" FOREIGN KEY ("qualification_id") REFERENCES "Qualification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitEnrollment" ADD CONSTRAINT "UnitEnrollment_learner_id_fkey" FOREIGN KEY ("learner_id") REFERENCES "Learner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitEnrollment" ADD CONSTRAINT "UnitEnrollment_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShortCourseEnrollment" ADD CONSTRAINT "ShortCourseEnrollment_learner_id_fkey" FOREIGN KEY ("learner_id") REFERENCES "Learner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShortCourseEnrollment" ADD CONSTRAINT "ShortCourseEnrollment_short_course_id_fkey" FOREIGN KEY ("short_course_id") REFERENCES "ShortCourse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearnerKsb" ADD CONSTRAINT "LearnerKsb_apprenticeship_enrollment_id_fkey" FOREIGN KEY ("apprenticeship_enrollment_id") REFERENCES "ApprenticeshipEnrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearnerKsb" ADD CONSTRAINT "LearnerKsb_ksb_id_fkey" FOREIGN KEY ("ksb_id") REFERENCES "Ksb"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearnerAssignment" ADD CONSTRAINT "LearnerAssignment_learner_id_fkey" FOREIGN KEY ("learner_id") REFERENCES "Learner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearnerAssignmentKsb" ADD CONSTRAINT "LearnerAssignmentKsb_learner_assignment_id_fkey" FOREIGN KEY ("learner_assignment_id") REFERENCES "LearnerAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearnerAssignmentKsb" ADD CONSTRAINT "LearnerAssignmentKsb_learner_ksb_id_fkey" FOREIGN KEY ("learner_ksb_id") REFERENCES "LearnerKsb"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtjHours" ADD CONSTRAINT "OtjHours_apprenticeship_enrollment_id_fkey" FOREIGN KEY ("apprenticeship_enrollment_id") REFERENCES "ApprenticeshipEnrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtjKsbLink" ADD CONSTRAINT "OtjKsbLink_otj_hours_id_fkey" FOREIGN KEY ("otj_hours_id") REFERENCES "OtjHours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtjKsbLink" ADD CONSTRAINT "OtjKsbLink_learner_ksb_id_fkey" FOREIGN KEY ("learner_ksb_id") REFERENCES "LearnerKsb"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gateway" ADD CONSTRAINT "Gateway_apprenticeship_enrollment_id_fkey" FOREIGN KEY ("apprenticeship_enrollment_id") REFERENCES "ApprenticeshipEnrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
