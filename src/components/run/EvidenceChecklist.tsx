import { useScenario } from '../../lib/useScenario.ts'
import RichText from '../shell/RichText.tsx'
import styles from './EvidenceChecklist.module.css'

interface EvidenceChecklistProps {
  title: string
  items: { id: string; text: string }[]
  /** Ids of the checks that have been ticked. */
  ticked: string[]
  /** The ones ticked by the step on screen now (they tick in one after another). */
  fresh: ReadonlySet<string>
}

/** What the provider checks before acting. Each item shows a tick or an empty circle. */
export default function EvidenceChecklist({ title, items, ticked, fresh }: EvidenceChecklistProps) {
  const { scenario } = useScenario()
  let freshOrder = 0

  return (
    <section className={styles.card} aria-labelledby="evidence-title">
      <h2 id="evidence-title" className={styles.title}>
        <RichText text={title} />
      </h2>
      <ul className={styles.list}>
        {items.map((item) => {
          const done = ticked.includes(item.id)
          const delay = done && fresh.has(item.id) ? freshOrder++ * 0.35 : 0
          return (
            <li key={item.id} className={done ? styles.done : styles.todo}>
              <span
                className={`${styles.box} ${done && fresh.has(item.id) ? styles.pop : ''}`}
                style={{ animationDelay: `${delay}s` }}
                aria-hidden="true"
              >
                {done ? '✓' : ''}
              </span>
              <span>
                <RichText text={item.text} />
                <span className={styles.sr}> ({done ? scenario.ui.checkedLabel : scenario.ui.notCheckedLabel})</span>
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
