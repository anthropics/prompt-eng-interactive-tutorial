# Chapter 4 - Separating Data and Instructions: Solutions & Tracker

| S.No. | Question | Answer |
| :--- | :--- | :--- |
| 1 | I will tell you the name of an animal. Please respond with the noise that animal makes. Cow | Moo! |
| 2 | Make this email more polite: "Show up at 6am tomorrow because I'm the CEO and I say so." | Please plan to arrive at 6am tomorrow. As CEO, I'd appreciate your prompt attendance. |
| 3 | Same email but wrapped in <email> XML tags. Make it more polite. | Please plan to arrive at 6am tomorrow. As CEO, I'd appreciate your prompt attendance. XML tags separate data from instructions clearly. |
| 4 | List of sentences mixed with example bullet. Tell me the second item. | "I like how cows sound" — but this shows a problem: the example bullet got merged into the list as item #1. Fix: wrap sentences in XML tags. |
| 5 | Same list but SENTENCES wrapped in <sentences> XML tags. Tell me the second item. | "This sentence is about spiders." ✅ XML tags fixed the confusion — Claude now reads only the data list. |
| 6 (Ex 4.1 attempt) | TOPIC=Pigs. "Hey claude tell me about {TOPIC} in one line" | Pigs are highly intelligent, social omnivores... ❌ FAIL — grader needs "haiku" + "pig". Fix: "Write a haiku about {TOPIC}" |
| 7 (Ex 4.2) | Garbled prompt with QUESTION="ar cn brown?" buried in noise | Yes! Dogs can be brown — it's one of the most common coat colors. ✅ Contains "brown". Fix: wrap {QUESTION} in XML tags for clarity. |
