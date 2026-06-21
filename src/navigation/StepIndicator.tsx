import React from "react";

export interface StepIndicatorStep {
  label: string;
}

export interface StepIndicatorProps {
  currentStep: number;
  steps: StepIndicatorStep[];
}

export function StepIndicator({
  currentStep,
  steps,
}: StepIndicatorProps): React.ReactElement {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;

        const circleStyle: React.CSSProperties = {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "2rem",
          height: "2rem",
          borderRadius: "50%",
          border: `2px solid ${isCompleted || isCurrent ? "var(--bp-green)" : "var(--bp-border)"}`,
          background: isCompleted ? "var(--bp-green)" : "var(--bp-bg)",
          fontFamily: "var(--bp-font-mono)",
          fontSize: "var(--bp-text-xs)",
          letterSpacing: "0.05em",
          color: isCompleted ? "var(--bp-bg)" : isCurrent ? "var(--bp-green)" : "var(--bp-text-muted)",
          transition: "all var(--bp-transition)",
        };

        const labelStyle: React.CSSProperties = {
          fontFamily: "var(--bp-font-body)",
          fontSize: "var(--bp-text-xs)",
          color: isCurrent ? "var(--bp-text)" : "var(--bp-text-muted)",
          marginTop: "0.25rem",
          textAlign: "center",
        };

        const connectorStyle: React.CSSProperties = {
          width: "3rem",
          height: "2px",
          background: stepNumber < currentStep ? "var(--bp-green)" : "var(--bp-border)",
          marginBottom: "1.25rem",
          transition: "background var(--bp-transition)",
        };

        return (
          <div key={step.label} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.2rem" }}>
              <div style={circleStyle}>
                {isCompleted ? "✓" : stepNumber}
              </div>
              <span style={labelStyle}>{step.label}</span>
            </div>
            {index < steps.length - 1 && <div style={connectorStyle} />}
          </div>
        );
      })}
    </div>
  );
}
