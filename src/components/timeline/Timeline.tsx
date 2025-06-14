import * as d3 from "d3";
import { zoom, zoomIdentity } from "d3-zoom";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { TimelineContainer, StyledSvg, Tooltip } from "./styles"; // Adjust the path as needed
import { Node } from "../../types";

// Define a type for the D3 Timeline class for better type safety
type OnNodeSelectedCallback = (node: Node) => void;

interface D3TimelineProps {
  data: Node[];
  onNodeSelected?: OnNodeSelectedCallback;
  selectedNodeId: string | null;
}

class D3Timeline {
  private svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private zoomG: d3.Selection<SVGGElement, unknown, null, undefined>;
  private xAxisG: d3.Selection<SVGGElement, unknown, null, undefined>;

  private xScale: d3.ScaleLinear<number, number>;
  private tooltip: d3.Selection<HTMLDivElement, unknown, null, undefined>;
  private data: Node[];
  private onNodeSelected: OnNodeSelectedCallback | undefined;
  private selectedNodeId: string | null;
  private height: number = 0;
  private width: number = 0;
  private margin = { top: 20, right: 30, bottom: 30, left: 30 };

  private verticalOffsetStep: number = 30;
  private currentTransform: d3.ZoomTransform = zoomIdentity;
  private yearLabelInterval: number = 1;

  constructor(
    svgElement: SVGSVGElement,
    tooltipElement: HTMLDivElement,
    data: Node[],
    onNodeSelected?: OnNodeSelectedCallback,
    selectedNodeId: string | null = null
  ) {
    this.svg = d3.select<SVGSVGElement, unknown>(svgElement);
    this.tooltip = d3.select<HTMLDivElement, unknown>(tooltipElement);
    this.data = data;
    this.onNodeSelected = onNodeSelected;
    this.selectedNodeId = selectedNodeId;

    this.xScale = d3.scaleLinear();

    // Append the main group for all zoomable elements
    this.zoomG = this.svg.append("g");

    // Append the axis group inside the zoomable group
    this.xAxisG = this.zoomG.append("g").attr("class", "timeline-axis");

    this.setupZoom();
    this.resize();
    window.addEventListener("resize", this.resize.bind(this));
  }

