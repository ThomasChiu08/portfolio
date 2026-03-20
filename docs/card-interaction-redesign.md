# Project Deck Card Interaction Redesign

## 1. Why The Current Interaction Feels Static

The current deck looks premium, but it behaves like a styled mock rather than a living product surface.

### Current interaction model

- `pointerover` immediately promotes a card to the active layer.
- Active state is mostly a stack reorder plus preview/action opacity reveal.
- `click` immediately scrolls to the destination section.
- Supporting cards do not meaningfully respond beyond their fixed stack positions.

### Problems

#### 1. Binary state model

The deck is effectively `inactive` or `active`. There is no distinction between:

- casual pass-over
- intentional inspection
- committed selection
- navigation handoff

That makes every interaction feel shallow and equally weighted.

#### 2. No intent detection

The system treats any pointer contact as interest. A fast cursor sweep and a deliberate linger produce the same state change. Premium interfaces do not react to noise; they respond to intent.

#### 3. Missing deck-level feedback

The active card changes, but the deck itself does not feel like a coordinated system. The surrounding cards, glass surface, and atmospheric background do not meaningfully reorganize around the user’s focus.

#### 4. Click behavior is too abrupt

Clicking immediately navigates away. There is no “selected” moment, no confirmation of commitment, and no cinematic handoff from local preview to page-level content. That makes the deck feel like a list of links instead of an intelligent workspace surface.

#### 5. The visual metaphor and the behavior are misaligned

Visually, the interface suggests:

- layered memory
- project surfaces
- a system panel
- a living glass stack

Behaviorally, it acts like a simple hover card list.

#### 6. The non-active cards feel dead

When one card is active, the others should participate in the story:

- receding
- yielding depth
- hinting at what remains in the stack
- reinforcing hierarchy

Right now they mostly wait.

#### 7. Text reveal is functional, not expressive

The preview text and CTA simply appear. There is no sequencing, no pacing, and no sense that information is being surfaced intentionally.

#### 8. No exit model

There is no deliberate “return to deck” interaction because there is no real selected state. The system jumps from preview to destination with no intermediate ownership of the transition.

## 2. Interaction Philosophy

### Primary metaphor: System Surface

The deck should behave like a **system surface**, not a card deck, data layer, or workspace.

This is the right metaphor because:

- A “deck” implies browsing and stacking, which is only part of the experience.
- A “workspace” implies dense manipulation and persistent tooling, which is too heavy for a hero surface.
- A “data layer” feels analytical and cold.
- A “system surface” suggests a calm, intelligent interface that can bring one project plane forward while the rest of the stack remains context.

### What this means behaviorally

- Cards are not just cards. They are addressable project surfaces.
- Hover does not mean “activate immediately.” It means “candidate for inspection.”
- Focus means the system has decided the user is inspecting a project.
- Selection means the system acknowledges a commitment before navigation.
- The entire deck responds as one surface, not as independent floating elements.

### Design principle

The interface should feel like the user is **pulling a project surface into operational focus**, not merely hovering a component.

## 3. State System Diagram

```text
[Idle]
  |
  | pointer enters card
  v
[Hover Candidate]
  |
  | dwell > 140-180ms OR pointer velocity slows below threshold
  v
[Focus]
  |
  | click / Enter / tap
  v
[Selected]
  |
  | confirm CTA, second tap, or auto-handoff after short lock
  v
[Transition Out]
  |
  v
[Target Section Spotlight]

From [Focus]:
  - pointer leaves quickly -> [Idle]
  - arrow keys -> [Hover Candidate] on adjacent card

From [Selected]:
  - Esc / click outside / back affordance -> [Focus]

From [Target Section Spotlight]:
  - scroll back to hero / return affordance -> [Selected] or [Idle]
```

## 4. Multi-State Interaction System

## 4.1 Idle State

### Goal

Establish the deck as a living surface without demanding attention.

### Behavior

- One default project remains softly forward as the resting surface.
- Supporting cards sit in a clear depth ladder behind it.
- Very slow ambient drift applies to the deck shell, not individual text blocks.
- A faint highlight travels across the glass shell on a long cycle.
- Background atmosphere remains stable and low-energy.

