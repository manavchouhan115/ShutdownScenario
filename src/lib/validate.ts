import type { Effect, Scenario } from '../types/scenario.ts'
import { TOKEN_PATTERN } from './text.ts'

// Checks scenario.json for the mistakes a person editing the story is most
// likely to make (a mistyped company id, a missing glossary entry, ...).
// Returns a list of plain-language problems. Empty list = all good.

const EFFECT_TYPES = ['status', 'link', 'path', 'envelope', 'highlight', 'evidence', 'log']

function* allStrings(value: unknown, where: string): Generator<[string, string]> {
  if (typeof value === 'string') yield [where, value]
  else if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) yield* allStrings(value[i], `${where}[${i}]`)
  } else if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) yield* allStrings(child, `${where}.${key}`)
  }
}

export function validateScenario(scenario: Scenario): string[] {
  const problems: string[] = []
  const companyIds = new Set(scenario.companies.map((c) => c.id))
  const kindOf = new Map(scenario.companies.map((c) => [c.id, c.kind]))
  const statuses = new Set(Object.keys(scenario.ui.statusLabels))

  if (scenario.meta.nameMode !== 'real' && scenario.meta.nameMode !== 'fictional') {
    problems.push(`meta.nameMode must be "real" or "fictional", not "${scenario.meta.nameMode}".`)
  }

  // Every {co:...} and {gl:...} placeholder must point at something that exists.
  for (const [where, text] of allStrings(scenario, 'scenario')) {
    for (const match of text.matchAll(TOKEN_PATTERN)) {
      const [, type, id] = match
      if (type === 'co' && !companyIds.has(id)) {
        problems.push(`${where}: unknown company "${id}" in ${match[0]}`)
      }
      if (type === 'gl' && !scenario.glossary[id]) {
        problems.push(`${where}: unknown glossary term "${id}" in ${match[0]}`)
      }
    }
  }

  const checkCompany = (id: string, where: string) => {
    if (!companyIds.has(id)) problems.push(`${where}: unknown company id "${id}"`)
  }

  const checkEffect = (effect: Effect, where: string, evidenceIds: Set<string>) => {
    if (!EFFECT_TYPES.includes(effect.type)) {
      problems.push(`${where}: unknown effect type "${effect.type}"`)
      return
    }
    switch (effect.type) {
      case 'status':
        checkCompany(effect.target, where)
        if (!statuses.has(effect.status)) problems.push(`${where}: unknown status "${effect.status}"`)
        break
      case 'link':
      case 'envelope':
        checkCompany(effect.from, where)
        checkCompany(effect.to, where)
        break
      case 'path':
        checkCompany(effect.from, where)
        effect.to.forEach((id) => checkCompany(id, where))
        break
      case 'highlight':
        effect.targets.forEach((id) => checkCompany(id, where))
        break
      case 'evidence':
        if (!evidenceIds.has(effect.id)) problems.push(`${where}: unknown evidence id "${effect.id}"`)
        break
      case 'log':
        checkCompany(effect.actor, where)
        break
    }
  }

  const evidenceIds = new Set(scenario.runs.run2.evidence.map((e) => e.id))

  for (const [runName, run] of Object.entries(scenario.runs)) {
    const harmed = new Set<string>()
    run.steps.forEach((step, i) => {
      const where = `${runName}.steps[${i}] (${step.id})`
      if (step.stage !== undefined && (step.stage < 1 || step.stage > scenario.runs.run2.stages.length)) {
        problems.push(`${where}: stage ${step.stage} is outside 1-${scenario.runs.run2.stages.length}`)
      }
      for (const effect of step.effects) {
        checkEffect(effect, where, evidenceIds)
        if (effect.type === 'status' && effect.status === 'harmed' && kindOf.get(effect.target) === 'affected') {
          harmed.add(effect.target)
        }
      }
    })
    // The final "services harmed" total should match what the map will show.
    if (harmed.size !== run.totals.harmed) {
      problems.push(
        `${runName}.totals.harmed is ${run.totals.harmed}, but the steps harm ${harmed.size} services.`,
      )
    }
  }

  const choiceSteps = scenario.runs.run2.steps.filter((s) => s.kind === 'choice')
  if (choiceSteps.length !== 1) {
    problems.push(`runs.run2 needs exactly one step with "kind": "choice" (found ${choiceSteps.length}).`)
  }

  scenario.choice.options.forEach((option, i) => {
    const where = `choice.options[${i}] (${option.id})`
    checkCompany(option.actor, where)
    option.result.effects.forEach((effect) => checkEffect(effect, where, evidenceIds))
  })

  return problems
}
