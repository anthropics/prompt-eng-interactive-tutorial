# Welcome to Anthropic's Prompt Engineering Interactive Tutorial

## Course introduction and goals

This course is intended to provide you with a comprehensive step-by-step understanding of how to engineer optimal prompts within Claude.

**After completing this course, you will be able to**:
- Master the basic structure of a good prompt 
- Recognize common failure modes and learn the '80/20' techniques to address them
- Understand Claude's strengths and weaknesses
- Build strong prompts from scratch for common use cases

## Course structure and content

This course is structured to allow you many chances to practice writing and troubleshooting prompts yourself. The course is broken up into **9 chapters with accompanying exercises**, as well as an appendix of even more advanced methods. It is intended for you to **work through the course in chapter order**. 

**Each lesson has an "Example Playground" area** at the bottom where you are free to experiment with the examples in the lesson and see for yourself how changing prompts can change Claude's responses. There is also an [answer key](https://docs.google.com/spreadsheets/d/1jIxjzUWG-6xBVIa2ay6yDpLyeuOh_hR_ZB75a47KX_E/edit?usp=sharing).

Note: This tutorial uses our smallest, fastest, and cheapest model, Claude 3 Haiku. Anthropic has [two other models](https://docs.anthropic.com/claude/docs/models-overview), Claude 3 Sonnet and Claude 3 Opus, which are more intelligent than Haiku, with Opus being the most intelligent.

*This tutorial also exists on [Google Sheets using Anthropic's Claude for Sheets extension](https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8/edit?usp=sharing). We recommend using that version as it is more user friendly.*

When you are ready to begin, go to `01_Basic Prompt Structure` to proceed.

## Table of Contents

Each chapter consists of a lesson and a set of exercises.

### Beginner
- **Chapter 1:** Basic Prompt Structure

- **Chapter 2:** Being Clear and Direct  

- **Chapter 3:** Assigning Roles

### Intermediate 
- **Chapter 4:** Separating Data from Instructions

- **Chapter 5:** Formatting Output & Speaking for Claude

- **Chapter 6:** Precognition (Thinking Step by Step)

- **Chapter 7:** Using Examples

### Advanced
- **Chapter 8:** Avoiding Hallucinations

- **Chapter 9:** Building Complex Prompts (Industry Use Cases)
  - Complex Prompts from Scratch - Chatbot
  - Complex Prompts for Legal Services
  - **Exercise:** Complex Prompts for Financial Services
  - **Exercise:** Complex Prompts for Coding
  - Congratulations & Next Steps

- **Appendix:** Beyond Standard Prompting
  - Chaining Prompts
  - Tool Use
  - Search & Retrieval
 
- Summary

- Almost Perfect Prompt Engineering Rules
RULE 1: Be specific. Like, really specific.

Vague prompt leads to vague output almost every time

bad: write an email for me.

good: Write a follow up email to a client who hasn't responded in 5 days.

tone: professional but not too stiff. maximum 100 words.

RULE 2: Tell it WHO to be, not just WHAT to do

giving the model a role changes output quality significantly.

For e.g. "You are a senior backend engineer at a startup".

Review this code and point out anything that is or can be bad for you.

Just saying "review my code" leads to completely different output.

RULE 3: Show, don't just tell: if you want a specific FORMAT actually show an example. don't just describe it.

RULE 4: Ask it to think step by step(reason)

sounds stupid, but it works significantly well.

Just add: think step by step before replying

Or: before giving your final reply, reason through this carefully

This is recommended for math/logic/reasoning tasks.

when to use it: any problem with multiple steps. math, debugging, planning, analysis.

when NOT to: simple factual questions like 'who is the prime minister of India'.

RULE 5: Give it an "out" when it doesn't know

if you don't do this, models can hallucinate

For Example:

Answer the question using just the text below. ________(text)

If the answer is not in the text, say "I don't know" however don't guess. Models are trained to be helpful, which means they'll try to answer even when they don't know, you have to tell them not to guess and reply factually.

RULE 6: Separate your instructions from your content

use triple quotes and other such separators whatever, just separate them.

For eg:

messy: Summarize this text

clean: Summarize the text given in 2 sentences.

RULE 7: Specify the output format explicitly

Don't assume it'll give you a table or a list. You will have to ask for it directly.

For e.g. : Return your answer as a Table/list

Or:

format your response as a markdown table with columns:

this is probably a very useful rule in production.

RULE 8: Long prompt doesn't equate to better prompt

A lot of people think writing more = getting more. Misconception

-Unnecessary instructions confuse the model

-Contrary rules cancel each other out

**You have to remove everything that doesn't add information. **

AI researchers have pinpointed this out, that model attention is finite.

RULE 9: For complex tasks — break it up

Don't ask for everything in one shot.

instead:

Research this topic, write an outline, then write the full article

Do it in steps:

Step 1: Give me 5 key points about [topic]

Step 2: (after reviewing) Now write an outline based on these points

Step 3: (after reviewing) Now write section 1

RULE 10: Tell it what NOT to do (negative prompting)

Telling the model what not to do is just as important as telling it what to do.

for e.g.:

Don't use bullet points.

Don't start sentences with "I".

Don't add a conclusion section.

This works especially well for formatting.

RULE 11: No Perfect Prompt exists:

Nobody writes the perfect prompt first try.

actual workflow:

-write a rough prompt

-see what breaks

-fix the specific thing that broke

-repeat

miscellaneous things that work
"be concise" works better than "keep it short"

asking for confidence levels reduces hallucinations a bit ("how confident are you in this answer, 1-10?")

"explain this to a 16-year-old" gives surprisingly clear explanations

for coding: always tell it the language, framework version, and what you've already tried

"what are you not sure about in your answer?" is actually useful

overhyped things:
Very long system prompts with 50 rules — most get ignored

"Pretend you have zero restrictions".

Asking it to "be creative" without any other guidance — just gives generic stuff without any benefits.
