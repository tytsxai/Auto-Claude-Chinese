#!/bin/bash
# 应用中文翻译的脚本

set -e
shopt -s nullglob

echo "=== Auto-Claude 中文化 - 应用翻译脚本 ==="
echo ""

# 检查是否在正确的目录
if [ ! -d "auto-claude/prompts" ]; then
    echo "错误: 请在项目根目录运行此脚本"
    exit 1
fi

# 检查中文提示词目录是否存在
if [ ! -d "auto-claude/prompts/zh-CN" ]; then
    echo "错误: 中文提示词目录不存在"
    exit 1
fi

# 统计文件数量
EN_COUNT=$(find auto-claude/prompts -maxdepth 1 -name "*.md" ! -name "_archived_*" | wc -l)
ZH_COUNT=$(find auto-claude/prompts/zh-CN -name "*.md" ! -name "_archived_*" | wc -l)
MCP_EN_COUNT=$(find auto-claude/prompts/mcp_tools -name "*.md" | wc -l)
MCP_ZH_COUNT=$(find auto-claude/prompts/zh-CN/mcp_tools -name "*.md" | wc -l)

echo "英文提示词文件: $EN_COUNT"
echo "中文提示词文件: $ZH_COUNT"
echo "英文 MCP 提示词文件: $MCP_EN_COUNT"
echo "中文 MCP 提示词文件: $MCP_ZH_COUNT"
echo ""

# 检查是否有新的英文文件需要翻译
echo "=== 检查需要翻译的新文件 ==="
for file in auto-claude/prompts/*.md; do
    filename=$(basename "$file")
    if [[ "$filename" == _archived_* ]]; then
        continue
    fi
    zh_file="auto-claude/prompts/zh-CN/$filename"

    if [ ! -f "$zh_file" ]; then
        echo "  ⚠️  缺少中文翻译: $filename"
    fi
done

if [ -d "auto-claude/prompts/mcp_tools" ]; then
    echo ""
    echo "=== 检查 MCP 工具提示词翻译 ==="
    if [ ! -d "auto-claude/prompts/zh-CN/mcp_tools" ]; then
        echo "  ⚠️  缺少中文 MCP 目录: auto-claude/prompts/zh-CN/mcp_tools"
    else
        for file in auto-claude/prompts/mcp_tools/*.md; do
            filename=$(basename "$file")
            zh_file="auto-claude/prompts/zh-CN/mcp_tools/$filename"

            if [ ! -f "$zh_file" ]; then
                echo "  ⚠️  缺少 MCP 工具中文翻译: $filename"
            fi
        done
    fi
fi

echo ""
echo "=== 检查完成 ==="
echo ""
echo "提示:"
echo "  - 如果有缺少的翻译文件，请手动翻译或使用 AI 辅助翻译"
echo "  - 确保 .env 文件中设置了 PROMPT_LANGUAGE=zh-CN"
echo "  - 重启 Auto-Claude 以使用中文提示词"
