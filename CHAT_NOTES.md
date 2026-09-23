# Chat notes: Follow the Incident demo

Saved copy of my main replies from the build chat, so you can read them later.

---

## 1. What I can do

This project was a blank slate at the time: just `CLAUDE.md` and `SPEC.md`.

**Scaffold and build the demo**
- Set up the Vite + React + TypeScript project, static-site config for GitHub Pages
- Build `src/data/scenario.json` from the spec's cast/timeline/content rules
- Build the components (incident map, Run 1 "Today" vs Run 2 "With a shutdown process", timeline playback, tooltips/glossary, the real/fictional name-mode banner)
- Wire in the yellow/blue/grey/red colour and icon coding, and keyboard-accessible Back/Next/Play controls
- Run `npm run build` and fix errors before each stage, then commit to git once you approve a stage (per your CLAUDE.md)

**Iterate stage by stage**
I work in small stages and stop after each one so you can check it in the browser.

**Other things I can do generally:** read/search/edit code, run shell commands, fetch web pages, spin up sub-agents for larger parallel tasks, publish HTML artifacts/mockups for design review, and manage git.

---

## 2. Build plan for v1

I read `SPEC.md` and `CLAUDE.md` in full. No code was written for this plan.

### Approach
- **The scenario file drives everything.** `scenario.json` holds the steps for both runs and the effects each step has on the map. The screen is worked out from the current step, so **Back** works automatically.
- **Company names and glossary terms are placeholders in the text.** For example `"{co:github} spots odd key use"` and `"a hidden {gl:prompt-injection}"`. A small text function swaps in the real or fictional name from `nameMode` and turns glossary terms into tooltips.
- **One shared screen layout for both runs.** Run 2 adds the stage bar, evidence checklist and log panel.

### Folder structure
```
Shutdown_demo/
  CLAUDE.md  SPEC.md
  SUGGESTIONS.md            <- ideas that are not in v1
  index.html  package.json  tsconfig.json
  vite.config.ts            <- base "./" so it works on GitHub Pages
  src/
    main.tsx  App.tsx
    data/scenario.json      <- ALL story content
    types/scenario.ts       <- TypeScript shape of that file
    lib/
      text.tsx              <- swaps {co:..} names and {gl:..} tooltips into text
      mapState.ts           <- works out the map from steps 0..n
      useRunPlayer.ts       <- current step, play/pause timer, back/next
    screens/                <- Intro, Run, Transition, Choice, Comparison, Closing
    components/
      shell/    Banner, Controls, Term, RichText
      map/      IncidentMap, CompanyNode, CompanyCard, Link, Envelope, StatusBadge, Legend, MobileList
      run/      Clock, Timeline, NoteCard, HarmCounter, StageBar, EvidenceChecklist, LogPanel, AssumptionLabel
      choice/   OptionCard, EscalationLadder, OptionResult
    styles/     tokens.css (colours, sizes) + one CSS module per component
```

### React components
| Group | Components | Job |
|---|---|---|
| Shell | `App`, `Banner`, `Controls`, `Term`, `RichText` | Screen order, the always-on banner, Back/Next/Play/Restart, tooltips |
| Map | `IncidentMap`, `CompanyNode`, `Link`, `Envelope`, `StatusBadge`, `Legend`, `CompanyCard`, `MobileList` | Three columns, status shown with colour and an icon and label, click a company for its card |
| Run | `Clock`, `Timeline`, `NoteCard`, `HarmCounter`, `StageBar`, `EvidenceChecklist`, `LogPanel`, `AssumptionLabel` | The T+ clock, step notes, services-harmed counter, and the Run 2 extras |
| Choice | `OptionCard`, `EscalationLadder`, `OptionResult` | Options A-D, the narrow-to-broad ladder, the trade-off text, "try another" |
| Screens | `Intro`, `RunScreen`, `Transition`, `ChoiceScreen`, `Comparison`, `Closing` | The seven screens from SPEC section 11 |

