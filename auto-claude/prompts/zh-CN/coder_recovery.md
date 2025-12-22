# 编码器恢复意识补充

## 添加到步骤 1（第 37 行）：

```bash
# 10. 检查尝试历史（恢复上下文）
echo -e "\n=== 恢复上下文 ==="
if [ -f memory/attempt_history.json ]; then
  echo "尝试历史（用于重试意识）："
  cat memory/attempt_history.json

  # 如果有，显示卡住的子任务
  stuck_count=$(cat memory/attempt_history.json | jq '.stuck_subtasks | length' 2>/dev/null || echo 0)
  if [ "$stuck_count" -gt 0 ]; then
    echo -e "\n⚠️  警告：一些子任务卡住了，需要不同的方法！"
    cat memory/attempt_history.json | jq '.stuck_subtasks'
  fi
else
  echo "还没有尝试历史（所有子任务都是首次尝试）"
fi
echo "=== 恢复上下文结束 ==="
```

## 添加到步骤 5（在 5.1 之前）：

### 5.0：检查此子任务的恢复历史（关键 - 首先执行此操作）

```bash
# 检查此子任务是否之前尝试过
SUBTASK_ID="your-subtask-id"  # 替换为 implementation_plan.json 中的实际子任务 ID

echo "=== 检查 $SUBTASK_ID 的尝试历史 ==="

if [ -f memory/attempt_history.json ]; then
  # 检查此子任务是否有尝试
  subtask_data=$(cat memory/attempt_history.json | jq ".subtasks[\"$SUBTASK_ID\"]" 2>/dev/null)

  if [ "$subtask_data" != "null" ]; then
    echo "⚠️⚠️⚠️ 此子任务之前已尝试过！⚠️⚠️⚠️"
    echo ""
    echo "以前的尝试："
    cat memory/attempt_history.json | jq ".subtasks[\"$SUBTASK_ID\"].attempts[]"
    echo ""
    echo "关键要求：你必须尝试不同的方法！"
    echo "查看上面尝试的内容并明确选择不同的策略。"
    echo ""

    # 显示计数
    attempt_count=$(cat memory/attempt_history.json | jq ".subtasks[\"$SUBTASK_ID\"].attempts | length" 2>/dev/null || echo 0)
    echo "这是第 #$((attempt_count + 1)) 次尝试"

    if [ "$attempt_count" -ge 2 ]; then
      echo ""
      echo "⚠️  高风险：已经多次尝试。考虑："
      echo "  - 使用完全不同的库或模式"
      echo "  - 简化方法"
      echo "  - 检查需求是否可行"
    fi
  else
    echo "✓ 首次尝试此子任务 - 不需要恢复上下文"
  fi
else
  echo "✓ 没有尝试历史文件 - 这是一个全新的开始"
fi

echo "=== 尝试历史检查结束 ==="
echo ""
```

**这意味着什么：**
- 如果你看到以前的尝试，你正在重试此子任务
- 以前的尝试因某种原因失败了
- 你必须阅读尝试的内容并明确选择不同的东西
- 重复相同的方法将触发循环修复检测

## 添加到步骤 6（标记为 in_progress 后）：

### 记录你的方法（恢复跟踪）

**重要：在编写任何代码之前，记录你的方法。**

```python
# 记录你的实现方法以进行恢复跟踪
import json
from pathlib import Path
from datetime import datetime

subtask_id = "your-subtask-id"  # 你当前的子任务 ID
approach_description = """
在此处用 2-3 句话描述你的方法：
- 你使用什么模式/库？
- 你修改什么文件？
- 你的核心策略是什么？

示例："使用 auth.py 中的 async/await 模式。将修改 user_routes.py
以添加头像上传端点，使用与 document_upload.py 相同的文件处理模式。
将使用 boto3 库存储在 S3 中。"
"""

# 这将用于检测循环修复
approach_file = Path("memory/current_approach.txt")
approach_file.parent.mkdir(parents=True, exist_ok=True)

with open(approach_file, "a") as f:
    f.write(f"\n--- {subtask_id} at {datetime.now().isoformat()} ---\n")
    f.write(approach_description.strip())
    f.write("\n")

print(f"为 {subtask_id} 记录的方法")
```

**为什么这很重要：**
- 如果你的尝试失败，恢复系统将读取此内容
- 它有助于检测下一次尝试是否尝试相同的事情（循环修复）
- 它创建了尝试内容的记录供人工审查

## 添加到步骤 7（验证部分之后）：

### 如果验证失败 - 恢复过程

