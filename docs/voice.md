# The hasToggle voice

Clear, funny, and confrontational — with the confrontation **covert**. The
exhibit titles state a belief the reader holds. That is the whole confrontation.
Nothing in the surrounding prose needs to press the point, and a label that
announces it ("MISCONCEPTION" in red above the title) kills it, which is why
that label was tried and removed.

This document exists because the voice drifts. It drifts toward prose that is
correct, defensible, and textureless — the register a language model produces
when a sentence optimizes for being unobjectionable. Every rule below is derived
from lines that were actually written for this site and actually accepted or
rejected. Section 4 is the evidence.

---

## 1. The three sources

**Paul Ford — "What Is Code?" (Bloomberg Businessweek, 2015).** The spine.
Long, genuinely technical, funny, second person, quietly brutal about the
reader's assumptions and never wrong. His load-bearing move is that the
confrontation includes the narrator — he diagnoses the industry's impostor
syndrome and puts himself in the diagnosis rather than above it. The moment
hasToggle is exempt from its own verdict it becomes smug, and the misconception
frame stops working.

**James Mickens — "The Night Watch", "The Slow Winter" (USENIX `;login:`).**
The asides. Steal the structure, never the voice — he is too distinctive to
imitate without it reading as impersonation. The structure: set up a received
platitude, then describe what actually happens in escalating operational detail
until the platitude collapses under its own specifics. **Texture is inventory,
not wit.**

**Mary Roach — *Stiff*, *Packing for Mars*.** The warmth. Funny about technical
detail without ever being cruel about it, and curious in a way that makes the
reader feel invited rather than tested. This slot originally read "Tufte", and
the evidence in section 4 overruled it: austere declarative prose was proposed
repeatedly on this site and rejected every time.

### On Tufte

Tufte is the right instinct for the *demos* — contempt for decoration, every
mark earning its place — and the wrong instinct for the *prose*, where it comes
out cold. Use him on the panels, not the paragraphs.

---

## 2. Techniques to reach for

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

## 3. Do not

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

## 4. Evidence

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

---

## 5. Time-hardening

Anchor copy on structural truths, not on current model or framework behaviour.
A line that depends on how a specific model behaves this month is a line that
will be wrong by a release. Same for counts: "Five exhibits. Dozens to go." goes
stale the Monday exhibit six ships, which is why it became "Still to build."

---

## 6. Typography

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
