import * as d3 from "d3";
import { Node, Edge } from "../src/types";

export interface LiteratureNetworkProps {
  nodes: Node[];
  edges: Edge[];
  onNodeClick: (node: Node) => void;
}

export interface D3Node extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  group: number;
  originalNode: Node;
}

export interface D3Link extends d3.SimulationLinkDatum<D3Node> {
  value: number;
  type: string;
}

export function getColoring() {
  const nodeColors = d3
    .scaleOrdinal<string>()
    .domain(["произведение", "автор", "тема"])
    .range(["#90caf9", "#f48fb1", "#a5d6a7"]);

  const linkColors = d3
    .scaleOrdinal<string>()
    .domain(["автор на", "тема", "повлиян"])
    .range(["#90caf9", "#a5d6a7", "#f48fb1"]);
  return { linkColors, nodeColors };
}
