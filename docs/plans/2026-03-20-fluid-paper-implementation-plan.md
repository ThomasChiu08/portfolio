# Fluid Paper Implementation Plan v2

> 综合 Codex 审计 + Codex 计划审查 + Codex 技术可行性 + Gemini 设计扫描 + Gemini 研究报告
> Date: 2026-03-20
> Status: **pending approval**

---

## Design Direction (设计方向)

**Fluid Paper** — 当前暖色学术风格的进化版

- 对标 **Anthropic** 品牌语言：温暖、学术、克制
- **禁止 AI 紫色**，走纸张 + 墨水 + 赤陶橙路线
- 动效丝滑但不炫技：GSAP + ScrollTrigger + 轻量 WebGL
- **iPhone 系列为第一优先级**

### 色彩方案（Anthropic Route）

| Token | 值 | 用途 |
|-------|-----|------|
| `--bg-paper` | `#FAF9F5` | 主背景（Anthropic 米白） |
| `--bg-warm` | `#f4eee4` | 暖调渐变辅色（保留现有） |
| `--text-ink` | `#141413` | 主文本（炭黑） |
| `--text-ink-muted` | `#827F76` | 次要文本 |
| `--accent-clay` | `#D97757` | 赤陶橙点缀（替代现有冷蓝灰） |
| `--accent-clay-soft` | `rgba(217, 119, 87, 0.14)` | 橙色柔和底色 |
| `--line` | `#E8E6DC` | 分割线 |
| `--glass-surface` | `rgba(250, 249, 245, 0.65)` | 毛玻璃（纸上玻璃感） |

---

## Phase 0: Safety Net + Dead Code (安全网 + 清理) — 2-3 sessions

> **Codex Bug Fix**: 先补测试再做删除/拆分，不能反过来

### 0.1 文件分类 (Triage)
- [ ] 分类所有 39 个未追踪文件：commit / ignore / defer
- [ ] 分类 12 个已修改文件：确认变更意图
- [ ] `.ccb/` 加入 `.gitignore`
- [ ] 决定 `CLAUDE.md` 是否 track（建议 track）

### 0.2 安全网 (Tests First)
- [ ] `src/main.js` — bootstrap 冒烟测试
- [ ] `src/experience/bootstrapExperience.js` — fallback 路径测试
- [ ] `src/experience/loadExperienceModules.js` — dynamic import mock 测试
- [ ] `src/utils/math.js` — 单元测试（高复用模块）
- [ ] 将 `npm run build` 加入验证清单

### 0.3 死代码清理
- [ ] 删除 `src/scene/` 整个目录（7 files, **1,624 行**）
- [ ] 删除 `src/animations/scrollTimeline.js`
- [ ] 从 `package.json` 移除 `three` 依赖
- [ ] 更新 `vite.config.js` 移除 Three.js chunk 配置
- [ ] 更新 `CLAUDE.md` 移除 scene 相关文档
- [ ] 运行 `npm test` + `npm run build` 验证
- [ ] `npm install` 刷新 lock file

### 0.4 大文件拆分
- [ ] `src/content/sections.js` (562行) → `siteContent.js` + `renderers/hero.js` + `renderers/sections.js` + `renderPage.js`（保留 sections.js 作为兼容 barrel）
- [ ] `src/experience/createHeroProjectController.js` (332行) → 提取 input bindings + navigation helpers
- [ ] 更新所有 import 和测试

### 0.5 文档整理
- [ ] 给每个 `docs/plans/` 文件加 status frontmatter（current/draft/superseded/archived）
- [ ] 创建 `docs/plans/README.md` 索引
- [ ] 分批 commit

---

## Phase 1: iPhone Hardening + Design Tokens (iPhone 加固 + 设计代币) — 1-2 sessions

> **Codex 关键发现**: iPhone 最大瓶颈是 backdrop-filter blur 叠加，不是 GSAP

### 1.1 iPhone 紧急加固
- [ ] `index.html` 加 `viewport-fit=cover`
- [ ] 添加 `env(safe-area-inset-*)` padding（masthead + 底部）
- [ ] **移动端 blur 降级**：phone 设备降低 blur radius，减少叠加 glass 层数，改用 flatter fills
- [ ] 添加 `touch-action: manipulation` 到可点击控件
- [ ] 添加 `touch-action: pan-x` 到移动端 Rail
- [ ] 可选：frame-time 监控，帧率持续下降时自动降低 canvas 粒子数

