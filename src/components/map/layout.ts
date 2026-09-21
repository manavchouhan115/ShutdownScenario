import type { Column, Company } from '../../types/scenario.ts'

// Fixed drawing area. Everything on the map is placed in these units and then
// shown as percentages, so the map scales with the page width.
export const VIEW_W = 1000
export const VIEW_H = 415

const ROW_TOP = 55
const NODE_H = 100
const ROW_PITCH = 122

// Left edge and width of each node column. The "affected" column is drawn as
// two sub-columns of three so the whole map stays short enough for a laptop.
const COLUMN_SLOTS: Record<Column, { x: number; w: number }[]> = {
  control: [{ x: 10, w: 200 }],
  intermediaries: [{ x: 260, w: 200 }],
  affected: [
    { x: 520, w: 220 },
    { x: 760, w: 220 },
  ],
}

/** Left, width and centre of each column, for the column titles. */
export const COLUMN_SPAN: Record<Column, { x: number; w: number }> = {
  control: { x: 10, w: 200 },
  intermediaries: { x: 260, w: 200 },
  affected: { x: 520, w: 460 },
}

/** Free vertical lanes between the columns, where links can run. */
export const GAP_X = { controlToMiddle: 235, middleToAffected: 490 }

/** Free horizontal lanes between the rows (0 = above the first row, 3 = below the last). */
export function channelY(k: number): number {
  return ROW_TOP + k * ROW_PITCH - (ROW_PITCH - NODE_H) / 2
}

export interface Box {
  x: number
  y: number
  w: number
  h: number
  cx: number
  cy: number
  column: Column
  row: number
}

/**
 * Where each company sits. Within a column the order follows the order in
 * scenario.json, top to bottom (and left sub-column first for "affected").
 */
export function computeLayout(companies: Company[]): Record<string, Box> {
  const boxes: Record<string, Box> = {}
  const counts: Record<Column, number> = { control: 0, intermediaries: 0, affected: 0 }

  for (const company of companies) {
    const i = counts[company.column]++
    const slots = COLUMN_SLOTS[company.column]
    const slot = slots[Math.floor(i / 3)] ?? slots[slots.length - 1]
    const row = i % 3
    const y = ROW_TOP + row * ROW_PITCH
    boxes[company.id] = {
      x: slot.x,
      y,
      w: slot.w,
      h: NODE_H,
      cx: slot.x + slot.w / 2,
      cy: y + NODE_H / 2,
      column: company.column,
      row,
    }
  }
  return boxes
}
