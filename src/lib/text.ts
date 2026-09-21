import type { ModeText, NameMode, Scenario } from '../types/scenario.ts'

// Placeholders that can appear inside any text in scenario.json:
//   {co:github}                      -> company name (real or fictional)
//   {gl:prompt-injection}            -> glossary term, with tooltip
//   {gl:prompt-injection|shown text} -> glossary tooltip on custom text
export const TOKEN_PATTERN = /\{(co|gl):([a-z0-9-]+)(?:\|([^}]*))?\}/g

export type Segment =
  | { kind: 'text'; text: string }
  | { kind: 'company'; id: string }
  | { kind: 'glossary'; id: string; shown?: string }

/** Split a text into plain pieces and placeholders, in order. */
export function parseText(text: string): Segment[] {
  const segments: Segment[] = []
  let last = 0
  for (const match of text.matchAll(TOKEN_PATTERN)) {
    const start = match.index
    if (start > last) segments.push({ kind: 'text', text: text.slice(last, start) })
    const [whole, type, id, shown] = match
    segments.push(
      type === 'co' ? { kind: 'company', id } : { kind: 'glossary', id, shown },
    )
    last = start + whole.length
  }
  if (last < text.length) segments.push({ kind: 'text', text: text.slice(last) })
  return segments
}

/** Pick the right wording for the current name mode. */
export function pickMode(text: ModeText, mode: NameMode): string {
  return typeof text === 'string' ? text : text[mode]
}

export function companyName(scenario: Scenario, id: string, mode: NameMode): string {
  const company = scenario.companies.find((c) => c.id === id)
  return company ? company.names[mode] : `[unknown company: ${id}]`
}

/** The text with names filled in and no tooltips. For labels and the like. */
export function plainText(scenario: Scenario, text: string, mode: NameMode): string {
  return parseText(text)
    .map((segment) => {
      if (segment.kind === 'text') return segment.text
      if (segment.kind === 'company') return companyName(scenario, segment.id, mode)
      return segment.shown ?? scenario.glossary[segment.id]?.term ?? segment.id
    })
    .join('')
}
