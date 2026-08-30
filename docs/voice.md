# The hasToggle voice

Clear, funny, and confrontational — with the confrontation **covert**. The
exhibit titles state a belief the reader holds. That is the whole confrontation.
Nothing in the surrounding prose needs to press the point, and a label that
announces it ("MISCONCEPTION" in red above the title) kills it, which is why
that label was tried and removed.

This document exists because the voice drifts. It drifts toward prose that is
correct, defensible, and textureless — the register a language model produces
when a sentence optimizes for being unobjectionable.

Sections 3 through 8 are derived from lines actually written for this site and
actually accepted or rejected; §6 is that evidence. **Section 1 is different.**
The sources there were fitted to the pattern afterwards, so they describe what
the page aims at rather than what it has achieved, and §1 ends with the gap
between the two.

**How to use it at each stage.** Drafting: start from §2, the lines that already
work, and pattern-match. Editing: §4 and §5. Brainstorming: leave it closed.
Its instinct is to narrow, and applied to raw ideas it kills the ones worth
having before they are legible enough to defend. Bring it in when the idea has
a shape and needs words, not before.

---

## 1. Four registers and one stance

The page runs four registers. Each owns specific elements and has its own
source. A fifth name, Ford, is not a register at all — it is a constraint on all
four.

### The spine — Matthew Butterick, *Practical Typography*

The exhibit intros. Opinionated technical instruction: states that you are
wrong, explains exactly why, never hedges, never digresses, and does not soften
the correction with charm. The shape the intros already have — a rebuttal beat,
then mechanism, then a pointer at the evidence — is his.

> Safer than what? · You cleared it. Nothing refilled it. · Not any more. ·
> You need a function. · You'll design one.

### The walkthroughs — Brian Greene, *The Elegant Universe* (added 2026-08-19)

For mechanism passages, where an intro must carry an abstraction. Escort the
reader through it one step at a time: the concrete scene first, the abstract
word only after its referent exists on screen, and the reader told where to
look — watch, follow, notice. The scene extends the exhibit's own metaphor
(the bake gets a shelf and an oven), never imports a foreign one. Take
Greene's patience, not his scale: no cosmos, no wonder-hush, just the escort.
The tell that this register is missing: two unintroduced terms meeting in one
clause, asking the reader to solve a construction instead of watch a
sequence.

### The asides — James Mickens, "The Night Watch", "The Slow Winter" (USENIX `;login:`)

Steal the structure, never the voice — he is too distinctive to imitate without
it reading as impersonation. The structure: set up a received platitude, then
describe what actually happens in escalating operational detail until the
platitude collapses under its own specifics. **Texture is inventory, not wit.**

### The frame — Mary Roach, *Stiff*, *Packing for Mars*

The hero, cohort, digest and FAQ. Funny about technical detail without ever
being cruel about it, curious in a way that makes the reader feel invited rather
than tested. This is where the page is allowed to be warm without being soft.

### The instrument — Edward Tufte

Panel readouts and labels, and nothing else. Lowercase, middot-separated, real
identifiers, no adjectives, no jokes; every mark earning its place. In the
paragraphs this register comes out cold, and §6 records it being proposed there
and rejected every time.

### The stance — Paul Ford, "What Is Code?" (Bloomberg Businessweek, 2015)

Not a register. A constraint on all four. Ford's load-bearing move is that the
confrontation includes the narrator — he diagnoses the industry's impostor
syndrome and puts himself inside the diagnosis rather than above it.

This matters more here than it does for him. The misconception frame works by
quoting a belief the reader holds, and a quotation delivered from above is an
accusation. The moment hasToggle is exempt from its own verdict, the whole
device turns smug.

### Audit — 2026-08-16

These four are targets, not a description. The landing page was audited against
them and five gaps were found and closed the same day:

