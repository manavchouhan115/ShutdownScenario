import { GAP_X, channelY, type Box } from './layout.ts'

// Links are drawn as right-angle lines that only travel through the empty lanes
// between the company boxes (see layout.ts), so they never run behind a box.

type Point = [number, number]

/** Points of a line from one company to another, in the map's own units. */
export function routePoints(from: Box, to: Box, offset = 0): Point[] {
  // `offset` nudges the line sideways inside its lane, so two lines that share
  // a lane do not sit exactly on top of each other.
  const gap = GAP_X.controlToMiddle + offset
  // Between two neighbouring columns: sideways, along the lane, sideways.
  // (When both are in the same row the middle part has no length: a straight line.)
  if (from.column === 'intermediaries' && to.column === 'control') {
    return [
      [from.x, from.cy + offset],
      [gap, from.cy + offset],
      [gap, to.cy + offset],
      [to.x + to.w, to.cy + offset],
    ]
  }

  // From the affected column to the control column: leave through the top or
  // bottom edge into the lane between rows, cross the middle column there,
  // then come down the lane beside the control column.
  if (from.column === 'affected' && to.column === 'control') {
    const k = to.row < from.row ? from.row : to.row > from.row ? from.row + 1 : from.row
    const startY = k === from.row ? from.y : from.y + from.h
    return [
      [from.cx, startY],
      [from.cx, channelY(k) + offset],
      [gap, channelY(k) + offset],
      [gap, to.cy + offset],
      [to.x + to.w, to.cy + offset],
    ]
  }

  // Fallback: a straight line between the centres.
  return [
    [from.cx, from.cy],
    [to.cx, to.cy],
  ]
}

/** The SVG path text for a list of points. */
export function pathData(points: Point[]): string {
  return points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x} ${y}`).join(' ')
}
