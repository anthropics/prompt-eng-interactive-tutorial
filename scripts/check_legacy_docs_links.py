#!/usr/bin/env python3
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
PATTERN = re.compile(r'https://docs\.anthropic\.com/claude/(?:docs|reference)/[^)\]\s"\']+')
paths = [ROOT / 'README.md']
paths += list((ROOT / 'Anthropic 1P').rglob('*.ipynb'))
paths += list((ROOT / 'AmazonBedrock').rglob('*.ipynb'))
failures = []
for path in paths:
    text = path.read_text()
    matches = sorted(set(PATTERN.findall(text)))
    if matches:
        failures.append((path, matches))
if failures:
    for path, matches in failures:
        print(path)
        for match in matches:
            print(f'  {match}')
    sys.exit(1)
print('OK: no legacy docs.anthropic.com/claude docs/reference links remain in tutorial files.')
