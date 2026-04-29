# Chapter 5 - Formatting Output: Solutions & Tracker

| S.No. | Question | Answer |
| :--- | :--- | :--- |
| 1 | Write a haiku about Rabbit. Put it in haiku tags. | Soft ears in the grass, / Silent paws upon the earth, / Moon watches it sleep. (wrapped in haiku tags) |
| 2 | Write a haiku about Cat in haiku tags. PREFILL: "<haiku>" | Whiskers in moonlight, / Paws fold beneath silken fur, / Dreams of birds take flight. Lesson: PREFILL forces Claude to start inside the tag, guaranteeing format. |
| 3 | Write a haiku about Cat in JSON format with keys first_line, second_line, third_line. PREFILL: "{" | {"first_line": "Whiskers in moonlight", "second_line": "Paws folded, eyes half-open", "third_line": "Dreams of birds take flight"} |
| 4 | Rewrite email in "olde english" style. Wrap in <olde english_email> tags. PREFILL: "<olde english_email>" | Good morrow, Master Zack. I doth write to thee in haste, seeking a brief account of thy progress upon the prompt thou wert charged to compose. Pray, grant me swift tidings. |
| 5 | Who is the best basketball player of all time? Please choose one specific player. PREFILL: "" (empty) | Michael Jordan. |
| 6 (Ex 5.1) | Write a haiku about cats in <haiku> tags. PREFILL: "<haiku>" | Silent paws at night, / Velvet shadows softly purr, / Moon owns what they seek. ✅ Contains "cat" + wrapped in haiku tags. |
| 7 | ANIMAL1=Cat, ANIMAL2=Dog (unused). Write haiku about ANIMAL1 in <haiku> tags. | Whiskers twitch at dusk, / Amber eyes trace the moonbeam, / Still paws, quiet dreams. Note: ANIMAL2 was defined but unused in the template. |
