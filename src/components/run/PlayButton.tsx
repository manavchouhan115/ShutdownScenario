import { useScenario } from '../../lib/useScenario.ts'
import styles from './PlayButton.module.css'

interface PlayButtonProps {
  playing: boolean
  onToggle: () => void
}

/** Auto-advances through the run's steps every few seconds, from wherever it currently is. */
export default function PlayButton({ playing, onToggle }: PlayButtonProps) {
  const { scenario } = useScenario()
  const { ui } = scenario

  return (
    <button type="button" className={styles.button} onClick={onToggle}>
      <span aria-hidden="true">{playing ? '⏸ ' : '▶ '}</span>
      {playing ? ui.pause : ui.play}
    </button>
  )
}
