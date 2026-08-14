import { BlastRadiusReport } from "../utils/validations/ai.schema.js";

export interface AgentResult {
  investigation: string;
  report: BlastRadiusReport;
}