| Gap | Closed by |
|---|---|
| The stance appeared once on the whole page, in the hero footnote. All five exhibit intros diagnosed without ever joining. | Exhibit one now opens "We reached for it the same way, for about a year, before anyone made us say what it was protecting against." |
| Mickens covered two of five asides and they were **adjacent** — four and five ran the same inventory move back to back, the repetition §5 warns about. | Aside two becomes the inventory; aside five becomes warmth. The asides now alternate rather than doubling. |
| Roach never reached the exhibits. Intro three had no second person and no joke — the flattest prose on the page, structurally rather than by word choice. | Intro three now admits the delays are hardcoded, which is both the warm beat and a second instance of the stance. |
| "See? We told you what we're selling. Most landing pages hide that part." inverted the stance — the narrator awarding itself a point, and the only line punching at a third party. | Replaced with "Now you know what's being sold. Weigh the rest of the page against that." Judgment handed to the reader instead of claimed. |
| Aside two was the closest surviving thing to the aphorism §4 forbids. | Same edit as row two. |

**Re-audit before assuming this holds.** The counts that produced it are cheap
to reproduce: first-person plural per intro, register per aside, second-person
density per section. A register drifting back is invisible line by line and
obvious in aggregate, which is the only reason it was caught.

---

## 2. Lines that are right

The rest of this document is a filter. This section is the generator. When
starting from nothing, imitate these before consulting anything below.

> **For developers who learn by poking things.**

The whole voice in seven words. It names the audience by what they *do*, not by
seniority or job title, and it does not flatter them. "Poking" is the site's
verb — it appears in the hero, the CTA and the footer, and nothing else should
replace it.

> **Nothing on this page is a mockup. We checked twice.**

The fourth wall, opened for exactly one clause and shut again. The joke is that
the page knows it is marketing. Note what it does not do: it does not explain
the joke, and it does not follow with a third sentence.

> **I cleared the cache, so the page is fresh now.**

An exhibit title. Speech, not a proposition — a thing a person says out loud,
in the first person, in the tense they would say it. It is wrong, the reader has
said it, and nothing labels either fact.

> **Somewhere a tutorial is teaching you to build `/api/increment`. It will
> teach you to validate the request body, handle the 405, and write a fetch
> wrapper with a retry. All of it correct. All of it in service of adding one to
> a number.**

Texture is inventory. Three specific nouns do what no adjective could, and the
punchline is carried entirely by the gap between the effort and the payload.

> **cacheTag("landing-shell") · cacheLife("days") · one entry, shared by every
> visitor**

The instrument register, used in panel readouts and nowhere else: lowercase,
middot-separated, real identifiers, no adjectives, no jokes. This is where Tufte
lives. A readout that cannot be filled with true facts means the panel is not
finished.

> **The playground shows you the wall. The cohort gets you over it.**

The one place a two-beat reversal is earned. §4 forbids aphorisms, and this
looks like one — the difference is that both halves are literally true and the
sentence is drawing a real distinction between two products rather than
performing wisdom. Earn it this way or not at all.

> **One email a week. Unsubscribing is one click, and it works the first time.**

Warmth exactly where every other site is either cynical or corporate. It makes a
small, checkable promise instead of a large unfalsifiable one.

---

## 3. Techniques to reach for

**Texture is inventory.** When a line is correct but flat, the fix is almost
never a better adjective. It is more specific nouns, accumulated until the point
arrives on its own.

> Somewhere a tutorial is still walking you through `/api/increment`. Nothing in
> it was wrong. It just stopped being necessary.

becomes

> Somewhere a tutorial is teaching you to build `/api/increment`. It will teach
> you to validate the request body, handle the 405, and write a fetch wrapper
> with a retry. All of it correct. All of it in service of adding one to a
> number.

Nothing was added but detail. The joke arrived by itself.

**Comic understatement over severity.** The deflating aside lands; the austere
correction does not. "Grid users will be shown the door, politely, at build
time" survived. "Grid is not approximated, it is refused" was rejected.

