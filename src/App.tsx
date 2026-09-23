import { useEffect, useRef, useState } from 'react'
import TabBar from './components/shell/TabBar.tsx'
import type { TabId } from './lib/flow.ts'
import { scenario } from './lib/useScenario.ts'
import { validateScenario } from './lib/validate.ts'
import Intro from './screens/Intro.tsx'
import RunScreen from './screens/RunScreen.tsx'

// Checked once when the page loads. Mistakes in scenario.json show up here in
// plain language instead of as a broken screen.
const problems = validateScenario(scenario)

export default function App() {
  const [tab, setTab] = useState<TabId>('intro')
  // Each run keeps its own place, independent of the other.
  const [run1Step, setRun1Step] = useState(0)
  const [run2Step, setRun2Step] = useState(0)
  const [playing, setPlaying] = useState(false)
  // Which way of stopping the agent the viewer has picked at Run 2's "Act" step, if any.
  const [choiceId, setChoiceId] = useState<string | null>(null)
  const mainRef = useRef<HTMLElement>(null)
  const firstRender = useRef(true)

  const isRun = tab === 'run1' || tab === 'run2'
  const stepIndex = tab === 'run1' ? run1Step : tab === 'run2' ? run2Step : 0
  const setStep = tab === 'run1' ? setRun1Step : setRun2Step
  const stepCount = tab === 'run1' ? scenario.runs.run1.steps.length : tab === 'run2' ? scenario.runs.run2.steps.length : undefined

  // Play pauses itself at the last step, and at an unanswered choice step.
  const waitingForChoice = tab === 'run2' && scenario.runs.run2.steps[run2Step]?.kind === 'choice' && choiceId === null
  const running = isRun && playing && stepCount !== undefined && stepIndex < stepCount - 1 && !waitingForChoice

  // When the section changes, move keyboard focus to its heading so keyboard
  // and screen-reader users start reading at the top of it.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    const heading = mainRef.current?.querySelector('h1')
    if (heading) {
      heading.tabIndex = -1
      heading.focus()
    }
  }, [tab])

  // Play: move to the next step every few seconds.
  useEffect(() => {
    if (!running) return
    const timer = setTimeout(() => setStep((s) => s + 1), scenario.meta.playIntervalMs)
    return () => clearTimeout(timer)
  }, [running, tab, stepIndex, setStep])

  if (problems.length > 0) {
    return (
      <main>
        <h1>scenario.json needs fixing</h1>
        <p>These problems were found in <code>src/data/scenario.json</code>:</p>
        <ul>
          {problems.map((problem) => (
            <li key={problem}>{problem}</li>
          ))}
        </ul>
      </main>
    )
  }

  // Switching to Run 1 or Run 2 always starts that run over from its first step.
  const selectTab = (next: TabId) => {
    setPlaying(false)
    if (next === 'run1') setRun1Step(0)
    if (next === 'run2') setRun2Step(0)
    setTab(next)
  }

  const selectStep = (index: number) => {
    setPlaying(false)
    setStep(index)
  }

  const togglePlay = () => {
    if (running) {
      setPlaying(false)
      return
    }
    // Pressing Play on the last step starts the run again.
    if (stepCount !== undefined && stepIndex >= stepCount - 1) setStep(0)
    setPlaying(true)
  }

  const pick = (id: string) => {
    setPlaying(false)
    setChoiceId(id)
  }

  const renderContent = () => {
    switch (tab) {
      case 'intro':
        return <Intro onStart={() => selectTab('run1')} />
      case 'run1':
        return (
          <RunScreen
            runKey="run1"
            stepIndex={run1Step}
            onSelectStep={selectStep}
            choiceId={null}
            onChoose={() => {}}
            onCardOpen={() => setPlaying(false)}
            playing={running}
            onTogglePlay={togglePlay}
          />
        )
      case 'run2':
        return (
          <RunScreen
            runKey="run2"
            stepIndex={run2Step}
            onSelectStep={selectStep}
            choiceId={choiceId}
            onChoose={pick}
            onCardOpen={() => setPlaying(false)}
            playing={running}
            onTogglePlay={togglePlay}
          />
        )
    }
  }

  return (
    <>
      <TabBar active={tab} onSelect={selectTab} />
      <main ref={mainRef} data-wide={isRun || undefined}>
        {renderContent()}
      </main>
    </>
  )
}