### Format of `scenario.json` (sketch)
```jsonc
{
  "meta":      { "nameMode": "real", "title": "...", "paperUrl": "TODO" },
  "banners":   { "real": "Hypothetical scenario. ...", "fictional": "All companies are fictional." },
  "companies": [ { "id": "github", "names": {"real":"GitHub","fictional":"CodeHarbor"},
                   "role": "Code hosting platform", "column": "affected",
                   "kind": "affected", "sees": "...", "canDo": "..." } ],
  "glossary":  { "prompt-injection": { "term": "Prompt injection", "definition": "..." } },
  "ui":        { "next": "Next", "back": "Back", "play": "Play" },
  "intro":     { "title": "...", "body": ["..."], "footnote": "...", "start": "Start" },
  "runs": {
    "run1": { "steps": [ { "id": "r1-t2-block", "time": "T+2h",
                           "event": "{co:github} spots odd key use and blocks {co:atlas}",
                           "note": "...",
                           "effects": [ { "type": "status", "target": "github", "status": "blocked" } ] } ],
              "totals": { "time": "6 days", "harmed": 5, "who": "..." } },
    "run2": { "stages": [...], "assumption": {...}, "evidence": [...], "steps": [...] }
  },
  "choice":    { "options": [ { "id": "A", "label": "...", "actor": "okta", "ladderLevel": 1,
                                "result": { "text": "...", "lesson": "...", "effects": [...] } } ] },
  "comparison":{ "rows": [...], "closingLine": "..." },
  "closing":   { "hypotheses": [...], "teaser": "...", "linkLabel": "..." },
  "transition":{ "text": "..." }
}
```
Effect types: `status`, `path`, `envelope`, `evidence`, `log` (and later `link`, `highlight`). The services-harmed counter is worked out from the map, so it can't drift from it.

