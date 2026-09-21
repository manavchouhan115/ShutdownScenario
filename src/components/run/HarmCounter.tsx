import { useScenario } from '../../lib/useScenario.ts'
import styles from './HarmCounter.module.css'

/** How many affected services have been harmed so far. The number pulses when it rises. */
export default function HarmCounter({ count }: { count: number }) {
  const { scenario } = useScenario()

  return (
    <div className={styles.counter}>
      <span className={styles.label}>
        {scenario.ui.servicesHarmed} ({scenario.ui.illustrative})
      </span>
      <span key={count} className={styles.value}>
        {count}
      </span>
    </div>
  )
}
