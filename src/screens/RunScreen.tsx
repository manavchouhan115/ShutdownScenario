import { useEffect, useMemo, useRef } from 'react'
import ChoicePanel from '../components/choice/ChoicePanel.tsx'
import Links from '../components/map/Links.tsx'
import MapPanel from '../components/map/MapPanel.tsx'
import AssumptionLabel from '../components/run/AssumptionLabel.tsx'
import Clock from '../components/run/Clock.tsx'
import EventCard from '../components/run/EventCard.tsx'
import EvidenceChecklist from '../components/run/EvidenceChecklist.tsx'
import HarmCounter from '../components/run/HarmCounter.tsx'
import LogPanel from '../components/run/LogPanel.tsx'
import StageBar from '../components/run/StageBar.tsx'
import Timeline from '../components/run/Timeline.tsx'
import TotalsCard from '../components/run/TotalsCard.tsx'
import RichText from '../components/shell/RichText.tsx'
import { computeMapState } from '../lib/mapState.ts'
import { useScenario } from '../lib/useScenario.ts'
import styles from './RunScreen.module.css'

interface RunScreenProps {
  runKey: 'run1' | 'run2'
  stepIndex: number
  /** Run 2 only: the option the viewer has picked at the "Act" step, if any. */
  choiceId: string | null
  onChoose: (id: string) => void
  /** Called when the viewer opens a company card (so Play can pause). */
  onCardOpen: () => void
}

/**
 * One run of the incident: clock, harm counter, the current step and the map.
 * Run 2 adds the four-stage bar, the evidence checklist, the choice and the record.
 */
export default function RunScreen({ runKey, stepIndex, choiceId, onChoose, onCardOpen }: RunScreenProps) {
  const { scenario } = useScenario()
  const run = scenario.runs[runKey]
  const run2 = runKey === 'run2' ? scenario.runs.run2 : null
  const step = run.steps[stepIndex]
  const isLast = stepIndex === run.steps.length - 1
  const isChoiceStep = step.kind === 'choice'

  const chosen = scenario.choice.options.find((option) => option.id === choiceId)
  const state = useMemo(
    () => computeMapState(run.steps, stepIndex, chosen?.result.effects ?? []),
    [run.steps, stepIndex, chosen],
  )

  // Which of the four stages the run has reached (0 = none yet).
  const stage = run.steps.slice(0, stepIndex + 1).reduce((max, s) => Math.max(max, s.stage ?? 0), 0)

  // Counted from the map itself, so the number can never disagree with what is shown.
  const harmed = scenario.companies.filter(
    (company) => company.kind === 'affected' && state.badges[company.id]?.includes('harmed'),
  ).length

  // After the viewer picks an option, make sure the map (where its effect shows) is in view.
  const mapRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!isChoiceStep || choiceId === null) return
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    mapRef.current?.scrollIntoView({ block: 'nearest', behavior: calm ? 'auto' : 'smooth' })
  }, [isChoiceStep, choiceId])

  const showChecklist = run2 !== null && stage >= 2 && !isChoiceStep

  return (
    <section>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{run.title}</h1>
          <p className={styles.subtitle}>
            <RichText text={run.screenTitle} />
          </p>
        </div>
        <div className={styles.status}>
          <Clock time={step.time} />
          <HarmCounter count={harmed} />
        </div>
      </div>

      {run2 && <StageBar stages={run2.stages} label={run2.stageBarLabel} current={stage} />}

      {run2 && isChoiceStep ? (
        <ChoicePanel step={step} selectedId={choiceId} onSelect={onChoose} />
      ) : (
        <div className={showChecklist ? styles.topRow : undefined}>
          <div>
            <EventCard step={step} />
            {run2 && step.showAssumption && (
              <AssumptionLabel label={run2.assumptionLabel} text={run2.assumption} />
            )}
          </div>
          {run2 && showChecklist && (
            <EvidenceChecklist
              title={run2.evidenceTitle}
              items={run2.evidence}
              ticked={state.evidence}
              fresh={state.freshEvidence}
            />
          )}
        </div>
      )}

      <MapPanel
        badges={state.badges}
        fresh={state.fresh}
        highlights={state.highlights}
        onCardOpen={onCardOpen}
        mapRef={mapRef}
        overlay={<Links links={state.links} paths={state.paths} envelopes={state.envelopes} />}
      />

      {run2 && state.log.length > 0 && <LogPanel title={run2.logTitle} entries={state.log} />}
      {isLast && <TotalsCard totals={run.totals} />}
      <Timeline steps={run.steps} current={stepIndex} />
    </section>
  )
}
