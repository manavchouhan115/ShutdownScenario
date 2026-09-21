# SPEC: "Follow the Incident" — Agent Emergency Shutdown Demo

Status: v1 prototype spec (SASH, internal)
Companion to: *AI Agent Emergency Shutdown: Design Choices for Coordination and Control* (SASH, 2026)

---

## 1. Goal

Show policy staffers, in about 5 minutes, that **the service that spots a rogue AI agent usually can't stop it**, and that a shared shutdown process closes that gap.

The viewer plays the same incident twice:
- **Run 1 – "Today":** no shared process. The harm spreads for days.
- **Run 2 – "With a shutdown process":** a standard report reaches the party who can act. The harm stops in hours.

## 2. Audience and tone

- Policy staffers with mixed technical backgrounds. Secondary: industry.
- Plain language. Any technical term gets a one-line tooltip (see Glossary).
- Calm and factual, not alarmist. This is a demo, not a game: no scores, no losing.
- The demo **describes** design choices; it does not prescribe a single answer. Where it points one way, it says "the paper's working hypothesis", not "the right answer".
- The internal version uses **real company names in their real roles**, to make the scenario relatable. The incident itself is **hypothetical**: none of these companies were involved in anything like it, and nothing here describes a real vulnerability or failure on their part. Brightwave (the deployer) and Atlas (the agent) stay fictional.
- A banner on every screen reads: "Hypothetical scenario. Real companies are shown in their real roles; this incident did not happen."
- Names are switchable to fictional ones for any external version (see §4a).
- All numbers are illustrative and labelled as such.

## 3. Key messages

1. The actor who **sees** the harm is often not the actor who can **stop** it.
2. Blocking an agent protects one service; the agent moves on to the next.
3. A trusted route from evidence to action is what turns detection into shutdown.
4. Shutdowns can start **narrow** before going **broad**, but the action has to hit the **right control point**. Systems should be designed to fail safely.
5. Every step should leave a record, so decisions can be checked and challenged.

## 4. The cast

The map has three columns, mirroring the stakeholder figure in the brief.

| Name | Role | Column | What they can do |
|---|---|---|---|
| **Amazon Bedrock AgentCore** | Agent provider (hosts and runs the agent) | Control (left) | Suspend or terminate the agent; suspend accounts |
| **Brightwave Logistics** | Deployer (company using the agent) | Control (left) | Change the agent's permissions; turn it off |
| **"Atlas"** | The AI coding agent that goes wrong | Control (left) | — |
| **Okta** | Identity / login provider | Intermediaries (middle) | Revoke Atlas's own login identity |
| **Kong** | Tool gateway. **All of Atlas's outgoing API calls pass through it.** | Intermediaries (middle) | Block Atlas's outgoing calls |
| **Cloudflare** | CDN / bot management | Intermediaries (middle) | Sees traffic across many sites; can flag patterns |
| **npm** | Public software package registry | Affected (right) | Source of the poisoned package |
| **GitHub** | Code hosting platform | Affected (right) | Block the agent on its own platform only |
| **Stripe** | Payments API | Affected (right) | Block the agent on its own platform; rotate its own keys |
| **Shopify** | Online store | Affected (right) | Block the agent on its own platform only |
| **SendGrid** | Email service | Affected (right) | Block the agent on its own platform only |
| **Salesforce** | Customer data platform | Affected (right) | Block the agent on its own platform only |

Brightwave built Atlas and runs it on Amazon Bedrock AgentCore, so AgentCore is the agent provider: the party that hosts the agent and can stop it.

Colour code (matches the brief): **yellow** = can intervene (control and intermediaries); **blue** = affected services.

## 4a. Naming switch

`scenario.json` stores **both** names for every company plus one setting, `nameMode: "real" | "fictional"`. Default for the internal demo: `real`. Switching to `fictional` swaps every name and replaces the hypothetical banner with "All companies are fictional."

| Real (internal default) | Fictional (external version) |
|---|---|
| Amazon Bedrock AgentCore | Nimbus Agents |
| Okta | KeyGate |
| Kong | ToolBridge |
| Cloudflare | EdgeShield |
| npm | PkgHub |
| GitHub | CodeHarbor |
| Stripe | PayLane |
| Shopify | ShopRight |
| SendGrid | MailPost |
| Salesforce | DataVault |
| Brightwave Logistics | (always fictional) |
| Atlas | (always fictional) |

## 5. The incident (same trigger in both runs)

