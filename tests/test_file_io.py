#!/usr/bin/env python3
"""
Tests for atomic file I/O helpers.
"""

import json

from core.file_io import atomic_write_json, atomic_write_text


def test_atomic_write_text_creates_parent(tmp_path):
    target = tmp_path / "nested" / "file.txt"
    atomic_write_text(target, "hello")
    assert target.read_text(encoding="utf-8") == "hello"


def test_atomic_write_json_round_trip(tmp_path):
    target = tmp_path / "data.json"
    payload = {"name": "auto-claude", "count": 3}
    atomic_write_json(target, payload)
    assert json.loads(target.read_text(encoding="utf-8")) == payload
