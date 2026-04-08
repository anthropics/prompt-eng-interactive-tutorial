import json
from pathlib import Path

replacements = {
    '03_Assigning_Roles_Role_Prompting.ipynb': {
        7: """You can use role prompting as a way to get Claude to emulate certain styles in writing, speak in a certain voice, or guide the complexity of its answers. **Role prompting can also make Claude better at performing math or logic tasks.**

For example, there is a definitive correct answer to the puzzle below: yes. **On newer models, Claude may already answer correctly without extra prompting**, so focus on how the role changes the model's **reasoning style and reliability**, not just whether the first answer is wrong.""",
        9: """Now, what if we **prime Claude to act as a logic bot**? How will that change Claude's answer?

On current models, the biggest difference is often **how explicitly Claude reasons through the cases**, even when both versions land on the right final answer. That is still a useful prompt engineering win, because it makes the behavior more legible and repeatable.""",
        13: """### Exercise 3.1 - Math Correction
Even simple arithmetic checks can benefit from better prompting. **Depending on the model version, Claude may already notice the mistake below**, or it may explain the arithmetic issue without clearly labeling the solution as incorrect.

Modify the `PROMPT` and / or the `SYSTEM_PROMPT` to make Claude grade the solution as `incorrectly` solved, rather than correctly solved. The goal is to practice using role prompting to make the verdict **more explicit and robust**, not to rely on a guaranteed baseline failure.""",
    },
    '04_Separating_Data_and_Instructions.ipynb': {
        8: """Here, **the prompt boundary is ambiguous**. On older models, Claude often treated \"Yo Claude\" as part of the email and began the rewrite with \"Dear Claude\". **Newer models may sometimes recover anyway**, but the input and instruction are still mixed together in a brittle way.""",
        9: """How do we solve this? **Wrap the input in XML tags**. That makes the data boundary explicit and usually gives more reliable behavior across model versions, even when the untagged prompt happens to work once by luck.

[XML tags](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags) are angle-bracket tags like `<tag></tag>`. They come in pairs and consist of an opening tag, such as `<tag>`, and a closing tag marked by a `/`, such as `</tag>`. XML tags are used to wrap around content, like this: `<tag>content</tag>`.

**Note:** While Claude can recognize and work with a wide range of separators and delimiters, we recommend that you **use XML tags as separators** because they make the structure obvious to both the model and the human reading the prompt.""",
        11: """Let's see another example of how XML tags can help.

In the following prompt, the instruction and the list items are formatted almost the same way. **Depending on the model version, Claude may or may not fail every time**, but the hyphen before `Each is about an animal, like rabbits.` still makes the prompt structure unnecessarily confusing.""",
        15: """**Note:** In the incorrect version of the \"Each is about an animal\" prompt, we intentionally include the leading hyphen to make the formatting misleading. This is an important lesson about prompting: **small details matter**. Even when a stronger model recovers, cleaner structure makes the prompt easier to debug and more reliable across model updates.

If you would like to experiment with the lesson prompts without changing any content above, scroll all the way to the bottom of the lesson notebook to visit the [**Example Playground**](#example-playground).""",
        21: """### Exercise 4.2 - Dog Question with Typos
Fix the `PROMPT` by adding XML tags so that Claude produces the right answer **reliably**, not just by accident on one model version.

Try not to change anything else about the prompt. The messy and mistake-ridden writing is intentional, so you can see how Claude reacts to such mistakes.""",
        25: """### Exercise 4.3 - Dog Question Part 2
Fix the `PROMPT` **WITHOUT** adding XML tags. Instead, remove only one or two words from the prompt.

Just as with the above exercises, try not to change anything else about the prompt. The point is to see which parts of the surrounding noise actually make the instruction harder to parse, even if a newer model sometimes answers correctly anyway.""",
    },
}

for path in Path('.').rglob('*.ipynb'):
    name = path.name
    if name not in replacements:
        continue
    nb = json.loads(path.read_text())
    changed = False
    for idx, new_src in replacements[name].items():
        cell = nb['cells'][idx]
        if cell['cell_type'] != 'markdown':
            raise RuntimeError(f'{path}:{idx} expected markdown, got {cell["cell_type"]}')
        lines = new_src.split('\n')
        cell['source'] = [line + ('\n' if i < len(lines) - 1 else '') for i, line in enumerate(lines)]
        changed = True
    if changed:
        path.write_text(json.dumps(nb, ensure_ascii=False, indent=1) + '\n')
        print(f'updated {path}')
