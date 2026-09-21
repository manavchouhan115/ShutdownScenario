import RichText from '../components/shell/RichText.tsx'
import { useScenario } from '../lib/useScenario.ts'
import styles from './Closing.module.css'

/** Screen 6: the paper's working hypotheses, a teaser, and the link to the paper. */
export default function Closing() {
  const { scenario } = useScenario()
  const { closing, meta } = scenario
  // Until a real web address is filled in, show a note instead of a broken link.
  const hasLink = /^https?:\/\//.test(meta.paperUrl)

  return (
    <section>
      <h1>{closing.title}</h1>
      <p className={styles.intro}>{closing.intro}</p>

      <ol className={styles.list}>
        {closing.hypotheses.map((hypothesis, i) => (
          <li key={hypothesis.title} className={styles.item}>
            <span className={styles.number} aria-hidden="true">
              {i + 1}
            </span>
            <div>
              <h2 className={styles.heading}>
                <RichText text={hypothesis.title} />
              </h2>
              <p className={styles.text}>
                <RichText text={hypothesis.text} />
              </p>
            </div>
          </li>
        ))}
      </ol>

      <p className={styles.teaser}>
        <RichText text={closing.teaser} />
      </p>

      <p className={styles.paper}>
        {hasLink ? (
          <a href={meta.paperUrl} target="_blank" rel="noopener noreferrer">
            {closing.linkLabel}: {meta.paperTitle}
          </a>
        ) : (
          <>
            {closing.linkLabel}: {meta.paperTitle}. {closing.linkPending}
          </>
        )}
      </p>
    </section>
  )
}
