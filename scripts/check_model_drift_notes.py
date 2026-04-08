from pathlib import Path

checks = {
    '03_Assigning_Roles_Role_Prompting.ipynb': [
        'On newer models, Claude may already answer correctly without extra prompting',
        'Depending on the model version, Claude may already notice the mistake below',
    ],
    '04_Separating_Data_and_Instructions.ipynb': [
        'Newer models may sometimes recover anyway',
        'Depending on the model version, Claude may or may not fail every time',
        'produces the right answer **reliably**',
    ],
}

for path in Path('.').rglob('*.ipynb'):
    snippets = checks.get(path.name)
    if not snippets:
        continue
    text = path.read_text()
    for snippet in snippets:
        if snippet not in text:
            raise SystemExit(f'missing snippet in {path}: {snippet}')

print('model drift notes present in all notebook variants')
