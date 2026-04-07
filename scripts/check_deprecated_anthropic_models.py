#!/usr/bin/env python3
from pathlib import Path
import json
import sys

BLOCKED_MODELS = {
    "claude-3-haiku-20240307",
    "claude-3-sonnet-20240229",
    "claude-3-opus-20240229",
}

paths = sorted(Path("Anthropic 1P").glob("*.ipynb"))
violations = []
for path in paths:
    nb = json.loads(path.read_text())
    for cell_index, cell in enumerate(nb.get("cells", []), start=1):
        if cell.get("cell_type") != "code":
            continue
        source = "".join(cell.get("source", []))
        for model in BLOCKED_MODELS:
            if model in source:
                violations.append(f"{path}: cell {cell_index} still references deprecated model {model}")

if violations:
    print("\n".join(violations))
    sys.exit(1)

print(f"checked {len(paths)} notebooks, no deprecated direct Anthropic model snapshots found")
