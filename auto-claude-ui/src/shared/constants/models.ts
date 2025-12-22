/**
 * 模型与代理配置常量
 * Claude 模型、思考级别、记忆后端和代理配置
 */

import type { AgentProfile, PhaseModelConfig, FeatureModelConfig, FeatureThinkingConfig } from '../types/settings';

// ============================================
// 可用模型
// ============================================

export const AVAILABLE_MODELS = [
  { value: 'opus', label: 'Claude Opus 4.5' },
  { value: 'sonnet', label: 'Claude Sonnet 4.5' },
  { value: 'haiku', label: 'Claude Haiku 4.5' }
] as const;

// 将模型简称映射到实际 Claude 模型 ID
export const MODEL_ID_MAP: Record<string, string> = {
  opus: 'claude-opus-4-5-20251101',
  sonnet: 'claude-sonnet-4-5-20250929',
  haiku: 'claude-haiku-4-5-20251001'
} as const;

// 将思考级别映射到预算 token（null 表示不启用扩展思考）
export const THINKING_BUDGET_MAP: Record<string, number | null> = {
  none: null,
  low: 1024,
  medium: 4096,
  high: 16384,
  ultrathink: 65536
} as const;

// ============================================
// 思考级别
// ============================================

// Claude 模型的思考级别（预算 token 分配）
export const THINKING_LEVELS = [
  { value: 'none', label: '无', description: '不启用扩展思考' },
  { value: 'low', label: '低', description: '简要思考' },
  { value: 'medium', label: '中', description: '适度分析' },
  { value: 'high', label: '高', description: '深度思考' },
  { value: 'ultrathink', label: '超强', description: '最大推理深度' }
] as const;

// ============================================
// 代理配置
// ============================================

// Auto 配置的默认阶段模型设置
// 所有阶段使用 Opus 以获得最高质量
export const DEFAULT_PHASE_MODELS: PhaseModelConfig = {
  spec: 'opus',       // 规范创建的最佳质量
  planning: 'opus',   // 复杂架构决策受益于 Opus
  coding: 'opus',     // 最高质量实现
  qa: 'opus'          // 彻底的 QA 审核
};

// Auto 配置的默认阶段思考设置
export const DEFAULT_PHASE_THINKING: import('../types/settings').PhaseThinkingConfig = {
  spec: 'ultrathink',   // 深度思考以创建全面的规范
  planning: 'high',     // 规划复杂功能所需的高强度思考
  coding: 'low',        // 更快的编码迭代
  qa: 'low'             // 高效 QA 审核
};

// ============================================
// 功能设置（非流水线功能）
// ============================================

// 默认功能模型配置（用于洞察、创意、路线图）
export const DEFAULT_FEATURE_MODELS: FeatureModelConfig = {
  insights: 'sonnet',   // 快速、响应灵敏的对话
  ideation: 'opus',     // 创意生成受益于 Opus
  roadmap: 'opus'       // 战略规划受益于 Opus
};

// 默认功能思考配置
export const DEFAULT_FEATURE_THINKING: FeatureThinkingConfig = {
  insights: 'medium',   // 对话所需的平衡思考
  ideation: 'high',     // 创意想法需要深度思考
  roadmap: 'high'       // 路线图需要战略性思考
};

// UI 展示的功能标签
export const FEATURE_LABELS: Record<keyof FeatureModelConfig, { label: string; description: string }> = {
  insights: { label: '洞察对话', description: '就你的代码库提出问题' },
  ideation: { label: '创意', description: '生成特性想法和改进' },
  roadmap: { label: '路线图', description: '创建战略性功能路线图' }
};

// 预设模型/思考配置的默认代理配置
export const DEFAULT_AGENT_PROFILES: AgentProfile[] = [
  {
    id: 'auto',
    name: 'Auto（优化）',
    description: '各阶段使用 Opus，并优化思考级别',
    model: 'opus',  // 回退/默认模型
    thinkingLevel: 'high',
    icon: 'Sparkles',
    isAutoProfile: true,
    phaseModels: DEFAULT_PHASE_MODELS,
    phaseThinking: DEFAULT_PHASE_THINKING
  },
  {
    id: 'complex',
    name: '复杂任务',
    description: '适用于需要深度分析的多步骤实现',
    model: 'opus',
    thinkingLevel: 'ultrathink',
    icon: 'Brain'
  },
  {
    id: 'balanced',
    name: '均衡',
    description: '多数任务的速度与质量平衡方案',
    model: 'sonnet',
    thinkingLevel: 'medium',
    icon: 'Scale'
  },
  {
    id: 'quick',
    name: '快速修改',
    description: '适合简单改动与快速修复的快速迭代',
    model: 'haiku',
    thinkingLevel: 'low',
    icon: 'Zap'
  }
];

// ============================================
// 记忆后端
// ============================================

export const MEMORY_BACKENDS = [
  { value: 'file', label: '基于文件（默认）' },
  { value: 'graphiti', label: 'Graphiti（FalkorDB）' }
] as const;
