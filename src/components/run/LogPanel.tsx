import { useScenario } from '../../lib/useScenario.ts'
import type { LogEntry } from '../../lib/mapState.ts'
import RichText from '../shell/RichText.tsx'
import styles from './LogPanel.module.css'

/** The record every party keeps of what it saw and did. Fills in at the last step. */
export default function LogPanel({ title, entries }: { title: string; entries: LogEntry[] }) {
  const { nameOf } = useScenario()

  return (
    <section className={styles.card} aria-labelledby="log-title">
      <h2 id="log-title" className={styles.title}>
        {title}
      </h2>
      <ul className={styles.list}>
        {entries.map((entry, i) => (
          <li key={i} className={styles.entry} style={{ animationDelay: `${i * 0.25}s` }}>
            <strong>{nameOf(entry.actor)}:</strong> <RichText text={entry.text} />
          </li>
        ))}
      </ul>
    </section>
  )
}
