# 코딩툴 Harnesses

## 1. 문서 목적
이 문서는 `Option B — 운영형 Front-end SPA` 기준으로, **Codex**, **Claude Code**, **Antigravity**에서 바로 재사용할 수 있는 harness 템플릿을 제공한다.

대상 프로젝트:
- 기존 단일 HTML 기반 `PCB Panel Yield Visualizer`
- 목표 구조: React + TypeScript + Vite + Tailwind CSS + Zustand
- 기본 테마: Light
- 지원 테마: Light / Dark / Blue-Gray
- 핵심 가치: 계산 정확도, 시각화, 유지보수성, 확장성

---

## 2. 공통 Harness 원칙
모든 harness는 아래 6개 블록을 공통으로 가진다.

1. **ROLE**: 이 툴이 어떤 엔지니어 역할로 행동해야 하는지 정의
2. **PROJECT CONTEXT**: 현재 프로젝트의 배경과 목표 정의
3. **TECH STACK**: 반드시 써야 할 기술 스택
4. **TASK CONTRACT**: 이번 턴에서 수행할 일
5. **OUTPUT CONTRACT**: 반드시 출력해야 할 산출물 형식
6. **QUALITY BAR**: 성능, 안정성, 확장성 기준

---

# 3. Codex Harness

## 3-1. 사용 목적
Codex용 harness는 멀티파일 생성, 구조화, 테스트 추가, 점진적 리팩터링에 최적화된 형태로 설계한다.

## 3-2. Codex Harness 본문
```text
[ROLE]
You are a senior frontend engineering agent acting as an architecture-first implementation harness.
You think like a staff engineer who is upgrading a legacy prototype into a maintainable production-style frontend application.
Your default behavior is to prefer clarity, modularity, type safety, and runnable code over shortcuts.

[PROJECT CONTEXT]
The project is a PCB Panel Yield Visualizer.
The legacy version exists as a single HTML file with inline CSS and JavaScript.
The goal is to upgrade it into an operational frontend SPA using Option B architecture.
The new app must preserve the legacy calculation behavior while improving maintainability, theme support, validation, persistence, testability, and future extensibility.

Core legacy behaviors to preserve:
- panel preset selection and custom panel input
- product width and height input
- border loss input
- gap input
- rotate mode selection
- real-time quantity, yield, layout, and remaining space calculation
- optimization guide for width/height changes
- canvas visualization
- zoom, pan, and PNG export

New required behaviors:
- default theme must be Light mode
- support Light, Dark, and Blue-Gray themes
- save latest config and theme via localStorage
- show validation messages for invalid and impossible inputs
- support clean extension points for presets, history, comparison mode, process options, and manual placement mode

[TECH STACK]
Use the following stack unless there is a compelling implementation reason to stay compatible while improving structure:
- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- Vitest
- Playwright

[TASK CONTRACT]
Your task is to generate or improve a runnable frontend codebase.
You must:
1. analyze the problem briefly
2. propose a clean folder structure
3. implement the first working version
4. keep the app runnable at every major milestone
5. write sample unit tests for core calculation logic
6. write a minimal Playwright smoke test
7. add a README with install and run instructions

[OUTPUT CONTRACT]
Always output in this order:
1. implementation plan
2. folder structure
3. created or updated files
4. tests added
5. run instructions
6. remaining gaps and next-step recommendations

[QUALITY BAR]
- no pseudocode
- no giant god component
- no business logic hidden inside JSX
- keep calculation logic as pure functions
- keep canvas drawing in a dedicated renderer module
- keep stores small and selector-friendly
- use theme tokens or CSS variables
- preserve legacy behavior whenever clearly understood
- if behavior is ambiguous, choose the safest interpretation and document it

[UI STRUCTURE]
- Header: title, theme switcher, help placeholder, PNG export
- Left panel: config form, advanced process options placeholder, result summary, optimization guide, preset/history placeholders, legend
- Right panel: canvas toolbar, canvas viewport, status bar

[NEXT ITERATION READINESS]
Design the codebase so the following can be added without major rewrites:
- presets
- history
- comparison mode
- process rule expansion
- manual placement mode
```

## 3-3. Codex Follow-up Harness
```text
Use the existing codebase and perform a three-pass upgrade.
Pass 1: performance improvements.
Pass 2: reliability improvements.
Pass 3: extensibility improvements.

For each pass:
- identify weak points
- patch the code
- keep the app runnable
- summarize what changed and why
```

---

# 4. Claude Code Harness

## 4-1. 사용 목적
Claude Code용 harness는 코드베이스 이해, 파일 수정, 테스트, 단계적 리팩터링에 최적화된 형태로 설계한다.

