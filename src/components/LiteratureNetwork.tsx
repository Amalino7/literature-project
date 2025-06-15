import * as d3 from "d3";
import { useRef, useEffect } from "react";
import {
  LiteratureNetworkProps,
  D3Node,
  D3Link,
  getColoring,
} from "../../resources/LiteratureNetwork";

export const LiteratureNetwork: React.FC<LiteratureNetworkProps> = ({
  nodes,
  edges,
  onNodeClick,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Transform the data for D3
    const d3Nodes: D3Node[] = nodes.map((node) => ({
      id: node.id,
      name: node.label,
      group: node.type === "произведение" ? 1 : node.type === "автор" ? 2 : 3,
      originalNode: node,
    }));

    const d3Links: D3Link[] = edges.map((edge) => ({
      source: edge.source,
      target: edge.target,
      value: 1,
      type: edge.type,
    }));

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    // Set up the SVG dimensions
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Create the SVG container
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Add zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        svg.select("g.zoom-container").attr("transform", event.transform);
      });

    svg.call(zoom);

    // Create a container for all elements that will be transformed by zoom
    const container = svg.append("g").attr("class", "zoom-container");

    // Create color scales
    const { linkColors, nodeColors } = getColoring();

    // Create the force simulation
    const simulation = d3
      .forceSimulation<D3Node>(d3Nodes)
      .force(
        "link",
        d3
          .forceLink<D3Node, D3Link>(d3Links)
          .id((d) => d.id)
          .distance(60) // Obsidian-like: shorter links
          .strength(0.2) // Slightly stronger links
      )
      .force("charge", d3.forceManyBody().strength(-100)) // Stronger repulsion
      .force("center", d3.forceCenter(width / 2, height / 2).strength(0.01)) // Weaker centering
      .force("collision", d3.forceCollide().radius(18)) // Smaller collision radius
      .force("x", d3.forceX(width / 2).strength(0.01)) // Weaker axis forces
      .force("y", d3.forceY(height / 2).strength(0.01))
      .alphaDecay(0.005) // Slower decay for more "floaty" motion
      .velocityDecay(0.15);

    const link = container
      .append("g")
      .selectAll("line")
      .data(d3Links)
      .join("line")
      .attr("stroke", (d) => linkColors(d.type))
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", (d) => (d.type === "повлиян" ? "5,5" : "0"))
      .on("mouseover", function (event, d) {
        d3.select(this)
          .attr("stroke", linkColors(d.type))
          .attr("stroke-opacity", 1)
          .attr("stroke-width", 4);
        linkLabels
          .filter((l) => l === d)
          .attr("display", "block")
          .attr("font-weight", "bold");
      })
      .on("mouseout", function (event, d) {
        d3.select(this)
          .attr("stroke", linkColors(d.type))
          .attr("stroke-opacity", 0.6)
          .attr("stroke-width", 2);
        linkLabels
          .filter((l) => l === d)
          .attr("display", "none")
          .attr("font-weight", "normal");
      });

    // Create the nodes
    const node = container
      .append("g")
      .selectAll<SVGCircleElement, D3Node>("circle")
      .data(d3Nodes)
      .join("circle")
      .attr("r", 8)
      .attr("fill", (d) => nodeColors(d.originalNode.type))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .style("cursor", "pointer")
      .on("click", (event, d) => onNodeClick(d.originalNode))
      .call(drag(simulation));

    // Add labels to nodes
    const labels = container
      .append("g")
      .selectAll("text")
      .data(d3Nodes)
      .join("text")
      .text((d) => d.name)
      .attr("font-size", 12)
      .attr("dx", 15)
      .attr("dy", 4)
      .attr("fill", (d) => nodeColors(d.originalNode.type))
      .style("pointer-events", "none");

    // Add link labels
    const linkLabels = container
      .append("g")
      .selectAll("text")
      .data(d3Links)
      .join("text")
      .text((d) => d.type)
      .attr("font-size", 10)
      .attr("fill", "#999")
      .attr("display", "none") // Hide by default
      .style("pointer-events", "none");

    // Create the links

    // Update positions on each tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as D3Node).x!)
        .attr("y1", (d) => (d.source as D3Node).y!)
        .attr("x2", (d) => (d.target as D3Node).x!)
        .attr("y2", (d) => (d.target as D3Node).y!);

      node.attr("cx", (d) => d.x!).attr("cy", (d) => d.y!);

      labels.attr("x", (d) => d.x!).attr("y", (d) => d.y!);

      linkLabels
        .attr(
          "x",
          (d) => ((d.source as D3Node).x! + (d.target as D3Node).x!) / 2
        )
        .attr(
          "y",
          (d) => ((d.source as D3Node).y! + (d.target as D3Node).y!) / 2
        );
    });

    // Drag functionality
    function drag(simulation: d3.Simulation<D3Node, D3Link>) {
      function dragstarted(
        event: d3.D3DragEvent<SVGCircleElement, D3Node, D3Node>
      ) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(
        event: d3.D3DragEvent<SVGCircleElement, D3Node, D3Node>
      ) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(
        event: d3.D3DragEvent<SVGCircleElement, D3Node, D3Node>
      ) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3
        .drag<SVGCircleElement, D3Node>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

    // Handle window resize
    const handleResize = () => {
      const width = svgRef.current?.clientWidth || 800;
      const height = svgRef.current?.clientHeight || 600;

      svg.attr("width", width).attr("height", height);

      simulation.force("center", d3.forceCenter(width / 2, height / 2));
      simulation.force("x", d3.forceX(width / 2).strength(0.05));
      simulation.force("y", d3.forceY(height / 2).strength(0.05));
      simulation.alpha(0.3).restart();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [nodes, edges, onNodeClick]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <svg ref={svgRef} style={{ width: "100%", height: "100%" }}></svg>
    </div>
  );
};