### Motion language

- 8 to 14 second ambient loop
- 1 to 2px vertical or parallax drift max
- no constant pulsing on text
- no obvious idle scale animation

### Why it works

The deck feels alive before interaction begins, but it does not look animated for animation’s sake.

## 4.2 Hover Candidate State

### Goal

Acknowledge user proximity without overcommitting.

### Behavior

- The hovered card gains slight edge illumination and local contrast.
- The card raises by a small amount in depth, not a visible “pop.”
- Neighboring cards subtly compress and shift to yield space.
- The shell’s internal glow nudges toward the hovered card.
- Text remains mostly unchanged; this is not yet full preview.

### Important rule

Hover alone should **not** fully expand the card. This state should feel like the system saying, “I see where you are looking.”

## 4.3 Focus State

### Goal

Create an intelligent preview mode that feels earned by intent.

### Trigger

Enter focus when either condition is met:

- pointer dwell exceeds roughly `140-180ms`
- pointer velocity drops below a slow-inspection threshold
- keyboard focus lands on a card
- first tap on mobile

### Behavior

- Focused card becomes the active project surface.
- The active card advances to the front plane and widens its breathing room.
- Supporting cards recede, dim slightly, and shift deeper into the stack.
- The deck shell darkens or quiets around the active card by a small amount.
- Preview content reveals in sequence instead of all at once.
- Label and stage metadata tighten into sharper clarity.
- The CTA changes from passive “View section” to a more directed action such as:
  - `Open memo`
  - `Inspect project`
  - `Jump to section`

### Content sequencing

Recommended timing:

1. edge light and elevation
2. stage and metadata sharpen
3. preview line fades upward
4. CTA appears last

### Why this matters

This is the core missing layer. Without focus, the interface cannot distinguish curiosity from commitment.

## 4.4 Selected / Active State

### Goal

Turn click into a deliberate commitment, not an abrupt jump.

### Behavior

- Clicking a focused card enters a selected state before navigation.
- Selected card locks into the lead plane and the rest of the deck settles.
- The shell background slightly attenuates around the chosen card.
- The active card may gain a stronger but still restrained inner glow.
- A selection lock of roughly `180-260ms` gives the interaction emotional weight.
- Then the interface transitions into the destination handoff.

### Navigation handoff

Do not navigate instantly on click.

Instead:

1. card enters selected lock
2. shell background and stack settle
3. CTA / label confirms intent
4. page scroll begins
5. destination section receives spotlight treatment

This makes the interaction feel product-grade rather than hyperlink-grade.

## 4.5 Exit State

### Goal

Allow the user to back out of selection without feeling punished.

### Behavior

- `Esc` returns from selected to focus.
- Clicking outside the deck returns from selected to focus.
- Returning to the hero after navigation restores the previously selected card rather than resetting the stack arbitrarily.
- On mobile, a close or back affordance should appear once a card is selected.

### Principle

Selected is not a trap. The user should feel in control of the surface at all times.

## 5. System-Level Interaction Logic

The deck must behave as a coordinated field, not a pile of independent hover cards.

### When one card becomes a candidate

- active card rises slightly
- immediate neighbor shifts back and right
- far card shifts deeper and softens more aggressively
- shell highlight bends toward the active region

### When one card enters focus

- non-focused cards reduce contrast and opacity slightly
- active card becomes the only fully readable plane
- deck header copy can subtly change from passive to contextual
  - example: `Hover to preview` becomes `Inspecting project memo`

### When one card is selected

- the stack settles into a stronger hierarchy
- depth separation becomes clearer
- background atmosphere responds to the selected project
- target section receives spotlight continuity after scroll

### Spatial hierarchy rules

- only one card may occupy the “foreground plane”
- only one secondary card may remain materially legible
- the third layer should behave mostly as context
- stack spacing should be expressive enough to show depth, but not theatrical

### Focus guidance

The system should always help answer:

- what is primary right now
- what is available next
- what action will happen if I commit

