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
    .domain(["произведение", "автор", "тема", "епоха"])
    .range(["#90caf9", "#f48fb1", "#a5d6a7", "rgb(197, 203, 36) "]);

  const linkColors = d3
    .scaleOrdinal<string>()
    .domain(["повлиян", "повлиян от", "автор на", "тема"])
    .range(["#f48fb1", "#f48fb1", "#90caf9", "#a5d6a7"]);
  return { linkColors, nodeColors };
}
