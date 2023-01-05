import { Data } from "../../pages/home";

const symptoms = [
  "heatup_error",
  "b11_other",
  "drain_leak",
  "w7_other",
  "no_inlet",
  "airsuction",
  "restricted_flow",
  "weak_radar",
  "radar_ghost",
  "setpoint_too_low",
  "w7_c7",
  "slow_heatup",
  "insufficient_power",
  "lid_open",
]; // 14 total

// accessors
export const getDateAccessor = (d: Data): Date => new Date(d.timestamp);
export const getValueAccessor = (d: Data): number =>
  symptoms?.indexOf(d.symptom) + 1 || 0;

export const getSymptomColor = (symptom: string) => {
  const colors = [
    "#e6194b",
    "#3cb44b",
    "#ffe119",
    "#4363d8",
    "#f58231",
    "#911eb4",
    "#46f0f0",
    "#f032e6",
    "#bcf60c",
    "#fabebe",
    "#008080",
    "#e6beff",
    "#9a6324",
    "#fffac8", // 14 total
    // "#800000",
    // "#aaffc3",
    // "#808000",
    // "#ffd8b1",
    // "#000075",
    // "#808080",
  ];
  const index = symptoms.indexOf(symptom);
  return colors[index];
};
