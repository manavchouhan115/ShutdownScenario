import { useScenario } from '../../lib/useScenario.ts'
import styles from './Banner.module.css'

/** Always visible. Says the scenario is hypothetical (real names) or fictional. */
export default function Banner() {
  const { scenario, nameMode } = useScenario()

  return (
    <div className={styles.banner} role="note">
      <span className={styles.icon} aria-hidden="true">
        i
      </span>
      <span>{scenario.banners[nameMode]}</span>
    </div>
  )
}
