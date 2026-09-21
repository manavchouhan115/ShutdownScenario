import { useEffect, useRef, useState } from 'react'
import Banner from './components/shell/Banner.tsx'
import Controls from './components/shell/Controls.tsx'
import { SCREENS, type ScreenId } from './lib/flow.ts'
import { scenario } from './lib/useScenario.ts'
import { validateScenario } from './lib/validate.ts'
import Closing from './screens/Closing.tsx'
import Comparison from './screens/Comparison.tsx'
import Intro from './screens/Intro.tsx'
import RunScreen from './screens/RunScreen.tsx'
import Transition from './screens/Transition.tsx'

// Checked once when the page loads. Mistakes in scenario.json show up here in
// plain language instead of as a broken screen.
const problems = validateScenario(scenario)

// Screens that step through events, and how many steps each has.
const STEP_COUNTS: Partial<Record<ScreenId, number>> = {
  run1: scenario.runs.run1.steps.length,
  run2: scenario.runs.run2.steps.length,
}

export default function App() {
  const [index, setIndex] = useState(0)
  // Which step each stepped screen is on.
  const [steps, setSteps] = useState<Partial<Record<ScreenId, number>>>({})
  const [playing, setPlaying] = useState(false)
  // Run 2: which way of stopping the agent the viewer has picked (A-D), if any.
  const [choiceId, setChoiceId] = useState<string | null>(null)
  const mainRef = useRef<HTMLElement>(null)
  const firstRender = useRef(true)

  const screen: ScreenId = SCREENS[index]
  const stepCount = STEP_COUNTS[screen]
  const stepIndex = steps[screen] ?? 0
  // The "Act" step waits for the viewer to pick an option before Next or Play can go on.
  const waitingForChoice =
    screen === 'run2' && scenario.runs.run2.steps[stepIndex].kind === 'choice' && choiceId === null
  // Playing stops by itself on the last step, and at a choice nobody has made yet.
  const running = playing && stepCount !== undefined && stepIndex < stepCount - 1 && !waitingForChoice

  const setStep = (id: ScreenId, value: number) => setSteps((s) => ({ ...s, [id]: value }))

  // When the screen changes, move keyboard focus to its heading so keyboard
  // and screen-reader users start reading at the top of the new screen.
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
  }, [screen])

  // Play: move to the next step every few seconds, and stop on the last one.
  useEffect(() => {
    if (!running) return
    const timer = setTimeout(
      () => setSteps((s) => ({ ...s, [screen]: stepIndex + 1 })),
      scenario.meta.playIntervalMs,
    )
    return () => clearTimeout(timer)
  }, [running, screen, stepIndex])

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

  // Next / Back: step within a run first, then move between screens.
  const move = (delta: 1 | -1) => {
    setPlaying(false)
    if (stepCount !== undefined) {
      const next = stepIndex + delta
      if (next >= 0 && next < stepCount) {
        setStep(screen, next)
        return
      }
    }
    const target = index + delta
    if (target < 0 || target >= SCREENS.length) return
    const targetId = SCREENS[target]
    const targetCount = STEP_COUNTS[targetId]
    // Arriving from the front starts a run at its first step; from behind, at its last.
    if (targetCount !== undefined) setStep(targetId, delta === 1 ? 0 : targetCount - 1)
    setIndex(target)
  }

  const restart = () => {
    setPlaying(false)
    setSteps({})
    setChoiceId(null)
    setIndex(0)
  }

  const togglePlay = () => {
    if (running) {
      setPlaying(false)
      return
    }
    // Pressing Play on the last step starts the run again.
    if (stepCount !== undefined && stepIndex >= stepCount - 1) setStep(screen, 0)
    setPlaying(true)
  }

  const pick = (id: string) => {
    setPlaying(false)
    setChoiceId(id)
  }

  const renderScreen = () => {
    switch (screen) {
      case 'intro':
        return <Intro onStart={() => move(1)} />
      case 'run1':
        return (
          <RunScreen
            runKey="run1"
            stepIndex={stepIndex}
            choiceId={null}
            onChoose={pick}
            onCardOpen={() => setPlaying(false)}
          />
        )
      case 'transition':
        return <Transition />
      case 'run2':
        return (
          <RunScreen
            runKey="run2"
            stepIndex={stepIndex}
            choiceId={choiceId}
            onChoose={pick}
            onCardOpen={() => setPlaying(false)}
          />
        )
      case 'comparison':
        return <Comparison />
      case 'closing':
        return <Closing />
    }
  }

  return (
    <>
      <Banner />
      <main ref={mainRef} data-wide={screen === 'run1' || screen === 'run2' || undefined}>
        {renderScreen()}
        {screen !== 'intro' && (
          <Controls
            canBack={index > 0}
            canNext={index < SCREENS.length - 1 && !waitingForChoice}
            onBack={() => move(-1)}
            onNext={() => move(1)}
            onRestart={restart}
            playable={stepCount !== undefined}
            playing={running}
            onTogglePlay={togglePlay}
          />
        )}
      </main>
    </>
  )
}