## 6. Micro-Interactions

Micro-interactions should communicate system intelligence, not ornament.

### Recommended micro-behaviors

- **Edge light drift:** a restrained highlight on the active card’s top edge that shifts with focus.
- **Glass density shift:** background fill becomes microscopically denser in selected state.
- **Preview sequencing:** preview line and CTA reveal in staggered timing.
- **Metadata sharpening:** label and stage text gain contrast and tracking stability in focus.
- **Surface parallax:** active card content shifts by 2 to 4px relative to the shell on pointer move.
- **Deck halo:** a soft local atmospheric bloom sits behind the active card, not around the full hero.
- **Section spotlight:** destination section receives a temporary “arrival” state so the handoff feels continuous.

### Avoid

- large hover scaling
- flashy glow pulses
- animated blur as the main effect
- 3D tilt that makes text unstable
- elastic or springy motion that feels playful
- any micro-interaction that reduces legibility

## 7. Motion Design Rules

## 7.1 Timing

- ambient idle motion: `8s - 14s`
- hover candidate response: `120ms - 170ms`
- focus transition: `220ms - 280ms`
- selected lock: `180ms - 260ms`
- navigation handoff: `480ms - 700ms`
- exit / return: `220ms - 320ms`

## 7.2 Easing

Use a small, disciplined easing family.

### Recommended curves

- **Surface rise / focus:** `cubic-bezier(0.22, 1, 0.36, 1)`
- **Opacity / text reveal:** `cubic-bezier(0.2, 0.8, 0.2, 1)`
- **Handoff / page transition:** `cubic-bezier(0.18, 0.9, 0.22, 1)`

### Avoid

- bounce
- overshoot springs
- inconsistent mixed easing across card and shell layers

## 7.3 Motion consistency

Every state should feel like the same material system:

- depth changes should be modest
- opacity changes should be soft
- light should move more than objects
- text should reveal after structure settles

## 8. Detailed State Behaviors

| State | Card behavior | Other cards | Shell / background | User signal |
| --- | --- | --- | --- | --- |
| Idle | resting lead card, ambient life | readable hierarchy, low energy | stable atmosphere | “This is a live system.” |
| Hover Candidate | slight rise, edge light, local attention | yield subtly | glow nudges toward target | “I see your interest.” |
| Focus | preview opens, metadata sharpens, CTA reveals | recede and dim | deck quiet zone forms around active card | “You are inspecting this.” |
| Selected | lead plane locks, action confirms | settle fully back | background attenuates, handoff prepares | “Commit received.” |
| Transition Out | card stabilizes before scroll | context fades | section spotlight prepared | “We are moving there now.” |
| Exit / Return | card returns to focus or idle | hierarchy restored | atmosphere normalizes | “You remain in control.” |

## 9. Keyboard And Accessibility Behavior

If this is meant to feel like a real product, keyboard behavior cannot be incidental.

### Keyboard rules

- `Tab` lands on the active or selected card only.
- Arrow keys cycle cards inside the deck.
- `Enter` or `Space` moves from focus to selected.
- `Enter` again, or CTA activation, performs the navigation handoff.
- `Esc` returns from selected to focus.

### Accessibility rules

- do not animate text position aggressively while it is being read
- preserve strong contrast in all states
- reduced motion should preserve state changes with opacity and contrast, not travel motion
- selected state must be announced clearly through `aria-current` or `aria-selected`

## 10. Mobile Fallback

Mobile should be simpler, not different in philosophy.

### Recommended mobile model

- first tap = focus/select card
- second tap or explicit CTA = navigate
- no hover candidate state
- reduced stack depth
- smaller atmospheric response
- no cursor parallax

### Why

This preserves the same logic:

- inspect first
- commit second

That is much more coherent than translating hover behavior directly to touch.

## 11. Technical Implementation Plan

## 11.1 Recommendation

Use **React state machine + CSS variable-driven presentation + minimal JS intent detection**.

This should be implemented as a controlled interaction system, not a pile of hover styles.

## 11.2 Stack recommendation

