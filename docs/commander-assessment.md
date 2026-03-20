# Commander Assessment & Implementation Plan

> 综合 Codex 审计 + Gemini 设计扫描 + Claude 独立验证
> Date: 2026-03-20

---

## Part 1: Intelligence Review (情报审核)

### Codex 审计报告 — 审核结论

**可信度：高**。Codex 实际跑了 `npm test`（14 files, 35 tests pass），并通过 import graph 分析验证了依赖关系。报告基于事实，不是猜测。

**关键确认：**
- `src/scene/` 整个 Three.js 子系统已死 — 零入站 import，可安全移除
- `src/animations/scrollTimeline.js` 同样孤立，未被引用
- 项目处于大重构中途：36 个未追踪文件 + 12 个已修改文件
- 测试覆盖 helper/model 层良好，但启动链和视觉系统几乎裸奔

**我的补充判断：**
- `sections.js` 562 行确实过胖，混合了数据 + 模板 + 组合逻辑
- `createHeroProjectController.js` 332 行是当前最复杂的交互模块
- 建议在做任何新功能前，先完成「代码卫生」阶段

---

### Gemini 设计扫描 — 审核结论

**可信度：中高**。Gemini 准确识别了设计语言（暖学术感 + Glassmorphism + Signal Field），技术评估基本正确。

**同意的部分：**
- 色彩系统分析准确（#f4eee4 暖米色基调 + #617489 冷蓝灰点缀）
- 字体策略 Serif + Sans + Mono 混搭的判断正确
- 响应式断点评价合理（760/1080/1180 三档）
- CleanupQueue + GSAP context revert 的架构评价准确

**需要修正的部分：**
- Gemini 建议 "引入 Three.js 做 3D 点云" — **否决**。Codex 审计已证实 Three.js 场景系统被废弃是有意为之，当前 Canvas 2D 方案性能更可控
- Gemini 建议 "引入 Barba.js 做页面转场" — **暂缓**。当前是 SPA 单页，引入路由系统是架构级变更，不属于当前阶段
- "可访问性对比度不足" — **有效建议**，需要验证并修复

**关键洞察（来自 Gemini，我认同）：**
1. Design tokens 已具雏形但未完全系统化（缺少 spacing/typography tokens）
2. Dark mode 是高价值方向，与项目 "agentOS / 量化" 主题高度契合
3. 当前在 "感官体验深度" 上还有提升空间

---

### Gemini UI Brainstorm — 待收

状态：执行中。收到后将补充审核。

---

## Part 2: Current State Assessment (现状评估)

### 项目健康度

| 维度 | 评分 | 说明 |
|------|------|------|
| 架构清晰度 | 8/10 | Boot sequence 清晰，Model/View 分离好，CleanupQueue 优秀 |
| 代码卫生 | 5/10 | 大量未提交代码，死代码未清理，大文件需拆分 |
| 测试覆盖 | 6/10 | Helper 层好，但启动链/视觉系统/动画无直接测试 |
| 设计系统 | 7/10 | CSS variables 完善，但缺 spacing tokens 和 dark mode |
| 视觉完成度 | 7/10 | Hero Deck 精致，背景系统出色，但内容区域偏素 |
| 移动端 | 6/10 | 有降级策略但体验不够精致 |
| 性能 | 8/10 | Canvas 帧率控制、智能休眠、HMR 清理都到位 |

### 技术债务清单

| 优先级 | 事项 | 影响 |
|--------|------|------|
| P0 | 提交当前所有未追踪文件 | 协作基础 |
| P0 | 移除 `src/scene/` 死代码 | 减少 7 个文件 ~500+ 行 |
| P1 | 拆分 `sections.js` (562 行) | 可维护性 |
| P1 | 拆分 `createHeroProjectController.js` (332 行) | 可维护性 |
| P1 | 移除 `scrollTimeline.js` 孤立文件 | 代码卫生 |
| P2 | 补充启动链测试 (main.js, bootstrap, loadModules) | 重构安全网 |
| P2 | 补充 `math.js` 测试 | 高复用模块需保护 |
| P2 | 给所有 design plans 加状态标记 | 文档卫生 |

---

## Part 3: Implementation Plan (实施计划)

### Phase 0: Code Hygiene (代码卫生) — 预计 1 session

> 目标：清理技术债，建立干净基线

