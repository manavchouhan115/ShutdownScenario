import type { CSSProperties } from 'react'
import { useScenario } from '../../lib/useScenario.ts'
import type { Step } from '../../types/scenario.ts'
import RichText from '../shell/RichText.tsx'
import styles from './ChoicePanel.module.css'

interface ChoicePanelProps {
  step: Step
  selectedId: string | null
  onSelect: (id: string) => void
}

/**
 * Stage 3, "Act": the viewer picks how to stop the agent. The options are laid
 * out as a ladder (broadest at the top, narrowest at the bottom). No option is
 * marked as the right one; each result explains the trade-off.
 */
export default function ChoicePanel({ step, selectedId, onSelect }: ChoicePanelProps) {
  const { scenario, nameOf } = useScenario()
  const { choice, ui } = scenario
  const selected = choice.options.find((option) => option.id === selectedId)
  const levels = [...new Set(choice.options.map((option) => option.ladderLevel))].sort((a, b) => b - a)

  return (
    <section className={styles.panel} aria-labelledby="choice-heading">
      <h2 id="choice-heading" className={styles.heading}>
        <strong className={styles.time}>{step.time}</strong>
        <RichText text={step.event} />
      </h2>

      <div className={styles.grid}>
        <div className={styles.ladder}>
          <div className={styles.axis} aria-hidden="true">
            <span>{choice.ladder.broad}</span>
            <span className={styles.line} />
            <span>{choice.ladder.narrow}</span>
          </div>
          <div className={styles.rows} role="group" aria-label={choice.ladder.title}>
            {levels.map((level) => {
              const onLevel = choice.options.filter((option) => option.ladderLevel === level)
              return (
                <div key={level} className={styles.row} style={{ '--cols': onLevel.length } as CSSProperties}>
                  {onLevel.map((option) => {
                    const on = option.id === selectedId
                    return (
                      <button
                        key={option.id}
                        type="button"
                        className={`${styles.option} ${on ? styles.selected : ''}`}
                        aria-pressed={on}
                        onClick={() => onSelect(option.id)}
                      >
                        <span className={styles.letter} aria-hidden="true">
                          {option.id}
                        </span>
                        <span className={styles.text}>
                          <span className={styles.label}>
                            <RichText text={option.label} />
                          </span>
                          <span className={styles.actor}>
                            {ui.doneBy} {nameOf(option.actor)}
                          </span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>

        <div className={styles.result} aria-live="polite">
          {selected ? (
            <>
              <h3 className={styles.headline}>
                <RichText text={selected.result.headline} />
              </h3>
              <p>
                <RichText text={selected.result.text} />
              </p>
              <p className={styles.lesson}>{selected.result.lesson}</p>
              <p className={styles.hint}>{choice.afterPick}</p>
            </>
          ) : (
            <p className={styles.prompt}>{choice.prompt}</p>
          )}
        </div>
      </div>
    </section>
  )
}
