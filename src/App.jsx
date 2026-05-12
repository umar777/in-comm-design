import React, { useState } from "react";
import {
  Library,
  Users,
  ChevronRight,
  Plus,
  X,
  BookOpen,
  GraduationCap,
  Layers,
  FileText,
  Award,
  Clock,
  CheckCircle2,
  Circle,
  ArrowLeft,
  Home,
  Settings,
  Search,
  ChevronDown,
  Target,
  Briefcase,
  Calendar,
  Hash,
  AlertCircle,
  Bell,
} from "lucide-react";
import { useLmsState } from "./hooks/useLmsState";
import Sidebar from "./components/Sidebar";
import LibraryPage from "./components/pages/LibraryPage";
import LearnersPage from "./components/pages/LearnersPage";
import LearnerProfile from "./components/pages/LearnerProfile";
import EnrollmentDetail from "./components/pages/EnrollmentDetail";
import Modal from "./components/modals/Modal";
import "./App.css";

export default function LMSAdminUI() {
  const state = useLmsState();
  // ============================================
  // GLOBAL STATE — mirrors the data model
  // ============================================
  const [view, setView] = useState({ page: "library" }); // page: library | learners | learner-profile | learning-plan | enrollment-detail

  // TEMPLATES (the library)
  const [apprenticeships, setApprenticeships] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [units, setUnits] = useState([]);
  const [shortCourses, setShortCourses] = useState([]);
  const [ksbs, setKsbs] = useState([]); // belongs to apprenticeships
  const [assignmentTemplates, setAssignmentTemplates] = useState([]);

  // LEARNERS
  const [learners, setLearners] = useState([]);

  // ENROLLMENTS (per-learner instances)
  const [apprenticeshipEnrollments, setApprenticeshipEnrollments] = useState(
    [],
  );
  const [qualEnrollments, setQualEnrollments] = useState([]);
  const [unitEnrollments, setUnitEnrollments] = useState([]);
  const [shortCourseEnrollments, setShortCourseEnrollments] = useState([]);

  // LEARNING PLAN ITEMS (top-level pointers)
  const [planItems, setPlanItems] = useState([]);

  // PROGRESS / per-learner
  const [learnerKsbs, setLearnerKsbs] = useState([]);
  const [learnerAssignments, setLearnerAssignments] = useState([]);
  const [otjHours, setOtjHours] = useState([]);
  const [gateways, setGateways] = useState([]);

  // Modal state
  const [modal, setModal] = useState(null);

  // ============================================
  // HELPERS
  // ============================================
  const newId = (prefix) =>
    `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  const getLearner = (id) => learners.find((l) => l.id === id);
  const getTemplate = (type, id) => {
    const map = {
      apprenticeship: apprenticeships,
      qualification: qualifications,
      unit: units,
      short_course: shortCourses,
    };
    return map[type]?.find((t) => t.id === id);
  };

  // Build the enrollment tree for a learner
  const getLearnerEnrollments = (learnerId) => {
    return {
      apprenticeships: apprenticeshipEnrollments.filter(
        (e) => e.learner_id === learnerId,
      ),
      qualifications: qualEnrollments.filter((e) => e.learner_id === learnerId),
      units: unitEnrollments.filter((e) => e.learner_id === learnerId),
      shortCourses: shortCourseEnrollments.filter(
        (e) => e.learner_id === learnerId,
      ),
    };
  };

  // ============================================
  // STYLES — editorial / refined aesthetic
  // ============================================
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=JetBrains+Mono:wght@400;500;600&family=Inter+Tight:wght@400;500;600;700&display=swap');
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    :root {
      --ink: #1a1a2e;
      --ink-soft: #4a5568;
      --ink-light: #718096;
      --paper: #f0f2f5;
      --paper-warm: #e8edf2;
      --paper-card: #ffffff;
      --line: #dde1e7;
      --line-soft: #edf0f3;
      --accent: #e8601c;
      --accent-soft: #fde8d8;
      --sidebar-bg: #1c2b3a;
      --moss: #2d7d52;
      --moss-soft: #c6e9d8;
      --gold: #b8893f;
      --slate: #3d4a5c;
      --slate-soft: #c1c8d2;
      --shadow-sm: 0 1px 3px rgba(0,0,0,0.06);
      --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
      --shadow-lg: 0 12px 32px rgba(0,0,0,0.12);
    }
    
    body, .lms-root { 
      font-family: 'Inter Tight', sans-serif;
      color: var(--ink);
      background: var(--paper);
      line-height: 1.5;
    }
    
    .lms-root {
      min-height: 100vh;
      display: flex;
    }

    .app-right {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    /* TOPBAR */
    .topbar {
      background: var(--paper-card);
      border-bottom: 1px solid var(--line);
      padding: 10px 32px;
      display: flex;
      align-items: center;
      gap: 16px;
      position: sticky;
      top: 0;
      z-index: 50;
    }
    .topbar-search {
      display: flex;
      align-items: center;
      gap: 10px;
      background: var(--paper);
      border: 1px solid var(--line);
      border-radius: 6px;
      padding: 7px 14px;
      flex: 1;
      max-width: 420px;
    }
    .topbar-search input {
      border: none;
      outline: none;
      font-size: 14px;
      font-family: inherit;
      color: var(--ink);
      background: transparent;
      width: 100%;
    }
    .topbar-search input::placeholder { color: var(--ink-light); }
    .topbar-actions { margin-left: auto; display: flex; align-items: center; gap: 4px; }
    .topbar-icon-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 6px 8px;
      border-radius: 4px;
      color: var(--ink-soft);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      font-weight: 600;
      font-family: inherit;
    }
    .topbar-icon-btn:hover { background: var(--paper); color: var(--ink); }
    .topbar-signout {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 14px;
      font-family: inherit;
      color: var(--ink);
      padding: 6px 12px;
      margin-left: 4px;
    }
    .topbar-signout:hover { color: var(--accent); }
    
    /* SIDEBAR */
    .sidebar {
      width: 220px;
      background: var(--sidebar-bg);
      color: var(--paper-card);
      display: flex;
      flex-direction: column;
      position: sticky;
      top: 0;
      height: 100vh;
    }
    
    .sidebar-brand {
      padding: 20px 20px 18px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .brand-name {
      font-family: 'Inter Tight', sans-serif;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.02em;
      color: #fff;
    }
    
    .brand-badge {
      font-size: 10px;
      font-weight: 700;
      font-family: 'Inter Tight', sans-serif;
      background: rgba(255,255,255,0.15);
      color: rgba(255,255,255,0.85);
      padding: 2px 7px;
      border-radius: 4px;
      letter-spacing: 0.05em;
    }
    
    .nav { padding: 16px 12px; flex: 1; overflow-y: auto; }
    .nav-label {
      font-size: 10px;
      font-family: 'Inter Tight', sans-serif;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      opacity: 0.5;
      padding: 0 8px;
      margin-bottom: 6px;
      margin-top: 12px;
      font-weight: 600;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 8px 9px 10px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 13.5px;
      color: rgba(255,255,255,0.65);
      transition: all 0.12s;
      border: none;
      border-left: 3px solid transparent;
      background: none;
      width: 100%;
      text-align: left;
      font-family: inherit;
    }
    .nav-item:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.9); }
    .nav-item.active {
      border-left-color: var(--accent);
      background: rgba(255,255,255,0.08);
      color: #fff;
    }
    
    /* MAIN */
    .main {
      flex: 1;
      min-width: 0;
      padding: 32px 40px;
      overflow-y: auto;
    }
    
    .page-header {
      margin-bottom: 40px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--line);
    }
    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-family: 'JetBrains Mono', monospace;
      letter-spacing: 0.05em;
      color: var(--ink-light);
      margin-bottom: 16px;
    }
    .breadcrumb button {
      background: none; border: none; color: inherit; cursor: pointer; font: inherit;
      padding: 0;
    }
    .breadcrumb button:hover { color: var(--accent); }
    .breadcrumb .sep { opacity: 0.5; }
    
    .page-title {
      font-family: 'Inter Tight', sans-serif;
      font-size: 26px;
      font-weight: 700;
      letter-spacing: -0.01em;
      line-height: 1.2;
      margin-bottom: 4px;
      color: var(--ink);
    }
    .page-title em { font-style: normal; color: var(--accent); }
    .page-subtitle {
      font-size: 13.5px;
      color: var(--ink-soft);
    }
    .page-header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
    }
    
    /* TABS */
    .tabs {
      display: flex;
      gap: 0;
      margin-bottom: 32px;
      border-bottom: 1px solid var(--line);
    }
    .tab {
      padding: 12px 20px;
      font-size: 13px;
      font-weight: 500;
      color: var(--ink-light);
      cursor: pointer;
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      font-family: inherit;
      letter-spacing: -0.01em;
      transition: all 0.15s;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .tab:hover { color: var(--ink); }
    .tab.active {
      color: var(--ink);
      border-bottom-color: var(--accent);
    }
    .tab .count {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      background: var(--paper-warm);
      padding: 2px 6px;
      border-radius: 3px;
      color: var(--ink-soft);
    }
    .tab.active .count { background: var(--accent-soft); color: var(--accent); }
    
    /* CARDS */
    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 16px;
    }
    .card {
      background: var(--paper-card);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 20px;
      transition: all 0.15s;
      cursor: pointer;
      position: relative;
    }
    .card:hover {
      border-color: var(--ink);
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }
    .card-tag {
      font-size: 10px;
      font-family: 'JetBrains Mono', monospace;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--ink-light);
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .card-tag.apprenticeship { color: var(--accent); }
    .card-tag.qualification { color: var(--moss); }
    .card-tag.unit { color: var(--gold); }
    .card-tag.short-course { color: var(--slate); }
    .card-title {
      font-family: 'Fraunces', serif;
      font-size: 20px;
      font-weight: 500;
      letter-spacing: -0.015em;
      line-height: 1.2;
      margin-bottom: 10px;
    }
    .card-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      font-size: 12px;
      color: var(--ink-soft);
      margin-top: 12px;
    }
    .card-meta-item {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 3px 8px;
      background: var(--paper-warm);
      border-radius: 4px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
    }
    
    /* BUTTONS */
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      font-size: 13px;
      font-weight: 500;
      font-family: inherit;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s;
      border: 1px solid transparent;
      letter-spacing: -0.005em;
    }
    .btn-primary {
      background: var(--accent);
      color: #fff;
    }
    .btn-primary:hover { background: #c94f14; }
    .btn-secondary {
      background: transparent;
      color: var(--ink);
      border-color: var(--line);
    }
    .btn-secondary:hover { border-color: var(--ink); background: var(--paper-warm); }
    .btn-ghost {
      background: transparent;
      color: var(--ink-soft);
      padding: 6px 10px;
    }
    .btn-ghost:hover { color: var(--ink); background: var(--paper-warm); }
    .btn-danger { color: var(--accent); }
    .btn-danger:hover { background: var(--accent-soft); }
    
    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      gap: 16px;
    }
    
    /* EMPTY STATE */
    .empty {
      text-align: center;
      padding: 80px 20px;
      border: 1px dashed var(--line);
      border-radius: 8px;
      background: var(--paper-warm);
    }
    .empty-icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: var(--paper-card);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
      color: var(--ink-light);
    }
    .empty-title {
      font-family: 'Fraunces', serif;
      font-size: 22px;
      font-weight: 500;
      margin-bottom: 6px;
    }
    .empty-text {
      color: var(--ink-soft);
      font-size: 14px;
      max-width: 400px;
      margin: 0 auto 20px;
    }
    
    /* LEARNER LIST */
    .learner-row {
      display: grid;
      grid-template-columns: 48px 1fr 200px 160px 120px 24px;
      gap: 16px;
      align-items: center;
      padding: 16px 20px;
      background: var(--paper-card);
      border: 1px solid var(--line);
      border-radius: 8px;
      margin-bottom: 8px;
      cursor: pointer;
      transition: all 0.15s;
    }
    .learner-row:hover {
      border-color: var(--ink);
      transform: translateX(2px);
    }
    .avatar {
      width: 40px; height: 40px;
      border-radius: 50%;
      background: var(--accent-soft);
      color: var(--accent);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Fraunces', serif;
      font-weight: 500;
      font-size: 16px;
    }
    .learner-name { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 500; letter-spacing: -0.01em; }
    .learner-meta { font-size: 12px; color: var(--ink-light); margin-top: 2px; font-family: 'JetBrains Mono', monospace; }
    .status-pill {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 100px;
      font-size: 11px;
      font-family: 'JetBrains Mono', monospace;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .status-pill.active { background: var(--moss-soft); color: var(--moss); }
    .status-pill.gateway { background: var(--accent-soft); color: var(--accent); }
    .status-pill.complete { background: var(--slate-soft); color: var(--slate); }
    .status-pill.planned { background: var(--paper-warm); color: var(--ink-soft); }
    
    /* MODAL */
    .modal-backdrop {
      position: fixed; inset: 0;
      background: rgba(26, 26, 26, 0.4);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
      padding: 24px;
    }
    .modal {
      background: var(--paper-card);
      border-radius: 12px;
      width: 100%;
      max-width: 640px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: var(--shadow-lg);
    }
    .modal-wide { max-width: 880px; }
    .modal-header {
      padding: 24px 32px;
      border-bottom: 1px solid var(--line);
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .modal-title {
      font-family: 'Fraunces', serif;
      font-size: 24px;
      font-weight: 500;
      letter-spacing: -0.02em;
    }
    .modal-sub {
      font-size: 13px;
      color: var(--ink-soft);
      margin-top: 4px;
    }
    .modal-body { padding: 24px 32px; }
    .modal-footer {
      padding: 20px 32px;
      border-top: 1px solid var(--line);
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
    
    /* FORM */
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .form-grid-full { grid-column: 1 / -1; }
    .field { display: flex; flex-direction: column; gap: 6px; }
    .field label {
      font-size: 11px;
      font-family: 'JetBrains Mono', monospace;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--ink-soft);
      font-weight: 500;
    }
    .field input, .field select, .field textarea {
      padding: 10px 12px;
      border: 1px solid var(--line);
      border-radius: 6px;
      font-family: inherit;
      font-size: 14px;
      background: var(--paper-card);
      color: var(--ink);
      transition: border 0.15s;
    }
    .field input:focus, .field select:focus, .field textarea:focus {
      outline: none;
      border-color: var(--ink);
    }
    .field textarea { resize: vertical; min-height: 80px; }
    .field-hint { font-size: 12px; color: var(--ink-light); }
    
    .checkbox-row {
      display: flex; align-items: center; gap: 10px;
      padding: 10px; border: 1px solid var(--line); border-radius: 6px;
      cursor: pointer;
    }
    .checkbox-row:hover { border-color: var(--ink); }
    .checkbox-row.checked { background: var(--paper-warm); border-color: var(--ink); }
    .checkbox-row input { width: 16px; height: 16px; }
    
    /* LEARNER PROFILE */
    .profile-header {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-bottom: 32px;
      padding: 32px;
      background: var(--paper-card);
      border: 1px solid var(--line);
      border-radius: 12px;
    }
    .profile-avatar {
      width: 72px; height: 72px;
      border-radius: 50%;
      background: var(--ink);
      color: var(--paper);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Fraunces', serif;
      font-weight: 500;
      font-size: 28px;
    }
    .profile-info { flex: 1; }
    .profile-name {
      font-family: 'Fraunces', serif;
      font-size: 32px;
      font-weight: 500;
      letter-spacing: -0.02em;
      margin-bottom: 4px;
    }
    .profile-meta {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      font-size: 13px;
      color: var(--ink-soft);
    }
    .profile-meta-item {
      display: flex; align-items: center; gap: 6px;
    }
    
    /* ENROLLMENT TREE */
    .tree-node {
      background: var(--paper-card);
      border: 1px solid var(--line);
      border-radius: 8px;
      margin-bottom: 12px;
      overflow: hidden;
    }
    .tree-header {
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      transition: background 0.15s;
    }
    .tree-header:hover { background: var(--paper-warm); }
    .tree-icon {
      width: 36px; height: 36px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .tree-icon.apprenticeship { background: var(--accent-soft); color: var(--accent); }
    .tree-icon.qualification { background: var(--moss-soft); color: var(--moss); }
    .tree-icon.unit { background: rgba(184, 137, 63, 0.2); color: var(--gold); }
    .tree-icon.short-course { background: var(--slate-soft); color: var(--slate); }
    .tree-info { flex: 1; }
    .tree-title { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 500; letter-spacing: -0.01em; }
    .tree-sub { font-size: 12px; color: var(--ink-light); font-family: 'JetBrains Mono', monospace; margin-top: 2px; }
    .tree-children { 
      padding: 0 20px 16px 56px;
      border-top: 1px solid var(--line-soft);
      background: var(--paper);
    }
    .tree-children .tree-node { margin-top: 12px; margin-bottom: 0; }
    
    /* DETAIL TABS within enrollment */
    .detail-tabs {
      display: flex;
      gap: 4px;
      background: var(--paper-warm);
      padding: 4px;
      border-radius: 8px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    .detail-tab {
      padding: 8px 14px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      background: none;
      border: none;
      color: var(--ink-soft);
      font-family: inherit;
      display: flex; align-items: center; gap: 6px;
      transition: all 0.15s;
    }
    .detail-tab:hover { color: var(--ink); }
    .detail-tab.active { background: var(--paper-card); color: var(--ink); box-shadow: var(--shadow-sm); }
    
    /* DATA LIST */
    .data-list { display: flex; flex-direction: column; gap: 8px; }
    .data-item {
      padding: 14px 16px;
      background: var(--paper-card);
      border: 1px solid var(--line);
      border-radius: 6px;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .data-item-main { flex: 1; }
    .data-item-title { font-weight: 500; font-size: 14px; }
    .data-item-sub { font-size: 12px; color: var(--ink-light); margin-top: 2px; }
    
    /* KSB GRID */
    .ksb-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 12px;
    }
    .ksb-card {
      padding: 14px;
      background: var(--paper-card);
      border: 1px solid var(--line);
      border-radius: 6px;
    }
    .ksb-id {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.05em;
      padding: 2px 8px;
      border-radius: 3px;
      display: inline-block;
      margin-bottom: 8px;
    }
    .ksb-id.K { background: #e8e2d3; color: #8b7c4c; }
    .ksb-id.S { background: var(--moss-soft); color: var(--moss); }
    .ksb-id.B { background: var(--accent-soft); color: var(--accent); }
    .ksb-desc { font-size: 13px; line-height: 1.4; }
    .ksb-status { 
      display: flex; align-items: center; gap: 6px; 
      font-size: 11px; color: var(--ink-light); margin-top: 8px;
      font-family: 'JetBrains Mono', monospace;
    }
    
    /* GATEWAY CHECKLIST */
    .gateway-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .gateway-item {
      padding: 12px 14px;
      background: var(--paper-card);
      border: 1px solid var(--line);
      border-radius: 6px;
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      font-size: 13px;
    }
    .gateway-item.met { background: var(--moss-soft); border-color: var(--moss); }
    .gateway-item.met .check-icon { color: var(--moss); }
    
    /* OTJ summary */
    .otj-summary {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 20px;
    }
    .stat {
      padding: 20px;
      background: var(--paper-card);
      border: 1px solid var(--line);
      border-radius: 8px;
    }
    .stat-label {
      font-size: 11px;
      font-family: 'JetBrains Mono', monospace;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--ink-light);
      margin-bottom: 8px;
    }
    .stat-value {
      font-family: 'Fraunces', serif;
      font-size: 32px;
      font-weight: 500;
      letter-spacing: -0.02em;
    }
    .stat-sub { font-size: 12px; color: var(--ink-soft); margin-top: 4px; }
    
    /* SECTION */
    .section { margin-bottom: 32px; }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 16px;
    }
    .section-title {
      font-family: 'Fraunces', serif;
      font-size: 22px;
      font-weight: 500;
      letter-spacing: -0.015em;
    }
    .section-tag {
      font-size: 10px;
      font-family: 'JetBrains Mono', monospace;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--ink-light);
    }
    
    /* CHIP-PICKER */
    .chip-picker {
      display: flex; flex-wrap: wrap; gap: 8px;
      padding: 12px;
      background: var(--paper-warm);
      border-radius: 6px;
      min-height: 48px;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 10px;
      background: var(--paper-card);
      border: 1px solid var(--line);
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
    }
    .chip-add {
      padding: 6px 10px;
      background: transparent;
      border: 1px dashed var(--line);
      border-radius: 4px;
      font-size: 12px;
      color: var(--ink-light);
      cursor: pointer;
      font-family: inherit;
      display: flex; align-items: center; gap: 4px;
    }
    .chip-add:hover { color: var(--ink); border-color: var(--ink); }
    
    .picker-list { max-height: 300px; overflow-y: auto; border: 1px solid var(--line); border-radius: 6px; }
    .picker-item {
      padding: 10px 14px;
      border-bottom: 1px solid var(--line-soft);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 12px;
      transition: background 0.1s;
    }
    .picker-item:last-child { border-bottom: none; }
    .picker-item:hover { background: var(--paper-warm); }
    .picker-item.selected { background: var(--accent-soft); }
    
    .info-banner {
      padding: 12px 16px;
      background: var(--paper-warm);
      border-left: 3px solid var(--accent);
      border-radius: 4px;
      font-size: 13px;
      color: var(--ink-soft);
      margin-bottom: 16px;
      display: flex;
      gap: 10px;
      align-items: flex-start;
    }

    /* STATS ROW */
    .stats-row {
      display: flex;
      gap: 28px;
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--line);
    }
    .stat-chip {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: var(--ink-soft);
    }
    .stat-chip .stat-num {
      font-size: 20px;
      font-weight: 700;
      color: var(--accent);
      line-height: 1;
    }

    /* FILTER BAR */
    .filter-bar {
      display: flex;
      gap: 10px;
      align-items: center;
      margin-bottom: 16px;
    }
    .filter-search {
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--paper-card);
      border: 1px solid var(--line);
      border-radius: 6px;
      padding: 7px 12px;
      flex: 1;
      max-width: 340px;
    }
    .filter-search input {
      border: none;
      outline: none;
      font-size: 13.5px;
      font-family: inherit;
      color: var(--ink);
      background: transparent;
      width: 100%;
    }
    .filter-search input::placeholder { color: var(--ink-light); }
    .filter-select {
      padding: 7px 10px;
      border: 1px solid var(--line);
      border-radius: 6px;
      font-size: 13.5px;
      font-family: inherit;
      background: var(--paper-card);
      color: var(--ink);
      cursor: pointer;
    }
    .filter-count {
      margin-left: auto;
      font-size: 13px;
      color: var(--ink-light);
    }

    /* DATA TABLE */
    .data-table-wrap {
      background: var(--paper-card);
      border: 1px solid var(--line);
      border-radius: 8px;
      overflow: hidden;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
    }
    .data-table th {
      padding: 11px 16px;
      text-align: left;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      color: var(--ink-light);
      background: var(--paper-card);
      border-bottom: 1px solid var(--line);
      white-space: nowrap;
    }
    .data-table td {
      padding: 14px 16px;
      font-size: 13.5px;
      border-bottom: 1px solid var(--line-soft);
      color: var(--ink);
    }
    .data-table tr:last-child td { border-bottom: none; }
    .data-table tbody tr:hover { background: var(--paper); cursor: pointer; }
    .table-empty-row td {
      text-align: center;
      color: var(--ink-light);
      padding: 48px 16px;
      font-size: 14px;
    }
    .table-empty-row td:hover { background: none; cursor: default; }
  `;

  // ============================================
  // SIDEBAR
  // ============================================
  const Sidebar = () => (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-name">IN-COMM</span>
        <span className="brand-badge">DLE</span>
      </div>
      <nav className="nav">
        <div className="nav-label">Library</div>
        <button
          className={`nav-item ${view.page === "library" && libraryTab === "apprenticeship" ? "active" : ""}`}
          onClick={() => {
            setView({ page: "library" });
            setLibraryTab("apprenticeship");
          }}
        >
          <Award size={15} /> Apprenticeships
        </button>
        <button
          className={`nav-item ${view.page === "library" && libraryTab === "qualification" ? "active" : ""}`}
          onClick={() => {
            setView({ page: "library" });
            setLibraryTab("qualification");
          }}
        >
          <GraduationCap size={15} /> Qualifications
        </button>
        <button
          className={`nav-item ${view.page === "library" && libraryTab === "short_course" ? "active" : ""}`}
          onClick={() => {
            setView({ page: "library" });
            setLibraryTab("short_course");
          }}
        >
          <BookOpen size={15} /> Short Courses
        </button>
        <button
          className={`nav-item ${view.page === "library" && libraryTab === "unit" ? "active" : ""}`}
          onClick={() => {
            setView({ page: "library" });
            setLibraryTab("unit");
          }}
        >
          <Layers size={15} /> Units
        </button>
        <div className="nav-label" style={{ marginTop: 16 }}>
          Learners
        </div>
        <button
          className={`nav-item ${view.page === "learners" || view.page.startsWith("learner") ? "active" : ""}`}
          onClick={() => setView({ page: "learners" })}
        >
          <Users size={15} /> Learners
        </button>
      </nav>
    </aside>
  );

  // ============================================
  // TOPBAR
  // ============================================
  const Topbar = () => (
    <header className="topbar">
      <div className="topbar-search">
        <Search size={15} color="var(--ink-light)" />
        <input placeholder="Search programmes, learners, KSBs..." />
      </div>
      <div className="topbar-actions">
        <button className="topbar-icon-btn" title="Notifications">
          <Bell size={16} />
        </button>
        <button className="topbar-icon-btn" title="Settings">
          <Settings size={16} />
        </button>
        <button
          className="topbar-icon-btn"
          title="Help"
          style={{ fontWeight: 700 }}
        >
          ?
        </button>
        <button className="topbar-signout">Sign out</button>
      </div>
    </header>
  );

  // ============================================
  // LIBRARY PAGE
  // ============================================
  const [libraryTab, setLibraryTab] = useState("apprenticeship");

  const LibraryPage = () => {
    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [levelFilter, setLevelFilter] = useState("all");

    const tabConfig = {
      apprenticeship: {
        label: "Apprenticeships",
        subtitle:
          "Asset library — standards, KSBs, qualifications, and EPA configurations",
        items: apprenticeships,
        buttonLabel: "New Apprenticeship",
        columns: [
          "Name",
          "Standard Ref",
          "Level",
          "Sector",
          "KSBs",
          "Quals",
          "EPA",
          "Status",
        ],
        emptyMsg: "No apprenticeships match your filters.",
      },
      qualification: {
        label: "Qualifications",
        subtitle:
          "Manage qualification templates used within apprenticeships and standalone programmes.",
        items: qualifications,
        buttonLabel: "New Qualification",
        columns: ["Name", "Level", "Awarding Body", "Units", "Status"],
        emptyMsg: "No qualifications match your filters.",
      },
      short_course: {
        label: "Short Courses",
        subtitle:
          "Define short course templates for standalone or embedded delivery.",
        items: shortCourses,
        buttonLabel: "New Short Course",
        columns: ["Name", "Code", "Duration", "Status"],
        emptyMsg: "No short courses match your filters.",
      },
      unit: {
        label: "Units",
        subtitle:
          "Reusable unit templates that can be attached to qualifications.",
        items: units,
        buttonLabel: "New Unit",
        columns: ["Name", "Code", "Mandatory/Elective", "Status"],
        emptyMsg: "No units match your filters.",
      },
    };

    const cfg = tabConfig[libraryTab];
    const allItems = cfg.items;

    const filtered = allItems.filter((item) => {
      const nameMatch =
        !searchText ||
        (item.name || "").toLowerCase().includes(searchText.toLowerCase());
      const statusMatch =
        statusFilter === "all" || (item.status || "draft") === statusFilter;
      const levelMatch =
        levelFilter === "all" ||
        (item.programme_level &&
          String(item.programme_level) === levelFilter) ||
        (item.qualification_level &&
          String(item.qualification_level) === levelFilter);
      return nameMatch && statusMatch && levelMatch;
    });

    const totalCount = allItems.length;
    const activeCount = allItems.filter(
      (i) => (i.status || "") === "active",
    ).length;
    const draftCount = allItems.filter(
      (i) => !i.status || i.status === "draft",
    ).length;

    const renderRow = (item) => {
      if (libraryTab === "apprenticeship") {
        const ksbCount = ksbs.filter(
          (k) => k.apprenticeship_id === item.id,
        ).length;
        return (
          <tr
            key={item.id}
            onClick={() =>
              setModal({
                type: "view-template",
                templateType: libraryTab,
                item,
              })
            }
          >
            <td style={{ fontWeight: 500 }}>{item.name}</td>
            <td>{item.standard_code || "—"}</td>
            <td>
              {item.programme_level ? `Level ${item.programme_level}` : "—"}
            </td>
            <td>{item.sector || "—"}</td>
            <td>{ksbCount}</td>
            <td>
              {qualifications.filter((q) => q.apprenticeship_id === item.id)
                .length || "—"}
            </td>
            <td>{item.epa_organisation || "—"}</td>
            <td>
              <span className={`status-pill ${item.status || "draft"}`}>
                {item.status || "draft"}
              </span>
            </td>
          </tr>
        );
      }
      if (libraryTab === "qualification") {
        const unitCount = units.filter(
          (u) => u.qualification_id === item.id,
        ).length;
        return (
          <tr
            key={item.id}
            onClick={() =>
              setModal({
                type: "view-template",
                templateType: libraryTab,
                item,
              })
            }
          >
            <td style={{ fontWeight: 500 }}>{item.name}</td>
            <td>
              {item.qualification_level
                ? `Level ${item.qualification_level}`
                : "—"}
            </td>
            <td>{item.awarding_body || "—"}</td>
            <td>{unitCount}</td>
            <td>
              <span className={`status-pill ${item.status || "draft"}`}>
                {item.status || "draft"}
              </span>
            </td>
          </tr>
        );
      }
      if (libraryTab === "short_course") {
        return (
          <tr
            key={item.id}
            onClick={() =>
              setModal({
                type: "view-template",
                templateType: libraryTab,
                item,
              })
            }
          >
            <td style={{ fontWeight: 500 }}>{item.name}</td>
            <td>{item.course_code || "—"}</td>
            <td>{item.duration || "—"}</td>
            <td>
              <span className={`status-pill ${item.status || "draft"}`}>
                {item.status || "draft"}
              </span>
            </td>
          </tr>
        );
      }
      if (libraryTab === "unit") {
        return (
          <tr
            key={item.id}
            onClick={() =>
              setModal({
                type: "view-template",
                templateType: libraryTab,
                item,
              })
            }
          >
            <td style={{ fontWeight: 500 }}>{item.name}</td>
            <td>{item.unit_code || "—"}</td>
            <td>{item.mandatory_or_elective || "—"}</td>
            <td>
              <span className={`status-pill ${item.status || "draft"}`}>
                {item.status || "draft"}
              </span>
            </td>
          </tr>
        );
      }
      return null;
    };

    return (
      <main className="main">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">{cfg.label}</h1>
            <p className="page-subtitle">{cfg.subtitle}</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() =>
              setModal({ type: "create-template", templateType: libraryTab })
            }
          >
            <Plus size={14} /> {cfg.buttonLabel}
          </button>
        </div>

        <div className="stats-row">
          <div className="stat-chip">
            <span className="stat-num">{totalCount}</span>
            <span>Total</span>
          </div>
          <div className="stat-chip">
            <span className="stat-num">{activeCount}</span>
            <span>Active</span>
          </div>
          <div className="stat-chip">
            <span className="stat-num">{draftCount}</span>
            <span>Draft</span>
          </div>
        </div>

        <div className="filter-bar">
          <div className="filter-search">
            <Search size={14} color="var(--ink-light)" />
            <input
              placeholder={`Search by name, standard ref, sector...`}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
          </select>
          <select
            className="filter-select"
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
          >
            <option value="all">All</option>
            {[2, 3, 4, 5, 6, 7].map((l) => (
              <option key={l} value={String(l)}>
                Level {l}
              </option>
            ))}
          </select>
          <span className="filter-count">
            {filtered.length} {cfg.label.toLowerCase()}
          </span>
        </div>

        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                {cfg.columns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr className="table-empty-row">
                  <td colSpan={cfg.columns.length}>{cfg.emptyMsg}</td>
                </tr>
              ) : (
                filtered.map((item) => renderRow(item))
              )}
            </tbody>
          </table>
        </div>
      </main>
    );
  };

  // ============================================
  // LEARNERS LIST
  // ============================================
  const LearnersPage = () => (
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
          Browse, manage, and build learning plans for individual learners. Each
          learner has their own enrollment record with per-learner data captured
          at the point of enrollment.
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
            Add learners to begin building their learning plans. You'll be able
            to enrol them on apprenticeships and standalone qualifications,
            units, or short courses.
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
                    : "No plan items"}
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

  // ============================================
  // LEARNER PROFILE  (also = their learning plan)
  // ============================================
  const [profileView, setProfileView] = useState({ tab: "plan" });

  const LearnerProfile = () => {
    const learner = getLearner(view.learnerId);
    if (!learner) return null;
    const e = getLearnerEnrollments(learner.id);
    const plan = planItems.filter((pi) => pi.learner_id === learner.id);

    return (
      <main className="main">
        <div className="breadcrumb" style={{ marginBottom: 24 }}>
          <button onClick={() => setView({ page: "learners" })}>
            <Home
              size={12}
              style={{ verticalAlign: "middle", marginRight: 6 }}
            />
            Learners
          </button>
          <span className="sep">/</span>
          <span>{learner.full_name}</span>
        </div>

        <div className="profile-header">
          <div className="profile-avatar">
            {(learner.full_name || "?")
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </div>
          <div className="profile-info">
            <div className="profile-name">{learner.full_name}</div>
            <div className="profile-meta">
              <div className="profile-meta-item">
                <Hash size={12} /> ULN: {learner.uln || "—"}
              </div>
              <div className="profile-meta-item">
                <Briefcase size={12} /> {learner.employer || "No employer"}
              </div>
              <div className="profile-meta-item">
                <Users size={12} /> Tutor:{" "}
                {learner.tutor_or_case_owner || "Unassigned"}
              </div>
              <div className="profile-meta-item">
                <Calendar size={12} /> DOB: {learner.date_of_birth || "—"}
              </div>
            </div>
          </div>
          <span
            className={`status-pill ${learner.learner_status || "planned"}`}
          >
            {learner.learner_status || "planned"}
          </span>
        </div>

        <div className="section-header">
          <div>
            <div className="section-tag">Learning Plan</div>
            <div className="section-title">Enrolled programmes</div>
          </div>
          <button
            className="btn btn-primary"
            onClick={() =>
              setModal({ type: "add-plan-item", learnerId: learner.id })
            }
          >
            <Plus size={14} /> Add to plan
          </button>
        </div>

        {plan.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">
              <GraduationCap size={24} />
            </div>
            <div className="empty-title">Empty learning plan</div>
            <div className="empty-text">
              Pull templates from the library to enrol this learner. They can be
              on a single apprenticeship, multiple standalone qualifications,
              units, or short courses — or any combination.
            </div>
            <button
              className="btn btn-primary"
              onClick={() =>
                setModal({ type: "add-plan-item", learnerId: learner.id })
              }
            >
              <Plus size={14} /> Pull from library
            </button>
          </div>
        ) : (
          <div>
            {plan.map((pi) => {
              if (pi.enrollment_type === "apprenticeship") {
                const enr = e.apprenticeships.find(
                  (a) => a.id === pi.enrollment_id,
                );
                if (!enr) return null;
                const tmpl = getTemplate(
                  "apprenticeship",
                  enr.apprenticeship_id,
                );
                const childQuals = e.qualifications.filter(
                  (q) => q.parent_enrollment_id === enr.id,
                );
                const childCourses = e.shortCourses.filter(
                  (s) => s.parent_enrollment_id === enr.id,
                );
                return (
                  <div key={pi.id} className="tree-node">
                    <div
                      className="tree-header"
                      onClick={() =>
                        setView({
                          page: "enrollment-detail",
                          enrollmentType: "apprenticeship",
                          enrollmentId: enr.id,
                          learnerId: learner.id,
                        })
                      }
                    >
                      <div className="tree-icon apprenticeship">
                        <Award size={18} />
                      </div>
                      <div className="tree-info">
                        <div className="tree-title">
                          {tmpl?.name || "Apprenticeship"}
                        </div>
                        <div className="tree-sub">
                          APPRENTICESHIP · {childQuals.length} qual
                          {childQuals.length === 1 ? "" : "s"} ·{" "}
                          {childCourses.length} short course
                          {childCourses.length === 1 ? "" : "s"} · started{" "}
                          {enr.start_date || "tbd"}
                        </div>
                      </div>
                      <span
                        className={`status-pill ${enr.status || "planned"}`}
                      >
                        {enr.status || "planned"}
                      </span>
                      <ChevronRight size={16} color="var(--ink-light)" />
                    </div>
                    {(childQuals.length > 0 || childCourses.length > 0) && (
                      <div className="tree-children">
                        {childQuals.map((qe) => {
                          const qtmpl = getTemplate(
                            "qualification",
                            qe.qualification_id,
                          );
                          const childUnits = e.units.filter(
                            (u) => u.parent_enrollment_id === qe.id,
                          );
                          return (
                            <div key={qe.id} className="tree-node">
                              <div
                                className="tree-header"
                                onClick={() =>
                                  setView({
                                    page: "enrollment-detail",
                                    enrollmentType: "qualification",
                                    enrollmentId: qe.id,
                                    learnerId: learner.id,
                                  })
                                }
                              >
                                <div className="tree-icon qualification">
                                  <GraduationCap size={16} />
                                </div>
                                <div className="tree-info">
                                  <div
                                    className="tree-title"
                                    style={{ fontSize: 16 }}
                                  >
                                    {qtmpl?.name}
                                  </div>
                                  <div className="tree-sub">
                                    QUALIFICATION · Reg #
                                    {qe.registration_number || "pending"} ·{" "}
                                    {childUnits.length} unit
                                    {childUnits.length === 1 ? "" : "s"}
                                  </div>
                                </div>
                                <span
                                  className={`status-pill ${qe.status || "planned"}`}
                                >
                                  {qe.status || "planned"}
                                </span>
                                <ChevronRight
                                  size={16}
                                  color="var(--ink-light)"
                                />
                              </div>
                              {childUnits.length > 0 && (
                                <div className="tree-children">
                                  {childUnits.map((ue) => {
                                    const utmpl = getTemplate(
                                      "unit",
                                      ue.unit_id,
                                    );
                                    return (
                                      <div
                                        key={ue.id}
                                        className="data-item"
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                          setView({
                                            page: "enrollment-detail",
                                            enrollmentType: "unit",
                                            enrollmentId: ue.id,
                                            learnerId: learner.id,
                                          })
                                        }
                                      >
                                        <div
                                          className="tree-icon unit"
                                          style={{ width: 28, height: 28 }}
                                        >
                                          <Layers size={14} />
                                        </div>
                                        <div className="data-item-main">
                                          <div className="data-item-title">
                                            {utmpl?.name}
                                          </div>
                                          <div className="data-item-sub">
                                            {utmpl?.unit_code || ""} ·{" "}
                                            {utmpl?.mandatory_or_elective || ""}
                                          </div>
                                        </div>
                                        <span
                                          className={`status-pill ${ue.status || "planned"}`}
                                        >
                                          {ue.status || "planned"}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                        {childCourses.map((se) => {
                          const stmpl = getTemplate(
                            "short_course",
                            se.short_course_id,
                          );
                          return (
                            <div
                              key={se.id}
                              className="data-item"
                              style={{ marginTop: 12, cursor: "pointer" }}
                              onClick={() =>
                                setView({
                                  page: "enrollment-detail",
                                  enrollmentType: "short_course",
                                  enrollmentId: se.id,
                                  learnerId: learner.id,
                                })
                              }
                            >
                              <div
                                className="tree-icon short-course"
                                style={{ width: 32, height: 32 }}
                              >
                                <BookOpen size={14} />
                              </div>
                              <div className="data-item-main">
                                <div className="data-item-title">
                                  {stmpl?.name}
                                </div>
                                <div className="data-item-sub">
                                  SHORT COURSE · {stmpl?.course_code || ""}
                                </div>
                              </div>
                              <span
                                className={`status-pill ${se.status || "planned"}`}
                              >
                                {se.status || "planned"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }
              // Standalone qual
              if (pi.enrollment_type === "qualification") {
                const enr = e.qualifications.find(
                  (q) => q.id === pi.enrollment_id,
                );
                if (!enr) return null;
                const tmpl = getTemplate("qualification", enr.qualification_id);
                const childUnits = e.units.filter(
                  (u) => u.parent_enrollment_id === enr.id,
                );
                return (
                  <div key={pi.id} className="tree-node">
                    <div
                      className="tree-header"
                      onClick={() =>
                        setView({
                          page: "enrollment-detail",
                          enrollmentType: "qualification",
                          enrollmentId: enr.id,
                          learnerId: learner.id,
                        })
                      }
                    >
                      <div className="tree-icon qualification">
                        <GraduationCap size={18} />
                      </div>
                      <div className="tree-info">
                        <div className="tree-title">{tmpl?.name}</div>
                        <div className="tree-sub">
                          STANDALONE QUALIFICATION · Reg #
                          {enr.registration_number || "pending"} ·{" "}
                          {childUnits.length} unit
                          {childUnits.length === 1 ? "" : "s"}
                        </div>
                      </div>
                      <span
                        className={`status-pill ${enr.status || "planned"}`}
                      >
                        {enr.status || "planned"}
                      </span>
                      <ChevronRight size={16} color="var(--ink-light)" />
                    </div>
                    {childUnits.length > 0 && (
                      <div className="tree-children">
                        {childUnits.map((ue) => {
                          const utmpl = getTemplate("unit", ue.unit_id);
                          return (
                            <div
                              key={ue.id}
                              className="data-item"
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                setView({
                                  page: "enrollment-detail",
                                  enrollmentType: "unit",
                                  enrollmentId: ue.id,
                                  learnerId: learner.id,
                                })
                              }
                            >
                              <div
                                className="tree-icon unit"
                                style={{ width: 28, height: 28 }}
                              >
                                <Layers size={14} />
                              </div>
                              <div className="data-item-main">
                                <div className="data-item-title">
                                  {utmpl?.name}
                                </div>
                                <div className="data-item-sub">
                                  {utmpl?.unit_code || ""}
                                </div>
                              </div>
                              <span
                                className={`status-pill ${ue.status || "planned"}`}
                              >
                                {ue.status || "planned"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }
              // Standalone unit / short course
              if (pi.enrollment_type === "unit") {
                const enr = e.units.find((u) => u.id === pi.enrollment_id);
                if (!enr) return null;
                const tmpl = getTemplate("unit", enr.unit_id);
                return (
                  <div key={pi.id} className="tree-node">
                    <div
                      className="tree-header"
                      onClick={() =>
                        setView({
                          page: "enrollment-detail",
                          enrollmentType: "unit",
                          enrollmentId: enr.id,
                          learnerId: learner.id,
                        })
                      }
                    >
                      <div className="tree-icon unit">
                        <Layers size={18} />
                      </div>
                      <div className="tree-info">
                        <div className="tree-title">{tmpl?.name}</div>
                        <div className="tree-sub">
                          STANDALONE UNIT · {tmpl?.unit_code || ""}
                        </div>
                      </div>
                      <span
                        className={`status-pill ${enr.status || "planned"}`}
                      >
                        {enr.status || "planned"}
                      </span>
                      <ChevronRight size={16} color="var(--ink-light)" />
                    </div>
                  </div>
                );
              }
              if (pi.enrollment_type === "short_course") {
                const enr = e.shortCourses.find(
                  (s) => s.id === pi.enrollment_id,
                );
                if (!enr) return null;
                const tmpl = getTemplate("short_course", enr.short_course_id);
                return (
                  <div key={pi.id} className="tree-node">
                    <div
                      className="tree-header"
                      onClick={() =>
                        setView({
                          page: "enrollment-detail",
                          enrollmentType: "short_course",
                          enrollmentId: enr.id,
                          learnerId: learner.id,
                        })
                      }
                    >
                      <div className="tree-icon short-course">
                        <BookOpen size={18} />
                      </div>
                      <div className="tree-info">
                        <div className="tree-title">{tmpl?.name}</div>
                        <div className="tree-sub">
                          STANDALONE SHORT COURSE · {tmpl?.course_code || ""}
                        </div>
                      </div>
                      <span
                        className={`status-pill ${enr.status || "planned"}`}
                      >
                        {enr.status || "planned"}
                      </span>
                      <ChevronRight size={16} color="var(--ink-light)" />
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}
      </main>
    );
  };

  // ============================================
  // ENROLLMENT DETAIL — drill in to manage assignments, KSBs, OTJ, gateway
  // ============================================
  const [enrollDetailTab, setEnrollDetailTab] = useState("overview");

  const EnrollmentDetail = () => {
    const learner = getLearner(view.learnerId);
    const { enrollmentType, enrollmentId } = view;

    let enrollment,
      template,
      parentInfo = null;
    if (enrollmentType === "apprenticeship") {
      enrollment = apprenticeshipEnrollments.find((x) => x.id === enrollmentId);
      template =
        enrollment &&
        getTemplate("apprenticeship", enrollment.apprenticeship_id);
    } else if (enrollmentType === "qualification") {
      enrollment = qualEnrollments.find((x) => x.id === enrollmentId);
      template =
        enrollment && getTemplate("qualification", enrollment.qualification_id);
    } else if (enrollmentType === "unit") {
      enrollment = unitEnrollments.find((x) => x.id === enrollmentId);
      template = enrollment && getTemplate("unit", enrollment.unit_id);
    } else if (enrollmentType === "short_course") {
      enrollment = shortCourseEnrollments.find((x) => x.id === enrollmentId);
      template =
        enrollment && getTemplate("short_course", enrollment.short_course_id);
    }

    if (!enrollment || !learner) return null;

    // Filter assignments for this enrollment
    const myAssignments = learnerAssignments.filter(
      (a) =>
        a.parent_enrollment_id === enrollment.id &&
        a.parent_enrollment_type === enrollmentType,
    );

    // Filter KSBs (only for apprenticeship)
    const myKsbs =
      enrollmentType === "apprenticeship"
        ? learnerKsbs.filter(
            (lk) => lk.apprenticeship_enrollment_id === enrollment.id,
          )
        : [];
    const myOtj =
      enrollmentType === "apprenticeship"
        ? otjHours.filter(
            (o) => o.apprenticeship_enrollment_id === enrollment.id,
          )
        : [];
    const myGateway =
      enrollmentType === "apprenticeship"
        ? gateways.find((g) => g.apprenticeship_enrollment_id === enrollment.id)
        : null;

    const totalOtj = myOtj.reduce(
      (s, o) => s + (parseFloat(o.hours_logged) || 0),
      0,
    );
    const minOtj = template?.min_otj_hours || 0;

    const tabs =
      enrollmentType === "apprenticeship"
        ? [
            { id: "overview", label: "Overview", icon: FileText },
            { id: "assignments", label: "Assignments", icon: FileText },
            { id: "ksbs", label: "KSBs", icon: Target },
            { id: "otj", label: "OTJ Hours", icon: Clock },
            { id: "gateway", label: "Gateway", icon: CheckCircle2 },
          ]
        : [
            { id: "overview", label: "Overview", icon: FileText },
            { id: "assignments", label: "Assignments", icon: FileText },
          ];

    const typeLabel = {
      apprenticeship: "Apprenticeship",
      qualification: "Qualification",
      unit: "Unit",
      short_course: "Short Course",
    }[enrollmentType];
    const TypeIcon = {
      apprenticeship: Award,
      qualification: GraduationCap,
      unit: Layers,
      short_course: BookOpen,
    }[enrollmentType];
    const typeClass =
      enrollmentType === "short_course" ? "short-course" : enrollmentType;

    return (
      <main className="main">
        <div className="breadcrumb" style={{ marginBottom: 24 }}>
          <button onClick={() => setView({ page: "learners" })}>
            <Home
              size={12}
              style={{ verticalAlign: "middle", marginRight: 6 }}
            />
            Learners
          </button>
          <span className="sep">/</span>
          <button
            onClick={() =>
              setView({ page: "learner-profile", learnerId: learner.id })
            }
          >
            {learner.full_name}
          </button>
          <span className="sep">/</span>
          <span>{template?.name}</span>
        </div>

        <div className="profile-header">
          <div
            className={`tree-icon ${typeClass}`}
            style={{ width: 56, height: 56 }}
          >
            <TypeIcon size={24} />
          </div>
          <div className="profile-info">
            <div className="section-tag">{typeLabel} enrollment</div>
            <div className="profile-name">{template?.name}</div>
            <div className="profile-meta">
              {enrollmentType === "qualification" && (
                <>
                  <div className="profile-meta-item">
                    <Hash size={12} /> Reg #:{" "}
                    {enrollment.registration_number || "—"}
                  </div>
                  <div className="profile-meta-item">
                    <Calendar size={12} /> Reg date:{" "}
                    {enrollment.registration_date || "—"}
                  </div>
                  <div className="profile-meta-item">
                    <Calendar size={12} /> Cert claim:{" "}
                    {enrollment.certificate_claim_date || "—"}
                  </div>
                </>
              )}
              {enrollmentType === "apprenticeship" && (
                <>
                  <div className="profile-meta-item">
                    <Calendar size={12} /> Started:{" "}
                    {enrollment.start_date || "—"}
                  </div>
                  <div className="profile-meta-item">
                    <Calendar size={12} /> Planned end:{" "}
                    {enrollment.planned_end_date || "—"}
                  </div>
                  <div className="profile-meta-item">
                    <Target size={12} /> Gateway:{" "}
                    {enrollment.estimated_gateway_date || "—"}
                  </div>
                </>
              )}
              {enrollmentType === "unit" && (
                <>
                  <div className="profile-meta-item">
                    <Calendar size={12} /> Started:{" "}
                    {enrollment.start_date || "—"}
                  </div>
                  <div className="profile-meta-item">
                    Grade: {enrollment.grade || "pending"}
                  </div>
                </>
              )}
              {enrollmentType === "short_course" && (
                <>
                  <div className="profile-meta-item">
                    <Calendar size={12} /> Started:{" "}
                    {enrollment.start_date || "—"}
                  </div>
                  <div className="profile-meta-item">
                    Cert: {enrollment.certificate_received_date || "—"}
                  </div>
                </>
              )}
            </div>
          </div>
          <button
            className="btn btn-secondary"
            onClick={() =>
              setModal({ type: "edit-enrollment", enrollmentType, enrollment })
            }
          >
            Edit details
          </button>
        </div>

        <div className="detail-tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`detail-tab ${enrollDetailTab === t.id ? "active" : ""}`}
              onClick={() => setEnrollDetailTab(t.id)}
            >
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>

        {enrollDetailTab === "overview" && (
          <div>
            <div className="info-banner">
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                This is the per-learner enrollment record. Template version is
                pinned at <strong>{enrollment.template_version || "v1"}</strong>{" "}
                — future template changes won't disturb this learner's pathway.
              </div>
            </div>

            {enrollmentType === "apprenticeship" && (
              <div className="otj-summary">
                <div className="stat">
                  <div className="stat-label">OTJ Hours</div>
                  <div className="stat-value">
                    {totalOtj}
                    <span style={{ fontSize: 16, color: "var(--ink-light)" }}>
                      {" "}
                      / {minOtj}
                    </span>
                  </div>
                  <div className="stat-sub">
                    {minOtj > 0
                      ? `${Math.round((totalOtj / minOtj) * 100)}% of minimum`
                      : "no minimum set"}
                  </div>
                </div>
                <div className="stat">
                  <div className="stat-label">KSBs Achieved</div>
                  <div className="stat-value">
                    {myKsbs.filter((k) => k.status === "achieved").length}
                    <span style={{ fontSize: 16, color: "var(--ink-light)" }}>
                      {" "}
                      / {myKsbs.length}
                    </span>
                  </div>
                  <div className="stat-sub">
                    {myKsbs.length === 0
                      ? "no KSBs initialised"
                      : `${myKsbs.length - myKsbs.filter((k) => k.status === "achieved").length} outstanding`}
                  </div>
                </div>
                <div className="stat">
                  <div className="stat-label">Assignments</div>
                  <div className="stat-value">{myAssignments.length}</div>
                  <div className="stat-sub">across the enrollment</div>
                </div>
              </div>
            )}
          </div>
        )}

        {enrollDetailTab === "assignments" && (
          <div>
            <div className="toolbar">
              <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>
                {myAssignments.length} assignment
                {myAssignments.length === 1 ? "" : "s"} attached at this level
              </div>
              <button
                className="btn btn-primary"
                onClick={() =>
                  setModal({
                    type: "create-assignment",
                    enrollment,
                    enrollmentType,
                    learnerId: learner.id,
                  })
                }
              >
                <Plus size={14} /> New assignment
              </button>
            </div>
            {myAssignments.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">
                  <FileText size={24} />
                </div>
                <div className="empty-title">No assignments yet</div>
                <div className="empty-text">
                  Create an assignment at the {typeLabel.toLowerCase()} level.
                  Assignments can be attached at apprenticeship, qualification,
                  or unit level — wherever the assessment naturally lives.
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    setModal({
                      type: "create-assignment",
                      enrollment,
                      enrollmentType,
                      learnerId: learner.id,
                    })
                  }
                >
                  <Plus size={14} /> Create first assignment
                </button>
              </div>
            ) : (
              <div className="data-list">
                {myAssignments.map((a) => (
                  <div key={a.id} className="data-item">
                    <div
                      className="tree-icon"
                      style={{
                        width: 36,
                        height: 36,
                        background: "var(--paper-warm)",
                      }}
                    >
                      <FileText size={16} />
                    </div>
                    <div className="data-item-main">
                      <div className="data-item-title">{a.title}</div>
                      <div className="data-item-sub">
                        Deadline: {a.deadline || "—"} ·
                        {a.submission_date
                          ? ` Submitted: ${a.submission_date} · `
                          : " Not submitted · "}
                        Grade: {a.mark_or_grade || "pending"}
                      </div>
                    </div>
                    {a.ksb_links && a.ksb_links.length > 0 && (
                      <div
                        style={{
                          fontSize: 11,
                          fontFamily: "JetBrains Mono, monospace",
                          color: "var(--ink-light)",
                        }}
                      >
                        {a.ksb_links.length} KSB
                        {a.ksb_links.length === 1 ? "" : "s"}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {enrollDetailTab === "ksbs" && enrollmentType === "apprenticeship" && (
          <div>
            <div className="info-banner">
              <Target size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                KSBs (Knowledge, Skills, Behaviours) are defined on the
                apprenticeship template and instantiated per learner. Mark each
                as achieved as evidence is gathered.
              </div>
            </div>
            <div className="toolbar">
              <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>
                {myKsbs.length} KSB{myKsbs.length === 1 ? "" : "s"} tracked
              </div>
              <button
                className="btn btn-primary"
                onClick={() =>
                  setModal({
                    type: "init-ksbs",
                    enrollment,
                    learnerId: learner.id,
                  })
                }
              >
                {myKsbs.length === 0
                  ? "Initialise KSBs from template"
                  : "Re-sync from template"}
              </button>
            </div>
            {myKsbs.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">
                  <Target size={24} />
                </div>
                <div className="empty-title">No KSBs tracked yet</div>
                <div className="empty-text">
                  Initialise KSBs from the apprenticeship template to begin
                  tracking achievement against each Knowledge, Skill, and
                  Behaviour.
                </div>
              </div>
            ) : (
              <div className="ksb-grid">
                {myKsbs.map((lk) => {
                  const ksb = ksbs.find((k) => k.id === lk.ksb_id);
                  return (
                    <div key={lk.id} className="ksb-card">
                      <span className={`ksb-id ${ksb?.type || "K"}`}>
                        {ksb?.code || lk.ksb_id}
                      </span>
                      <div className="ksb-desc">{ksb?.description || "—"}</div>
                      <div className="ksb-status">
                        {lk.status === "achieved" ? (
                          <CheckCircle2 size={12} />
                        ) : (
                          <Circle size={12} />
                        )}
                        {lk.status || "not started"}
                        {lk.met_by && ` · met via ${lk.met_by}`}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {enrollDetailTab === "otj" && enrollmentType === "apprenticeship" && (
          <div>
            <div className="otj-summary">
              <div className="stat">
                <div className="stat-label">Logged</div>
                <div className="stat-value">{totalOtj}h</div>
              </div>
              <div className="stat">
                <div className="stat-label">Required minimum</div>
                <div className="stat-value">{minOtj}h</div>
              </div>
              <div className="stat">
                <div className="stat-label">Remaining</div>
                <div className="stat-value">
                  {Math.max(0, minOtj - totalOtj)}h
                </div>
              </div>
            </div>
            <div className="toolbar">
              <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>
                {myOtj.length} log entr{myOtj.length === 1 ? "y" : "ies"}
              </div>
              <button
                className="btn btn-primary"
                onClick={() =>
                  setModal({
                    type: "log-otj",
                    enrollment,
                    learnerId: learner.id,
                  })
                }
              >
                <Plus size={14} /> Log hours
              </button>
            </div>
            {myOtj.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">
                  <Clock size={24} />
                </div>
                <div className="empty-title">No OTJ hours logged</div>
                <div className="empty-text">
                  Log off-the-job training hours to track progress against the
                  minimum required for this apprenticeship.
                </div>
              </div>
            ) : (
              <div className="data-list">
                {myOtj.map((o) => (
                  <div key={o.id} className="data-item">
                    <div
                      className="tree-icon"
                      style={{
                        width: 36,
                        height: 36,
                        background: "var(--paper-warm)",
                      }}
                    >
                      <Clock size={16} />
                    </div>
                    <div className="data-item-main">
                      <div className="data-item-title">
                        {o.hours_logged}h · {o.source_type || "training"}
                      </div>
                      <div className="data-item-sub">
                        {o.date} · {o.description || "no description"} ·
                        verified by {o.verified_by || "—"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {enrollDetailTab === "gateway" &&
          enrollmentType === "apprenticeship" && (
            <div>
              <div className="info-banner">
                <CheckCircle2
                  size={16}
                  style={{ flexShrink: 0, marginTop: 1 }}
                />
                <div>
                  Gateway is the formal point of progression to End-Point
                  Assessment. All criteria must be met and signed off before EPA
                  notification.
                </div>
              </div>
              <div className="toolbar">
                <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>
                  {myGateway?.gateway_confirmed_date
                    ? `Gateway confirmed ${myGateway.gateway_confirmed_date}`
                    : "Gateway not yet confirmed"}
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    setModal({
                      type: "edit-gateway",
                      enrollment,
                      gateway: myGateway,
                      learnerId: learner.id,
                    })
                  }
                >
                  {myGateway ? "Update gateway" : "Begin gateway checklist"}
                </button>
              </div>
              {myGateway && (
                <div className="gateway-grid">
                  {[
                    ["all_quals_complete", "All qualifications complete"],
                    ["functional_skills_met", "Functional skills met"],
                    ["min_otj_hours_met", "Minimum OTJ hours met"],
                    ["all_ksbs_achieved", "All KSBs achieved"],
                    ["all_reviews_signed", "All reviews signed"],
                    ["iqa_final_complete", "IQA final complete"],
                    ["employer_confirmed", "Employer confirmed"],
                    ["exam_officer_signoff", "Exam officer sign-off"],
                    ["mock_epa_completed", "Mock EPA completed"],
                  ].map(([key, label]) => (
                    <div
                      key={key}
                      className={`gateway-item ${myGateway[key] ? "met" : ""}`}
                    >
                      {myGateway[key] ? (
                        <CheckCircle2 size={16} className="check-icon" />
                      ) : (
                        <Circle size={16} color="var(--ink-light)" />
                      )}
                      {label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
      </main>
    );
  };

  // ============================================
  // MODALS
  // ============================================
  const [formData, setFormData] = useState({});
  React.useEffect(() => {
    if (modal) setFormData({});
  }, [modal?.type, modal?.templateType, modal?.enrollment?.id]);

  const closeModal = () => {
    setModal(null);
    setFormData({});
  };

  const renderModal = () => {
    if (!modal) return null;

    // === CREATE TEMPLATE ===
    if (modal.type === "create-template") {
      const t = modal.templateType;
      const labels = {
        apprenticeship: "Apprenticeship",
        qualification: "Qualification",
        unit: "Unit",
        short_course: "Short Course",
      };

      const handleSave = () => {
        const id = newId(t);
        const item = { id, name: formData.name, ...formData };
        if (t === "apprenticeship")
          setApprenticeships([...apprenticeships, item]);
        if (t === "qualification") setQualifications([...qualifications, item]);
        if (t === "unit") setUnits([...units, item]);
        if (t === "short_course") setShortCourses([...shortCourses, item]);
        closeModal();
      };

      return (
        <div className="modal-backdrop" onClick={closeModal}>
          <div
            className="modal modal-wide"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <div className="section-tag">New template</div>
                <div className="modal-title">{labels[t]}</div>
                <div className="modal-sub">
                  Define structural fields. Per-learner data is captured at
                  enrollment.
                </div>
              </div>
              <button className="btn btn-ghost" onClick={closeModal}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="field form-grid-full">
                  <label>Name</label>
                  <input
                    value={formData.name || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder={`e.g. ${t === "apprenticeship" ? "Digital Marketer L3" : t === "qualification" ? "L3 Diploma in Business Admin" : t === "unit" ? "Principles of Business Communication" : "GDPR Foundation"}`}
                  />
                </div>

                {t === "apprenticeship" && (
                  <>
                    <div className="field">
                      <label>Standard code</label>
                      <input
                        value={formData.standard_code || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            standard_code: e.target.value,
                          })
                        }
                        placeholder="ST0122"
                      />
                    </div>
                    <div className="field">
                      <label>Pathway</label>
                      <input
                        value={formData.pathway || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, pathway: e.target.value })
                        }
                      />
                    </div>
                    <div className="field">
                      <label>Programme level</label>
                      <input
                        type="number"
                        value={formData.programme_level || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            programme_level: e.target.value,
                          })
                        }
                        placeholder="3"
                      />
                    </div>
                    <div className="field">
                      <label>Delivery mode</label>
                      <select
                        value={formData.delivery_mode || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            delivery_mode: e.target.value,
                          })
                        }
                      >
                        <option value="">Select…</option>
                        <option>Part Time</option>
                        <option>Full Time</option>
                      </select>
                    </div>
                    <div className="field">
                      <label>Programme length</label>
                      <input
                        value={formData.programme_length || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            programme_length: e.target.value,
                          })
                        }
                        placeholder="18 months"
                      />
                    </div>
                    <div className="field">
                      <label>EPA length</label>
                      <input
                        value={formData.epa_length || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            epa_length: e.target.value,
                          })
                        }
                        placeholder="3 months"
                      />
                    </div>
                    {/* <div className="field">
                      <label>Funding body</label>
                      <input
                        value={formData.funding_body || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            funding_body: e.target.value,
                          })
                        }
                      />
                    </div> */}
                    {/* <div className="field">
                      <label>Awarding body</label>
                      <input
                        value={formData.awarding_body || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            awarding_body: e.target.value,
                          })
                        }
                      />
                    </div> */}
                    <div className="field">
                      <label>Min OTJ hours</label>
                      <input
                        type="number"
                        value={formData.min_otj_hours || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            min_otj_hours: e.target.value,
                          })
                        }
                        placeholder="278"
                      />
                    </div>
                    <div className="field">
                      <label>EPA grade options</label>
                      <input
                        value={formData.epa_grade_options || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            epa_grade_options: e.target.value,
                          })
                        }
                        placeholder="pass / merit / distinction"
                      />
                    </div>
                    <div className="field">
                      <label>Sector</label>
                      <input
                        value={formData.sector || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, sector: e.target.value })
                        }
                        placeholder="e.g. Digital"
                      />
                    </div>
                  </>
                )}

                {t === "qualification" && (
                  <>
                    <div className="field">
                      <label>Qualification level</label>
                      <input
                        type="number"
                        value={formData.qualification_level || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            qualification_level: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="field">
                      <label>Awarding body</label>
                      <input
                        value={formData.awarding_body || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            awarding_body: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="field">
                      <label>Duration</label>
                      <input
                        value={formData.qualification_duration || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            qualification_duration: e.target.value,
                          })
                        }
                        placeholder="12 months"
                      />
                    </div>
                    <div className="field">
                      <label>Sector</label>
                      <input
                        value={formData.sector || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, sector: e.target.value })
                        }
                      />
                    </div>
                    <div
                      className="field form-grid-full"
                      style={{ flexDirection: "row", gap: 16 }}
                    >
                      <label
                        className={`checkbox-row ${formData.has_units ? "checked" : ""}`}
                        style={{ flex: 1 }}
                      >
                        <input
                          type="checkbox"
                          checked={!!formData.has_units}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              has_units: e.target.checked,
                            })
                          }
                        />
                        <span>Contains units</span>
                      </label>
                      <label
                        className={`checkbox-row ${formData.has_assignments ? "checked" : ""}`}
                        style={{ flex: 1 }}
                      >
                        <input
                          type="checkbox"
                          checked={!!formData.has_assignments}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              has_assignments: e.target.checked,
                            })
                          }
                        />
                        <span>Has assignments</span>
                      </label>
                    </div>
                  </>
                )}

                {t === "unit" && (
                  <>
                    <div className="field">
                      <label>Unit code</label>
                      <input
                        value={formData.unit_code || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            unit_code: e.target.value,
                          })
                        }
                        placeholder="A/506/1942"
                      />
                    </div>
                    <div className="field">
                      <label>Sequence number</label>
                      <input
                        type="number"
                        value={formData.sequence_number || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sequence_number: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="field">
                      <label>Mandatory or elective</label>
                      <select
                        value={formData.mandatory_or_elective || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            mandatory_or_elective: e.target.value,
                          })
                        }
                      >
                        <option value="">Select…</option>
                        <option>mandatory</option>
                        <option>elective</option>
                      </select>
                    </div>
                    <div className="field">
                      <label>Sits inside qualification</label>
                      <select
                        value={formData.qualification_id || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            qualification_id: e.target.value,
                          })
                        }
                      >
                        <option value="">Standalone</option>
                        {qualifications.map((q) => (
                          <option key={q.id} value={q.id}>
                            {q.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {t === "short_course" && (
                  <>
                    <div className="field">
                      <label>Course code</label>
                      <input
                        value={formData.course_code || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            course_code: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="field">
                      <label>Duration</label>
                      <input
                        value={formData.duration || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, duration: e.target.value })
                        }
                        placeholder="2 days"
                      />
                    </div>
                    <div className="field">
                      <label>Sector</label>
                      <input
                        value={formData.sector || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, sector: e.target.value })
                        }
                      />
                    </div>
                    <div
                      className="field form-grid-full"
                      style={{ flexDirection: "row", gap: 16 }}
                    >
                      <label
                        className={`checkbox-row ${formData.has_assessment ? "checked" : ""}`}
                        style={{ flex: 1 }}
                      >
                        <input
                          type="checkbox"
                          checked={!!formData.has_assessment}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              has_assessment: e.target.checked,
                            })
                          }
                        />
                        <span>Has assessment</span>
                      </label>
                      <label
                        className={`checkbox-row ${formData.produces_certificate ? "checked" : ""}`}
                        style={{ flex: 1 }}
                      >
                        <input
                          type="checkbox"
                          checked={!!formData.produces_certificate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              produces_certificate: e.target.checked,
                            })
                          }
                        />
                        <span>Produces certificate</span>
                      </label>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={!formData.name}
              >
                Create template
              </button>
            </div>
          </div>
        </div>
      );
    }

    // === VIEW TEMPLATE ===
    if (modal.type === "view-template") {
      const { templateType } = modal;
      // Always read the freshest item from state so updates (KSBs, quals) are reflected immediately
      const item =
        (templateType === "apprenticeship"
          ? apprenticeships.find((a) => a.id === modal.item.id)
          : templateType === "qualification"
            ? qualifications.find((q) => q.id === modal.item.id)
            : templateType === "unit"
              ? units.find((u) => u.id === modal.item.id)
              : shortCourses.find((s) => s.id === modal.item.id)) || modal.item;
      const labels = {
        apprenticeship: "Apprenticeship",
        qualification: "Qualification",
        unit: "Unit",
        short_course: "Short Course",
      };

      // Show structural composition
      const childQuals =
        templateType === "apprenticeship"
          ? qualifications.filter((q) =>
              (item.qualification_ids || []).includes(q.id),
            )
          : [];
      const childCourses =
        templateType === "apprenticeship"
          ? shortCourses.filter((s) =>
              (item.short_course_ids || []).includes(s.id),
            )
          : [];
      const childUnits =
        templateType === "qualification"
          ? units.filter((u) => u.qualification_id === item.id)
          : [];
      const myKsbs =
        templateType === "apprenticeship"
          ? ksbs.filter((k) => k.apprenticeship_id === item.id)
          : [];

      return (
        <div className="modal-backdrop" onClick={closeModal}>
          <div
            className="modal modal-wide"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <div className="section-tag">
                  {labels[templateType]} template
                </div>
                <div className="modal-title">{item.name}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  className={`status-pill ${item.status || "draft"}`}
                  style={{ cursor: "pointer", border: "none", fontWeight: 600 }}
                  onClick={() => {
                    const next =
                      (item.status || "draft") === "draft" ? "active" : "draft";
                    const updated = { ...item, status: next };
                    if (templateType === "apprenticeship")
                      setApprenticeships(
                        apprenticeships.map((a) =>
                          a.id === item.id ? updated : a,
                        ),
                      );
                    if (templateType === "qualification")
                      setQualifications(
                        qualifications.map((q) =>
                          q.id === item.id ? updated : q,
                        ),
                      );
                    if (templateType === "unit")
                      setUnits(
                        units.map((u) => (u.id === item.id ? updated : u)),
                      );
                    if (templateType === "short_course")
                      setShortCourses(
                        shortCourses.map((s) =>
                          s.id === item.id ? updated : s,
                        ),
                      );
                    setModal({ ...modal, item: updated });
                  }}
                  title="Click to toggle status"
                >
                  {item.status || "draft"}
                </button>
                <button className="btn btn-ghost" onClick={closeModal}>
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: 24 }}>
                <div className="section-tag" style={{ marginBottom: 8 }}>
                  Template fields
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                  }}
                >
                  {Object.entries(item)
                    .filter(([k]) => k !== "id" && k !== "name")
                    .map(([k, v]) => (
                      <div key={k} style={{ fontSize: 13 }}>
                        <span
                          style={{
                            color: "var(--ink-light)",
                            fontFamily: "JetBrains Mono, monospace",
                            fontSize: 11,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          {k.replace(/_/g, " ")}
                        </span>
                        <br />
                        <span>
                          {Array.isArray(v)
                            ? `${v.length} items`
                            : typeof v === "boolean"
                              ? v
                                ? "yes"
                                : "no"
                              : v || "—"}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {templateType === "apprenticeship" && (
                <>
                  <div style={{ marginBottom: 24 }}>
                    <div className="section-header">
                      <div className="section-tag">
                        Composition · Qualifications
                      </div>
                      <button
                        className="btn btn-ghost"
                        onClick={() =>
                          setModal({
                            type: "compose-apprenticeship",
                            item,
                            mode: "qualifications",
                          })
                        }
                      >
                        + Add
                      </button>
                    </div>
                    {childQuals.length === 0 ? (
                      <div style={{ fontSize: 13, color: "var(--ink-light)" }}>
                        No qualifications attached.
                      </div>
                    ) : (
                      <div className="data-list">
                        {childQuals.map((q) => (
                          <div key={q.id} className="data-item">
                            <GraduationCap size={14} color="var(--moss)" />
                            <div className="data-item-main">
                              <div className="data-item-title">{q.name}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <div className="section-header">
                      <div className="section-tag">
                        Composition · Short Courses
                      </div>
                      <button
                        className="btn btn-ghost"
                        onClick={() =>
                          setModal({
                            type: "compose-apprenticeship",
                            item,
                            mode: "short_courses",
                          })
                        }
                      >
                        + Add
                      </button>
                    </div>
                    {childCourses.length === 0 ? (
                      <div style={{ fontSize: 13, color: "var(--ink-light)" }}>
                        No short courses attached.
                      </div>
                    ) : (
                      <div className="data-list">
                        {childCourses.map((s) => (
                          <div key={s.id} className="data-item">
                            <BookOpen size={14} color="var(--slate)" />
                            <div className="data-item-main">
                              <div className="data-item-title">{s.name}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="section-header">
                      <div className="section-tag">
                        KSBs · Knowledge, Skills, Behaviours
                      </div>
                      <button
                        className="btn btn-ghost"
                        onClick={() =>
                          setModal({
                            type: "add-ksb",
                            apprenticeshipId: item.id,
                          })
                        }
                      >
                        + Add KSB
                      </button>
                    </div>
                    {myKsbs.length === 0 ? (
                      <div style={{ fontSize: 13, color: "var(--ink-light)" }}>
                        No KSBs defined yet.
                      </div>
                    ) : (
                      <div className="ksb-grid">
                        {myKsbs.map((k) => (
                          <div key={k.id} className="ksb-card">
                            <span className={`ksb-id ${k.type}`}>{k.code}</span>
                            <div className="ksb-desc">{k.description}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {templateType === "qualification" && (
                <div>
                  <div className="section-header">
                    <div className="section-tag">
                      Units inside this qualification
                    </div>
                  </div>
                  {childUnits.length === 0 ? (
                    <div style={{ fontSize: 13, color: "var(--ink-light)" }}>
                      No units. Create units in the library and assign them to
                      this qualification.
                    </div>
                  ) : (
                    <div className="data-list">
                      {childUnits.map((u) => (
                        <div key={u.id} className="data-item">
                          <Layers size={14} color="var(--gold)" />
                          <div className="data-item-main">
                            <div className="data-item-title">{u.name}</div>
                            <div className="data-item-sub">
                              {u.unit_code} · {u.mandatory_or_elective}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // === COMPOSE APPRENTICESHIP (attach quals/courses) ===
    if (modal.type === "compose-apprenticeship") {
      const { item, mode } = modal;
      const pool = mode === "qualifications" ? qualifications : shortCourses;
      const fieldKey =
        mode === "qualifications" ? "qualification_ids" : "short_course_ids";
      const current = item[fieldKey] || [];

      const toggle = (id) => {
        const next = current.includes(id)
          ? current.filter((x) => x !== id)
          : [...current, id];
        const updated = { ...item, [fieldKey]: next };
        setApprenticeships(
          apprenticeships.map((a) => (a.id === item.id ? updated : a)),
        );
        setModal({ ...modal, item: updated });
      };

      return (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="section-tag">Compose apprenticeship</div>
                <div className="modal-title">
                  Attach{" "}
                  {mode === "qualifications"
                    ? "qualifications"
                    : "short courses"}
                </div>
                <div className="modal-sub">Tap to toggle.</div>
              </div>
              <button className="btn btn-ghost" onClick={closeModal}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              {pool.length === 0 ? (
                <div className="empty-text">
                  No{" "}
                  {mode === "qualifications"
                    ? "qualifications"
                    : "short courses"}{" "}
                  in the library yet. Create them first.
                </div>
              ) : (
                <div className="picker-list">
                  {pool.map((p) => (
                    <div
                      key={p.id}
                      className={`picker-item ${current.includes(p.id) ? "selected" : ""}`}
                      onClick={() => toggle(p.id)}
                    >
                      {current.includes(p.id) ? (
                        <CheckCircle2 size={16} color="var(--accent)" />
                      ) : (
                        <Circle size={16} color="var(--ink-light)" />
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, fontSize: 14 }}>
                          {p.name}
                        </div>
                        <div
                          style={{ fontSize: 12, color: "var(--ink-light)" }}
                        >
                          {p.qualification_level
                            ? `Level ${p.qualification_level}`
                            : ""}
                          {p.course_code || ""}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-primary"
                onClick={() => {
                  const fresh =
                    apprenticeships.find((a) => a.id === item.id) || item;
                  setModal({
                    type: "view-template",
                    templateType: "apprenticeship",
                    item: fresh,
                  });
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      );
    }

    // === ADD KSB ===
    if (modal.type === "add-ksb") {
      const handleSave = () => {
        setKsbs([
          ...ksbs,
          {
            id: newId("ksb"),
            apprenticeship_id: modal.apprenticeshipId,
            code: formData.code,
            type: formData.type || "K",
            description: formData.description,
            mandatory: formData.mandatory !== false,
          },
        ]);
        // Return to view-template so user sees the new KSB immediately
        const appr = apprenticeships.find(
          (a) => a.id === modal.apprenticeshipId,
        );
        if (appr) {
          setModal({
            type: "view-template",
            templateType: "apprenticeship",
            item: appr,
          });
          setFormData({});
        } else {
          closeModal();
        }
      };
      return (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Add KSB</div>
              <button className="btn btn-ghost" onClick={closeModal}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="field">
                  <label>Code</label>
                  <input
                    value={formData.code || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    placeholder="K1"
                  />
                </div>
                <div className="field">
                  <label>Type</label>
                  <select
                    value={formData.type || "K"}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                  >
                    <option value="K">Knowledge</option>
                    <option value="S">Skill</option>
                    <option value="B">Behaviour</option>
                  </select>
                </div>
                <div className="field form-grid-full">
                  <label>Description</label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="What this KSB covers…"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={!formData.code}
              >
                Add KSB
              </button>
            </div>
          </div>
        </div>
      );
    }

    // === CREATE LEARNER ===
    if (modal.type === "create-learner") {
      const handleSave = () => {
        setLearners([
          ...learners,
          { id: newId("learner"), ...formData, learner_status: "planned" },
        ]);
        closeModal();
      };
      return (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Add learner</div>
              <button className="btn btn-ghost" onClick={closeModal}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="field form-grid-full">
                  <label>Full name</label>
                  <input
                    value={formData.full_name || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                  />
                </div>
                <div className="field">
                  <label>ULN</label>
                  <input
                    value={formData.uln || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, uln: e.target.value })
                    }
                  />
                </div>
                <div className="field">
                  <label>Date of birth</label>
                  <input
                    type="date"
                    value={formData.date_of_birth || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        date_of_birth: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="field">
                  <label>Employer</label>
                  <input
                    value={formData.employer || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, employer: e.target.value })
                    }
                  />
                </div>
                <div className="field">
                  <label>Workplace manager</label>
                  <input
                    value={formData.workplace_manager || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        workplace_manager: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="field">
                  <label>Tutor / case owner</label>
                  <input
                    value={formData.tutor_or_case_owner || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tutor_or_case_owner: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="field">
                  <label>SEN requirements</label>
                  <input
                    value={formData.sen_requirements || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sen_requirements: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={!formData.full_name}
              >
                Add learner
              </button>
            </div>
          </div>
        </div>
      );
    }

    // === ADD PLAN ITEM ===
    if (modal.type === "add-plan-item") {
      const learnerId = modal.learnerId;
      const itemType = formData.item_type || "apprenticeship";
      const pool = {
        apprenticeship: apprenticeships,
        qualification: qualifications,
        unit: units,
        short_course: shortCourses,
      }[itemType];

      const handleSave = () => {
        if (!formData.template_id) return;
        const tmpl = pool.find((p) => p.id === formData.template_id);
        const planItemId = newId("pi");
        let enrollmentId, enrollmentRecord;

        if (itemType === "apprenticeship") {
          enrollmentId = newId("enr_app");
          enrollmentRecord = {
            id: enrollmentId,
            learner_id: learnerId,
            apprenticeship_id: tmpl.id,
            template_version: "v1",
            status: "planned",
            start_date: formData.start_date,
          };
          setApprenticeshipEnrollments((prev) => [...prev, enrollmentRecord]);

          // CASCADE: create child enrollments for embedded quals + short courses
          const newQualEnrs = [],
            newUnitEnrs = [],
            newCourseEnrs = [];
          (tmpl.qualification_ids || []).forEach((qid) => {
            const qe = {
              id: newId("enr_qual"),
              learner_id: learnerId,
              qualification_id: qid,
              parent_enrollment_id: enrollmentId,
              template_version: "v1",
              status: "planned",
            };
            newQualEnrs.push(qe);
            // cascade units
            const qUnits = units.filter((u) => u.qualification_id === qid);
            qUnits.forEach((u) =>
              newUnitEnrs.push({
                id: newId("enr_unit"),
                learner_id: learnerId,
                unit_id: u.id,
                parent_enrollment_id: qe.id,
                status: "planned",
              }),
            );
          });
          (tmpl.short_course_ids || []).forEach((sid) => {
            newCourseEnrs.push({
              id: newId("enr_sc"),
              learner_id: learnerId,
              short_course_id: sid,
              parent_enrollment_id: enrollmentId,
              status: "planned",
            });
          });
          if (newQualEnrs.length)
            setQualEnrollments((prev) => [...prev, ...newQualEnrs]);
          if (newUnitEnrs.length)
            setUnitEnrollments((prev) => [...prev, ...newUnitEnrs]);
          if (newCourseEnrs.length)
            setShortCourseEnrollments((prev) => [...prev, ...newCourseEnrs]);
        } else if (itemType === "qualification") {
          enrollmentId = newId("enr_qual");
          enrollmentRecord = {
            id: enrollmentId,
            learner_id: learnerId,
            qualification_id: tmpl.id,
            parent_enrollment_id: null,
            template_version: "v1",
            status: "planned",
            registration_number: formData.registration_number,
            registration_date: formData.registration_date,
          };
          setQualEnrollments((prev) => [...prev, enrollmentRecord]);
          // cascade units
          const qUnits = units.filter((u) => u.qualification_id === tmpl.id);
          if (qUnits.length) {
            const newUnits = qUnits.map((u) => ({
              id: newId("enr_unit"),
              learner_id: learnerId,
              unit_id: u.id,
              parent_enrollment_id: enrollmentId,
              status: "planned",
            }));
            setUnitEnrollments((prev) => [...prev, ...newUnits]);
          }
        } else if (itemType === "unit") {
          enrollmentId = newId("enr_unit");
          enrollmentRecord = {
            id: enrollmentId,
            learner_id: learnerId,
            unit_id: tmpl.id,
            parent_enrollment_id: null,
            status: "planned",
          };
          setUnitEnrollments((prev) => [...prev, enrollmentRecord]);
        } else if (itemType === "short_course") {
          enrollmentId = newId("enr_sc");
          enrollmentRecord = {
            id: enrollmentId,
            learner_id: learnerId,
            short_course_id: tmpl.id,
            parent_enrollment_id: null,
            status: "planned",
          };
          setShortCourseEnrollments((prev) => [...prev, enrollmentRecord]);
        }

        setPlanItems((prev) => [
          ...prev,
          {
            id: planItemId,
            learner_id: learnerId,
            plan_id: "plan_" + learnerId,
            enrollment_type: itemType,
            enrollment_id: enrollmentId,
          },
        ]);
        closeModal();
      };

      return (
        <div className="modal-backdrop" onClick={closeModal}>
          <div
            className="modal modal-wide"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <div className="section-tag">Pull from library</div>
                <div className="modal-title">Add to learning plan</div>
                <div className="modal-sub">
                  Choose what to enrol this learner on. Apprenticeships will
                  cascade-enrol any contained qualifications, units, and short
                  courses.
                </div>
              </div>
              <button className="btn btn-ghost" onClick={closeModal}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="field" style={{ marginBottom: 16 }}>
                <label>What are you adding?</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[
                    ["apprenticeship", "Apprenticeship", Award],
                    [
                      "qualification",
                      "Standalone qualification",
                      GraduationCap,
                    ],
                    ["unit", "Standalone unit", Layers],
                    ["short_course", "Short course", BookOpen],
                  ].map(([id, label, Icon]) => (
                    <button
                      key={id}
                      className={`tab ${itemType === id ? "active" : ""}`}
                      style={{
                        borderBottom:
                          itemType === id
                            ? "2px solid var(--accent)"
                            : "2px solid transparent",
                      }}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          item_type: id,
                          template_id: null,
                        })
                      }
                    >
                      <Icon size={14} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {pool.length === 0 ? (
                <div className="empty-text">
                  No {itemType.replace("_", " ")} templates in the library.
                  Create one first.
                </div>
              ) : (
                <div className="picker-list" style={{ marginBottom: 16 }}>
                  {pool.map((p) => (
                    <div
                      key={p.id}
                      className={`picker-item ${formData.template_id === p.id ? "selected" : ""}`}
                      onClick={() =>
                        setFormData({ ...formData, template_id: p.id })
                      }
                    >
                      {formData.template_id === p.id ? (
                        <CheckCircle2 size={16} color="var(--accent)" />
                      ) : (
                        <Circle size={16} color="var(--ink-light)" />
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, fontSize: 14 }}>
                          {p.name}
                        </div>
                        <div
                          style={{ fontSize: 12, color: "var(--ink-light)" }}
                        >
                          {p.standard_code ||
                            p.unit_code ||
                            p.course_code ||
                            ""}{" "}
                          {p.qualification_level
                            ? `· L${p.qualification_level}`
                            : ""}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {formData.template_id && (
                <>
                  <div className="info-banner">
                    <AlertCircle
                      size={16}
                      style={{ flexShrink: 0, marginTop: 1 }}
                    />
                    <div>
                      The fields below will be saved on the learner's enrollment
                      record — not on the template. Each learner has their own
                      values.
                    </div>
                  </div>
                  <div className="form-grid">
                    <div className="field">
                      <label>Start date</label>
                      <input
                        type="date"
                        value={formData.start_date || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            start_date: e.target.value,
                          })
                        }
                      />
                    </div>
                    {itemType === "qualification" && (
                      <>
                        <div className="field">
                          <label>Registration number</label>
                          <input
                            value={formData.registration_number || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                registration_number: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="field">
                          <label>Registration date</label>
                          <input
                            type="date"
                            value={formData.registration_date || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                registration_date: e.target.value,
                              })
                            }
                          />
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={!formData.template_id}
              >
                Enrol learner
              </button>
            </div>
          </div>
        </div>
      );
    }

    // === EDIT ENROLLMENT ===
    if (modal.type === "edit-enrollment") {
      const { enrollment, enrollmentType: et } = modal;
      const handleSave = () => {
        const updated = { ...enrollment, ...formData };
        if (et === "apprenticeship")
          setApprenticeshipEnrollments(
            apprenticeshipEnrollments.map((x) =>
              x.id === enrollment.id ? updated : x,
            ),
          );
        if (et === "qualification")
          setQualEnrollments(
            qualEnrollments.map((x) => (x.id === enrollment.id ? updated : x)),
          );
        if (et === "unit")
          setUnitEnrollments(
            unitEnrollments.map((x) => (x.id === enrollment.id ? updated : x)),
          );
        if (et === "short_course")
          setShortCourseEnrollments(
            shortCourseEnrollments.map((x) =>
              x.id === enrollment.id ? updated : x,
            ),
          );
        closeModal();
      };
      return (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Edit enrollment details</div>
              <button className="btn btn-ghost" onClick={closeModal}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="field">
                  <label>Status</label>
                  <select
                    defaultValue={enrollment.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="planned">planned</option>
                    <option value="active">active</option>
                    <option value="gateway">gateway</option>
                    <option value="complete">complete</option>
                  </select>
                </div>
                <div className="field">
                  <label>Start date</label>
                  <input
                    type="date"
                    defaultValue={enrollment.start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                  />
                </div>

                {et === "apprenticeship" && (
                  <>
                    <div className="field">
                      <label>Planned end date</label>
                      <input
                        type="date"
                        defaultValue={enrollment.planned_end_date}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            planned_end_date: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="field">
                      <label>Estimated gateway</label>
                      <input
                        type="date"
                        defaultValue={enrollment.estimated_gateway_date}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            estimated_gateway_date: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="field">
                      <label>Practical gateway</label>
                      <input
                        type="date"
                        defaultValue={enrollment.practical_gateway_date}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            practical_gateway_date: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="field">
                      <label>EPA date</label>
                      <input
                        type="date"
                        defaultValue={enrollment.epa_date}
                        onChange={(e) =>
                          setFormData({ ...formData, epa_date: e.target.value })
                        }
                      />
                    </div>
                  </>
                )}
                {et === "qualification" && (
                  <>
                    <div className="field">
                      <label>Registration number</label>
                      <input
                        defaultValue={enrollment.registration_number}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            registration_number: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="field">
                      <label>Registration date</label>
                      <input
                        type="date"
                        defaultValue={enrollment.registration_date}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            registration_date: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="field">
                      <label>End date</label>
                      <input
                        type="date"
                        defaultValue={enrollment.end_date}
                        onChange={(e) =>
                          setFormData({ ...formData, end_date: e.target.value })
                        }
                      />
                    </div>
                    <div className="field">
                      <label>Certificate claim date</label>
                      <input
                        type="date"
                        defaultValue={enrollment.certificate_claim_date}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            certificate_claim_date: e.target.value,
                          })
                        }
                      />
                    </div>
                  </>
                )}
                {et === "unit" && (
                  <>
                    <div className="field">
                      <label>Completion date</label>
                      <input
                        type="date"
                        defaultValue={enrollment.completion_date}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            completion_date: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="field">
                      <label>Grade</label>
                      <input
                        defaultValue={enrollment.grade}
                        onChange={(e) =>
                          setFormData({ ...formData, grade: e.target.value })
                        }
                      />
                    </div>
                  </>
                )}
                {et === "short_course" && (
                  <>
                    <div className="field">
                      <label>Completion date</label>
                      <input
                        type="date"
                        defaultValue={enrollment.completion_date}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            completion_date: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="field">
                      <label>Certificate received date</label>
                      <input
                        type="date"
                        defaultValue={enrollment.certificate_received_date}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            certificate_received_date: e.target.value,
                          })
                        }
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                Save changes
              </button>
            </div>
          </div>
        </div>
      );
    }

    // === CREATE ASSIGNMENT ===
    if (modal.type === "create-assignment") {
      const { enrollment, enrollmentType: et, learnerId } = modal;
      const apprId =
        et === "apprenticeship" ? enrollment.apprenticeship_id : null;
      const availableKsbs = apprId
        ? ksbs.filter((k) => k.apprenticeship_id === apprId)
        : [];
      // For nested unit/qual, find the parent apprenticeship to get KSBs
      let rootApprId = apprId;
      if (!rootApprId) {
        if (et === "qualification" && enrollment.parent_enrollment_id) {
          const parentApp = apprenticeshipEnrollments.find(
            (a) => a.id === enrollment.parent_enrollment_id,
          );
          rootApprId = parentApp?.apprenticeship_id;
        } else if (et === "unit" && enrollment.parent_enrollment_id) {
          const parentQual = qualEnrollments.find(
            (q) => q.id === enrollment.parent_enrollment_id,
          );
          if (parentQual?.parent_enrollment_id) {
            const parentApp = apprenticeshipEnrollments.find(
              (a) => a.id === parentQual.parent_enrollment_id,
            );
            rootApprId = parentApp?.apprenticeship_id;
          }
        }
      }
      const linkableKsbs = rootApprId
        ? ksbs.filter((k) => k.apprenticeship_id === rootApprId)
        : [];

      const toggleKsb = (id) => {
        const links = formData.ksb_links || [];
        setFormData({
          ...formData,
          ksb_links: links.includes(id)
            ? links.filter((x) => x !== id)
            : [...links, id],
        });
      };

      const handleSave = () => {
        setLearnerAssignments([
          ...learnerAssignments,
          {
            id: newId("asn"),
            learner_id: learnerId,
            parent_enrollment_id: enrollment.id,
            parent_enrollment_type: et,
            title: formData.title,
            deadline: formData.deadline,
            submission_date: formData.submission_date,
            mark_or_grade: formData.mark_or_grade,
            assessor_feedback: formData.assessor_feedback,
            ksb_links: formData.ksb_links || [],
          },
        ]);
        closeModal();
      };

      return (
        <div className="modal-backdrop" onClick={closeModal}>
          <div
            className="modal modal-wide"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <div className="section-tag">
                  New assignment · attached to {et}
                </div>
                <div className="modal-title">Create assignment</div>
                <div className="modal-sub">
                  This assignment will be linked to this enrollment
                  specifically. KSB links are only available when the assignment
                  sits within an apprenticeship pathway.
                </div>
              </div>
              <button className="btn btn-ghost" onClick={closeModal}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="field form-grid-full">
                  <label>Title</label>
                  <input
                    value={formData.title || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>
                <div className="field">
                  <label>Deadline</label>
                  <input
                    type="date"
                    value={formData.deadline || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, deadline: e.target.value })
                    }
                  />
                </div>
                <div className="field">
                  <label>Submission date</label>
                  <input
                    type="date"
                    value={formData.submission_date || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        submission_date: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="field">
                  <label>Mark / grade</label>
                  <input
                    value={formData.mark_or_grade || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mark_or_grade: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="field">
                  <label>Assessor feedback</label>
                  <textarea
                    value={formData.assessor_feedback || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        assessor_feedback: e.target.value,
                      })
                    }
                  />
                </div>
                {linkableKsbs.length > 0 && (
                  <div className="field form-grid-full">
                    <label>
                      Link to KSBs ({(formData.ksb_links || []).length}{" "}
                      selected)
                    </label>
                    <div className="chip-picker">
                      {linkableKsbs.map((k) => (
                        <span
                          key={k.id}
                          className="chip"
                          onClick={() => toggleKsb(k.id)}
                          style={{
                            background: (formData.ksb_links || []).includes(
                              k.id,
                            )
                              ? "var(--accent-soft)"
                              : "var(--paper-card)",
                            borderColor: (formData.ksb_links || []).includes(
                              k.id,
                            )
                              ? "var(--accent)"
                              : "var(--line)",
                          }}
                        >
                          {(formData.ksb_links || []).includes(k.id) ? (
                            <CheckCircle2 size={12} />
                          ) : (
                            <Circle size={12} />
                          )}
                          {k.code}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={!formData.title}
              >
                Create assignment
              </button>
            </div>
          </div>
        </div>
      );
    }

    // === INIT KSBs FOR LEARNER ===
    if (modal.type === "init-ksbs") {
      const { enrollment, learnerId } = modal;
      const apprKsbs = ksbs.filter(
        (k) => k.apprenticeship_id === enrollment.apprenticeship_id,
      );
      const handleSave = () => {
        const existing = learnerKsbs
          .filter((lk) => lk.apprenticeship_enrollment_id === enrollment.id)
          .map((lk) => lk.ksb_id);
        const newRecords = apprKsbs
          .filter((k) => !existing.includes(k.id))
          .map((k) => ({
            id: newId("lk"),
            apprenticeship_enrollment_id: enrollment.id,
            ksb_id: k.id,
            status: "not started",
          }));
        setLearnerKsbs([...learnerKsbs, ...newRecords]);
        closeModal();
      };
      return (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Initialise KSBs</div>
              <button className="btn btn-ghost" onClick={closeModal}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p
                style={{
                  fontSize: 14,
                  color: "var(--ink-soft)",
                  marginBottom: 16,
                }}
              >
                This will create per-learner KSB tracking records for all{" "}
                {apprKsbs.length} KSBs defined on the apprenticeship template.
                Each will start as "not started".
              </p>
              {apprKsbs.length === 0 && (
                <div className="info-banner">
                  <AlertCircle size={16} />
                  <div>
                    No KSBs are defined on the template yet. Add some via the
                    library first.
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={apprKsbs.length === 0}
              >
                Initialise {apprKsbs.length} KSBs
              </button>
            </div>
          </div>
        </div>
      );
    }

    // === LOG OTJ ===
    if (modal.type === "log-otj") {
      const handleSave = () => {
        setOtjHours([
          ...otjHours,
          {
            id: newId("otj"),
            apprenticeship_enrollment_id: modal.enrollment.id,
            ...formData,
          },
        ]);
        closeModal();
      };
      return (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Log OTJ hours</div>
              <button className="btn btn-ghost" onClick={closeModal}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="field">
                  <label>Date</label>
                  <input
                    type="date"
                    value={formData.date || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                </div>
                <div className="field">
                  <label>Hours</label>
                  <input
                    type="number"
                    step="0.25"
                    value={formData.hours_logged || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, hours_logged: e.target.value })
                    }
                  />
                </div>
                <div className="field">
                  <label>Source type</label>
                  <select
                    value={formData.source_type || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, source_type: e.target.value })
                    }
                  >
                    <option value="">Select…</option>
                    <option>training</option>
                    <option>workplace learning</option>
                    <option>self-study</option>
                    <option>shadowing</option>
                    <option>other</option>
                  </select>
                </div>
                <div className="field">
                  <label>Verified by</label>
                  <input
                    value={formData.verified_by || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, verified_by: e.target.value })
                    }
                  />
                </div>
                <div className="field form-grid-full">
                  <label>Description</label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={!formData.hours_logged}
              >
                Log hours
              </button>
            </div>
          </div>
        </div>
      );
    }

    // === EDIT GATEWAY ===
    if (modal.type === "edit-gateway") {
      const existing = modal.gateway;
      const handleSave = () => {
        if (existing) {
          setGateways(
            gateways.map((g) =>
              g.id === existing.id ? { ...existing, ...formData } : g,
            ),
          );
        } else {
          setGateways([
            ...gateways,
            {
              id: newId("gw"),
              apprenticeship_enrollment_id: modal.enrollment.id,
              ...formData,
            },
          ]);
        }
        closeModal();
      };
      const checkboxes = [
        ["all_quals_complete", "All qualifications complete"],
        ["functional_skills_met", "Functional skills met"],
        ["min_otj_hours_met", "Minimum OTJ hours met"],
        ["all_ksbs_achieved", "All KSBs achieved"],
        ["all_reviews_signed", "All reviews signed"],
        ["iqa_final_complete", "IQA final complete"],
        ["employer_confirmed", "Employer confirmed"],
        ["exam_officer_signoff", "Exam officer sign-off"],
        ["mock_epa_completed", "Mock EPA completed"],
      ];
      return (
        <div className="modal-backdrop" onClick={closeModal}>
          <div
            className="modal modal-wide"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <div className="section-tag">Gateway checklist</div>
                <div className="modal-title">Progress to EPA</div>
              </div>
              <button className="btn btn-ghost" onClick={closeModal}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="field">
                  <label>Confirmation date</label>
                  <input
                    type="date"
                    defaultValue={existing?.gateway_confirmed_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        gateway_confirmed_date: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="field">
                  <label>EPA notification route</label>
                  <input
                    defaultValue={existing?.epa_notification_route}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        epa_notification_route: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div style={{ marginTop: 24 }}>
                <div className="section-tag" style={{ marginBottom: 12 }}>
                  Criteria
                </div>
                <div className="gateway-grid">
                  {checkboxes.map(([k, label]) => {
                    const checked =
                      formData[k] !== undefined ? formData[k] : !!existing?.[k];
                    return (
                      <label
                        key={k}
                        className={`gateway-item ${checked ? "met" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) =>
                            setFormData({ ...formData, [k]: e.target.checked })
                          }
                          style={{ display: "none" }}
                        />
                        {checked ? (
                          <CheckCircle2 size={16} className="check-icon" />
                        ) : (
                          <Circle size={16} color="var(--ink-light)" />
                        )}
                        {label}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                Save gateway
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  // ============================================
  // ROOT RENDER
  // ============================================
  return (
    <div className="lms-root">
      <style>{styles}</style>
      <Sidebar />
      <div className="app-right">
        <Topbar />
        {view.page === "library" && <LibraryPage />}
        {view.page === "learners" && <LearnersPage />}
        {view.page === "learner-profile" && <LearnerProfile />}
        {view.page === "enrollment-detail" && <EnrollmentDetail />}
      </div>
      {renderModal()}
    </div>
  );
}
