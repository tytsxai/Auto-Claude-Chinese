/**
 * Theme constants
 * Color themes for multi-theme support with light/dark mode variants
 */

import type { ColorThemeDefinition } from '../types/settings';

// ============================================
// Color Themes
// ============================================

/**
 * All available color themes with preview colors for the theme selector.
 * Each theme has both light and dark mode variants defined in CSS.
 */
export const COLOR_THEMES: ColorThemeDefinition[] = [
  {
    id: 'default',
    name: '默认',
    description: 'Oscura 风格，淡黄色点缀',
    previewColors: { bg: '#F2F2ED', accent: '#E6E7A3', darkBg: '#0B0B0F', darkAccent: '#E6E7A3' }
  },
  {
    id: 'dusk',
    name: '暮色',
    description: '更温暖的变体，暗色模式更轻盈',
    previewColors: { bg: '#F5F5F0', accent: '#E6E7A3', darkBg: '#131419', darkAccent: '#E6E7A3' }
  },
  {
    id: 'lime',
    name: '青柠',
    description: '清新活力的青柠色，紫色点缀',
    previewColors: { bg: '#E8F5A3', accent: '#7C3AED', darkBg: '#0F0F1A' }
  },
  {
    id: 'ocean',
    name: '海洋',
    description: '沉稳专业的蓝色调',
    previewColors: { bg: '#E0F2FE', accent: '#0284C7', darkBg: '#082F49' }
  },
  {
    id: 'retro',
    name: '复古',
    description: '温暖怀旧的琥珀气息',
    previewColors: { bg: '#FEF3C7', accent: '#D97706', darkBg: '#1C1917' }
  },
  {
    id: 'neo',
    name: '霓虹',
    description: '现代赛博粉/洋红风格',
    previewColors: { bg: '#FDF4FF', accent: '#D946EF', darkBg: '#0F0720' }
  },
  {
    id: 'forest',
    name: '森林',
    description: '自然泥土感的绿色调',
    previewColors: { bg: '#DCFCE7', accent: '#16A34A', darkBg: '#052E16' }
  }
];
