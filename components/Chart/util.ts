import { Data } from "../../types";

const colors = {
  heatup_error: "#e6194b",
  b11_other: "#3cb44b",
  drain_leak: "#ffe119",
  w7_other: "#4363d8",
  no_inlet: "#f58231",
  airsuction: "#911eb4",
  restricted_flow: "#46f0f0",
  weak_radar: "#f032e6",
  radar_ghost: "#bcf60c",
  setpoint_too_low: "#fabebe",
  w7_c7: "#008080",
  slow_heatup: "#e6beff",
  insufficient_power: "#9a6324",
  lid_open: "#fffac8",
};

export const getSymptomColor = (symptom: string) =>
  colors[symptom as keyof typeof colors];

// accessors
export const getDateAccessor = (d: Data): Date => new Date(d.timestamp);
