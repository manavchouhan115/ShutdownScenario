import { useScenario } from '../../lib/useScenario.ts'
import type { BadgeKey, CompanyKind } from '../../types/scenario.ts'
import { KindIcon } from './icons.tsx'
import StatusBadge from './StatusBadge.tsx'
import styles from './Legend.module.css'

const KINDS: CompanyKind[] = ['intervene', 'affected', 'agent']
const BADGES: BadgeKey[] = ['harmed', 'blocked', 'stopped', 'flagged', 'confirmed', 'disrupted', 'queued', 'deciding']

/** The key: what each colour/icon means. Every entry has a text label. */
export default function Legend() {
  const { scenario } = useScenario()
  const { ui } = scenario

  return (
    <section className={styles.legend} aria-label={ui.legendTitle}>
      <h2 className={styles.title}>{ui.legendTitle}</h2>
      <ul className={styles.row}>
        {KINDS.map((kind) => (
          <li key={kind} className={styles.kind}>
            <span className={`${styles.swatch} ${styles[kind]}`}>
              <KindIcon kind={kind} />
            </span>
            {ui.legend[kind]}
          </li>
        ))}
      </ul>
      <ul className={styles.row}>
        {BADGES.map((badge) => (
          <li key={badge}>
            <StatusBadge badge={badge} />
          </li>
        ))}
      </ul>
    </section>
  )
}