### 1.2 完善 Design Token 系统
- [ ] **色彩 tokens** — 替换为 Fluid Paper 色板（见上表）
- [ ] **间距 tokens** — `--space-xs` (4px) ~ `--space-3xl` (64px)
- [ ] **排版 tokens** — `--text-xs` ~ `--text-4xl`，使用 `clamp()` 流式排版
- [ ] **阴影/深度 tokens** — `--shadow-sm` ~ `--shadow-2xl` + `--backdrop-blur-sm/md/lg`（Gemini 指出遗漏）
- [ ] **Z-Index tokens** — `--z-base`, `--z-overlay`, `--z-modal`（Gemini 指出遗漏）
- [ ] **透明度 tokens** — `--opacity-glass-light/medium/heavy`（Gemini 指出遗漏）
- [ ] **动效 tokens** — `--duration-fast/normal/slow`, `--ease-out-expo`
- [ ] 验证现有组件全部迁移到新 tokens

### 1.3 可访问性修复
- [ ] 审查所有文本/背景对比度（WCAG AA 4.5:1）
- [ ] 修复半透明文字对比度不足
- [ ] 验证 keyboard navigation 完整性
- [ ] 添加 `font-variant-numeric: tabular-nums`（Gemini 排版建议）
- [ ] 考虑 `text-wrap: balance` 提升标题呼吸感

---

## Phase 2: Motion Upgrade (动效升级) — 2-3 sessions

> **Codex 推荐**: Flip 优先，SplitText 其次，DrawSVG 暂不需要

### 2.1 GSAP Flip 集成（高优先）
- [ ] 安装 GSAP Flip 插件
- [ ] Hero 项目卡片切换用 Flip 做平滑过渡（利用现有 idle→candidate→committed 状态机）
- [ ] "Open Memo" 点击 → Flip 扩展动画（Seamless Context Dive）
- [ ] 桌面端 only，移动端保持简单过渡

### 2.2 Lenis 平滑滚动
- [ ] 引入 Lenis 作为滚动基础层
- [ ] 配合现有 ScrollTrigger reveals
- [ ] 移动端：保持原生滚动（不劫持）

### 2.3 SplitText 文字动画（选择性）
- [ ] 仅用于 Hero 标题 + 1-2 个 section heading
- [ ] 使用 `words` 或 `lines` 模式（不用 `chars`）
- [ ] 墨水浸染风格揭示（clip-path reveal）
- [ ] 移动端 / reduced-motion 关闭

### 2.4 磁性微交互
- [ ] Hero 按钮和导航菜单项的磁性吸附效果
- [ ] 触发范围 ~20px，带弹簧阻尼回弹
- [ ] 移动端替代为 CSS `scale(0.96)` 触控反馈

### 2.5 移动端 Bottom Sheet
- [ ] 替换现有横向 Rail 滚动
- [ ] iOS 风格的底部抽屉，手指上滑展开 Project Deck
- [ ] 点击项目后抽屉收回 + 主视口切换
- [ ] 使用 GSAP 或 CSS spring 动画

---

## Phase 3: WebGL Pilot (WebGL 试点) — 1-2 sessions

> **Codex 推荐**: OGL + 自定义 fragment shader，lazy-loaded，hero 范围

### 3.1 OGL 集成架构
- [ ] 新建 `src/webgl/createHeroShaderLayer.js`
- [ ] 通过 `loadExperienceModules.js` 懒加载
- [ ] 生命周期由 `createExperienceRuntime()` 管理
- [ ] 清理注册到 `createCleanupQueue()`
- [ ] **仅桌面端加载**，移动端降级为静态渐变/噪点

### 3.2 Hero 流体效果
- [ ] 一个全屏或 hero 尺寸的 quad + fragment shader
- [ ] Uniforms: time, pointer position, scroll progress
- [ ] 效果：纸张下的轻微水波纹折射（墨水扩散感）
- [ ] 与现有 Canvas 2D 背景共存（Option A: hero-local）

