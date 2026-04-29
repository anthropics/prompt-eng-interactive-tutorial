# Chapter 9 - Complex Prompts from Scratch: Solutions & Tracker

| S.No. | Question | Answer |
| :--- | :--- | :--- |
| 1 | Joe (AdAstra career coach) asked: "Which of the two careers [social worker, HR specialist] requires more than a Bachelor's degree?" | Social work — requires MSW for licensed/clinical roles. HR specialist typically needs only a Bachelor's. Used all 10 prompt elements: context, tone, rules, examples, XML data, immediate task, precognition, output format, prefill. |
| 2 | Legal Q: "Are there any laws about what to do with pets during a hurricane?" (with legal search results) | Yes — PETS Act (2006) requires state/local emergency plans to include pets. Hawaii, Louisiana, NH, California all passed related state laws [3]. Used: expert role, XML data, citation format examples, precognition (<relevant_quotes>), output in <answer> tags, prefill. |
| 3 | Blank 10-element prompt template + buggy Python code (print_multiplicative_inverses). Build prompt from scratch. | Bug: range(n) starts at i=0 causing ZeroDivisionError. Fix: range(1, n+1). Demonstrated building full prompt: expert role + task desc + XML code input + precognition + output format. |
