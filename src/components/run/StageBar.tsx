import styles from './StageBar.module.css'

interface StageBarProps {
  stages: string[]
  label: string
  /** 1-based stage the run is in now; 0 when it has not reached stage 1 yet. */
  current: number
}

/** The paper's four stages, as a progress bar: done (tick), current, still to come. */
export default function StageBar({ stages, label, current }: StageBarProps) {
  return (
    <ol className={styles.bar} aria-label={label}>
      {stages.map((stage, i) => {
        const number = i + 1
        const state = number < current ? styles.done : number === current ? styles.current : styles.future
        return (
          <li
            key={stage}
            className={`${styles.stage} ${state}`}
            aria-current={number === current ? 'step' : undefined}
          >
            <span className={styles.number} aria-hidden="true">
              {number < current ? '✓' : number}
            </span>
            <span>{stage}</span>
          </li>
        )
      })}
    </ol>
  )
}
