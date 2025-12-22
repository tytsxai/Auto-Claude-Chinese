#!/usr/bin/env python3
"""
Check script for multilingual prompt loader.

Usage:
    python scripts/i18n/check-prompt-loader.py
    PROMPT_LANGUAGE=zh-CN python scripts/i18n/check-prompt-loader.py
    PROMPT_LANGUAGE=en python scripts/i18n/check-prompt-loader.py
"""

import os
import sys
from pathlib import Path

repo_root = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(repo_root / "auto-claude"))

from prompts_pkg.prompt_loader import get_prompt_path, get_prompts_dir, load_prompt


def run_checks() -> None:
    """Check the multilingual prompt loader."""
    language = os.environ.get("PROMPT_LANGUAGE", "zh-CN")
    print(f"Testing prompt loader with PROMPT_LANGUAGE={language}")
    print("=" * 70)

    # Test 1: Get prompts directory
    print("\n1. Testing get_prompts_dir():")
    prompts_dir = get_prompts_dir()
    print(f"   Prompts directory: {prompts_dir}")
    print(f"   Exists: {prompts_dir.exists()}")

    # Test 2: Load common prompts
    test_prompts = [
        "planner",
        "coder",
        "qa_reviewer",
        "qa_fixer",
        "followup_planner",
        "spec_gatherer",
        "spec_writer",
    ]

    print("\n2. Testing prompt loading:")
    for prompt_name in test_prompts:
        try:
            prompt_path = get_prompt_path(prompt_name)
            content = load_prompt(prompt_name)
            status = "✓" if content else "✗"
            print(
                f"   {status} {prompt_name:20s} -> {prompt_path.name} ({len(content)} chars)"
            )
        except FileNotFoundError as e:
            print(f"   ✗ {prompt_name:20s} -> NOT FOUND")
            print(f"      Error: {e}")

    # Test 3: Test subdirectory prompts (MCP tools)
    print("\n3. Testing subdirectory prompts (mcp_tools):")
    mcp_prompts = [
        "mcp_tools/electron_validation",
        "mcp_tools/puppeteer_browser",
    ]

    for prompt_name in mcp_prompts:
        try:
            prompt_path = get_prompt_path(prompt_name)
            content = load_prompt(prompt_name)
            status = "✓" if content else "✗"
            print(
                f"   {status} {prompt_name:40s} -> {prompt_path.name} ({len(content)} chars)"
            )
        except FileNotFoundError:
            print(f"   ✗ {prompt_name:40s} -> NOT FOUND")

    # Test 4: Test fallback behavior
    print("\n4. Testing fallback behavior:")
    if language != "en":
        print(f"   Current language: {language}")
        print("   Testing if English fallback works for missing translations...")

        # Try to load a prompt that might not exist in localized version
        try:
            prompt_path = get_prompt_path("planner")
            if "zh-CN" in str(prompt_path):
                print(f"   ✓ Using localized version: {prompt_path}")
            else:
                print(f"   ✓ Falling back to English: {prompt_path}")
        except FileNotFoundError as e:
            print(f"   ✗ Fallback failed: {e}")
    else:
        print("   Skipped (current language is English)")

    print("\n" + "=" * 70)
    print("Check complete!")


if __name__ == "__main__":
    run_checks()
