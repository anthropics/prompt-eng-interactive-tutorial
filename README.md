# Welcome to Anthropic's Prompt Engineering Interactive Tutorial

## About this fork

This is a fork of [anthropics/prompt-eng-interactive-tutorial](https://github.com/anthropics/prompt-eng-interactive-tutorial), adapted to run **without a billed Anthropic Console API key**. The original notebooks call the Anthropic Messages API directly with `client.messages.create(...)`, which requires an API key tied to Console billing. In this fork, every notebook's `get_completion()` instead shells out to the [Claude Code](https://docs.claude.com/en/docs/claude-code/overview) CLI (`claude -p ...`), authenticating with whatever Claude.ai account/subscription you're already logged into.

**Setup:**
1. Install Claude Code and log in once (`claude` in a terminal, then `/login` if prompted).
2. Open `Anthropic 1P/00_Tutorial_How-To.ipynb` and follow the setup cells there.

**Known limitations of this approach**, documented in [`Anthropic 1P/claude_cli.py`](Anthropic%201P/claude_cli.py):
- No `temperature` or `max_tokens` control (the CLI doesn't expose them), so responses are somewhat less deterministic than the original tutorial's `temperature=0` examples.
- No true assistant-turn "prefill" (the CLI takes a single prompt, not a raw messages array) — it's approximated by instructing Claude to continue from the given text and stripping a leading repeat.
- No native `stop_sequences` — approximated by generating the full reply and truncating client-side, used in the Chapter 10.2 tool-use appendix.
- Multi-turn conversations (Chapter 10.1 chaining, 10.2 tool use) are flattened into a plain-text transcript per call rather than using persistent API conversation state.

The `AmazonBedrock/` folder is unchanged from upstream and still requires AWS credentials/billing.

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