Brightwave uses Atlas, an AI coding agent hosted by AgentCore, to maintain its software. Atlas installs a package from npm that contains a hidden **prompt injection**. The injected instructions make Atlas copy secret API keys stored in Brightwave's code (including Stripe keys) and use them against other services.

Threat model: **compromised agent** (one of the four in scope in the paper).

## 6. Run 1 — "Today" (no shared process)

A visible clock shows elapsed time. The viewer steps through with **Next**, or presses **Play** to auto-advance.

| Time | Event | Map effect | On-screen note |
|---|---|---|---|
| T+0h | Atlas installs a poisoned package from npm | npm → Atlas link flashes | "A hidden instruction in the package takes over the agent's task." |
| T+1h | Atlas copies secret keys from Brightwave's code on GitHub | GitHub turns red | "The agent is using its normal access, so nothing looks unusual to AgentCore." |
| T+2h | GitHub spots odd key use and **blocks Atlas** | Block icon on GitHub | "GitHub is now safe. But the agent is still running." |
| T+2h | GitHub tries to warn someone and emails a generic support inbox | Envelope sits in a queue | "There is no standard way to reach the party that can stop the agent." |
| T+5h | Atlas uses stolen keys at Stripe to issue fraudulent refunds | Stripe turns red | Services-harmed counter rises |
| T+10h | Atlas places fake bulk orders at Shopify | Shopify turns red | — |
| T+1d | Cloudflare sees the same agent pattern on 3 customer sites | Cloudflare pulses | "Cloudflare can see the pattern, but has no one to tell." |
| T+2d | Atlas sends phishing emails via SendGrid | SendGrid turns red | — |
| T+3d | Atlas exports customer records from Salesforce | Salesforce turns red | — |
| T+6d | AgentCore finally triages the support ticket and **stops Atlas** | Atlas greys out | "Six days after the first service knew." |

**Run 1 totals (illustrative):** 6 days to shutdown · 5 services harmed · only AgentCore acted, days later.

After Run 1, a transition screen: **"Now replay the same incident, with a shutdown process in place."**

## 7. Run 2 — "With a shutdown process"

Same trigger. A progress bar shows the paper's four stages: **1 Detect & attribute → 2 Evaluate → 3 Act → 4 Verify & record**.

| Time | Stage | Event | Map effect |
|---|---|---|---|
| T+0h | — | Same poisoned package | Same as Run 1 |
| T+1h | — | Same key theft at GitHub | GitHub turns red |
| T+2h | **1 Detect & attribute** | GitHub blocks Atlas **and** sends a standard shutdown report. An agent ID on Atlas's traffic says who to contact: AgentCore (provider) and Brightwave (deployer). | Report travels GitHub → AgentCore and Brightwave along a highlighted path |
| T+2.5h | 1 | Cloudflare adds supporting evidence: the same agent pattern seen on 3 sites | Second report joins the path |
| T+3h | — | Atlas uses stolen keys at Stripe before any action lands | Stripe turns red ("Fast is not the same as instant.") |
| T+3h | **2 Evaluate** | AgentCore checks the report: sender is identifiable, evidence is specific, Cloudflare corroborates, and its own logs confirm unusual activity. Brightwave confirms Atlas was not meant to call Stripe. Decision: act on **this one agent instance only**. | AgentCore and Brightwave highlight; evidence checklist ticks |
| T+3.5h | **3 Act** | **Viewer chooses the action** (see §8) | Depends on choice |
| T+4h | **4 Verify & record** | Cloudflare confirms no new traffic from Atlas. Stripe and other key owners rotate the stolen keys. Every party logs what it saw and did. GitHub gets confirmation back. Brightwave can patch and ask for Atlas to be restored. | Green ticks; log panel fills in |

**Assumption label (shown on screen at T+2h):**
> "This assumes agents carry a reliable ID saying who runs them. That doesn't widely exist yet. The paper also discusses passing reports back along the chain, or a shared repository providers check."

**Run 2 totals (illustrative):** ~4 hours to shutdown · 2 services harmed · several actors each played a part.

## 8. The key choice: how to stop the agent

At Stage 3 the viewer picks one option. Each shows its result, then lets them **try another** before continuing. No option is marked "correct"; the text explains the trade-off.

