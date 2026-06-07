# PCB Panel Yield Visualizer

레거시 단일 HTML `PCB_Count.html`을 기준으로 구성한 React + TypeScript 운영형 SPA입니다.

## Live URL

https://greeme99.github.io/PCB-Yield-Visualizer/

## 구성

- React + TypeScript + Vite
- Tailwind CSS와 CSS 변수 기반 3종 테마
- Zustand 상태 관리
- 순수 함수 기반 수량/수율/최적화 계산
- 전용 Canvas renderer
- Vitest 단위 테스트
- Playwright smoke test

## 실행

```bash
npm install
npm run dev
```

브라우저에서 Vite가 출력하는 로컬 주소를 엽니다.

## 검증

```bash
npm run test
npm run build
npm run test:e2e
```

## 반영된 핵심 요구사항

- 라이트 모드 기본값, 다크/블루-그레이 테마 지원
- 최근 설정과 테마 localStorage 저장/복원
- 원판 프리셋, 제품 크기, 외곽 로스, GAP, 회전 옵션
- 총 수량, 단순 수율, 실공정 기준 수율, 배열, 잔여 공간
- 입력 검증 메시지와 배치 불가 상태
- 최적화 추천값 즉시 적용
- 캔버스 확대/축소, 패닝, 수동 미리보기, PNG 저장
- 프리셋 저장과 최근 계산 이력 재적용

## 레거시 파일

`PCB_Count.html`은 비교 및 백업용으로 그대로 보존했습니다.
