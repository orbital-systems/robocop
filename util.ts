import { ChartData } from "./types";

const symptomData = {
  S01: { name: "Noisy turbdity", color: "#e6194b" },
  S02: { name: "Weak turbidity", color: "#3cb44b" },
  S03: { name: "Strong turbidity", color: "#ffe119" },
  S04: { name: "Weak turbidity during calibration", color: "#4363d8" },
  S05: { name: "Incorrect sensor tank level readings", color: "#f58231" },
  S06: { name: "Level readings noisy during SU Calibration", color: "#911eb4" },
  S07: { name: "Sensor tank intensity saturated", color: "#46f0f0" },
  S08: {
    name: "Sensor tank unreachable. Calibration failed 3 times",
    color: "#f032e6",
  },
  S09: {
    name: "Sensor tank calibration atempt failed once due to being unreachable",
    color: "#bcf60c",
  },
  S10: {
    name: "Sensor tank calibration attempt failed once due to insufficient water",
    color: "#fabebe",
  },
  S11: { name: "Sensor tank communication error", color: "#008080" },
  S12: { name: "Sensor tank software crash", color: "#e6beff" },
  S13: { name: "Sensor tank power issue", color: "#9a6324" },
};

export const getSymptomColor = (symptom: string) =>
  symptomData[symptom as keyof typeof symptomData]?.color || "orange";

export const getSymptomName = (symptom: string) =>
  symptomData[symptom as keyof typeof symptomData]?.name || "unknown";

// accessors
export const getDateAccessor = (d: ChartData): Date => new Date(d.timestamp);

const diagnoseData = {
  D01: { name: "Loose cable", color: "#e6194b" },
  D02: { name: "Cable rupture/ Missing sensor tank", color: "#3cb44b" },
  D03: { name: "Hardware failure", color: "#ffe119" },
  D04: { name: "Software error", color: "#4363d8" },
  D05: { name: "Cleaning needed", color: "#911eb4" },
};

export const getDiagnoseColor = (diagnose: string) =>
  diagnoseData[diagnose as keyof typeof diagnoseData]?.color || "orange";

export const getDiagnoseName = (diagnose: string) =>
  diagnoseData[diagnose as keyof typeof diagnoseData]?.name || "unknown";
