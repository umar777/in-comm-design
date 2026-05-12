import React from "react";

// TODO: Split modal logic into separate files:
// - CreateTemplate modal
// - ViewTemplate modal
// - CreateLearner modal
// - AddPlanItem modal
// - EditEnrollment modal
// - CreateAssignment modal
// - InitKsbs modal
// - LogOtj modal
// - EditGateway modal

export default function Modal({ state }) {
  const { modal, setModal } = state;

  if (!modal) return null;

  // Placeholder: All modal handlers from original App.jsx should be moved here
  // Currently the modals are too complex to split in one go

  return null;
}