**0.1 死代码清理**
- [ ] 删除 `src/scene/` 整个目录 (7 files)
- [ ] 删除 `src/animations/scrollTimeline.js`
- [ ] 确认 `vite.config.js` 中 Three.js chunk 配置是否需要更新
- [ ] 跑测试确认无破坏

**0.2 大文件拆分**
- [ ] `src/content/sections.js` → 拆为 `siteContent.js` (数据) + `sectionRenderers.js` (模板) + `pageComposer.js` (组合)
- [ ] `src/experience/createHeroProjectController.js` → 提取 input bindings 和 navigation helpers
- [ ] 更新相关 import 和测试

**0.3 Git 整理**
- [ ] 将所有合理的未追踪文件分批提交
- [ ] `.ccb/` 加入 .gitignore
- [ ] `CLAUDE.md` 决定是否 track（建议 track）
- [ ] 给 `docs/plans/` 每个文件加 status frontmatter

**0.4 测试补充**
- [ ] `src/utils/math.js` 单元测试
- [ ] `src/experience/bootstrapExperience.js` 基础测试
- [ ] `src/experience/loadExperienceModules.js` mock 测试

### Phase 1: Design System Hardening (设计系统强化) — 预计 1-2 sessions

> 目标：完善 design tokens，为后续功能打基础

**1.1 完善 CSS Token 系统**
- [ ] 补充 spacing tokens (`--space-xs` ~ `--space-3xl`)
- [ ] 补充 typography tokens (`--text-xs` ~ `--text-4xl`)
- [ ] 补充 motion tokens (`--duration-fast`, `--ease-out-expo` 等)
- [ ] 验证现有组件对 tokens 的使用一致性

**1.2 可访问性修复**
- [ ] 审查所有文本/背景对比度（WCAG AA 标准 4.5:1）
- [ ] 修复 Gemini 指出的半透明文字对比度问题
- [ ] 确保 keyboard navigation 完整性（Codex 确认 Hero 已有 Arrow/Enter 支持）

**1.3 移动端体验优化**
- [ ] 审查 mobile hero deck 的触控交互质量
- [ ] 优化 Rail 的水平滑动手感
- [ ] 验证 `prefers-reduced-motion` 降级路径

### Phase 2: Visual Enhancement (视觉提升) — 预计 2-3 sessions

> 目标：提升视觉完成度和差异化

**2.1 Dark Mode（高优先级）**
- [ ] 设计 dark palette（基于当前 agentOS/量化主题）
- [ ] 实现 CSS variable 切换机制
- [ ] Canvas 背景系统适配 dark mode
- [ ] 测试所有组件在 dark mode 下的表现

**2.2 内容区域升级**
- [ ] About/Bio 区域增加视觉层次
- [ ] Project cards 增加微交互
- [ ] Contact 区域设计优化

**2.3 动效精修**
- [ ] Hero 入场动画优化
- [ ] Section 过渡节奏微调
- [ ] Canvas 背景与滚动的联动增强

### Phase 3: Killer Feature (杀手级特性) — 待 brainstorm 结果

> 等 Gemini UI brainstorm 回来后，评估 1-2 个差异化特性
> 候选方向：
> - Hero → Detail 的沉浸式转场
> - 交互式技能可视化
> - 背景 Signal Field 与内容的深度联动

---

## Part 4: Decision Log (决策记录)

| 决策 | 理由 | 来源 |
|------|------|------|
| 不恢复 Three.js | Canvas 2D 性能更可控，Three.js 被有意废弃 | Codex 审计 |
| 不引入路由框架 | 架构级变更，当前 SPA 模式足够 | Claude 判断 |
| 优先 Dark Mode | 与项目定位高度契合，ROI 最高 | Gemini 建议 + Claude 认同 |
| 先清理再建设 | 36 个未追踪文件是协作障碍 | Codex 审计 |
| sections.js 必须拆分 | 562 行违反 200-400 行原则 | Codex + CLAUDE.md 标准 |

---

## Part 5: Risk Register (风险登记)

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| Phase 0 拆分可能引入回归 | 中 | 先补充测试再拆分，每步验证 |
| Dark Mode 影响面大 | 高 | 先建 token 切换机制，逐组件适配 |
| Canvas 背景 dark mode 适配复杂 | 中 | 背景系统已有 config 层，通过 config 注入新色板 |
| 未提交代码堆积 | 高 | Phase 0.3 立即解决 |

---

*Next action: 等 Gemini UI brainstorm 到达后，补充 Phase 3 具体方案，然后请 Thomas 确认计划。*
