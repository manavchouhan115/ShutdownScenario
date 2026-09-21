import type { BadgeKey, Effect, Step } from '../types/scenario.ts'

// What the map shows at a given moment, worked out from scratch by replaying
// every step up to the current one. Because nothing is "undone", pressing Back
// simply replays fewer steps.

export interface ActiveLink {
  key: string
  from: string
  to: string
  style: 'flash' | 'blocked' | 'revoked'
  /** True when it came from the step on screen right now (it animates in). */
  current: boolean
}

export interface ActivePath {
  key: string
  from: string
  to: string[]
  kind: 'report' | 'evidence'
  current: boolean
}

export interface ActiveEnvelope {
  key: string
  from: string
  to: string
  current: boolean
}

export interface LogEntry {
  actor: string
  text: string
}

export interface MapState {
  /** Labels shown on each company, in the order they happened (harmed first). */
  badges: Record<string, BadgeKey[]>
  links: ActiveLink[]
  paths: ActivePath[]
  envelopes: ActiveEnvelope[]
  highlights: Set<string>
  /** Ids of the evidence checks ticked so far (Run 2). */
  evidence: string[]
  /** The ones the current step just ticked. */
  freshEvidence: Set<string>
  log: LogEntry[]
  /** Companies the current step just changed. */
  fresh: Set<string>
}

function emptyState(): MapState {
  return {
    badges: {},
    links: [],
    paths: [],
    envelopes: [],
    highlights: new Set(),
    evidence: [],
    freshEvidence: new Set(),
    log: [],
    fresh: new Set(),
  }
}

function addBadge(state: MapState, id: string, badge: BadgeKey) {
  const list = (state.badges[id] ??= [])
  if (list.includes(badge)) return
  if (badge === 'harmed') list.unshift(badge)
  else list.push(badge)
}

function apply(state: MapState, effect: Effect, key: string, current: boolean) {
  switch (effect.type) {
    case 'status':
      addBadge(state, effect.target, effect.status)
      if (current) state.fresh.add(effect.target)
      break
    case 'link':
      state.links.push({ key, from: effect.from, to: effect.to, style: effect.style, current })
      break
    case 'path':
      state.paths.push({ key, from: effect.from, to: effect.to, kind: effect.kind, current })
      break
    case 'envelope':
      state.envelopes.push({ key, from: effect.from, to: effect.to, current })
      addBadge(state, effect.to, 'queued')
      if (current) state.fresh.add(effect.to)
      break
    case 'highlight':
      effect.targets.forEach((id) => {
        if (effect.off) {
          state.highlights.delete(id)
          state.badges[id] = (state.badges[id] ?? []).filter((badge) => badge !== 'deciding')
          return
        }
        state.highlights.add(id)
        addBadge(state, id, 'deciding')
        if (current) state.fresh.add(id)
      })
      break
    case 'evidence':
      if (!state.evidence.includes(effect.id)) state.evidence.push(effect.id)
      if (current) state.freshEvidence.add(effect.id)
      break
    case 'log':
      state.log.push({ actor: effect.actor, text: effect.text })
      break
  }
}

/**
 * The map after showing steps 0..upTo. `choiceEffects` are the effects of the
 * option the viewer picked (Run 2). They apply right after the step marked
 * kind "choice", and count as "current" only while that step is on screen.
 */
export function computeMapState(steps: Step[], upTo: number, choiceEffects: Effect[] = []): MapState {
  const state = emptyState()
  const last = Math.min(upTo, steps.length - 1)
  for (let i = 0; i <= last; i++) {
    const step = steps[i]
    step.effects.forEach((effect, j) => apply(state, effect, `${step.id}-${j}`, i === last))
    if (step.kind === 'choice') {
      choiceEffects.forEach((effect, j) => apply(state, effect, `${step.id}-choice-${j}`, i === last))
    }
  }
  return state
}
