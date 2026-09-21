import raw from '../data/scenario.json'
import type { Scenario } from '../types/scenario.ts'
import { companyName, plainText } from './text.ts'

// The one place the story file is loaded. validateScenario() (see App.tsx)
// checks the parts the type cast below cannot.
export const scenario = raw as unknown as Scenario

/** Access to the story and to the current name mode (real or fictional). */
export function useScenario() {
  const nameMode = scenario.meta.nameMode
  return {
    scenario,
    nameMode,
    /** A company's name in the current name mode. */
    nameOf: (id: string) => companyName(scenario, id, nameMode),
    /** Text with names filled in and no tooltips. */
    plain: (text: string) => plainText(scenario, text, nameMode),
  }
}
