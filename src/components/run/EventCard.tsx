import type { Step } from '../../types/scenario.ts'
import RichText from '../shell/RichText.tsx'
import styles from './EventCard.module.css'

/**
 * What is happening now, and the plain-language note about it. A polite live
 * region, so screen readers read each new step out as it appears.
 */
export default function EventCard({ step }: { step: Step }) {
  return (
    <div className={styles.card} aria-live="polite" aria-atomic="true">
      <p className={styles.event}>
        <strong className={styles.time}>{step.time}</strong>
        <RichText text={step.event} />
      </p>
      {step.note && (
        <p className={styles.note}>
          <RichText text={step.note} />
        </p>
      )}
    </div>
  )
}
