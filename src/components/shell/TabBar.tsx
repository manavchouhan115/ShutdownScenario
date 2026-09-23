import { TABS, type TabId } from '../../lib/flow.ts'
import { useScenario } from '../../lib/useScenario.ts'
import styles from './TabBar.module.css'

interface TabBarProps {
  active: TabId
  onSelect: (id: TabId) => void
}

/**
 * Always-visible switch between the demo's sections. Picking Run 1 or Run 2
 * starts that run over from its first step (see App.tsx); Intro, Compare and
 * Hypotheses have no steps of their own.
 */
export default function TabBar({ active, onSelect }: TabBarProps) {
  const { scenario } = useScenario()
  const { tabs, tabsLabel } = scenario.ui

  return (
    <nav className={styles.bar} aria-label={tabsLabel}>
      {TABS.map((id) => (
        <button
          key={id}
          type="button"
          className={`${styles.tab} ${id === active ? styles.active : ''}`}
          aria-current={id === active ? 'page' : undefined}
          onClick={() => onSelect(id)}
        >
          {tabs[id]}
        </button>
      ))}
    </nav>
  )
}