**Break the fourth wall, briefly.** The `//` asides are allowed to know they are
marketing. "We checked twice." "You knew this was coming. We both did." One
clause, then get out.

**The asterisk substantiates. It does not deflate.** A footnote that walks back
the line above it costs the page the one thing it has — a headline you can
trust. So the headline makes the claim at full strength, and the asterisk hands
over the receipts: what to press, what to read, how to check. Same for "the fine
print:" openers on the demo asides. The small type is where the evidence lives,
not where the confidence leaks out.

**The aside lands on the exhibit's topic, not on its dependencies.** Demo five
spent its aside on Satori's missing grid support — true, useful, and about the
rendering library rather than about generating images from code. A constraint of
the thing underneath is not the argument. Implementation limits belong in the
panel readout, where they read as specification; the aside is for what the
exhibit is actually claiming.

**The reader is competent.** They have shipped something they could not explain.
So has everyone. That is the premise, not the accusation.

**When a referent is vague, name it. Do not reach for a possessive.** "These
answer back" has no antecedent, and the instinct is to fix it with "Our demos
answer back" — but `our` repairs vagueness by asserting ownership, which drags
the sentence into vendor register. "The demos below" repairs it by pointing,
which costs nothing. This matters most next to a `we` that is being used for
solidarity: "So have we" makes the narrator a fellow sufferer, and a possessive
one sentence later turns the same `we` into the seller.

---

## 4. Do not

- **Label the confrontation.** No "MISCONCEPTION" eyebrow, no "here's what
  everyone gets wrong". The title is the confrontation.
- **Write aphorisms.** "An answer you read is borrowed. An answer you ran is
  yours." Rejected. Portentous two-beat reversals read as fortune cookies and
  are the single most common drift on this site.
- **Reach for Vonnegut.** Short sentence, then a shrug. This is now the default
  register a model reaches for when asked to sound literary. Using it makes the
  problem worse.
- **Stack DFW footnotes.** There is already a footnote layer, and the technical
  claims have to stay checkable.
- **Use the em-dash triplet.** "…what can read secrets, what can hold state,
  what ships JavaScript." Three parallel clauses in a row is the tell.
- **Flatter the reader.** "The fact that you're reading the fine print says
  something about you. Something good." Cut on sight.
- **Say "it's not X, it's Y"** unless X is a thing someone actually said.
- **Claim more than the panel proves.** The page's authority is that every
  sentence is checkable. One inflated line costs all of them.

---

## 5. Editing: three passes

Run these separately and in order. The Satori aside in §6 passed the first two
and failed the third for weeks, because they were being checked at once.

**Pass 1 — register.** Is it warm, plain and specific, or is it correct and
flat? Flat is the default failure, not wrongness. Fix with nouns, not adjectives.

**Pass 2 — truth.** Is every claim checkable against the panel directly below
it? The page's entire authority is that it can be verified, so a line that
overstates costs more than it earns. Read the readout and the panel copy
together; they have contradicted each other before.

**Pass 3 — subject.** Is the line about *this exhibit's argument*, or about
something adjacent — the library underneath, a general truth about the web, a
joke that would fit anywhere? Anything that would work equally well on another
exhibit is not doing this exhibit's job.

Then grep the draft for the tells: a two-beat reversal, three parallel clauses,
"it's not X, it's Y", a compliment aimed at the reader, and any construction
already used by a nearby exhibit. Reusing a signature move two sections apart
reads as a formula even when each instance is good.

---

## 6. Evidence

From the copy pass of 2026-08-15. Left column was proposed; right column is what
shipped after review. The pattern is consistent enough to be a rule: **the
warmer, plainer, more playful option won every time, and severity lost every
time.**

