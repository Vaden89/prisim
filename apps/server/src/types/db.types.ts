export interface CodeChunk {
  filename: string;
  startLine: number;
  endLine: number;
  code: string;
  similarity: number;
}

export interface Dependent {
  callerFile: string;
  callerName: string;
  lineNumber: number;
}

export interface CascadeNode {
  symbol: string;
  depth: number;
  dependents: Dependent[];
}