### 3.3 图片悬停扭曲（可选）
- [ ] 悬停 Project 卡片时的液态扭曲 displacement
- [ ] 桌面端 only

---

## Phase 4: Dark Mode (暗黑模式) — 2-3 sessions

> **Gemini 风险警告**: Glassmorphism 在深色下会「糊成一团」，需要专门的边框光带策略
> **Codex 提醒**: 这是产品方向决策，需 Thomas 确认

### 4.1 Dark Palette 设计
- [ ] 基色：`#141413`（Anthropic 深色）
- [ ] Glass 策略：极细亮边 `1px solid rgba(255,255,255,0.15)` + 内阴影
- [ ] Canvas 背景：新色板 + 可能调整 `mix-blend-mode`
- [ ] 噪点纹理透明度拉高

### 4.2 CSS Variable 切换机制
- [ ] `prefers-color-scheme` 自动检测
- [ ] 手动切换 toggle
- [ ] 所有组件逐一适配验证

### 4.3 Canvas Dark Mode 适配
- [ ] `backgroundConfig` 注入 dark palette
- [ ] 粒子/连线色彩重新标定
- [ ] 高光衰减逻辑调整

---

## Verification Protocol (验证协议)

每个 Phase 完成后必须通过：

- [ ] `npm test` — 全部通过
- [ ] `npm run build` — 零错误，检查 bundle size
- [ ] iPhone Safari 真机/模拟器检查（blur 性能、safe-area、触控响应）
- [ ] Desktop Chrome/Safari 视觉验证
- [ ] Lighthouse Performance 评分 ≥ 90
- [ ] WCAG AA 对比度检查

---

## Decision Log (决策记录)

| 决策 | 理由 | 来源 |
|------|------|------|
| WebGL 用 OGL 不用 Three.js | 轻量、tree-shakable、与现有架构兼容 | Codex 技术评估 |
| GSAP 优先加 Flip | 与现有状态机完美契合，ROI 最高 | Codex 技术评估 |
| DrawSVG 暂不引入 | 当前无 SVG 设计元素 | Codex 技术评估 |
| iPhone blur 降级为 P1 | 是当前最大移动端瓶颈 | Codex 技术评估 |
| 色彩走 Anthropic 路线 | Thomas 指令：减少 AI 感，对标 Anthropic | Thomas + Gemini 研究 |
| 先补测试再做删除/拆分 | Phase 顺序 bug 修复 | Codex 计划审查 |
| scene/ 清理同步清 package.json | 隐藏依赖链 | Codex 计划审查 |
| sections.js 拆分保留 barrel | 低风险渐进迁移 | Codex 计划审查 |
| 移动端不做 pin/scrub | iPhone Safari 高风险 | Codex 技术评估 |
| Dark Mode 移至 Phase 4 | 产品方向决策，需确认 | Codex 计划审查 |

---

## Risk Register (风险登记)

| 风险 | 等级 | 缓解 |
|------|------|------|
| Phase 0 拆分引入回归 | 中 | 0.2 先补测试，每步 test + build |
| iPhone blur 性能 | **高** | Phase 1.1 优先降级 |
| Dark Mode Glassmorphism 失效 | **高** | 专门的边框光带 + 内阴影策略 |
| OGL 引入增加复杂度 | 中 | 限制在 hero 范围，desktop only |
| Lenis 与 ScrollTrigger 冲突 | 中 | 遵循 GSAP 官方集成指南 |
| SplitText 在响应式下断行 | 低 | 使用 autoSplit + onSplit() |

---

## Timeline Estimate (时间估算)

| Phase | 内容 | Sessions |
|-------|------|----------|
| 0 | Safety Net + Dead Code | 2-3 |
| 1 | iPhone Hardening + Design Tokens | 1-2 |
| 2 | Motion Upgrade | 2-3 |
| 3 | WebGL Pilot | 1-2 |
| 4 | Dark Mode | 2-3 |
| **Total** | | **8-13 sessions** |

---

*Intelligence sources: Codex Audit, Codex Plan Review, Codex Tech Feasibility, Gemini Design Scan, Gemini Fluid Paper Research*
