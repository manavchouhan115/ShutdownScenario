import styles from './AssumptionLabel.module.css'

/** A short caveat shown at the step that depends on it (the agent ID). */
export default function AssumptionLabel({ label, text }: { label: string; text: string }) {
  return (
    <p className={styles.assumption}>
      <strong className={styles.label}>{label}</strong> {text}
    </p>
  )
}
