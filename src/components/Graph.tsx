const LANE_COUNT = 5; // Number of vertical lanes for labels
const lanes = Array(LANE_COUNT)
  .fill(null)
  .map(() => ({ lastX: -Infinity, lastIndex: -1 }));

const minLane = lanes.reduce(
  (
    minLane: { lastX: number; idx: number },
    currentLane: { lastX: number; lastIndex: number },
    idx: number
  ) => {
    if (currentLane.lastX < minLane.lastX) {
      return { lastX: currentLane.lastX, idx };
    }
    return minLane;
  },
  { lastX: Infinity, idx: 0 }
);
