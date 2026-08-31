#!/usr/bin/env python3
"""Compatibility entry point for the browser-rendered press-kit PDF."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
BUILDER = ROOT / "scripts" / "build_press_pdf.mjs"


def main() -> int:
    completed = subprocess.run(["node", str(BUILDER)], cwd=ROOT, check=False)
    return completed.returncode


if __name__ == "__main__":
    sys.exit(main())
