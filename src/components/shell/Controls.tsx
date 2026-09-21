import { useScenario } from '../../lib/useScenario.ts'
import styles from './Controls.module.css'

interface ControlsProps {
  canBack: boolean
  canNext: boolean
  onBack: () => void
  onNext: () => void
  onRestart: () => void
  /** Show Play/Pause. Only screens that have steps to play through use it. */
  playable: boolean
  playing: boolean
  onTogglePlay: () => void
}

/** Back / Play-Pause / Restart / Next. Real buttons, so Tab and Enter (or Space) work. */
export default function Controls({
  canBack,
  canNext,
  onBack,
  onNext,
  onRestart,
  playable,
  playing,
  onTogglePlay,
}: ControlsProps) {
  const { scenario } = useScenario()
  const { ui } = scenario

  return (
    <nav className={styles.controls} aria-label={ui.controlsLabel}>
      <button type="button" className={styles.button} onClick={onBack} disabled={!canBack}>
        <span aria-hidden="true">&larr; </span>
        {ui.back}
      </button>
      {playable && (
        <button type="button" className={styles.button} onClick={onTogglePlay}>
          <span aria-hidden="true">{playing ? '⏸ ' : '▶ '}</span>
          {playing ? ui.pause : ui.play}
        </button>
      )}
      <button type="button" className={styles.button} onClick={onRestart}>
        <span aria-hidden="true">&#8634; </span>
        {ui.restart}
      </button>
      <button
        type="button"
        className={`${styles.button} ${styles.primary}`}
        onClick={onNext}
        disabled={!canNext}
      >
        {ui.next}
        <span aria-hidden="true"> &rarr;</span>
      </button>
    </nav>
  )
}
