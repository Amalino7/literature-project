import styled from "styled-components";

export const TimelineContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: transparent;
  position: relative; /* Needed for tooltips */
`;

export const StyledSvg = styled.svg`
  width: 100%;
  height: 100%;

  .timeline-axis {
    .domain,
    .tick line {
      stroke: currentColor;
    }
    .tick text {
      fill: currentColor;
      font-size: 14px;
    }
  }

  .timeline-dot {
    cursor: pointer;
    stroke: currentColor;
    stroke-width: 2px;
    transition: r 0.2s ease-out, fill 0.2s ease-out, stroke-width 0.2s ease-out;

    &:hover {
      r: 8;
      stroke-width: 3px;
    }
  }

  .timeline-hitbox {
    cursor: pointer;
    transition: opacity 0.2s ease;
    opacity: 0;

    &:hover {
      opacity: 0.1;
    }
  }

  .timeline-label {
    fill: currentColor;
    font-size: 14px;
    pointer-events: none;
    font-weight: 500;
    text-shadow: 0 0 3px rgba(255, 255, 255, 0.7);
    user-select: none;
  }

  .year-label {
    fill: currentColor;
    font-size: 14px;
    font-weight: 500;
    pointer-events: none;
    user-select: none;
    opacity: 0.8;
    transition: opacity 0.2s ease;
  }

  .year-marker {
    stroke: currentColor;
    stroke-width: 1;
    opacity: 0.6;
  }

  .year-label:hover {
    opacity: 1;
  }

  .timeline-dot.selected {
    r: 8;
    stroke-width: 3px;
    fill: gold;
  }
`;

export const Tooltip = styled.div`
  position: absolute;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  pointer-events: none; /* Ensure tooltip doesn't interfere with mouse events */
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  transform: translate(-50%, calc(-100% - 10px)); /* Position above the dot */
  white-space: nowrap;
  z-index: 100;

  &.visible {
    opacity: 1;
  }
`;
