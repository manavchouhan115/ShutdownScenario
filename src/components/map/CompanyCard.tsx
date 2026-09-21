import { useEffect, useRef } from 'react'
import { useScenario } from '../../lib/useScenario.ts'
import RichText from '../shell/RichText.tsx'
import { KindIcon } from './icons.tsx'
import styles from './CompanyCard.module.css'

interface CompanyCardProps {
  companyId: string
  onClose: () => void
}

/**
 * Who a company is, what it can see and what it can do. A native modal dialog,
 * so Esc closes it, focus stays inside while it is open, and focus returns to
 * the company button afterwards.
 */
export default function CompanyCard({ companyId, onClose }: CompanyCardProps) {
  const { scenario, nameOf } = useScenario()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const company = scenario.companies.find((c) => c.id === companyId)

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()
  }, [])

  if (!company) return null
  const { ui } = scenario

  return (
    <dialog
      ref={dialogRef}
      className={styles.card}
      aria-labelledby="company-card-title"
      onClose={onClose}
      onClick={(event) => {
        // A click on the dark backdrop lands on the dialog element itself.
        if (event.target === dialogRef.current) dialogRef.current?.close()
      }}
    >
      <h2 id="company-card-title" className={styles.title}>
        {nameOf(company.id)}
      </h2>
      <p className={styles.kind}>
        <KindIcon kind={company.kind} />
        {ui.legend[company.kind]}
      </p>
      <p className={styles.role}>
        <RichText text={company.role} />
      </p>
      <h3>{ui.seesLabel}</h3>
      <p>
        <RichText text={company.sees} />
      </p>
      <h3>{ui.canDoLabel}</h3>
      <p>
        <RichText text={company.canDo} />
      </p>
      <form method="dialog">
        <button type="submit" className={styles.close}>
          {ui.close}
        </button>
      </form>
    </dialog>
  )
}
