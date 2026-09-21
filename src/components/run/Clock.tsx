import { useScenario } from '../../lib/useScenario.ts'
import styles from './Clock.module.css'

/** The elapsed-time clock, for example "T+2h". */
export default function Clock({ time }: { time: string }) {
  const { scenario } = useScenario()

  return (
    <div className={styles.clock}>
      <span className={styles.label}>{scenario.ui.elapsedTime}</span>
      <span className={styles.time}>{time}</span>
    </div>
  )
}
