import { useScenario } from '../../lib/useScenario.ts'
import type { RunTotals } from '../../types/scenario.ts'
import RichText from '../shell/RichText.tsx'
import styles from './TotalsCard.module.css'

/** The run's totals, shown on its last step. Numbers are labelled illustrative. */
export default function TotalsCard({ totals }: { totals: RunTotals }) {
  const { scenario } = useScenario()
  const { ui, comparison } = scenario

  return (
    <section className={styles.card} aria-labelledby="totals-title">
      <h2 id="totals-title" className={styles.title}>
        {ui.endOfRun} ({ui.illustrative})
      </h2>
      <dl className={styles.list}>
        {comparison.rows.map((row) => (
          <div key={row.key} className={styles.row}>
            <dt>{row.label}</dt>
            <dd>{row.key === 'who' ? <RichText text={totals.who} /> : totals[row.key]}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
