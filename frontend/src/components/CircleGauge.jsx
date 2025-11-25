import React from "react";

const CircleGauge = ({ value }) => {
  const percentage = Math.min((value / 500) * 100, 100);

  return (
    <div style={{ width: "140px", height: "140px", margin: "auto" }}>
      <svg width="140" height="140">
        <circle
          cx="70"
          cy="70"
          r="60"
          stroke="#e0e0e0"
          strokeWidth="12"
          fill="none"
        />

        <circle
          cx="70"
          cy="70"
          r="60"
          stroke="#007bff"
          strokeWidth="12"
          fill="none"
          strokeDasharray={`${percentage * 3.77} 999`}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
          style={{ transition: "0.6s ease" }}
        />
      </svg>

      <h2 style={{ marginTop: "-90px" }}>{value}</h2>
    </div>
  );
};

export default CircleGauge;
