export interface Node {
  id: string;
  label: string;
  type: "work" | "author" | "theme";
  year?: number;
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
  type: "influenced" | "themed" | "authored";
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
