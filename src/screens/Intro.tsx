import RichText from '../components/shell/RichText.tsx'
import { useScenario } from '../lib/useScenario.ts'
import styles from './Intro.module.css'

interface IntroProps {
  onStart: () => void
}

/** Screen 1: title, short setup, Start button. */
export default function Intro({ onStart }: IntroProps) {
  const { scenario } = useScenario()
  const { intro, ui } = scenario

  return (
    <section>
      <h1>{intro.title}</h1>
      {intro.body.map((paragraph, i) => (
        <p key={i} className={styles.body}>
          <RichText text={paragraph} />
        </p>
      ))}
      <p className={styles.footnote}>{intro.footnote}</p>
      <button type="button" className={styles.start} onClick={onStart}>
        {ui.start}
        <span aria-hidden="true"> &rarr;</span>
      </button>
    </section>
  )
}