### Build stages
After each stage I stop and you check it in the browser (`npm run dev`, then http://localhost:5173). I run `npm run build` first. After you approve, I commit.

| # | Stage | What you'll see |
|---|---|---|
| 0 | Project setup: git, Vite + React + TS, GitHub Pages config | A blank page that builds cleanly |
| 1 | Data layer: full `scenario.json`, types, text function, banner, name-mode switch | The intro text with the banner; flip `nameMode` and names change |
| 2 | Screen flow and controls: all 7 screens as placeholders, Back/Next/Restart, keyboard access | Click through the whole demo order |
| 3 | The static map: three columns, colour-plus-icon statuses, legend, company cards, mobile list | A clickable map with no animation |
| 4 | Run 1: clock, timeline, notes, harm counter, Play/pause, map effects | The full "Today" run |
| 5 | Transition and Run 2 up to Evaluate: stage bar, report path, evidence checklist, log, assumption label | Run 2 through T+3h |
| 6 | The choice: options A-D, results, ladder, "try another", then Verify & record | The key interaction, end to end |
| 7 | Comparison and Closing | The last two screens |
| 8 | Polish: phone layout, tooltip coverage, hard-coded text audit, accessibility, final static build | A version ready to host |

### Decisions I asked about
1. Git: OK to `git init`? (Answered: yes, local only, no pushing.)
2. The choice screen: keep the map visible and treat it as the T+3.5h step of Run 2.
3. After choosing an option: keep the harmed counter at 2 for every option and put the differences in the result text.
4. Continue after the choice: enable Next once at least one result has been seen; the viewer can try any other option at any time.
5. Paper link: `TODO` placeholder until you have the real URL.
6. Ideas outside v1: none of SPEC section 15 will be built. New ideas go into `SUGGESTIONS.md`.

---

## 3. Stage 0 report: project setup

Stage 0 was done and `npm run build` passed.

**Git**
- I ran `git init` on branch `main`. There is no remote, so nothing can be pushed. Everything stays on your machine.

**The venv**
- I created `.venv` (Python 3.14.3) in the project folder and added it to `.gitignore`.
- This project is Vite/React, which runs on Node, so nothing in it uses Python. Its packages install into the project's own `node_modules` folder, which keeps them isolated in the same way. If you wanted the venv for something specific, tell me and I'll set that up.
- To activate it in PowerShell: `.venv\Scripts\Activate.ps1`.

**What was in the project**
- Config files: Vite + React + TypeScript (`package.json`, `tsconfig*.json`, `vite.config.ts`), with `base: './'` for GitHub Pages.
- A placeholder page in `src/App.tsx`.
- Empty folders: `src/data`, `src/types`, `src/lib`, `src/screens`, `src/components`, `src/styles`.
- Vite's demo content (logo, sample styles) was removed.

**To see it:** run `npm run dev` and open http://localhost:5173. You should see "Follow the Incident" and a line saying setup is complete.

Stage 0 was committed locally after you said "next stage".

---

## 4. Stage 1 report: data layer

Stage 1 is built, and `npm run build` and `npm run lint` both pass. I have not looked at it in a browser, so please check it there. Stage 1 is uncommitted until you approve it.

**To see it**
1. Run `npm run dev` and open http://localhost:5173.
2. You should see the banner pinned at the top, then the intro text, then a dashed grey "Stage 1 preview (temporary)" box listing the cast and the Run 1 script.
3. Hover over or Tab to a dotted-underline word such as "AI agent" or "hidden instruction" to see its tooltip.
4. In `src/data/scenario.json`, change `"nameMode": "real"` to `"fictional"` and save. The names, the banner and the intro footnote all switch. Change it back afterwards.

**What I built**
- `src/data/scenario.json`: all the story content from the spec (cast, glossary, intro, both runs, options A-D, comparison, closing, every button label), using `{co:...}` and `{gl:...}` placeholders.
- `src/types/scenario.ts`: the shape of that file.
- `src/lib/validate.ts`: a checker that runs when the page loads. Mistyped company ids, glossary terms or statuses show a plain-language problem list instead of a broken screen. It also checks that the "services harmed" totals match the steps. I tested it on the real file and on deliberately broken copies.
- Components: `Banner`, `Term` (the tooltip), `RichText` (fills in names and tooltips), the `Intro` screen, and a colour-token stylesheet.
- `SUGGESTIONS.md`: one idea for an on-screen name switch.

**Things for you to check**
1. The spec gave what each company can *do* but not what it can *see*. I drafted the "sees" lines shown on the company cards. Please review them, because they name real companies.
2. The map needs two statuses the spec's four colours don't cover: **disrupted** (Brightwave under options C and D) and **confirmed** (the green ticks at T+4h). Atlas also has no colour in the spec. I'll propose colours and icons in Stage 3.
3. The spec's intro footnote says "real companies appear in their real roles". I added a fictional-mode wording so it doesn't say that when names are fictional.
4. `paperUrl` is still a `TODO` placeholder.
5. The record lines that appear at T+4h in Run 2 are my wording. The spec only says every party logs what it saw and did.
6. The shell choked on the large JSON file, so I wrote it with the file-writing tool instead.

**Next:** say "approved" and I'll commit Stage 1. Stage 2 builds the screen flow: the Start button, Back/Next/Restart, and placeholders for all seven screens. It also removes the temporary preview box.

---

## 5. Stage 2 report: screen flow and controls

Stage 2 is built, and `npm run build`, `npm run lint` and the `scenario.json` check all pass. I have not looked at it in a browser, so please check it there.

You told me there is no need to commit after each stage, so nothing from Stage 1 or Stage 2 is committed (only Stage 0 is). Those changes are just saved in the folder.

**To see it:** run `npm run dev` and open http://localhost:5173.
1. The intro now has a **Start** button. Click it, or Tab to it and press Enter.
2. After that, every screen has **Back**, **Restart** and **Next** buttons at the bottom, with Next on the right. Back is greyed out on the first screen after the intro, and Next is greyed out on the last.
3. Click through all seven screens in order: Intro, Run 1, Transition, Run 2, Choice, Comparison, Closing.
4. Try it with the keyboard only: Tab to a button and press Enter or Space.
5. The banner stays pinned at the top on every screen.

**What changed**
- The temporary Stage 1 preview box is gone.
- Screens 1 (Intro) and 3 (Transition) are real. Screens 2, 4, 5, 6 and 7 show their titles from `scenario.json` with a dashed "Placeholder screen, built in Stage N" note.
- When you move to a new screen, keyboard focus jumps to its heading, so keyboard and screen-reader users start at the top of the new page.
- I added one new label, `controlsLabel` ("Demo controls"), to `scenario.json`. Screen readers use it to name the Back/Next bar.

**Left for later stages:** Play/Pause is not here yet because there are no run steps to play. It arrives in Stage 4 with Run 1.

**Next:** Stage 3, the static map: three columns, colour-plus-icon statuses, legend, company cards and the phone list. I will propose colours for "disrupted", "confirmed" and Atlas there.

---

## 6. Stage 3 report: the static map

Stage 3 is built. `npm run build` and `npm run lint` pass. I also opened the page in a real headless Chrome window and looked at screenshots of it (real-names mode, laptop and phone widths).

**What you get**
- **A three-column map:** Control (Amazon Bedrock AgentCore, Brightwave, Atlas), Intermediaries (Cloudflare, Okta, Kong) and Affected services (npm, GitHub, Stripe, Shopify, SendGrid, Salesforce). The affected column is drawn as two sub-columns of three so the whole map fits on a laptop screen.
- **Colour plus icon plus text, never colour alone:**
  - Yellow with a shield icon = can intervene. Blue with a target icon = affected service. Dark slate with a robot icon = the AI agent (Atlas).
  - Status labels are small pills with an icon and words: Harmed (red, warning triangle), Blocked the agent (dark, circle-slash), Stopped (grey, square), Spotted a pattern (yellow, eye), Confirmed (green, tick), Disrupted (orange, pause bars), Waiting in a support queue (blue, envelope).
- **A key** under the map explains every colour and label.
- **Company cards:** click a company and a pop-up shows who they are, what they can see and what they can do. Esc, the Close button or a click outside closes it.
- **Phone layout:** below about 960 px wide the map becomes a vertical list with the same colours, icons and labels.

**Choices I made that you may want to review**
1. Colours for the statuses the spec did not cover: Disrupted is orange, Confirmed is green, and Atlas is dark slate.
2. The middle column order is now Cloudflare, Okta, Kong (it was Okta, Kong, Cloudflare in the spec table). This lets the lines between companies run through clear gaps and never behind a box. The order in `scenario.json` sets the order on screen.
3. New label texts were added to `scenario.json` (column titles, "Key", "Close", "What they can see", and so on) so nothing is typed into the components.

---

## 7. Stage 4 report: Run 1 ("Today")

Stage 4 is built. `npm run build` and `npm run lint` pass. I clicked through the whole run in headless Chrome and checked screenshots of steps 1, 4 and 10, the company card, and the phone layout. I could not check the animations (the lines drawing in, the pulses), because screenshots are still images.

**To see it:** run `npm run dev`, open http://localhost:5173, click Start.

**What you get on the Run 1 screen**
- **The clock** ("Time since the first service knew", for example T+2h) and a red **Services harmed (illustrative)** counter, top right. The counter is counted from what the map shows, so it cannot disagree with it.
- **The current event** in a box above the map: the time, what happened, and the plain-language note. Screen readers read each new step out.
- **The map**, which changes step by step:
  - T+0h: a red line from npm to Atlas.
  - T+1h: GitHub turns red and shows "Harmed".
  - T+2h: GitHub also shows "Blocked the agent".
  - T+2h (second step): a dashed line and an envelope go from GitHub to AgentCore, and AgentCore shows "Waiting in a support queue".
  - T+5h to T+3d: Stripe, Shopify, SendGrid and Salesforce turn red; Cloudflare shows "Spotted a pattern" at T+1d.
  - T+6d: Atlas turns grey and shows "Stopped".
  - Lines from earlier steps stay on screen but fainter. The companies a step just changed give a short pulse (switched off if the person's device asks for reduced motion).
- **A timeline** of all the step times, showing which are done, which is current, and which are still to come.
- **"How this run ended (illustrative)"** on the last step: 6 days, 5 services harmed, AgentCore alone acted days later.
- **Controls:** Back, Play/Pause, Restart, Next.
  - Play moves to the next step every 4 seconds (you can change `playIntervalMs` in `scenario.json`) and stops on the last step. Pressing Play on the last step starts the run again.
  - Next, Back, Restart or opening a company card all pause Play.
  - Back from the Transition screen lands on the last step of Run 1, not the first.
  - The controls stay at the bottom of the window while you scroll, so they are always in reach.
- On a 1280 x 800 laptop window, the event text, the map and the controls all fit on screen at once.

**Things for you to check**
1. Does the 4-second Play speed feel right? Can you read each note in that time?
2. The lines are drawn as right-angle routes so they never cross a company box. Is the picture clear enough, or would you prefer something simpler (for example, only highlighting the companies)?
3. The "How this run ended" box sits below the map, so on a small window you scroll to see it. I did this so the map does not jump around on the last step.
4. Everything I checked was in real-names mode. Switching `nameMode` to `fictional` uses the same code, but I did not look at it.

**Next:** Stage 5, the Transition and Run 2 up to the Evaluate step: the four-stage progress bar, the reports travelling to AgentCore and Brightwave, the evidence checklist, the record panel and the assumption label.

---

## 8. Stage 5 report: Run 2 up to "Evaluate"

Stage 5 is built. `npm run build` and `npm run lint` pass, and I checked screenshots of the steps in a real headless Chrome window (real-names mode; laptop, 1024 px and phone widths). I could not check the animations.

**A change to the plan:** as I proposed in the build plan, the choice is now a step inside Run 2 (at T+3.5h) rather than its own screen, so the map stays visible. The demo now has six screens: Intro, Run 1, Transition, Run 2, Comparison, Closing.

**To see it:** run `npm run dev`, click Start, then Next through Run 1 and the Transition screen. Or press Play on Run 1.

**What Run 2 shows (steps T+0h to T+3h)**
- **A four-stage progress bar** under the title: Detect & attribute, Evaluate, Act, Verify & record. Finished stages get a tick, the current one is filled in, and later ones are dashed.
- **T+0h and T+1h** are the same as Run 1: the poisoned package, then the key theft at GitHub.
- **T+2h:** GitHub blocks Atlas and sends a shutdown report. Blue lines carry the report to both AgentCore and Brightwave. The **assumption label** (a dashed yellow note about agent IDs) appears under the event.
- **T+2.5h:** Cloudflare adds its evidence, drawn as dashed gold lines to the same two companies.
- **T+3h:** Atlas uses the stolen keys at Stripe, so the counter goes to 2 and the note says "Fast is not the same as instant."
- **T+3h, Evaluate:** AgentCore and Brightwave get a dark-blue ring and a "Deciding" label. The **evidence checklist** appears beside the event text and its five ticks pop in one after another.
- The key under the map has a new entry for "Deciding".

---

## 9. Stage 6 report: the choice and "Verify & record"

Stage 6 is built. `npm run build` and `npm run lint` pass. I tried all four options in headless Chrome and checked the T+4h screen after each.

**The choice step (T+3.5h, "Act")**
- Four options are laid out as an **escalation ladder**: a vertical arrow labelled Broadest at the top and Narrowest at the bottom.
  - D (suspend Brightwave's whole account) is on the top rung and C (kill the process) is in the middle.
  - A (revoke Atlas's login) and B (block outgoing tool calls) share the bottom rung.
  - Each option says who would do it (for example "Done by Kong").
- Click an option and a panel beside the ladder shows a headline, what happens, and the lesson. Every option looks the same when picked, and none is marked correct.
- You can click the other options at any time to compare them. **Next stays greyed out until you have picked one**, and Play stops at this step until you do.
- The page scrolls so the whole map is in view after a pick, so you can see the effect. It does not scroll if the person's device asks for reduced motion.

**What each option does to the map**
- **A, revoke login (Okta):** a grey dashed line with a bar end runs from Okta to Atlas. Atlas is not stopped, and the result text says the Stripe refunds continue until the keys are rotated.
- **B, block calls (Kong):** a dark line with a bar end runs from Kong to Atlas, Atlas turns grey and shows "Stopped", and the record gets a line.
- **C, kill the process (AgentCore):** Atlas is "Stopped" and Brightwave shows "Disrupted".
- **D, suspend the account (AgentCore):** the same picture as C, with a different explanation.
- The services-harmed counter stays at 2 for every option, as agreed in the plan.

**T+4h, "Verify & record"**
- Cloudflare, GitHub and Stripe get a green "Confirmed" label. The "Deciding" rings come off AgentCore and Brightwave.
- The **record panel** fills in line by line: the line from the option you picked, then Cloudflare, Stripe, GitHub, AgentCore and Brightwave.
- A "How this run ended" box shows about 4 hours, 2 services harmed, and who acted.

**Other changes**
- On screens narrower than 1024 px (it was 960) the map becomes the vertical list. This gives the company boxes room for up to three labels.
- Phones: the buttons are smaller so Back, Play, Restart and Next fit on one line, and the "Narrowest" label is no longer cut off.

**Things for you to check**
1. **The record panel appears at T+3.5h,** with the chosen option's line, one step before T+4h. I kept it because "every step leaves a record" is one of the demo's key messages. Would you rather it stay empty until T+4h?
2. **Option A and the T+4h text.** The spec's T+4h text says "Cloudflare confirms no new traffic from Atlas". After option A, Atlas has not been stopped, so this reads slightly oddly. I used the spec text as written.
3. The Evaluate and Verify steps are long, so on a laptop-height window you scroll to see everything. The buttons stay pinned to the bottom of the window.
4. I still have not looked at fictional-names mode, and I cannot see the animations in screenshots.

**Next:** Stage 7, the Comparison screen (Run 1 and Run 2 side by side, then "The difference was a trusted route from evidence to action") and the Closing screen (the four working hypotheses, the fake-report teaser and the link to the paper).

---

## 10. Stage 7 report: Comparison and Closing screens

Stage 7 is built. `npm run build`, `npm run lint` and the `scenario.json` check pass. I looked at screenshots of both screens on a laptop and a phone. All seven stages of the plan except the final polish stage are now done.

**To see it:** run `npm run dev`, click through both runs (pick any option at the choice step), and press Next after the T+4h step.

**The Comparison screen ("The same incident, side by side")**
- A table with Run 1: Today on the left and Run 2: With a shutdown process on the right. The rows are Time to shutdown (6 days / about 4 hours), Services harmed (5 / 2) and Who acted.
- Under it: "All numbers are illustrative." and the closing line, "The difference was a trusted route from evidence to action."
- On a phone, each row becomes a small block with the run name in front of each value. Nothing is styled as the "correct" column.

**The Closing screen ("The paper's working hypotheses")**
- The line "These are hypotheses from the paper, not final recommendations."
- The four hypotheses as numbered cards, then the teaser "What if someone sends a fake shutdown report?" in a dashed box.
- The paper: its title and, once a real web address is filled in, a link that opens in a new tab. **The address in `scenario.json` (`paperUrl`) is still a placeholder,** so for now the screen shows the paper's title and "The link to the paper will be added here." Once you replace `paperUrl` with a real `https://...` address, the link appears by itself.
- Next is greyed out here because it is the last screen. Restart takes you back to the intro.

**Other changes**
- The temporary "placeholder" screen is deleted, since nothing uses it any more.
- **I checked fictional-names mode.** I switched `nameMode` to `fictional`, clicked through the intro, both runs and the Comparison screen, and then switched it back to `real`. The banner reads "All companies are fictional.", the intro footnote changes, and no real company names appear anywhere on the Comparison screen. The one fix: "Nimbus Agents's own logs" read badly, so that checklist line now says "Its own logs confirm unusual activity".

**Things for you to check**
1. The paper link (see above): send me the address when you have it, or paste it into `paperUrl` yourself.
2. The Comparison "Who acted" text for Run 2 says "Kong or others (act)" for every viewer, as in the spec, even if the viewer picked a different option.

**Still to do (Stage 8, polish, from the plan):** a phone-layout pass, a check that every technical term has a tooltip, an audit for any text hard-coded in components, an accessibility pass, and the final static build for GitHub Pages.

---

## 11. Stage 8 report: polish and the final build

Stage 8 is done, which finishes the v1 plan. `npm run build`, `npm run lint` and the `scenario.json` check all pass.

**What I checked, and what I changed**
- **Hard-coded text.** I searched every component for words typed directly into the code. The only one is the developer message that appears when `scenario.json` is broken; it has to live in the code, because it shows when the file cannot be read. I removed two unused labels from `scenario.json` ("continue" and "try another option").
- **Tooltips.** I checked every glossary term against every text in the demo. Terms that appeared without a tooltip now have one: "shutdown" (Transition screen, the T+2h report, the closing teaser), "provider" and "deployer" (T+2h and the closing hypotheses).
- **Tooltip behaviour.** The tooltip now stays fully on screen, including on a phone, next to the edge of the window and inside the company pop-up. Escape closes it. It opens on hover, on tap, and when you Tab to the word.
- **Colour contrast.** I measured 23 colour pairs against the 4.5:1 target. Two fell short: the blue "Waiting in a support queue" label (4.06) and the red counter number (4.23). Both are darkened, and every pair now passes.
- **Layout sweep.** A script walked the whole demo at six window widths (320, 390, 768, 1025, 1100 and 1280 px) with each of the four options: 600 screen states. It looks for sideways scrolling, clipped text and anything past the right edge. It found one problem: at about 1025 px wide, text in some company boxes (for example GitHub with three labels at T+4h) did not fit. The text inside the boxes now scales with the map, so the map looks the same at every width. A second run found 0 problems.
- **Finished-site test.** I copied the built site into a sub-folder and served it the way GitHub Pages does. The demo, its assets, its title and its icon all loaded and worked.
- **Small extras.** The browser tab title now comes from `scenario.json`. The tab icon is now a yellow shield on a dark square instead of Vite's default. I added two ideas to `SUGGESTIONS.md` (arrow-key shortcuts and a publishing workflow).

**Not checked:** the animations (screenshots are still images), and how a real screen reader speaks the demo. I did check that the pieces a screen reader needs are in place (headings, labels, live announcements of each step and each pick, and keyboard access to everything).

**How to do common things**
- **Run it while editing:** `npm run dev`, then open http://localhost:5173. Saved changes appear straight away.
- **Change any wording, timing or company name:** edit `src/data/scenario.json`. If a mistyped company name or term breaks something, the page lists the problem in plain language.
- **Switch between real and fictional names:** change `"nameMode"` at the top of `scenario.json` to `"real"` or `"fictional"`.
- **Change how fast Play goes:** change `"playIntervalMs"` (in thousandths of a second; 4000 is 4 seconds).
- **Add the paper link:** replace the `"paperUrl"` value with the full web address (starting `https://`).
- **Build the finished site:** `npm run build`. The files appear in the `dist` folder (about 0.3 MB). Put the contents of `dist` on any web host, including GitHub Pages. Do not just double-click `dist/index.html`, because browsers block that. To try the built version locally, run `npm run preview`.

**Nothing is committed to git,** as you asked. Only the Stage 0 commit exists, so all of the work since is unsaved in git's terms. Say the word if you want one commit for the whole project.

---

## 12. Navigation redesign: tabs on top, steps on the left

You asked for a different shape: a button on top to switch between Run 1 and Run 2, and buttons on the left to jump to any step 1 to n inside the run currently open, with switching runs always starting over from step 1. `npm run build`, `npm run lint` and the `scenario.json` check all pass. I ran an automated check that visits every step of both runs, with all four choices, at 8 window widths (320 to 1440 px) — 328 screen states, 0 problems.

**What the page looks like now**
- **A row of five tabs at the top, under the banner: Intro, Run 1, Run 2, Compare, Hypotheses.** Clicking Run 1 or Run 2 always starts that run over from step 1, even if you were already on it. The banner and the tabs stay on screen while you scroll.
- **Inside Run 1 or Run 2, a numbered list of every step sits on the left.** Click any step, in any order, to jump straight to it — nothing is gated any more. The step you're on is highlighted.
- **Play** now advances from wherever you currently are, not just from the start, and still pauses itself at the last step and at the choice step until you pick an option.
- The old Back/Next/Restart buttons and the guided step-by-step order are gone, since the tabs and the step list replace them. The Transition screen ("Now replay the same incident...") is gone too, since Run 2 is just a tab click away; I removed its text from `scenario.json` rather than leave it unused.
- On a phone or a narrow window, the step list becomes a horizontal scrolling row above the content instead of a left-hand column.

**Two layout bugs I found and fixed while building this**
1. The step list, when it became a horizontal scrolling row on narrow screens, was widening the whole page instead of scrolling inside itself. Fixed with one CSS rule.
2. The step sidebar takes up room that used to belong to the map, so the map's boxes were clipping company names on some window widths (1100 to 1440 px) that were fine before. I widened the run screens' maximum width and adjusted where the map switches to its narrow vertical-list layout, to give it enough room again.

**Not changed:** `SPEC.md` still describes the old screen-by-screen order, at your request. The map, company cards, tooltips, colours, the choice ladder, the evidence checklist, the record panel and the real/fictional switch all work exactly as before, just inside the new layout.

---

## 13. Removed: Compare tab, Hypotheses tab, paper mentions, and the banner

You asked to remove the Compare and Hypotheses tabs, remove any mention of the paper from the site, and remove the "Hypothetical scenario" banner, since you'll give that context yourself when you share the link. `npm run build`, `npm run lint` and the `scenario.json` check all pass.

**What changed**
- **Only three tabs left: Intro, Run 1, Run 2.** The Compare screen (the side-by-side numbers table) and the Hypotheses screen (the four working hypotheses, the fake-report teaser, and the link to the paper) are both gone.
- **No mention of the paper anywhere.** The paper's title, its link, and the one line in Run 2 that said "The paper also discusses..." are all removed or reworded.
- **The top banner is gone.** I also removed the same disclaimer sentence from the intro screen, since you confirmed you'd rather have no on-page disclaimer at all, only the timing note ("About 5 minutes. All numbers are illustrative.").
- The end-of-run summary box ("How this run ended") still works — it used to share its row labels with the Compare screen, so I moved those into the run screen's own settings rather than deleting them.
- Deleted the now-unused files: `Comparison.tsx`, `Closing.tsx`, `Banner.tsx`, and their stylesheets.

**One thing worth flagging:** `CLAUDE.md` (this project's own instructions) says the hypothetical-scenario banner should appear on every screen, specifically because real company names are used in a fabricated harmful scenario, and asks me to ask before doing something that conflicts with it. I did ask, and you were clear that you'll add that context yourself whenever you share the link — that's a reasonable call as the person publishing it, I just want it on record that removing the banner is a deliberate change from what `CLAUDE.md` currently says. Worth remembering to add that context every time you share the link, since a link can end up forwarded on without it.

---

## Working preferences you have given me
- Git stays local only: never push, and no commit after each stage (Stage 0 is the only commit so far). Commit only if you ask.
- Update this file after each stage.
