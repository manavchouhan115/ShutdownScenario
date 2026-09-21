// The shape of src/data/scenario.json.
//
// Text fields may contain two kinds of placeholder (resolved in src/lib/text.ts):
//   {co:github}                      -> the company's name in the current nameMode
//   {gl:prompt-injection}            -> the glossary term, with a tooltip
//   {gl:prompt-injection|shown text} -> custom shown text, with the same tooltip

export type NameMode = 'real' | 'fictional'

/** Text that is the same in both name modes, or differs between them. */
export type ModeText = string | { real: string; fictional: string }

export type Column = 'control' | 'intermediaries' | 'affected'

/** intervene = yellow, affected = blue, agent = the rogue agent itself. */
export type CompanyKind = 'intervene' | 'affected' | 'agent'

export type Status =
  | 'harmed'
  | 'blocked'
  | 'stopped'
  | 'flagged'
  | 'confirmed'
  | 'disrupted'

export interface Company {
  id: string
  names: { real: string; fictional: string }
  role: string
  column: Column
  kind: CompanyKind
  sees: string
  canDo: string
}

export interface GlossaryEntry {
  term: string
  definition: string
}

export type Effect =
  | { type: 'status'; target: string; status: Status }
  | { type: 'link'; from: string; to: string; style: 'flash' | 'blocked' | 'revoked' }
  | { type: 'path'; from: string; to: string[]; kind: 'report' | 'evidence' }
  | { type: 'envelope'; from: string; to: string; state: 'queued' }
  /** Ring + "Deciding" label on these companies. With off: true, takes it away again. */
  | { type: 'highlight'; targets: string[]; off?: boolean }
  | { type: 'evidence'; id: string }
  | { type: 'log'; actor: string; text: string }

export interface Step {
  id: string
  /** Clock label, for example "T+2h" or "T+1d". */
  time: string
  /** 1-4 in Run 2: which of the paper's four stages this step belongs to. */
  stage?: number
  /** A "choice" step pauses the run and shows the options. */
  kind?: 'event' | 'choice'
  event: string
  note?: string
  /** Show the "this assumes agents carry a reliable ID" label on this step. */
  showAssumption?: boolean
  effects: Effect[]
}

export interface RunTotals {
  time: string
  harmed: number
  who: string
}

export interface Run {
  totals: RunTotals
  steps: Step[]
}

export interface ChoiceOption {
  id: string
  label: string
  /** Company id of the party that would take this action. */
  actor: string
  /** 1 = narrowest, 3 = broadest. Used by the escalation ladder. */
  ladderLevel: number
  result: {
    headline: string
    text: string
    lesson: string
    harmStops: boolean
    effects: Effect[]
  }
}

export interface Scenario {
  meta: {
    title: string
    nameMode: NameMode
    playIntervalMs: number
    paperTitle: string
    paperUrl: string
  }
  banners: { real: string; fictional: string }
  ui: {
    back: string
    next: string
    play: string
    pause: string
    restart: string
    start: string
    doneBy: string
    controlsLabel: string
    close: string
    seesLabel: string
    canDoLabel: string
    legendTitle: string
    queuedLabel: string
    decidingLabel: string
    checkedLabel: string
    notCheckedLabel: string
    timelineLabel: string
    endOfRun: string
    illustrative: string
    elapsedTime: string
    servicesHarmed: string
    legend: { intervene: string; affected: string; agent: string }
    statusLabels: Record<Status, string>
  }
  map: { label: string; hint: string; columns: Record<Column, string> }
  companies: Company[]
  glossary: Record<string, GlossaryEntry>
  intro: { title: string; body: string[]; footnote: ModeText }
  transition: { text: string }
  runs: {
    run1: Run & { title: string; screenTitle: string }
    run2: Run & {
      title: string
      screenTitle: string
      stages: string[]
      stageBarLabel: string
      assumptionLabel: string
      assumption: string
      evidenceTitle: string
      evidence: { id: string; text: string }[]
      logTitle: string
    }
  }
  choice: {
    title: string
    prompt: string
    afterPick: string
    ladder: { title: string; broad: string; narrow: string }
    options: ChoiceOption[]
  }
  comparison: {
    title: string
    columns: { run1: string; run2: string }
    rows: { label: string; key: 'time' | 'harmed' | 'who' }[]
    note: string
    closingLine: string
  }
  closing: {
    title: string
    intro: string
    hypotheses: { title: string; text: string }[]
    teaser: string
    linkLabel: string
    /** Shown instead of the link while meta.paperUrl is not a real web address yet. */
    linkPending: string
  }
}

/** What a company can show as a small label: a status, a report waiting in a queue, or "deciding". */
export type BadgeKey = Status | 'queued' | 'deciding'
