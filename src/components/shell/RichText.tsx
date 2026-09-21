import { Fragment } from 'react'
import { parseText } from '../../lib/text.ts'
import { useScenario } from '../../lib/useScenario.ts'
import Term from './Term.tsx'

interface RichTextProps {
  /** A text from scenario.json, possibly with {co:...} and {gl:...} placeholders. */
  text: string
}

/** Shows a scenario text with company names filled in and glossary tooltips. */
export default function RichText({ text }: RichTextProps) {
  const { scenario, nameOf } = useScenario()

  return (
    <>
      {parseText(text).map((segment, i) => {
        if (segment.kind === 'text') return <Fragment key={i}>{segment.text}</Fragment>
        if (segment.kind === 'company') return <Fragment key={i}>{nameOf(segment.id)}</Fragment>
        const shown = segment.shown ?? scenario.glossary[segment.id]?.term ?? segment.id
        return (
          <Term key={i} id={segment.id}>
            {shown}
          </Term>
        )
      })}
    </>
  )
}
