import { useMemo } from 'react'
import type { ActiveEnvelope, ActiveLink, ActivePath } from '../../lib/mapState.ts'
import { useScenario } from '../../lib/useScenario.ts'
import { computeLayout } from './layout.ts'
import { pathData, routePoints } from './routes.ts'
import styles from './Links.module.css'

interface LinksProps {
  links: ActiveLink[]
  paths: ActivePath[]
  envelopes: ActiveEnvelope[]
}

const ARROW = 'M0 0 L14 7 L0 14 Z'
const BAR = 'M10 0 L14 0 L14 14 L10 14 Z'

/** Lines drawn on the map (inside the map's SVG). Newest ones draw themselves in. */
export default function Links({ links, paths, envelopes }: LinksProps) {
  const { scenario } = useScenario()
  const layout = useMemo(() => computeLayout(scenario.companies), [scenario.companies])

  const line = (key: string, from: string, to: string, className: string, marker: string, offset = 0) => {
    const points = routePoints(layout[from], layout[to], offset)
    return (
      <path
        key={key}
        d={pathData(points)}
        pathLength={1}
        className={className}
        markerEnd={`url(#${marker})`}
      />
    )
  }

  return (
    <>
      <defs>
        {[
          ['arrow-flash', styles.markerFlash, ARROW],
          ['arrow-report', styles.markerReport, ARROW],
          ['arrow-evidence', styles.markerEvidence, ARROW],
          ['arrow-queued', styles.markerQueued, ARROW],
          ['bar-blocked', styles.markerBlocked, BAR],
          ['bar-revoked', styles.markerRevoked, BAR],
        ].map(([id, className, d]) => (
          <marker
            key={id}
            id={id}
            markerUnits="userSpaceOnUse"
            markerWidth="14"
            markerHeight="14"
            refX="13"
            refY="7"
            orient="auto"
          >
            <path d={d} className={className} />
          </marker>
        ))}
      </defs>

      {links.map((link) =>
        line(
          link.key,
          link.from,
          link.to,
          `${styles[link.style]} ${link.current ? styles.current : styles.past}`,
          link.style === 'flash' ? 'arrow-flash' : link.style === 'blocked' ? 'bar-blocked' : 'bar-revoked',
          link.style === 'flash' ? -7 : 0,
        ),
      )}

      {paths.flatMap((path) =>
        path.to.map((target) =>
          line(
            `${path.key}-${target}`,
            path.from,
            target,
            `${styles[path.kind]} ${path.current ? styles.current : styles.past}`,
            path.kind === 'report' ? 'arrow-report' : 'arrow-evidence',
            path.kind === 'evidence' ? 8 : 0,
          ),
        ),
      )}

      {envelopes.map((envelope) => {
        const points = routePoints(layout[envelope.from], layout[envelope.to], 8)
        // Sit the envelope on the last corner, beside the company it is waiting at.
        const [x, y] = points[points.length - 2]
        return (
          <g key={envelope.key}>
            {line(`${envelope.key}-line`, envelope.from, envelope.to, `${styles.queued} ${envelope.current ? styles.current : styles.past}`, 'arrow-queued', 8)}
            <g
              className={`${styles.envelope} ${envelope.current ? styles.current : ''}`}
              transform={`translate(${x - 15} ${y - 24})`}
            >
              <rect x="6" y="-6" width="30" height="20" rx="2" className={styles.envelopeBack} />
              <rect x="0" y="0" width="30" height="20" rx="2" className={styles.envelopeFront} />
              <path d="M1 2 L15 12 L29 2" className={styles.envelopeFlap} />
            </g>
          </g>
        )
      })}
    </>
  )
}
