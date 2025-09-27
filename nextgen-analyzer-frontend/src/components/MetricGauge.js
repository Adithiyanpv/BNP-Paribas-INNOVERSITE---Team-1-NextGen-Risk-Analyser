// src/components/MetricGauge.js
import React from 'react';

const MetricGauge = ({ label, value, unit = '', good, bad, higherIsBetter = false }) => {
  let category = 'average';

  if (higherIsBetter) {
    if (value >= good) category = 'good';
    else if (value < bad) category = 'bad';
  } else {
    if (value <= good) category = 'good';
    else if (value > bad) category = 'bad';
  }

  // Calculate the position of the needle (0% to 100%)
  const range = bad - good;
  let percentage = ((value - good) / range) * 100;
  if (higherIsBetter) {
    percentage = ((value - bad) / (good - bad)) * 100;
  }
  percentage = Math.max(0, Math.min(100, percentage));

  return (
    <div className="metric-gauge">
      <div className="gauge-label">
        <span>{label}</span>
        <strong>{value.toFixed(2)}{unit}</strong>
      </div>
      <div className="gauge-track">
        <div className="gauge-bar good"></div>
        <div className="gauge-bar average"></div>
        <div className="gauge-bar bad"></div>
        <div className="gauge-needle" style={{ left: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

export default MetricGauge;