import { useMemo, type ReactNode, type Ref } from 'react'
import { useScenario } from '../../lib/useScenario.ts'
import type { BadgeKey, Column } from '../../types/scenario.ts'
import CompanyNode from './CompanyNode.tsx'
import { COLUMN_SPAN, VIEW_H, VIEW_W, computeLayout } from './layout.ts'
import styles from './IncidentMap.module.css'

interface IncidentMapProps {
  badges: Record<string, BadgeKey[]>
  /** Company ids the current step just changed. */
  fresh: ReadonlySet<string>
  highlights: ReadonlySet<string>
  onSelect: (id: string) => void
  /** Drawn on top of the map, in the map's own units (see layout.ts). Used for links. */
  overlay?: ReactNode
  /** The map's outer element, so a screen can scroll it into view. */
  ref?: Ref<HTMLDivElement>
}

const COLUMNS: Column[] = ['control', 'intermediaries', 'affected']

const pctX = (value: number) => `${(value / VIEW_W) * 100}%`
const pctY = (value: number) => `${(value / VIEW_H) * 100}%`

/** The wide, three-column map. Hidden on narrow screens, where MobileList is shown. */
export default function IncidentMap({ badges, fresh, highlights, onSelect, overlay, ref }: IncidentMapProps) {
  const { scenario, nameOf } = useScenario()
  const layout = useMemo(() => computeLayout(scenario.companies), [scenario.companies])

  return (
    <div
      ref={ref}
      className={styles.map}
      role="group"
      aria-label={scenario.map.label}
      style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}
    >
      {COLUMNS.map((column) => (
        <h2
          key={column}
          className={styles.columnTitle}
          style={{ left: pctX(COLUMN_SPAN[column].x), width: pctX(COLUMN_SPAN[column].w) }}
        >
          {scenario.map.columns[column]}
        </h2>
      ))}

      <svg
        className={styles.overlay}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        {overlay}
      </svg>

      {scenario.companies.map((company) => {
        const box = layout[company.id]
        return (
          <CompanyNode
            key={company.id}
            company={company}
            name={nameOf(company.id)}
            badges={badges[company.id] ?? []}
            fresh={fresh.has(company.id)}
            highlighted={highlights.has(company.id)}
            onSelect={() => onSelect(company.id)}
            className={styles.node}
            style={{
              left: pctX(box.x),
              top: pctY(box.y),
              width: pctX(box.w),
              height: pctY(box.h),
            }}
          />
        )
      })}
    </div>
  )
}