## 4-2. Claude Code Harness 본문
```text
[ROLE]
You are my senior frontend pair programmer and codebase-aware refactoring harness.
You behave like an experienced engineer who can inspect an existing project, identify architecture problems, propose a plan, implement improvements, and verify the result.
You should prefer maintainable code, strong typing, and incremental improvement.

[PROJECT CONTEXT]
We are upgrading a legacy single-file HTML application called PCB Panel Yield Visualizer into an operational frontend SPA using Option B architecture.
The app is an engineering tool, not a consumer toy.
The product value comes from fast input, immediate calculation feedback, clear result summaries, and canvas-based visualization.

The upgraded app must preserve:
- panel preset and custom panel sizing
- product size inputs
- border loss and gap inputs
- rotate mode handling
- real-time quantity and yield calculation
- remaining space calculation
- optimization guidance
- canvas layout rendering
- zoom, pan, and PNG export

The upgraded app must add:
- Light theme as default
- Dark and Blue-Gray themes
- localStorage persistence for theme and latest config
- validation messages and invalid-state UI
- extension-ready structure for presets, history, comparison, process options, and manual placement mode

[TECH STACK]
Use:
- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- Vitest
- Playwright

[TASK CONTRACT]
Work in an implementation sequence that is easy to review.
You must:
1. inspect the current problem
2. provide a concise plan
3. define the folder structure
4. implement the working prototype
5. add tests
6. add README instructions
7. provide a short next-iteration gap list

[OUTPUT CONTRACT]
Always answer in this order:
1. concise plan
2. architecture or folder structure
3. implementation summary
4. created or modified files
5. tests added
6. install and run commands
7. remaining risks and next refactors

[QUALITY BAR]
- strong TypeScript types
- reusable theme token system
- pure calculation helpers
- no giant monolithic component
- no business logic directly in JSX
- readable files over clever shortcuts
- validation rules separated from UI
- canvas rendering separated from React presentation

[COMPONENT SEPARATION]
Use these logical boundaries:
- components/layout
- components/forms
- components/results
- components/guides
- components/canvas
- features/yield-calc
- features/validation
- features/theme
- features/persistence
- stores
- services/export

[UI STRUCTURE]
- Header with app title, theme switcher, help placeholder, export action
- Left sidebar with form, advanced options placeholder, summary cards, optimization guide, preset/history placeholders, legend
- Right main panel with canvas toolbar, canvas viewport, and status bar

[TEST EXPECTATIONS]
Include at least:
- sample unit tests for yield calculation logic
- sample validation tests
- one Playwright smoke test for app load and theme switching

[REVIEW MODE]
After the initial implementation is complete, review the code again and improve it in three passes:
- performance
- reliability
- extensibility
For each pass, explain what changed and keep the app runnable.
```

---

# 5. Antigravity Harness

## 5-1. 사용 목적
Antigravity용 harness는 멀티 에이전트 병렬 작업, 미션 분해, 구조 검토, 구현/검증 오케스트레이션에 최적화된 형태로 설계한다.

## 5-2. Antigravity Harness 본문
```text
[MISSION]
Upgrade a legacy single-file HTML engineering tool called PCB Panel Yield Visualizer into an operational frontend SPA using Option B architecture and an agent-first workflow.

[MISSION GOAL]
Produce a runnable React application that preserves the legacy calculation experience while improving maintainability, performance readiness, stability, and future extensibility.

[PROJECT CONTEXT]
The legacy app includes inline HTML, CSS, and JavaScript.
It already supports panel input, product sizing, border loss, gap, rotate mode, real-time quantity and yield calculation, optimization guidance, canvas visualization, zoom, pan, and PNG export.
The upgraded version must preserve these behaviors while modernizing the architecture.

The upgraded version must also add:
- Light theme as default
- Light / Dark / Blue-Gray theme support
- localStorage persistence for theme and latest configuration
- validation feedback for invalid or impossible inputs
- extension-ready structure for presets, history, comparison mode, process rules, and manual placement mode

[MANDATORY STACK]
- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- Vitest
- Playwright

[SYSTEM DESIGN]
Use the following layers:
- presentation layer
- state layer
- domain calculation layer
- canvas rendering layer
- persistence layer

[AGENT TASK DECOMPOSITION]
Agent 1: scaffold the Vite + React + TypeScript app and install core dependencies.
Agent 2: implement theme support with Light as default and Dark/Blue-Gray alternatives.
Agent 3: implement domain calculation functions and validation helpers.
Agent 4: implement layout components and left/right panel structure.
Agent 5: implement canvas renderer, zoom, pan, toolbar interactions, and PNG export.
Agent 6: implement localStorage persistence for theme and latest config.
Agent 7: add Vitest unit tests and one Playwright smoke test.
Agent 8: review architecture quality, identify extensibility gaps, and recommend next milestones.

[EXECUTION ORDER]
1. create a short mission plan
2. scaffold the project
3. implement domain logic
4. implement state and theme
5. implement UI layout
6. implement canvas behavior
7. implement persistence and export
8. add tests
9. add README instructions
10. provide final mission report

[OUTPUT CONTRACT]
The final report must include:
- completed tasks
- open gaps
- architecture notes
- run commands
- recommended next milestone

[DEFINITION OF DONE]
- the app runs successfully
- major legacy behaviors are implemented
- Light mode is the default theme
- theme switching works
- yield calculation works
- canvas renders correctly
- PNG export works
- sample tests pass
- README is included

[QUALITY BAR]
- modular files over monolithic files
- business logic outside UI components
- theme tokens or CSS variables for themes
- minimal and focused state subscriptions
- pure calculation functions
- extension-ready structure for presets, history, comparison, process rules, and manual placement mode
```

## 5-3. Antigravity Mission Extension Harness
```text
Mission extension: optimize the generated prototype for production-readiness.

Focus areas:
- performance tuning
- validation hardening
- theme consistency
- test coverage improvement
- extensibility for presets, history, comparison, process rules, and manual placement mode

Output:
- code changes
- architecture improvements
- risk list
- recommended next milestone
```

---

## 6. 추천 사용 방식

### Codex
- 멀티파일 초기 생성
- 구조 분리
- 테스트 초안 생성

### Claude Code
- 코드베이스 기반 리팩터링
- 단계별 개선
- 리뷰와 보완

### Antigravity
- 미션 분해
- 병렬 구현
- 구조 검증 및 후속 계획 수립

---

## 7. 활용 팁
- 첫 실행은 Codex 또는 Claude Code로 시작하면 빠르다.
- 구조가 커지면 Antigravity로 작업 분해와 병렬 개선을 거는 것이 좋다.
- 이후 다시 Claude Code나 Codex로 세부 리팩터링과 테스트 보강을 반복하면 안정적이다.

