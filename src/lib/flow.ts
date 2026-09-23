// The demo's five sections. The viewer switches between them at any time with
// the tab bar; there is no fixed order to step through.
export const TABS = ['intro', 'run1', 'run2'] as const

export type TabId = (typeof TABS)[number]