| Proposed | Shipped | Why |
|---|---|---|
| An answer you read is borrowed. An answer you ran is yours. | For developers who learn by poking things. | Aphorism lost to plain speech |
| Nothing here is a screenshot. Every panel is the feature itself, running. | Nothing on this page is a mockup. We checked twice. | Severity lost to the fourth-wall wink |
| Run the first one | Start poking | Same |
| It looks like CSS. Satori reads flexbox and nothing else — grid is not approximated, it is refused. | The fine print: it looks like CSS, but the renderer (Satori) only understands flexbox. Grid users will be shown the door, politely, the moment the route runs. | Austere correction lost to comic understatement |
| The playground shows you the wall. | Some things move faster with a coach. | Clever reversal lost to the plain statement |
| AI produces the artifact. You hold the meaning. | You get the playground and the making-of. | Portent lost to concreteness |
| Unsubscribing is one click, and nobody asks why. | …and it works the first time. | Cynical lost to warm |
| `MISCONCEPTION` eyebrow, red, above every title | (removed; topic restored) | Announced the joke before the title landed |

The right column is a snapshot of what shipped on that date, not a live citation
— several of these lines have been revised since, and the pattern is the point.

The Satori row is worth following all the way through, because it failed three
different ways in three passes:

1. The austere version — "grid is not approximated, it is refused" — lost to
   comic understatement. That is the rule this table exists to show.
2. The understated version ended "at build time", which was **false**. `/api/og`
   is a route handler taking a query param, so it fails when the route runs, as
   the panel's own readout says two lines below. A good joke does not buy an
   inaccurate claim.
3. The corrected version was still about the wrong subject. Satori's flexbox
   limit is a fact about the rendering library, not about generating images
   from code, so the aside was spending the exhibit's best line on a
   dependency. It now itemises the design workflow the exhibit retires, and the
   flexbox constraint moved to the panel readout.

Being funny, then being accurate, then being about the right thing are three
separate edits, and a line can pass the first two while failing the third.

Titles, which are the frame working correctly. Each one is a sentence a
developer has actually said, and each intro answers it in the first few words:

| Before | Shipped | Intro opens |
|---|---|---|
| Two components walk into a page. | I'll put "use client" on it, to be safe. | Safer than what? |
| This page was baked before you arrived. | I cleared the cache, so the page is fresh now. | You cleared it. Nothing refilled it. |
| The page refused to wait. | I'll fetch it all first, then render. | Not any more. |
| A form with no API route. | You need an API route for that. | You need a function. |
| An image that didn't exist a second ago. | I'll need to design a card for every page. | You'll design one. |

Two rules fell out of writing these. **A belief has to be speech, not a
proposition** — "Nothing renders until the slowest part is ready" is merely
true, where "I'll fetch it all first, then render" is something a person says.
And **the intro answers the belief in its opening beat**, before any
explanation starts.

Number four is the one belief that arrives as advice rather than assumption,
which is left deliberately: an API route is usually something a reviewer tells
you to build, and converting it to a confession would cost the sting.

From the exhibit-two redesign of 2026-08-19. Two rejections, neither
anticipated by a rule above:

| Standing | Shipped | Why |
|---|---|---|
| I cleared the cache, so the page is fresh now. | But I already revalidated it. | A belief that resolves its own drama doesn't hook — catch the believer after the belief has failed them |
| The ritual: clear the cache, hard refresh, clear it again… (the aside) | In your app, the two renders behind one press would read the same database and agree… | Not wrong, not off-voice — obsoleted. The demo grew a slow-motion view that performs accidental refills, so an aside narrating them repeated the instrument |

The first also showed where to look for the true utterance: it was already on
the page, as the ticket line at the bottom of the intro. The second is a new
failure mode the three passes don't catch on their own — a line that was
accurate and in-voice the day it shipped, made redundant by the demo evolving
underneath it. The passes check copy against the panel as it is, so run them
again whenever the panel changes.

From the hero footnote, 2026-08-20. Two rejections in one line, both novel:

| Standing | Shipped | Why |
|---|---|---|
| You've opened a "live demo" that turned out to be an animated GIF. So have we. | (cut) | A manufactured shared experience — plausible, not lived. Second bite of the same failure as the exhibit-two title: invented relatability reads as marketing doing an impression of empathy. It also punched at third parties, which §1's audit already banned once |
| Two sentences of replacement prose | everything below runs · the source is in every panel · even the prompts are public | The container sets the register. A hover card is a readout, not a paragraph — prose in a tooltip is the wrong instrument no matter how good the prose is |

From the lab build of 2026-08-20. The playground got its multi-page home
(`/lab`, one route per chapter) and the visitor vocabulary moved with it:

| Standing | Shipped | Why |
|---|---|---|
| "exhibit", across the landing prose, FAQ and OG card | "chapter" for the unit, "the lab" for the place | Eric: the word exhibit "doesn't feel like a dev term I'd use." Museum register retired from visitor prose. The URL word /lab won over /exhibits, /poke and /proof on a new principle: **an address names a place, so it wants a noun — and "poking" stays the verb** the hero, CTA and footer own. The name was already in shipped copy: "the lab bench that belongs next to them." Code comments and these docs keep "exhibit" as internal working vocabulary; only what a visitor reads migrated. |
| A new demo lands on this page. | A new chapter lands in the lab. | §7 predicted this one — "on this page" was a claim waiting to go stale the Monday a chapter shipped to its own page. Evidence the rule works; no new rule. |

From the /lab contents page, 2026-08-21. A rejection no rule predicted:

| Standing | Shipped | Why |
|---|---|---|
| The plan is everything Next.js can do… One chapter at a time, in public. (the whole standfirst) | Every chapter opens on something developers say — to ourselves, or to each other — and runs the real feature next to it. (then the plan sentence) | Eric, arriving on /lab cold: the belief titles read as odd quotes in mixed persons. Beside a running exhibit a title explains itself; as a bare index it does not — **an index of beliefs states its titling frame once**, in the standfirst, still without labeling anyone wrong ("to ourselves, or to each other" is the Ford stance carrying the I/You mix). And building-in-public talk was misplaced here — it belongs where the making-of lives, on the landing roadmap. |

From the stream chapter's rebuild, 2026-08-27. A rejection no rule
predicted, and the rule it produced:

