import React, { useState } from "react";

export default function LearnerProfile({ state }) {
  const { view, learners } = state;
  const learner = learners.find((l) => l.id === view.learnerId);

  if (!learner) return null;

  return (
    <main className="main">
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
        </div>
      </div>
    </main>
  );
}
