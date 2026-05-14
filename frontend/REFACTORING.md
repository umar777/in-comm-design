# LMS Admin UI - React Refactoring

## What's Been Done ✅

### 1. State Management Extracted

- **File**: `src/hooks/useLmsState.js`
- Centralized all React state management in a custom hook
- All 20+ pieces of app state now in one place
- Helper functions (`newId`, `getLearner`, `getTemplate`, `getLearnerEnrollments`) moved to hook
- Single source of truth for data models

### 2. Styles Extracted to CSS

- **File**: `src/App.css`
- Removed 2000+ lines of inline styles from JSX
- Moved all CSS custom properties, component styles, states
- Can now be compiled/optimized separately
- Can be shared across multiple components

### 3. Component Architecture Created

```
src/
├── hooks/
│   └── useLmsState.js              ← All state logic
├── components/
│   ├── Sidebar.jsx                 ← Navigation
│   ├── pages/
│   │   ├── LibraryPage.jsx         ← Template library (partial)
│   │   ├── LearnersPage.jsx        ← Learner list (partial)
│   │   ├── LearnerProfile.jsx      ← Stub
│   │   └── EnrollmentDetail.jsx    ← Stub
│   └── modals/
│       └── Modal.jsx               ← Placeholder
└── App.css                         ← All styles
```

### 4. Root Component Simplified

- **File**: `src/App.jsx.refactored`
- Clean composition-based structure
- Delegates to page components
- Modal rendering separated into function
- Passes `state` object to all children for flexibility

## Next Steps - Complete Migration

### Step 1: Move Modal Code

The original App.jsx has 9 modal types (Create Template, View Template, Create Learner, Add Plan Item, Edit Enrollment, Create Assignment, Init KSBs, Log OTJ, Edit Gateway).

**Next:** Extract each into `src/components/modals/[ModalName].jsx`:

```javascript
// src/components/modals/CreateTemplateModal.jsx
export default function CreateTemplateModal({
  modal,
  state,
  closeModal,
  formData,
  setFormData,
}) {
  // Modal logic here
}
```

### Step 2: Complete Page Components

Implement the full page logic in:

- `src/components/pages/LibraryPage.jsx` - Add template viewing/composition
- `src/components/pages/LearnersPage.jsx` - Currently working
- `src/components/pages/LearnerProfile.jsx` - Full implementation
- `src/components/pages/EnrollmentDetail.jsx` - Full implementation

### Step 3: Integrate into App.jsx

Once modals and pages are split, `App.jsx` becomes _very_ simple:

```javascript
export default function LMSAdminUI() {
  const state = useLmsState();
  return (
    <div className="lms-root">
      <Sidebar state={state} />
      <Page state={state} />
      <Modal state={state} />
    </div>
  );
}
```

## How to Use the Refactored Structure

### Currently Working:

1. ✅ Sidebar navigation
2. ✅ Library page (partial - Create/View templates)
3. ✅ Learners page (partial - List, Create learner)

### To Restore Full Functionality:

1. Copy all modal JSX logic from original `App.jsx` into separate modal files
2. Extract nested JSX in original pages into separate component files
3. Keep the `state` prop pattern throughout for consistency

## Files Provided

| File                                        | Status         | Purpose                     |
| ------------------------------------------- | -------------- | --------------------------- |
| `src/hooks/useLmsState.js`                  | ✅ Complete    | State + helpers             |
| `src/App.css`                               | ✅ Complete    | All styling                 |
| `src/App.jsx.refactored`                    | ✅ Ready       | Clean structure template    |
| `src/components/Sidebar.jsx`                | ✅ Complete    | Navigation                  |
| `src/components/pages/LibraryPage.jsx`      | ⚠️ Partial     | Master template list        |
| `src/components/pages/LearnersPage.jsx`     | ⚠️ Partial     | Learner list                |
| `src/components/pages/LearnerProfile.jsx`   | ❌ Stub        | Learning plan + enrollments |
| `src/components/pages/EnrollmentDetail.jsx` | ❌ Stub        | Enrollment management       |
| `src/components/modals/Modal.jsx`           | ❌ Placeholder | All modals                  |

## Recommended Next Action

**Option A - Keep Working:** Backup original `App.jsx`, then copy the new `App.jsx.refactored` to `App.jsx` and incrementally port features.

**Option B - Hybrid Approach:** Keep original `App.jsx` working while slowly extracting pieces to new structure.

## Architecture Benefits

Once complete refactoring is done:

- ✅ Code is modularized and testable
- ✅ Each component has single responsibility
- ✅ State is centralized and predictable
- ✅ Styles are organized and reusable
- ✅ Much easier to add new features
- ✅ Each file is <300 lines instead of 2200
