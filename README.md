# Welcome to Anthropic's Prompt Engineering Interactive Tutorial

## Course introduction and goals

This course is intended to provide you with a comprehensive step-by-step understanding of how to engineer optimal prompts within Claude.

**After completing this course, you will be able to**:
- Master the basic structure of a good prompt
- Recognize common failure modes and learn the '80/20' techniques to address them
- Understand Claude's strengths and weaknesses
- Build strong prompts from scratch for common use cases

## Quick start

If you are new to the repo, start with these notebooks in order:

1. [00_Tutorial_How-To.ipynb](<Anthropic 1P/00_Tutorial_How-To.ipynb>)
2. [01_Basic_Prompt_Structure.ipynb](<Anthropic 1P/01_Basic_Prompt_Structure.ipynb>)
3. Continue chapter-by-chapter through the rest of the `Anthropic 1P/` folder

You can open the notebooks in JupyterLab, VS Code, or Google Colab after uploading them there.

If you want the Bedrock version instead, use [AmazonBedrock/README.md](<AmazonBedrock/README.md>) and start with either:
- [AmazonBedrock/anthropic/00_Tutorial_How-To.ipynb](<AmazonBedrock/anthropic/00_Tutorial_How-To.ipynb>)
- [AmazonBedrock/boto3/00_Tutorial_How-To.ipynb](<AmazonBedrock/boto3/00_Tutorial_How-To.ipynb>)

## Course structure and content

This course is structured to allow you many chances to practice writing and troubleshooting prompts yourself. The course is broken up into **9 chapters with accompanying exercises**, as well as an appendix of even more advanced methods. It is intended for you to **work through the course in chapter order**.

**Each lesson has an "Example Playground" area** at the bottom where you are free to experiment with the examples in the lesson and see for yourself how changing prompts can change Claude's responses. There is also an [answer key](https://docs.google.com/spreadsheets/d/1jIxjzUWG-6xBVIa2ay6yDpLyeuOh_hR_ZB75a47KX_E/edit?usp=sharing).

Note: This tutorial uses our smallest, fastest, and cheapest model, Claude 3 Haiku. Anthropic has [two other models](https://docs.anthropic.com/en/docs/about-claude/models/overview), Claude 3 Sonnet and Claude 3 Opus, which are more intelligent than Haiku, with Opus being the most intelligent.

*This tutorial also exists on [Google Sheets using Anthropic's Claude for Sheets extension](https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8/edit?usp=sharing). We recommend using that version as it is more user friendly.*

When you are ready to begin, open [01_Basic_Prompt_Structure.ipynb](<Anthropic 1P/01_Basic_Prompt_Structure.ipynb>). If you have not set up your environment yet, start with [00_Tutorial_How-To.ipynb](<Anthropic 1P/00_Tutorial_How-To.ipynb>) first.

## Table of Contents

Each chapter consists of a lesson and a set of exercises.

### Beginner
- **Chapter 1:** [Basic Prompt Structure](<Anthropic 1P/01_Basic_Prompt_Structure.ipynb>)
- **Chapter 2:** [Being Clear and Direct](<Anthropic 1P/02_Being_Clear_and_Direct.ipynb>)
- **Chapter 3:** [Assigning Roles](<Anthropic 1P/03_Assigning_Roles_Role_Prompting.ipynb>)

### Intermediate
- **Chapter 4:** [Separating Data from Instructions](<Anthropic 1P/04_Separating_Data_and_Instructions.ipynb>)
- **Chapter 5:** [Formatting Output & Speaking for Claude](<Anthropic 1P/05_Formatting_Output_and_Speaking_for_Claude.ipynb>)
- **Chapter 6:** [Precognition (Thinking Step by Step)](<Anthropic 1P/06_Precognition_Thinking_Step_by_Step.ipynb>)
- **Chapter 7:** [Using Examples](<Anthropic 1P/07_Using_Examples_Few-Shot_Prompting.ipynb>)

### Advanced
- **Chapter 8:** [Avoiding Hallucinations](<Anthropic 1P/08_Avoiding_Hallucinations.ipynb>)
- **Chapter 9:** [Building Complex Prompts (Industry Use Cases)](<Anthropic 1P/09_Complex_Prompts_from_Scratch.ipynb>)
  - Complex Prompts from Scratch - Chatbot
  - Complex Prompts for Legal Services
  - **Exercise:** Complex Prompts for Financial Services
  - **Exercise:** Complex Prompts for Coding
  - Congratulations & Next Steps

- **Appendix:** Beyond Standard Prompting
  - [Chaining Prompts](<Anthropic 1P/10.1_Appendix_Chaining Prompts.ipynb>)
  - [Tool Use](<Anthropic 1P/10.2_Appendix_Tool Use.ipynb>)
  - [Search & Retrieval](<Anthropic 1P/10.3_Appendix_Search & Retrieval.ipynb>)
