import type { BadgeKey, CompanyKind } from '../../types/scenario.ts'

// Small drawn icons. They sit next to a text label, so they are hidden from
// screen readers (the label carries the meaning).

const common = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
}

export function StatusIcon({ badge }: { badge: BadgeKey }) {
  switch (badge) {
    case 'harmed': // warning triangle
      return (
        <svg {...common}>
          <path d="M12 3 L22 20 H2 Z" />
          <path d="M12 10 V14" />
          <path d="M12 17.2 V17.3" />
        </svg>
      )
    case 'blocked': // circle with a slash
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M5.6 5.6 L18.4 18.4" />
        </svg>
      )
    case 'stopped': // stop square
      return (
        <svg {...common}>
          <rect x="5" y="5" width="14" height="14" rx="2" />
        </svg>
      )
    case 'flagged': // eye
      return (
        <svg {...common}>
          <path d="M2 12 C5 6.5 19 6.5 22 12 C19 17.5 5 17.5 2 12 Z" />
          <circle cx="12" cy="12" r="2.6" />
        </svg>
      )
    case 'confirmed': // check in a circle
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M7.5 12.5 L10.7 15.6 L16.6 9" />
        </svg>
      )
    case 'disrupted': // pause bars
      return (
        <svg {...common}>
          <path d="M9 5 V19" />
          <path d="M15 5 V19" />
        </svg>
      )
    case 'deciding': // magnifying glass
      return (
        <svg {...common}>
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="M15.5 15.5 L21 21" />
        </svg>
      )
    case 'queued': // envelope
      return (
        <svg {...common}>
          <rect x="3" y="5.5" width="18" height="13" rx="2" />
          <path d="M3.5 7 L12 13 L20.5 7" />
        </svg>
      )
  }
}

export function KindIcon({ kind }: { kind: CompanyKind }) {
  switch (kind) {
    case 'intervene': // shield
      return (
        <svg {...common}>
          <path d="M12 3 L20 6 V12 C20 16.5 16.5 19.5 12 21 C7.5 19.5 4 16.5 4 12 V6 Z" />
        </svg>
      )
    case 'affected': // target rings
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      )
    case 'agent': // robot head
      return (
        <svg {...common}>
          <rect x="4" y="8" width="16" height="11" rx="2.5" />
          <path d="M12 8 V4" />
          <path d="M9 13 V13.1" />
          <path d="M15 13 V13.1" />
        </svg>
      )
  }
}
