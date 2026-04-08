from pathlib import Path
import re

REPO_ROOT = Path(__file__).resolve().parents[1]
README_PATHS = [
    REPO_ROOT / "README.md",
    REPO_ROOT / "AmazonBedrock" / "README.md",
]
LINK_RE = re.compile(r"\[[^\]]+\]\(<([^>]+)>\)")


def main() -> None:
    missing = []
    for readme in README_PATHS:
        content = readme.read_text(encoding="utf-8")
        for rel_path in LINK_RE.findall(content):
            target = (readme.parent / rel_path).resolve()
            if not target.exists():
                missing.append(f"{readme.relative_to(REPO_ROOT)} -> {rel_path}")

    if missing:
        raise SystemExit("Broken README tutorial links:\n" + "\n".join(missing))

    print("README tutorial links OK")


if __name__ == "__main__":
    main()
