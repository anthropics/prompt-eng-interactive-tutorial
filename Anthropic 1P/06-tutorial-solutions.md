# Chapter 6 - Precognition (Thinking Step by Step): Solutions & Tracker

| S.No. | Question | Answer |
| :--- | :--- | :--- |
| 1 | Is this movie review positive or negative? "...blew my mind...freshness...living under a rock since 1900" | Positive on surface (uses positive words). But trick: reviewer lived under a rock since 1900, undermining the compliment. Step-by-step thinking catches this. |
| 2 | SYSTEM: savvy movie reader. Same review but ask for <positive-argument> and <negative-argument> before answering. | Verdict: Negative/unreliable. Positive arg: enthusiastic language. Negative arg: reviewer isolated since 1900, no modern frame of reference — praise is meaningless. |
| 3 | Same review but order swapped: "negative or positive?" with <negative-argument> first. | Verdict: Negative. Lesson: Order of arguments biases the final answer. Asking negative first nudges Claude toward a negative conclusion. |
| 4 | Name a famous movie starring an actor born in 1956. | Forrest Gump — starring Tom Hanks (born July 9, 1956). |
| 5 | Same question but brainstorm actors+birth years in <brainstorm> tags first. | Brainstorm: Tom Hanks (1956✅), Mel Gibson (1956✅), Tom Cruise (1962❌). Answer: Braveheart / Forrest Gump. Lesson: Brainstorming first reduces hallucination. |
| 6 | Broken email classifier: "classify as green or blue: {email}" | Broken prompt: (1) {email} placeholder never filled, (2) categories say "green/blue" but answer key uses A/B/C/D. Claude gets confused. Fix: substitute variable + use correct categories. |
| 7 | Same broken prompt but REGEX_CATEGORIES updated to <answer>X</answer> tags | Still broken: {email} unfilled + "green or blue" wrong. Only the grader improved. Fix: use correct A/B/C/D categories + fill {email} + wrap in XML tags. |
