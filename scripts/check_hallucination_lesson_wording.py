#!/usr/bin/env python3
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
NOTEBOOKS = [
    ROOT / 'Anthropic 1P/08_Avoiding_Hallucinations.ipynb',
    ROOT / 'AmazonBedrock/anthropic/08_Avoiding_Hallucinations.ipynb',
    ROOT / 'AmazonBedrock/boto3/08_Avoiding_Hallucinations.ipynb',
]

required_fragments = [
    'Evidence gathering',
    'Information-sufficiency check',
    'Using both together is the most reliable teaching example here.',
]
exercise_heading = '### Exercise 8.2 - Prospectus Hallucination'
exercise_phrase = 'asking for citations **and** telling it to check whether those citations actually support the final answer'

failed = False
for notebook in NOTEBOOKS:
    data = json.loads(notebook.read_text())
    lesson = ''.join(data['cells'][9]['source'])
    exercise = ''.join(data['cells'][17]['source'])

    missing = [frag for frag in required_fragments if frag not in lesson]
    if missing:
        failed = True
        print(f'{notebook}: missing lesson fragments: {missing}')

    if exercise_heading not in exercise or exercise_phrase not in exercise:
        failed = True
        print(f'{notebook}: exercise wording not updated as expected')

if failed:
    sys.exit(1)

print(f'validated {len(NOTEBOOKS)} chapter 8 notebooks')
