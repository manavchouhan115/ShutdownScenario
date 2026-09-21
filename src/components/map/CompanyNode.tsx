import type { CSSProperties } from 'react'
import type { BadgeKey, Company } from '../../types/scenario.ts'
import { KindIcon } from './icons.tsx'
import StatusBadge from './StatusBadge.tsx'
import styles from './CompanyNode.module.css'

interface CompanyNodeProps {
  company: Company
  name: string
  badges: BadgeKey[]
  /** True when the current step just changed this company (used for a short pulse). */
  fresh: boolean
  /** True when the company is being singled out (for example, the ones deciding). */
  highlighted?: boolean
  onSelect: () => void
  /** Extra class from the parent, used to place the node on the map. */
  className?: string
  style?: CSSProperties
}

/** One company as a button. Colour comes from its role and what has happened to it. */
export default function CompanyNode({
  company,
  name,
  badges,
  fresh,
  highlighted,
  onSelect,
  className,
  style,
}: CompanyNodeProps) {
  const harmed = badges.includes('harmed')
  const stopped = badges.includes('stopped')
  const classes = [
    styles.node,
    styles[company.kind],
    harmed ? styles.harmed : '',
    stopped ? styles.stopped : '',
    highlighted ? styles.highlighted : '',
    className ?? '',
  ].join(' ')

  return (
    <button
      type="button"
      className={classes}
      style={style}
      onClick={onSelect}
      aria-haspopup="dialog"
      data-fresh={fresh || undefined}
    >
      <span className={styles.name}>
        <KindIcon kind={company.kind} />
        <span>{name}</span>
      </span>
      {badges.length > 0 && (
        <span className={styles.badges}>
          {badges.map((badge) => (
            <StatusBadge key={badge} badge={badge} />
          ))}
        </span>
      )}
    </button>
  )
}
