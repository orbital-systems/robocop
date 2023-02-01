export interface Symptom {
  index: number;
  timestamp: string;
  symptom_id: string;
  device_id: string;
  session_id: string;
  code: string;
  software_version?: string;
}