### Primary recommendation

- **React / Next.js client component** for state management and intent logic
- **CSS transforms / opacity / pseudo-elements** for most rendering
- **small imperative pointer tracker** for velocity and parallax
- **Intersection Observer or existing scroll system** for section handoff spotlight

### Framer Motion

Use only if you want cleaner orchestration for:

- selected lock
- entry/exit presence
- shared layout handoff

Do **not** use it as the primary hover engine. This system wants precision and restraint more than animation abstraction.

### WebGL

Not recommended for the card system.

Reasons:

- text-heavy glass cards do not benefit from WebGL complexity
- it adds fragility where the interaction should feel dependable
- the premium value here comes from state logic and timing, not rendering spectacle

## 11.3 What should be GPU accelerated

- `transform`
- `opacity`
- restrained shadow and highlight movement via pseudo-elements

## 11.4 What should stay CSS-based

- stack offsets
- opacity hierarchies
- edge-light treatments
- background wash under the deck
- content reveal sequencing using state classes or CSS variables

## 11.5 What should be JS-controlled

- hover candidate timing
- pointer velocity detection
- state transitions between focus and selected
- keyboard control
- selection-to-navigation handoff
- restoration of previous selection on return

## 11.6 What should not be animated heavily

- text blur
- backdrop-filter
- width/height layout changes on every hover
- anything requiring frequent React rerender loops for continuous motion

## 11.7 Recommended rollout order

### Phase 1: State architecture

- introduce explicit deck states
- separate `focus` from `selected`
- preserve keyboard behavior while replacing the binary active model

### Phase 2: Deck-level choreography

- make non-active cards respond to candidate and focus states
- add deck halo, shell attenuation, and hierarchy logic
- sequence preview and CTA reveal instead of revealing both at once

### Phase 3: Navigation handoff

- add selected lock
- implement destination spotlight
- restore selected card when returning to the hero

### Phase 4: Premium polish

- pointer-velocity intent detection
- restrained parallax
- contextual helper copy transitions
- reduced-motion tuning and mobile simplification

## 12. Proposed Component Structure

```text
ProjectDeckSurface
  ProjectDeckHeader
  ProjectDeckStack
    ProjectDeckCard
    ProjectDeckCard
    ProjectDeckCard
  ProjectDeckOverlay
```

### Responsibilities

- `ProjectDeckSurface`
  owns state machine, pointer intent, selection memory, and section handoff

- `ProjectDeckStack`
  maps stack order, depth offsets, and inter-card response

- `ProjectDeckCard`
  renders content and local surface effects based on deck-level state

- `ProjectDeckOverlay`
  handles glow wash, focus ring logic, and optional contextual helper copy

## 13. Optional State Machine Pseudocode

```ts
type DeckState =
  | 'idle'
  | 'hover-candidate'
  | 'focus'
  | 'selected'
  | 'transition-out'

type DeckContext = {
  activeId: string
  selectedId: string | null
  pointerVelocity: number
  lastFocusedId: string | null
}

onPointerEnter(cardId):
  set activeId
  set state = 'hover-candidate'
  start dwell timer

onPointerMove():
  if dwell timer elapsed or pointerVelocity < threshold:
    set state = 'focus'

onClick(cardId):
  if state !== 'selected':
    set selectedId = cardId
    set state = 'selected'
    start handoff timer
  else:
    navigate(cardId)

onEscape():
  if state === 'selected':
    set state = 'focus'

onNavigateComplete():
  set state = 'idle'
```

## 14. Final Recommendation

Do not treat this as a hover animation problem. Treat it as a **small operating surface** with its own state grammar.

The winning direction is:

- **Primary metaphor:** system surface
- **Primary missing layer:** intent-aware focus state
- **Primary product upgrade:** selected state before navigation
- **Primary system behavior:** the whole deck reorganizes around one active surface
- **Primary technical approach:** React state machine + CSS variable-driven rendering, with optional Framer Motion only for larger transitions

If this is implemented well, the deck will stop feeling like a premium static composition and start feeling like a real, living product surface with judgment behind it.