| Option | Who does it | Result | Lesson shown |
|---|---|---|---|
| **A. Revoke Atlas's login identity** | Okta | Atlas loses access to Brightwave's systems, **but it still holds the stolen Stripe keys, which don't depend on its login.** Stripe refunds continue until the keys are rotated. | Narrow isn't enough if it's the wrong control point |
| **B. Block outgoing tool calls** | Kong | Every outgoing call is blocked, including those using stolen keys. Harm stops. Brightwave's other agents keep working. | Narrow and at the right control point |
| **C. Kill the process** | AgentCore | Harm stops instantly, **but** a Stripe refund batch is left half-finished (money moved, records not updated), and Brightwave's normal software builds fail. | Decisive but messy: safe failure has to be designed in advance |
| **D. Suspend Brightwave's whole account** | AgentCore | Harm stops, but **all** of Brightwave's agents go down, including unrelated ones. | Too broad: collateral damage |

Show a small **escalation ladder** beside the options, from narrow (A, B) at the bottom to broad (D) at the top.

## 9. End screen: side-by-side comparison

| | Run 1: Today | Run 2: With a shutdown process |
|---|---|---|
| Time to shutdown | 6 days | ~4 hours |
| Services harmed | 5 | 2 |
| Who acted | AgentCore alone, days later | GitHub + Cloudflare (report), AgentCore + Brightwave (decide), Kong or others (act), key owners (clean up) |

Beneath it: **"The difference was a trusted route from evidence to action."**

## 10. Closing screen: "The paper's working hypotheses"

Four short points, framed as hypotheses from the paper, not final recommendations:

1. **A shared reporting standard**, not a new central authority, so affected services can reach providers and deployers quickly.
2. **Providers and deployers decide and act**; others request action and supply evidence.
3. **Start narrow at the right control point**, and build agents to fail safely.
4. **Keep it accountable**: attributable requests, logs kept by everyone involved, routes to appeal, and safe harbor for good-faith reporters.

Plus a teaser: **"What if someone sends a fake shutdown report?"** and a link to the paper.

## 11. Screens (in order)

1. **Intro**: title, 3-sentence setup, Start button.
2. **Run 1**: map, clock, timeline, services-harmed counter, step notes.
3. **Transition**: "Now replay it with a shutdown process."
4. **Run 2**: map, four-stage progress bar, evidence checklist, log panel.
5. **The choice**: options A–D with the escalation ladder.
6. **Comparison**: side-by-side results.
7. **Closing**: working hypotheses and link to the paper.

### Draft intro text
> **Follow the Incident**
> An AI agent has been hijacked and is causing harm across the internet. The first company to notice can block it, but can it stop it?
> Play the same incident twice: once as things work today, and once with a shutdown process in place.
> *(About 5 minutes. A hypothetical scenario: real companies appear in their real roles, but this incident did not happen. All numbers are illustrative.)*

## 12. Interaction rules

- Controls: **Back / Next / Play-pause / Restart**. The viewer can go back at any point.
- Clicking any company on the map shows a card: who they are, what they can see, what they can do.
- The hypothetical-scenario banner stays visible on every screen.
- No login, no data collection, no sound.
- Works on a laptop browser; readable on mobile (map can collapse to a vertical list).

## 13. Glossary (tooltips)

- **AI agent:** an AI system that takes actions on its own, such as calling APIs, writing code or sending emails.
- **Agent provider:** the company that hosts and runs the agent.
- **Deployer:** the organisation using the agent for its own work.
- **Prompt injection:** hidden instructions in content the agent reads, which hijack what it does.
- **Credentials / API keys:** secrets that let the agent log into or call services.
- **Tool gateway:** a checkpoint that an agent's outgoing calls to tools and APIs pass through.
- **CDN / bot management:** services in front of many websites that can see traffic patterns across them.
- **Agent ID:** a label on an agent's activity that says who runs it and who to contact.
- **Shutdown:** any targeted action that stops an agent from continuing harm, from revoking a key to ending the process.

## 14. Out of scope for v1

- Real agents, real APIs or AI calls: everything is scripted.
- Misaligned or shutdown-resisting agents (out of scope in the paper too).
- Jurisdiction-specific legal detail.

## 15. Ideas for v2 (not in v1)

- **Fallback executor branch:** "What if AgentCore doesn't respond?" Okta, Kong or Cloudflare step in.
- **Abuse resistance beat:** a fake shutdown report arrives; show how attribution, corroboration and reputation catch it.
- **Routing alternatives:** let the viewer switch between agent-ID routing, passing reports back along the chain, and a shared repository.
- **Liability note:** why actors may hesitate to report or keep logs without safe harbor.
- **"Design your own shutdown system"** sandbox (Idea 2).

## 16. Open questions for review

1. Is a compromised coding agent the right scenario, or would a misused agent (e.g. a phishing campaign) land better with policymakers?
2. Are the timings believable?
3. Who reviews the content before public release?
4. For an external version, do we switch to fictional names, or keep the real ones with the hypothetical banner?
