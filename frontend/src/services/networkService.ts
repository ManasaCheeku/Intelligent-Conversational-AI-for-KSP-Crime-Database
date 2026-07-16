export type NetworkNodeType =
  | "suspect"
  | "wanted"
  | "victim"
  | "officer"
  | "vehicle"
  | "weapon"
  | "bank"
  | "phone"
  | "location"
  | "evidence";

export type NetworkEdgeType =
  | "phone"
  | "money"
  | "vehicle"
  | "family"
  | "gang"
  | "evidence"
  | "cctv"
  | "tower"
  | "fingerprint"
  | "dna";

export interface CriminalNode {
  id: string;
  type: NetworkNodeType;
  label: string;
  subtitle?: string;
  riskScore?: number;
  color?: string;
}

export interface CriminalEdge {
  id: string;
  source: string;
  target: string;
  type: NetworkEdgeType;
  label?: string;
  confidence?: number;
}

export interface CriminalGraph {
  nodes: CriminalNode[];
  edges: CriminalEdge[];
}