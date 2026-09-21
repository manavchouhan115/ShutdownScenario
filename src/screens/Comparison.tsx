import RichText from '../components/shell/RichText.tsx'
import { useScenario } from '../lib/useScenario.ts'
import styles from './Comparison.module.css'

/** Screen 5: the two runs side by side, then the one-line takeaway. */
export default function Comparison() {
  const { scenario } = useScenario()
  const { comparison, runs } = scenario
  const totals = { run1: runs.run1.totals, run2: runs.run2.totals }

  return (
    <section>
      <h1 id="comparison-title">{comparison.title}</h1>

      <table className={styles.table} aria-labelledby="comparison-title">
        <thead>
          <tr>
            <td />
            <th scope="col" className={styles.run1}>
              {comparison.columns.run1}
            </th>
            <th scope="col" className={styles.run2}>
              {comparison.columns.run2}
            </th>
          </tr>
        </thead>
        <tbody>
          {comparison.rows.map((row) => (
            <tr key={row.key}>
              <th scope="row" className={styles.rowLabel}>
                {row.label}
              </th>
              {(['run1', 'run2'] as const).map((run) => (
                <td
                  key={run}
                  data-label={comparison.columns[run]}
                  className={row.key === 'who' ? styles.who : styles.big}
                >
                  {row.key === 'who' ? <RichText text={totals[run].who} /> : totals[run][row.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <p className={styles.note}>{comparison.note}</p>
      <p className={styles.closing}>{comparison.closingLine}</p>
    </section>
  )
}
