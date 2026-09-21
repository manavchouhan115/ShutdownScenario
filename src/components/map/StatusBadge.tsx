import { useScenario } from '../../lib/useScenario.ts'
import type { BadgeKey } from '../../types/scenario.ts'
import { StatusIcon } from './icons.tsx'
import styles from './StatusBadge.module.css'

/** Icon plus text, so a status is never shown by colour alone. */
export default function StatusBadge({ badge }: { badge: BadgeKey }) {
  const { scenario } = useScenario()
  const label =
    badge === 'queued'
      ? scenario.ui.queuedLabel
      : badge === 'deciding'
        ? scenario.ui.decidingLabel
        : scenario.ui.statusLabels[badge]

  return (
    <span className={`${styles.badge} ${styles[badge]}`}>
      <StatusIcon badge={badge} />
      <span>{label}</span>
    </span>
  )
}
