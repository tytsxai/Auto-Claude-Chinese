"""
Safe file I/O helpers.

Provides atomic writes for JSON and text to avoid partial/corrupted files on
crash or concurrent reads.
"""

from __future__ import annotations

import json
import os
import tempfile
from pathlib import Path
from typing import Any


def atomic_write_text(path: Path, content: str, encoding: str = "utf-8") -> None:
    """Write text atomically by writing to a temp file then renaming."""
    target = Path(path)
    target.parent.mkdir(parents=True, exist_ok=True)

    fd, tmp_path = tempfile.mkstemp(
        dir=target.parent, prefix=f".{target.name}.", suffix=".tmp"
    )
    try:
        with os.fdopen(fd, "w", encoding=encoding) as handle:
            handle.write(content)
        os.replace(tmp_path, target)
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)


def atomic_write_json(
    path: Path,
    data: Any,
    *,
    indent: int = 2,
    ensure_ascii: bool = True,
) -> None:
    """Write JSON atomically with consistent formatting."""
    payload = json.dumps(data, indent=indent, ensure_ascii=ensure_ascii)
    atomic_write_text(path, payload)
