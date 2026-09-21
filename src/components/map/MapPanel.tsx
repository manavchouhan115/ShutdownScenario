import { useState, type ReactNode, type Ref } from 'react'
import { useScenario } from '../../lib/useScenario.ts'
import type { BadgeKey } from '../../types/scenario.ts'
import CompanyCard from './CompanyCard.tsx'
import IncidentMap from './IncidentMap.tsx'
import Legend from './Legend.tsx'
import MobileList from './MobileList.tsx'
import styles from './MapPanel.module.css'

interface MapPanelProps {
  badges: Record<string, BadgeKey[]>
  fresh: ReadonlySet<string>
  /** Companies to single out with a ring (default: none). */
  highlights?: ReadonlySet<string>
  /** Links and paths drawn over the wide map. */
  overlay?: ReactNode
  /** Called when a company card opens (the run uses this to pause Play). */
  onCardOpen?: () => void
  /** The wide map's outer element, so a screen can scroll it into view. */
  mapRef?: Ref<HTMLDivElement>
}

const NO_HIGHLIGHTS: ReadonlySet<string> = new Set()

/** The map (or the phone list), its key, and the company card that opens on click. */
export default function MapPanel({ badges, fresh, highlights = NO_HIGHLIGHTS, overlay, onCardOpen, mapRef }: MapPanelProps) {
  const { scenario } = useScenario()
  const [selected, setSelected] = useState<string | null>(null)

  const select = (id: string) => {
    onCardOpen?.()
    setSelected(id)
  }

  return (
    <div>
      <p className={styles.hint}>{scenario.map.hint}</p>
      <IncidentMap badges={badges} fresh={fresh} highlights={highlights} onSelect={select} overlay={overlay} ref={mapRef} />
      <MobileList badges={badges} fresh={fresh} highlights={highlights} onSelect={select} />
      <Legend />
      {selected && <CompanyCard companyId={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
