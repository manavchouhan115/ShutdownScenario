import { useScenario } from '../../lib/useScenario.ts'
import type { Step } from '../../types/scenario.ts'
import styles from './Timeline.module.css'

interface TimelineProps {
  steps: Step[]
  current: number
}

/** All the steps of the run as a row of time labels: done, current, still to come. */
export default function Timeline({ steps, current }: TimelineProps) {
  const { scenario } = useScenario()

  return (
    <ol className={styles.timeline} aria-label={scenario.ui.timelineLabel}>
      {steps.map((step, i) => {
        const state = i < current ? styles.done : i === current ? styles.current : styles.future
        return (
          <li
            key={step.id}
            className={`${styles.item} ${state}`}
            aria-current={i === current ? 'step' : undefined}
          >
            {step.time}
          </li>
        )
      })}
    </ol>
  )
}
