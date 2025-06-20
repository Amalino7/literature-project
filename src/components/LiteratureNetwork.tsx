import * as d3 from "d3";
import { useRef, useEffect, useState } from "react"; // Import useState
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
  // Use a state to keep track of the currently selected node
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // useRef to store D3 selections and simulation outside of the render cycle
  // This prevents D3 elements from being re-created unnecessarily
  const d3Elements = useRef<{
    simulation?: d3.Simulation<D3Node, D3Link>;
    link?: d3.Selection<SVGLineElement, D3Link, SVGGElement, unknown>;
    node?: d3.Selection<SVGCircleElement, D3Node, any, any>;
    labels?: d3.Selection<SVGTextElement, D3Node, any, any>;
    linkLabels?: d3.Selection<SVGTextElement, D3Link, any, any>;
    container?: d3.Selection<SVGGElement, unknown, any, any>;
  }>({});

  useEffect(() => {
    if (!svgRef.current) return;

    const currentSvg = d3.select(svgRef.current);

    // Clear any existing SVG content only on initial mount or full data change
    // This is important to prevent multiple graphs if useEffect runs excessively
    currentSvg.selectAll("*").remove();

    // Set up the SVG dimensions (initial)
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    currentSvg.attr("width", width).attr("height", height);

    // Add zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        d3Elements.current.container?.attr("transform", event.transform);
      });

    currentSvg.call(zoom);

    // Create a container for all elements that will be transformed by zoom
    const container = currentSvg.append("g").attr("class", "zoom-container");
    d3Elements.current.container = container; // Store the container

    // Transform the data for D3 (this should only happen when nodes/edges actually change)
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
      .force("charge", d3.forceManyBody().strength(-250)) // Stronger repulsion
      .force("center", d3.forceCenter(width / 2, height / 2).strength(0.01)) // Weaker centering
      .force("collision", d3.forceCollide().radius(22)) // Smaller collision radius
      .force("x", d3.forceX(width / 2).strength(0.001)) // Weaker axis forces
      .force("y", d3.forceY(height / 2).strength(0.001))
      .alphaDecay(0.002) // Slower decay for more "floaty" motion
      .velocityDecay(0.12);

    d3Elements.current.simulation = simulation; // Store the simulation

    // Create the links
    const link = container
      .append("g")
      .selectAll("line")
      .data(d3Links)
      .join("line")
      .attr("stroke", (d) => linkColors(d.type))
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", (d) =>
        d.type !== "автор на" && d.type !== "тема" ? "5,5" : "0"
      )
      .on("mouseover", function (_, d) {
        d3.select(this)
          .attr("stroke", linkColors(d.type))
          .attr("stroke-opacity", 1)
          .attr("stroke-width", 4);
        d3Elements.current.linkLabels
          ?.filter((l) => l === d)
          .attr("display", "block")
          .attr("font-weight", "bold");
      })
      .on("mouseout", function (_, d) {
        d3.select(this)
          .attr("stroke", linkColors(d.type))
          .attr("stroke-opacity", 0.6)
          .attr("stroke-width", 2);
        d3Elements.current.linkLabels
          ?.filter((l) => l === d)
          .attr("display", "none")
          .attr("font-weight", "normal");
      });

    d3Elements.current.link = link as d3.Selection<
      SVGLineElement,
      D3Link,
      SVGGElement,
      unknown
    >; // Store the links

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
      .on("click", (_, d) => {
        // Update the React state for selected node
        setSelectedNodeId(d.id);
        // Call the prop function
        onNodeClick(d.originalNode);
        // You can also add D3-specific highlighting here immediately
        d3Elements.current.node?.attr("stroke", (nodeD) =>
          nodeD.id === d.id ? "gold" : "#fff"
        );
        d3Elements.current.node?.attr("stroke-width", (nodeD) =>
          nodeD.id === d.id ? 3 : 1.5
        );
      })
      .call(drag(simulation));

    d3Elements.current.node = node; // Store the nodes

    // Add labels to nodes
    const labels = container
      .append("g")
      .selectAll<SVGTextElement, D3Node>("text")
      .data(d3Nodes)
      .join("text")
      .text((d) => d.name)
      .attr("font-size", 12)
      .attr("dx", 15)
      .attr("dy", 4)
      .attr("fill", (d) => nodeColors(d.originalNode.type))
      .style("pointer-events", "none");

    d3Elements.current.labels = labels as d3.Selection<
      SVGTextElement,
      D3Node,
      any,
      any
    >; // Store the labels

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

    d3Elements.current.linkLabels = linkLabels as d3.Selection<
      SVGTextElement,
      D3Link,
      SVGGElement,
      unknown
    >; // Store the link labels

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
      const currentWidth = svgRef.current?.clientWidth || 800;
      const currentHeight = svgRef.current?.clientHeight || 600;

      currentSvg.attr("width", currentWidth).attr("height", currentHeight);

      simulation.force(
        "center",
        d3.forceCenter(currentWidth / 2, currentHeight / 2)
      );
      simulation.force("x", d3.forceX(currentWidth / 2).strength(0.05));
      simulation.force("y", d3.forceY(currentHeight / 2).strength(0.05));
      simulation.alpha(0.3).restart();
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function for useEffect
    return () => {
      window.removeEventListener("resize", handleResize);
      // Optional: Stop the simulation if the component unmounts
      d3Elements.current.simulation?.stop();
    };
  }, [nodes, edges]); // Dependencies: Only re-run this effect if nodes or edges change significantly

  // Secondary useEffect to handle selection highlighting
  // This effect runs whenever selectedNodeId changes
  useEffect(() => {
    if (d3Elements.current.node) {
      d3Elements.current.node
        .attr("stroke", (d) => (d.id === selectedNodeId ? "gold" : "#fff"))
        .attr("stroke-width", (d) => (d.id === selectedNodeId ? 3 : 1.5));
    }
  }, [selectedNodeId]); // Dependency: Re-run when selectedNodeId changes

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <svg ref={svgRef} style={{ width: "100%", height: "100%" }}></svg>
    </div>
  );
};