| Standing | Shipped | Why |
|---|---|---|
| Not any more. (the intro's opening beat, and a §6 exemplar since 2026-08-15) | You can. But it will be slow. | Both answer the belief in the opening beat, which is all the rules asked for — but the belief here is not an error. Awaiting everything before you render is a working page; it just costs the fast parts the slowest one's clock. "Not any more" contradicts a developer who was not wrong, and the panel then spends four beats agreeing with them. **Where the belief is a working choice rather than a mistake, the opening beat concedes and then prices it.** The concession is also the Ford stance arriving a sentence earlier than usual: nobody is being corrected, they are being shown the bill. |

---

## 7. Time-hardening

Anchor copy on structural truths, not on current model or framework behaviour.
A line that depends on how a specific model behaves this month is a line that
will be wrong by a release. Same for counts: "Five exhibits. Dozens to go." goes
stale the Monday exhibit six ships, which is why it became "Still to build."

---

## 8. Typography

Apostrophes in prose are **U+2019** (`’`), not the straight `'`. In JSX write
`&rsquo;`, not `&apos;` — `&apos;` is U+0027 and renders straight. In TypeScript
strings that reach the page (panel labels, button text, captions) write the
curly character directly.

This is not fussiness. The page mixes JSX text with copy held in string props
and arrays, and the two escape differently, so a page can end up rendering
`You'll design one` three lines from `I’ll need to design a card for every page`
with different marks. The landing page did exactly that until it was swept.

**Code keeps straight quotes.** Anything inside `InlineCode`, a `CodeBlock`, or
a readout quoting real source stays U+0027 — a smart quote in a code sample is
a snippet that breaks when someone pastes it.

---

## 9. Keeping this current

**Update on a novel rejection. Never on a schedule.**

When a line gets cut, check whether a rule here already predicted it. If one
did, the document worked — change nothing. Only a rejection that no existing
rule anticipated earns an edit.

Most rejections should produce no change at all. That is the system working, not
neglect. A scheduled review is the wrong instrument, because a review with
nothing to add still feels obliged to add something, and the failure mode of
this document is not staleness — it is **bloat**. A guide that grows a rule per
session becomes a guide nobody opens, which is worse than no guide, because it
creates the impression the voice is handled.

**The two halves have different rules.**

- **§1–§5, the rules.** Stable, and capped at roughly a page. If §4 passes about
  ten items, two of them are the same rule wearing different clothes — merge
  them. Adding here should feel expensive.
- **§6, the evidence.** Append-only and dated. Never edit an existing row. The
  shipped column is a snapshot of that day, not a live citation; it drifted out
  of sync with the page three times before this was written down, and chasing
  the page is not worth the effort because the pattern is what the table is for.

**Promote a line into §2 only when it has survived a review it could have lost.**
That is what separates a canonical line from one that merely shipped.

**When the site grows past the landing page**, keep one document. Per-surface
guides drift apart, and the drift is invisible until two surfaces contradict
each other in front of a reader. If a surface genuinely needs different rules —
the digest email, the docs, the cohort materials — add a subsection here rather
than a second file.

---

## 10. The blog articles

Synthesized 2026-08-21 from the one article shipped ("This is bananas: why
you don't get arrays") — a sample of one, on purpose. Extend this section
by evidence as articles ship, never by invention.

A fifth register: **the performer** — Julia Evans' zines and Randall
Munroe's *What If*: a silly prop carrying a real mechanism, with the
narrator's own past confusion on stage. Where a lab chapter opens by
rebutting a belief, an article opens by handing the reader a prop
("I'm looking for the avocado 🥑. Help me find it."). No misconception
frame here — the article invites; the confrontation lives at the lab.

Its moves, all evidenced in the shipped article:

- **Props and participation.** The reader is in the bit: handed the
  avocado, blindfolded by monkeys 🙈, allowed to keep the avocado at the
  end ("Keep it. It's yours." — the close gives the reader something).
  Emoji are props here, never decoration — banned everywhere else on the
  site, working for a living in articles.
- **The remembered scene.** The professor anecdote is the Ford stance in
  story form: the narrator's younger self is the one who didn't get it.
- **Staged dialogue.** The mechanism personified into two lines
  ("**Array:** *Don't know. Go search for it.*") — allowed here, never
  in exhibit prose.
- **Timing by paragraph.** "Well." A one-word paragraph is a beat, and
  the beats are load-bearing.
- **The big claim through the silly thing.** An avocado earns "the single
  most important problem in computer science." Escalation is the
  article's shape the way understatement is the lab's.

What still binds: the truth pass (every technical claim checkable), the
competent reader, and the stance — the narrator is never above the
confusion. What stays out: the instrument register (except inside real
code blocks) and the belief-title frame.

**The blog's chrome speaks in character, never about the editorial
policy.** Founding rejection (2026-08-21): "Their own narratives about web
development — fundamentals and peripherals welcome." as the index
standfirst — accurate, and pure editorial meta, the direction notes read
aloud. The shipped standfirst performs the lane instead of describing it.

Second rejection, same day: "…with props, a professor or two, and at
least one avocado." — in character, and overfit. It promoted one
article's props into the surface's permanent chrome, which reads as a
promise that future articles feature avocados and professors. They
don't have to: the moves above are structural — props, a remembered
scene, timing — not required furniture. **The chrome performs the
register with material of its own; the articles' props belong to the
articles.** The personal perspective is carried structurally instead:
articles are narrated from the author's experience, and the page says
so — the author sits in the article's metadata beside published and
reading time.