  private setupZoom(): void {
    const zoomBehavior = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 10])
      .translateExtent([
        [0, 0],
        [this.width, this.height],
      ])
      .on("zoom", (event) => {
        this.currentTransform = event.transform;
        this.zoomG.attr("transform", event.transform.toString());
        this.drawContent(); // Redraw content on zoom/pan
      });

    this.svg.call(zoomBehavior);

    // Add double-click to reset zoom
    this.svg.on("dblclick", () => {
      this.svg
        .transition()
        .duration(750)
        .call(zoomBehavior.transform, d3.zoomIdentity);
    });
  }

  private resize(): void {
    const oldWidth = this.width;
    const oldHeight = this.height;

    this.width = this.svg.node()?.clientWidth || 0;
    this.height = this.svg.node()?.clientHeight || 0;

    // Adjust the translate extent of the zoom behavior on resize
    const zoomBehavior = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 10])
      .translateExtent([
        [0, 0],
        [this.width, this.height],
      ])
      .on("zoom", (event) => {
        this.currentTransform = event.transform;
        this.drawContent();
      });

    this.svg.call(zoomBehavior);

    // If the width has changed, adjust the transform to maintain relative position
    if (oldWidth > 0 && this.width > 0) {
      const scaleFactor = this.width / oldWidth;
      const newTransform = d3.zoomIdentity
        .translate(
          this.currentTransform.x * scaleFactor,
          this.currentTransform.y
        )
        .scale(this.currentTransform.k);

      this.svg
        .transition()
        .duration(0)
        .call(zoomBehavior.transform, newTransform);
    } else {
      // If first render, set to identity
      this.currentTransform = d3.zoomIdentity;
    }

    this.update();
  }

  public update(
    newData?: Node[],
    newSelectedNodeId: string | null = null
  ): void {
    if (newData) {
      this.data = newData;
    }
    if (newSelectedNodeId !== null) {
      this.selectedNodeId = newSelectedNodeId;
    }

    const { width, height, margin } = this;

    // Ensure there's data to process
    if (this.data.length === 0) {
      this.svg.selectAll("*").remove();
      return;
    }

    // Sort data by year to ensure correct timeline order
    this.data.sort((a, b) => (a.year ?? 0) - (b.year ?? 0));

    // Calculate dynamic year range
    const minYear = d3.min(this.data, (d) => d.year ?? 0) ?? 0;
    const maxYear = d3.max(this.data, (d) => d.year ?? 0) ?? 0;
    const yearPadding = (maxYear - minYear) * 0.1;

    // Update xScale domain and range
    this.xScale
      .domain([minYear - yearPadding, maxYear + yearPadding])
      .range([margin.left, width - margin.right]);

    // Draw content with the current transform
    this.drawContent();
  }

  private drawContent(zoomedXScale?: d3.ScaleLinear<number, number>): void {
    const currentXScale =
      zoomedXScale || this.currentTransform.rescaleX(this.xScale);
    const { height, margin, verticalOffsetStep } = this;

    // Calculate vertical positions for dots and labels
    const getDotY = (d: Node, i: number) => {
      const baseLine = height - margin.bottom;
      return baseLine - (i % 3) * verticalOffsetStep;
    };

    const getLabelY = (d: Node, i: number) => {
      return getDotY(d, i) - 15;
    };

    // Remove old content within zoomG, except for xAxisG
    this.xAxisG.selectAll("*").remove();
    this.zoomG
      .selectAll(
        ".timeline-line, .timeline-dot, .timeline-label, .year-marker, .year-label"
      )
      .remove();

    // Calculate year label interval based on zoom level
    const yearRange = currentXScale.domain();
    const visibleYears = yearRange[1] - yearRange[0];
    this.yearLabelInterval = Math.max(1, Math.ceil(visibleYears / 20)); // Show max 20 labels

    // Add year markers
    const startYear = Math.ceil(yearRange[0]);
    const endYear = Math.floor(yearRange[1]);

    // Create year markers with dynamic interval
    for (
      let year = startYear;
      year <= endYear;
      year += this.yearLabelInterval
    ) {
      const x = currentXScale(year);

      // Add year marker line
      this.zoomG
        .append("line")
        .attr("class", "year-marker")
        .attr("x1", x)
        .attr("y1", height - margin.bottom)
        .attr("x2", x)
        .attr("y2", height - margin.bottom - 8)
        .attr("stroke", "currentColor")
        .attr("stroke-width", 1);

      // Add year label with fixed position
      this.zoomG
        .append("text")
        .attr("class", "year-label")
        .attr("x", x)
        .attr("y", height - margin.bottom - 12)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .attr("font-weight", "500")
        .attr("fill", "currentColor")
        .attr("dominant-baseline", "middle") // Ensure consistent vertical alignment
        .text(year.toString());
    }

    // Timeline line
    this.zoomG
      .append("line")
      .attr("class", "timeline-line")
      .attr("x1", currentXScale.range()[0])
      .attr("y1", height - margin.bottom)
      .attr("x2", currentXScale.range()[1])
      .attr("y2", height - margin.bottom)
      .attr("stroke", "currentColor")
      .attr("stroke-width", 1);

    // Dots for timeline items
    this.zoomG
      .selectAll(".timeline-dot")
      .data(this.data, (d: any) => d.id)
      .join("circle")
      .attr(
        "class",
        (d) => `timeline-dot ${d.id === this.selectedNodeId ? "selected" : ""}`
      )
      .attr("cx", (d) => currentXScale(d.year ?? 0))
      .attr("cy", getDotY)
      .attr("r", 6)
      .attr("fill", (d) =>
        d.id === this.selectedNodeId ? "gold" : "currentColor"
      )
      .on("click", (event, d) => {
        event.stopPropagation();
        this.selectedNodeId = d.id;
        this.update();
        if (this.onNodeSelected) {
          this.onNodeSelected(d);
        }
      })
      .on("mouseover", (event, d) => {
        this.tooltip
          .html(`<strong>${d.label}</strong> (${d.year})`)
          .style("left", `${event.pageX}px`)
          .style("top", `${event.pageY}px`)
          .classed("visible", true);
      })
      .on("mouseout", () => {
        this.tooltip.classed("visible", false);
      });

    // Add invisible hitbox circles for better touch interaction
    this.zoomG
      .selectAll(".timeline-hitbox")
      .data(this.data, (d: any) => d.id)
      .join("circle")
      .attr("class", "timeline-hitbox")
      .attr("cx", (d) => currentXScale(d.year ?? 0))
      .attr("cy", getDotY)
      .attr("r", 12)
      .attr("fill", "transparent")
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        event.stopPropagation();
        this.selectedNodeId = d.id;
        this.update();
        if (this.onNodeSelected) {
          this.onNodeSelected(d);
        }
      })
      .on("mouseover", (event, d) => {
        this.tooltip
          .html(`<strong>${d.label}</strong> (${d.year})`)
          .style("left", `${event.pageX}px`)
          .style("top", `${event.pageY}px`)
          .classed("visible", true);
      })
      .on("mouseout", () => {
        this.tooltip.classed("visible", false);
      });

    // Labels for timeline items
    this.zoomG
      .selectAll(".timeline-label")
      .data(this.data, (d: any) => d.id)
      .join("text")
      .attr("class", "timeline-label")
      .attr("x", (d) => currentXScale(d.year ?? 0))
      .attr("y", getLabelY)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle") // Ensure consistent vertical alignment
      .text((d) => d.label);
  }

  public destroy(): void {
    window.removeEventListener("resize", this.resize.bind(this));
    this.svg.selectAll("*").remove();
  }
}

// React Component remains the same as before
const Timeline: React.FC<D3TimelineProps> = ({
  data,
  onNodeSelected,
  selectedNodeId,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const d3TimelineRef = useRef<D3Timeline | null>(null);

  useEffect(() => {
    if (svgRef.current && tooltipRef.current) {
      d3TimelineRef.current = new D3Timeline(
        svgRef.current,
        tooltipRef.current,
        data,
        onNodeSelected,
        selectedNodeId
      );
      // No initial update call here, it's done in the constructor's resize()
      // or you can explicitly call it after setupZoom
    }

    return () => {
      d3TimelineRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    if (d3TimelineRef.current) {
      d3TimelineRef.current.update(data, selectedNodeId);
    }
  }, [data, selectedNodeId]);

  return (
    <TimelineContainer>
      <StyledSvg ref={svgRef}></StyledSvg>
      <Tooltip ref={tooltipRef} className="tooltip"></Tooltip>
    </TimelineContainer>
  );
};

export default Timeline;
