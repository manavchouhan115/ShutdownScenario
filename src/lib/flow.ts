// The order of the demo's screens (SPEC section 11).
export const SCREENS = [
  'intro',
  'run1',
  'transition',
  'run2',
  'comparison',
  'closing',
] as const

export type ScreenId = (typeof SCREENS)[number]
