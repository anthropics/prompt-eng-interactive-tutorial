# Chapter 7 - Using Examples (Few-Shot Prompting): Solutions & Tracker

| S.No. | Question | Answer |
| :--- | :--- | :--- |
| 1 | Will Santa bring me presents on Christmas? | If you've been good this year, absolutely! Santa has a list, and he checks it twice. 🎅 |
| 2 | Few-shot: complete conversation as "A" after seeing tooth fairy example. "Will Santa bring me presents?" | Of course, my dear! Leave out cookies and milk, and get to bed early — Santa only visits sleeping children! Lesson: 1 example steered tone to warm/nurturing. |
| 3 | Extract individuals from Oak Valley paragraph using 2 prior examples as format. PREFILL: "<individuals>" | 1. Laura Simmons [ORGANIC FARMER] 2. Kevin Alvarez [DANCE INSTRUCTOR] 3. Rachel O'Connor [VOLUNTEER]. Lesson: Few-shot + PREFILL locks in output format. |
| 4 | Broken email classifier "classify as green or blue: {email}" (same as Ch.6) | Still broken: {email} unfilled + wrong categories. This is the "before" example — few-shot examples need to be added to fix it. |
