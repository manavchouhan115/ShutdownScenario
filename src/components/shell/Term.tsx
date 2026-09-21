import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { useScenario } from '../../lib/useScenario.ts'
import styles from './Term.module.css'

interface TermProps {
  /** Glossary id from scenario.json */
  id: string
  children: ReactNode
}

// Widest the tooltip gets, in pixels (20rem). Used to keep it on screen.
const TIP_MAX_WIDTH = 320
const EDGE = 8
// Room the tooltip needs below the word; if there is less, it opens above.
const TIP_HEIGHT_GUESS = 150

interface Position {
  left: number
  top?: number
  bottom?: number
}

/**
 * A word with a dotted underline. Hover, tap, or Tab to it to read the
 * definition; Escape closes it. The tooltip sits at a fixed spot on the screen
 * and stays inside the window, even next to an edge or inside a pop-up.
 */
export default function Term({ id, children }: TermProps) {
  const { scenario } = useScenario()
  const tipId = useId()
  const termRef = useRef<HTMLSpanElement>(null)
  const [position, setPosition] = useState<Position | null>(null)
  const entry = scenario.glossary[id]

  const open = () => {
    const el = termRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const width = Math.min(TIP_MAX_WIDTH, window.innerWidth - 2 * EDGE)
    const left = Math.max(EDGE, Math.min(rect.left, window.innerWidth - width - EDGE))
    const roomBelow = window.innerHeight - rect.bottom
    if (roomBelow < TIP_HEIGHT_GUESS && rect.top > TIP_HEIGHT_GUESS) {
      setPosition({ left, bottom: window.innerHeight - rect.top })
    } else {
      setPosition({ left, top: rect.bottom })
    }
  }

  // While a tooltip is open: Escape closes it, and so does scrolling (it stays fixed on screen).
  const isOpen = position !== null
  useEffect(() => {
    if (!isOpen) return
    const close = () => setPosition(null)
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('scroll', close, true)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', close, true)
    }
  }, [isOpen])

  if (!entry) return <>{children}</>

  return (
    <span
      ref={termRef}
      className={styles.term}
      tabIndex={0}
      aria-describedby={tipId}
      onMouseEnter={open}
      onMouseLeave={() => setPosition(null)}
      onFocus={open}
      onBlur={() => setPosition(null)}
    >
      {children}
      <span
        role="tooltip"
        id={tipId}
        className={`${styles.tip} ${position ? styles.open : ''}`}
        style={position ?? undefined}
      >
        <strong>{entry.term}:</strong> {entry.definition}
      </span>
    </span>
  )
}