```python
# 如果验证失败，记录尝试
import json
from pathlib import Path
from datetime import datetime

subtask_id = "your-subtask-id"
approach = "你尝试的内容"  # 来自你的 approach.txt
error_message = "出了什么问题"  # 实际错误

# 加载或创建尝试历史
history_file = Path("memory/attempt_history.json")
if history_file.exists():
    with open(history_file) as f:
        history = json.load(f)
else:
    history = {"subtasks": {}, "stuck_subtasks": [], "metadata": {}}

# 如果需要，初始化子任务
if subtask_id not in history["subtasks"]:
    history["subtasks"][subtask_id] = {"attempts": [], "status": "pending"}

# 从 build-progress.txt 获取当前会话编号
session_num = 1  # 你可以从 build-progress.txt 提取

# 记录失败的尝试
attempt = {
    "session": session_num,
    "timestamp": datetime.now().isoformat(),
    "approach": approach,
    "success": False,
    "error": error_message
}

history["subtasks"][subtask_id]["attempts"].append(attempt)
history["subtasks"][subtask_id]["status"] = "failed"
history["metadata"]["last_updated"] = datetime.now().isoformat()

# 保存
with open(history_file, "w") as f:
    json.dump(history, f, indent=2)

print(f"为 {subtask_id} 记录的失败尝试")

# 检查我们是否应该标记为卡住
attempt_count = len(history["subtasks"][subtask_id]["attempts"])
if attempt_count >= 3:
    print(f"\n⚠️  警告：{attempt_count} 次尝试失败。")
    print("如果找不到不同的方法，考虑标记为卡住。")
```

## 在步骤 9 和 10 之间添加新步骤：

## 步骤 9B：记录成功尝试（如果验证通过）

```python
# 在尝试历史中记录成功完成
import json
from pathlib import Path
from datetime import datetime

subtask_id = "your-subtask-id"
approach = "你尝试的内容"  # 来自你的 approach.txt

# 加载尝试历史
history_file = Path("memory/attempt_history.json")
if history_file.exists():
    with open(history_file) as f:
        history = json.load(f)
else:
    history = {"subtasks": {}, "stuck_subtasks": [], "metadata": {}}

# 如果需要，初始化子任务
if subtask_id not in history["subtasks"]:
    history["subtasks"][subtask_id] = {"attempts": [], "status": "pending"}

# 获取会话编号
session_num = 1  # 从 build-progress.txt 或会话计数提取

# 记录成功尝试
attempt = {
    "session": session_num,
    "timestamp": datetime.now().isoformat(),
    "approach": approach,
    "success": True,
    "error": None
}

history["subtasks"][subtask_id]["attempts"].append(attempt)
history["subtasks"][subtask_id]["status"] = "completed"
history["metadata"]["last_updated"] = datetime.now().isoformat()

# 保存
with open(history_file, "w") as f:
    json.dump(history, f, indent=2)

# 同时记录为良好提交
commit_hash = "$(git rev-parse HEAD)"  # 获取当前提交

commits_file = Path("memory/build_commits.json")
if commits_file.exists():
    with open(commits_file) as f:
        commits = json.load(f)
else:
    commits = {"commits": [], "last_good_commit": None, "metadata": {}}

commits["commits"].append({
    "hash": commit_hash,
    "subtask_id": subtask_id,
    "timestamp": datetime.now().isoformat()
})
commits["last_good_commit"] = commit_hash
commits["metadata"]["last_updated"] = datetime.now().isoformat()

with open(commits_file, "w") as f:
    json.dump(commits, f, indent=2)

print(f"✓ 在提交 {commit_hash[:8]} 为 {subtask_id} 记录的成功")
```

## 要添加的关键恢复原则：

### 恢复循环

```
1. 开始子任务
2. 检查此子任务的 attempt_history.json
3. 如果存在以前的尝试：
   a. 阅读尝试的内容
   b. 阅读失败的内容
   c. 选择不同的方法
4. 记录你的方法
5. 实现
6. 验证
7. 如果成功：记录尝试，记录良好提交，标记完成
8. 如果失败：记录带有错误的尝试，检查是否卡住（3+ 次尝试）
```

### 何时标记为卡住

如果满足以下条件，子任务应标记为卡住：
- 3+ 次使用不同方法的尝试都失败了
- 检测到循环修复（多次尝试相同的方法）
- 需求似乎不可行
- 外部阻塞（缺少依赖项等）

```python
# 将子任务标记为卡住
subtask_id = "your-subtask-id"
reason = "为什么卡住"

history_file = Path("memory/attempt_history.json")
with open(history_file) as f:
    history = json.load(f)

stuck_entry = {
    "subtask_id": subtask_id,
    "reason": reason,
    "escalated_at": datetime.now().isoformat(),
    "attempt_count": len(history["subtasks"][subtask_id]["attempts"])
}

history["stuck_subtasks"].append(stuck_entry)
history["subtasks"][subtask_id]["status"] = "stuck"

with open(history_file, "w") as f:
    json.dump(history, f, indent=2)

# 同时将 implementation_plan.json 状态更新为"blocked"
```
