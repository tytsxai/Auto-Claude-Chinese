/**
 * 变更日志相关常量
 * 格式选项、受众类型和生成配置
 */

// ============================================
// 变更日志格式
// ============================================

export const CHANGELOG_FORMAT_LABELS: Record<string, string> = {
  'keep-a-changelog': 'Keep a Changelog 格式',
  'simple-list': '简单列表',
  'github-release': 'GitHub 发布'
};

export const CHANGELOG_FORMAT_DESCRIPTIONS: Record<string, string> = {
  'keep-a-changelog': '包含 Added/Changed/Fixed/Removed 等结构化章节',
  'simple-list': '按分类组织的简洁列表',
  'github-release': 'GitHub 风格的发布说明'
};

// ============================================
// 变更日志受众
// ============================================

export const CHANGELOG_AUDIENCE_LABELS: Record<string, string> = {
  'technical': '技术向',
  'user-facing': '面向用户',
  'marketing': '营销'
};

export const CHANGELOG_AUDIENCE_DESCRIPTIONS: Record<string, string> = {
  'technical': '面向开发者的详细技术变更',
  'user-facing': '面向用户的清晰非技术说明',
  'marketing': '强调价值与收益的营销文案'
};

// ============================================
// 变更日志表情等级
// ============================================

export const CHANGELOG_EMOJI_LEVEL_LABELS: Record<string, string> = {
  'none': '无',
  'little': '仅标题',
  'medium': '标题+重点',
  'high': '全部'
};

export const CHANGELOG_EMOJI_LEVEL_DESCRIPTIONS: Record<string, string> = {
  'none': '不使用表情',
  'little': '仅章节标题使用表情',
  'medium': '标题与重点条目使用表情',
  'high': '标题与每一行都使用表情'
};

// ============================================
// 变更日志来源模式
// ============================================

export const CHANGELOG_SOURCE_MODE_LABELS: Record<string, string> = {
  'tasks': '已完成任务',
  'git-history': 'Git 历史',
  'branch-diff': '分支对比'
};

export const CHANGELOG_SOURCE_MODE_DESCRIPTIONS: Record<string, string> = {
  'tasks': '从已完成的规范任务生成',
  'git-history': '从近期提交或标签范围生成',
  'branch-diff': '从两个分支之间的提交生成'
};

// ============================================
// Git 历史类型
// ============================================

export const GIT_HISTORY_TYPE_LABELS: Record<string, string> = {
  'recent': '最近提交',
  'since-date': '自某日期起',
  'tag-range': '标签之间'
};

export const GIT_HISTORY_TYPE_DESCRIPTIONS: Record<string, string> = {
  'recent': '从 HEAD 往前 N 个提交',
  'since-date': '自指定日期以来的所有提交',
  'tag-range': '两个标签之间的提交'
};

// ============================================
// 变更日志生成阶段
// ============================================

export const CHANGELOG_STAGE_LABELS: Record<string, string> = {
  'loading_specs': '正在加载规范文件...',
  'loading_commits': '正在加载提交...',
  'generating': '正在生成变更日志...',
  'formatting': '正在格式化输出...',
  'complete': '完成',
  'error': '错误'
};

// ============================================
// 默认配置
// ============================================

// 默认变更日志文件路径
export const DEFAULT_CHANGELOG_PATH = 'CHANGELOG.md';
