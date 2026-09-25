"""get_completion(), backed by the `claude` CLI instead of the Anthropic API.

Every notebook in this fork imports from here instead of creating an
`anthropic.Anthropic(api_key=...)` client. Each call shells out to a
non-interactive `claude -p ...` run, which authenticates with whatever
account you're already logged into Claude Code with (a Claude.ai
subscription), so no billed Anthropic Console API key is required.

Setup: install Claude Code and log in once (`claude` in a terminal, then
`/login`). See the top-level README for details and known limitations
(no temperature/max_tokens control, no true assistant-turn prefill, no
native tool-use blocks -- see the docstrings below for how each is
approximated).
"""

import os
import subprocess

# CLI model alias: "sonnet", "opus", "fable", "haiku", or a full model id.
# Override with the TUTORIAL_CLAUDE_MODEL environment variable if you want
# a different model without editing this file.
MODEL_NAME = os.environ.get("TUTORIAL_CLAUDE_MODEL", "sonnet")


def _invoke(prompt: str, system_prompt: str = "") -> str:
    cmd = [
        "claude", "-p", prompt,
        "--model", MODEL_NAME,
        "--tools", "",  # pure text completion, no agentic tool use
        "--no-session-persistence",  # each call is an independent turn
        "--system-prompt", system_prompt,  # "" fully clears the default system prompt
        "--setting-sources", "",  # don't pull in your own CLAUDE.md/settings/hooks
        "--strict-mcp-config",  # and don't pull in your own MCP servers either
    ]
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
    except FileNotFoundError as e:
        raise RuntimeError(
            "Could not find the `claude` command. Install Claude Code and make sure "
            "it's on your PATH, then run `claude` once and `/login` before retrying."
        ) from e
    if result.returncode != 0:
        raise RuntimeError(f"claude CLI failed (exit {result.returncode}): {result.stderr.strip()}")
    return result.stdout.strip()


def get_completion(prompt: str, system_prompt: str = "", prefill: str = "") -> str:
    """Drop-in replacement for the original notebooks' get_completion().

    `prefill` approximates the API's assistant-turn prefill: the CLI has no
    equivalent, so we instruct Claude to continue from that exact text
    without repeating it, then strip a leading repeat if it slips through.
    As with the original tutorial, the returned text excludes `prefill`
    itself -- prepend it yourself if you want the full reconstructed text.
    """
    full_prompt = prompt
    if prefill:
        full_prompt += (
            "\n\n---\n"
            "Your reply has already begun with the exact text below, sent as the "
            "start of your turn. Continue directly from it: do not repeat it, and "
            "add no preamble before it.\n"
            f"{prefill}"
        )
    text = _invoke(full_prompt, system_prompt)
    if prefill and text.startswith(prefill):
        text = text[len(prefill):].lstrip("\n")
    return text


def _flatten_messages(messages: list) -> tuple[str, str]:
    """Turns an Anthropic-style messages list into (transcript, trailing_prefill)."""
    turns = messages
    trailing_prefill = ""
    if messages and messages[-1]["role"] == "assistant":
        trailing_prefill = messages[-1]["content"]
        turns = messages[:-1]
    lines = [f"{'Human' if m['role'] == 'user' else 'Assistant'}: {m['content']}" for m in turns]
    return "\n\n".join(lines), trailing_prefill


def get_completion_messages(messages: list, system_prompt: str = "") -> str:
    """For the multi-turn chaining appendix: get_completion(messages, system_prompt).

    The CLI takes one prompt per call rather than a structured messages
    array, so prior turns are flattened into a plain-text transcript and
    Claude is asked to continue it. This is an approximation of true
    multi-turn state, close enough for the chaining exercises.
    """
    transcript, prefill = _flatten_messages(messages)
    prompt = f"Continue the conversation below by writing only the next Assistant turn.\n\n{transcript}\n\nAssistant:"
    return get_completion(prompt, system_prompt=system_prompt, prefill=prefill)


def get_completion_tool_use(messages: list, system_prompt: str = "", prefill: str = "", stop_sequences=None) -> str:
    """For the tool-use appendix: get_completion(messages, system_prompt, prefill, stop_sequences).

    The CLI has no stop_sequences flag, so Claude generates its full reply
    and we truncate client-side at the first stop sequence, mirroring how
    the Anthropic API excludes the stop sequence and anything after it.
    """
    transcript, trailing_prefill = _flatten_messages(messages)
    effective_prefill = prefill or trailing_prefill
    prompt = f"Continue the conversation below by writing only the next Assistant turn.\n\n{transcript}\n\nAssistant:"
    text = get_completion(prompt, system_prompt=system_prompt, prefill=effective_prefill)
    if stop_sequences:
        cut_points = [text.find(seq) for seq in stop_sequences if seq in text]
        if cut_points:
            text = text[:min(cut_points)]
    return text
