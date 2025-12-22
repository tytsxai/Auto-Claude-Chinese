## WEB 浏览器验证

对于 Web 前端应用程序，使用 Puppeteer MCP 工具进行浏览器自动化和验证。

### 可用工具

| 工具 | 用途 |
|------|---------|
| `mcp__puppeteer__puppeteer_connect_active_tab` | 连接到浏览器标签页 |
| `mcp__puppeteer__puppeteer_navigate` | 导航到 URL |
| `mcp__puppeteer__puppeteer_screenshot` | 截取屏幕截图 |
| `mcp__puppeteer__puppeteer_click` | 点击元素 |
| `mcp__puppeteer__puppeteer_fill` | 填充输入字段 |
| `mcp__puppeteer__puppeteer_select` | 选择下拉选项 |
| `mcp__puppeteer__puppeteer_hover` | 悬停在元素上 |
| `mcp__puppeteer__puppeteer_evaluate` | 执行 JavaScript |

### 验证流程

#### 步骤 1：导航到页面

```
Tool: mcp__puppeteer__puppeteer_navigate
Args: {"url": "http://localhost:3000"}
```

导航到开发服务器 URL。

#### 步骤 2：截取屏幕截图

```
Tool: mcp__puppeteer__puppeteer_screenshot
Args: {"name": "page-initial-state"}
```

捕获初始页面状态以进行视觉验证。

#### 步骤 3：验证元素存在

```
Tool: mcp__puppeteer__puppeteer_evaluate
Args: {"script": "document.querySelector('[data-testid=\"feature\"]') !== null"}
```

检查预期元素是否存在于页面上。

#### 步骤 4：测试交互

**点击按钮/链接：**
```
Tool: mcp__puppeteer__puppeteer_click
Args: {"selector": "[data-testid=\"submit-button\"]"}
```

**填充表单字段：**
```
Tool: mcp__puppeteer__puppeteer_fill
Args: {"selector": "input[name=\"email\"]", "value": "test@example.com"}
```

**选择下拉选项：**
```
Tool: mcp__puppeteer__puppeteer_select
Args: {"selector": "select[name=\"country\"]", "value": "US"}
```

#### 步骤 5：检查控制台错误

```
Tool: mcp__puppeteer__puppeteer_evaluate
Args: {"script": "window.__consoleErrors || []"}
```

或在测试前设置错误捕获：
```
Tool: mcp__puppeteer__puppeteer_evaluate
Args: {
  "script": "window.__consoleErrors = []; const origError = console.error; console.error = (...args) => { window.__consoleErrors.push(args); origError.apply(console, args); };"
}
```

### 记录发现

```
浏览器验证：
- [页面/组件]：通过/失败
  - 控制台错误：[列表或"无"]
  - 视觉检查：通过/失败
  - 交互：通过/失败
```

### 常见选择器

测试 UI 元素时，优先使用这些选择器策略：
1. `[data-testid="..."]` - 最可靠（如果可用）
2. `#id` - 元素 ID
3. `button:contains("Text")` - 按可见文本
4. `.class-name` - CSS 类
5. `input[name="..."]` - 按名称的表单字段
