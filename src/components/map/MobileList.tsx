import { useScenario } from '../../lib/useScenario.ts'
import type { BadgeKey, Column } from '../../types/scenario.ts'
import { KindIcon } from './icons.tsx'
import StatusBadge from './StatusBadge.tsx'
import styles from './MobileList.module.css'

interface MobileListProps {
  badges: Record<string, BadgeKey[]>
  fresh: ReadonlySet<string>
  highlights: ReadonlySet<string>
  onSelect: (id: string) => void
}

const COLUMNS: Column[] = ['control', 'intermediaries', 'affected']

/** The map as a vertical list, for phones. Shown only on narrow screens. */
export default function MobileList({ badges, fresh, highlights, onSelect }: MobileListProps) {
  const { scenario, nameOf } = useScenario()

  return (
    <div className={styles.list} role="group" aria-label={scenario.map.label}>
      {COLUMNS.map((column) => (
        <section key={column}>
          <h2 className={styles.title}>{scenario.map.columns[column]}</h2>
          <ul className={styles.items}>
            {scenario.companies
              .filter((company) => company.column === column)
              .map((company) => {
                const list = badges[company.id] ?? []
                const classes = [
                  styles.item,
                  styles[company.kind],
                  list.includes('harmed') ? styles.harmed : '',
                  list.includes('stopped') ? styles.stopped : '',
                  highlights.has(company.id) ? styles.highlighted : '',
                ].join(' ')
                return (
                  <li key={company.id}>
                    <button
                      type="button"
                      className={classes}
                      onClick={() => onSelect(company.id)}
                      aria-haspopup="dialog"
                      data-fresh={fresh.has(company.id) || undefined}
                    >
                      <span className={styles.name}>
                        <KindIcon kind={company.kind} />
                        <span>{nameOf(company.id)}</span>
                      </span>
                      {list.length > 0 && (
                        <span className={styles.badges}>
                          {list.map((badge) => (
                            <StatusBadge key={badge} badge={badge} />
                          ))}
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
          </ul>
        </section>
      ))}
    </div>
  )
}
