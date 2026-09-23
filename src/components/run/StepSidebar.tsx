import type { Step } from '../../types/scenario.ts'
import styles from './StepSidebar.module.css'

interface StepSidebarProps {
  steps: Step[]
  current: number
  label: string
  onSelect: (index: number) => void
}

/**
 * Every step of the run, numbered, always clickable — the viewer can jump to
 * any moment directly, in any order. A vertical rail on a laptop; a
 * horizontal scrolling row above the content on a narrow screen.
 */
export default function StepSidebar({ steps, current, label, onSelect }: StepSidebarProps) {
  return (
    <nav className={styles.sidebar} aria-label={label}>
      <ol className={styles.list}>
        {steps.map((step, i) => (
          <li key={step.id}>
            <button
              type="button"
              className={`${styles.step} ${i === current ? styles.current : ''}`}
              aria-current={i === current ? 'step' : undefined}
              onClick={() => onSelect(i)}
            >
              <span className={styles.number} aria-hidden="true">
                {i + 1}
              </span>
              <span className={styles.time}>{step.time}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  )
}
