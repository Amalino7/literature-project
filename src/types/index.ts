export interface Node {
  id: string;
  label: string;
  type: string;
  year?: number;
  // birthYear?: number;
  // deathYear?: number;
  image?: string;
  description?: string;
  tags?: string[];
  externalLink?: string;
}

// Extend Node with D3's simulation properties
export interface SimulationNode extends Node, d3.SimulationNodeDatum {
  // x, y, vx, vy are added by D3 simulation
}

export interface Edge {
  source: string;
  target: string;
  type: string;
  justification: string;
  // type:  "повлиян" | "тема" | "автор на";
}

export interface TimelineItem extends Node {
  year: number;
}

export interface DetailItem extends Node {
  image?: string;
  description?: string;
  tags?: string[];
  externalLink?: string;
}
