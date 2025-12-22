#!/usr/bin/env python3
"""
Tests for multilingual prompt loader utilities.
"""

import sys
from pathlib import Path

import pytest

# Add auto-claude directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent / "auto-claude"))

from prompts_pkg.prompt_loader import get_prompt_path, get_prompts_dir, load_prompt


def _write_prompt(base_dir: Path, relative_path: str, content: str) -> Path:
    prompt_path = base_dir / "prompts" / relative_path
    prompt_path.parent.mkdir(parents=True, exist_ok=True)
    prompt_path.write_text(content, encoding="utf-8")
    return prompt_path


def test_get_prompt_path_prefers_localized(tmp_path: Path, monkeypatch):
    _write_prompt(tmp_path, "planner.md", "EN")
    localized = _write_prompt(tmp_path, "zh-CN/planner.md", "ZH")
    monkeypatch.setenv("PROMPT_LANGUAGE", "zh-CN")

    resolved = get_prompt_path("planner", base_dir=tmp_path)

    assert resolved == localized


def test_get_prompt_path_falls_back_to_english(tmp_path: Path, monkeypatch):
    english = _write_prompt(tmp_path, "planner.md", "EN")
    monkeypatch.setenv("PROMPT_LANGUAGE", "zh-CN")

    resolved = get_prompt_path("planner", base_dir=tmp_path)

    assert resolved == english


def test_get_prompt_path_raises_when_missing(tmp_path: Path, monkeypatch):
    monkeypatch.setenv("PROMPT_LANGUAGE", "zh-CN")

    with pytest.raises(FileNotFoundError):
        get_prompt_path("planner", base_dir=tmp_path)


def test_load_prompt_reads_localized_content(tmp_path: Path, monkeypatch):
    _write_prompt(tmp_path, "zh-CN/planner.md", "ZH")
    monkeypatch.setenv("PROMPT_LANGUAGE", "zh-CN")

    content = load_prompt("planner", base_dir=tmp_path)

    assert content == "ZH"


def test_get_prompts_dir_returns_localized(tmp_path: Path, monkeypatch):
    _write_prompt(tmp_path, "planner.md", "EN")
    localized_dir = tmp_path / "prompts" / "zh-CN"
    localized_dir.mkdir(parents=True, exist_ok=True)
    monkeypatch.setenv("PROMPT_LANGUAGE", "zh-CN")

    resolved = get_prompts_dir(base_dir=tmp_path)

    assert resolved == localized_dir
