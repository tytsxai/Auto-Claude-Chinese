## ELECTRON 应用验证

对于 Electron/桌面应用程序，使用 electron-mcp-server 工具验证 UI。

**先决条件：**
- 环境中设置 `ELECTRON_MCP_ENABLED=true`
- Electron 应用使用 `--remote-debugging-port=9222` 运行
- 启动命令：`pnpm run dev:mcp` 或 `pnpm run start:mcp`

### 可用工具

| 工具 | 用途 |
|------|---------|
| `mcp__electron__get_electron_window_info` | 获取正在运行的 Electron 窗口信息 |
| `mcp__electron__take_screenshot` | 捕获 Electron 窗口的屏幕截图 |
| `mcp__electron__send_command_to_electron` | 发送命令（点击、填充、执行 JS） |
| `mcp__electron__read_electron_logs` | 从 Electron 应用读取控制台日志 |

### 验证流程

#### 步骤 1：连接到 Electron 应用

```
Tool: mcp__electron__get_electron_window_info
```

验证应用正在运行并获取窗口信息。如果未找到应用，记录跳过了 Electron 验证。

#### 步骤 2：捕获屏幕截图

```
Tool: mcp__electron__take_screenshot
```

截取屏幕截图以直观验证应用程序的当前状态。

#### 步骤 3：分析页面结构

```
Tool: mcp__electron__send_command_to_electron
Command: get_page_structure
```

获取所有交互元素（按钮、输入、选择、链接）的组织概览。

#### 步骤 4：验证 UI 元素

使用 `send_command_to_electron` 与特定命令：

**按文本点击元素：**
```
Command: click_by_text
Args: {"text": "Button Text"}
```

**按选择器点击元素：**
```
Command: click_by_selector
Args: {"selector": "button.submit-btn"}
```

**填充输入字段：**
```
Command: fill_input
Args: {"selector": "#email", "value": "test@example.com"}
# 或按占位符：
Args: {"placeholder": "Enter email", "value": "test@example.com"}
```

**发送键盘快捷键：**
```
Command: send_keyboard_shortcut
Args: {"text": "Enter"}
# 或：{"text": "Ctrl+N"}、{"text": "Meta+N"}、{"text": "Escape"}
```

**执行 JavaScript：**
```
Command: eval
Args: {"code": "document.title"}
```

#### 步骤 5：检查控制台日志

```
Tool: mcp__electron__read_electron_logs
Args: {"logType": "console", "lines": 50}
```

检查 JavaScript 错误、警告或失败的操作。

### 记录发现

```
ELECTRON 验证：
- 应用连接：通过/失败
  - 调试端口可访问：是/否
  - 连接到正确的窗口：是/否
- UI 验证：通过/失败
  - 捕获的屏幕截图：[列表]
  - 视觉元素正确：通过/失败
  - 交互工作：通过/失败
- 控制台错误：[列表或"无"]
- Electron 特定功能：通过/失败
  - [功能]：通过/失败
- 问题：[列表或"无"]
```

### 处理常见问题

**应用未运行：**
如果 Electron 应用未运行或调试端口不可访问：
1. 记录跳过了 Electron 验证
2. 注明原因："应用未使用 --remote-debugging-port=9222 运行"
3. 在 QA 报告中添加为"需要手动验证"

**无头环境（CI/CD）：**
如果在没有显示的无头环境中运行：
1. 跳过交互式 Electron 验证
2. 记录："Electron UI 验证已跳过 - 无头环境"
3. 依赖单元/集成测试进行验证
