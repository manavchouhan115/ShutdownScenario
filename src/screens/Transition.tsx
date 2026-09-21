import RichText from '../components/shell/RichText.tsx'
import { useScenario } from '../lib/useScenario.ts'
import styles from './Transition.module.css'

/** Screen 3: the pause between Run 1 and Run 2. */
export default function Transition() {
  const { scenario } = useScenario()

  return (
    <section className={styles.transition}>
      <h1>
        <RichText text={scenario.transition.text} />
      </h1>
    </section>
  )
}
