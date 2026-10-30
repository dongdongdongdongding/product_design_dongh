---
name: design-system
description: 화면 시안의 디자인 품질을 맡는 내부 스킬. 외부 레퍼런스 검색(비슷한 서비스 · 공개 디자인 시스템 · 패턴 사례), Apple HIG(Human Interface Guidelines) · Material · KRDS 같은 플랫폼 원칙, 닐슨 휴리스틱 평가, 디자인 토큰(W3C DTCG) 정리, 컴포넌트 목록 · 상태 정리, 접근성 대비 검사, 기획 밀도 기준을 다룬다. "디자인 시스템", "디자인 토큰", "컴포넌트 정리", "HIG", "iOS 느낌", "휴리스틱", "사용성 평가", "UX 검토", "레퍼런스 찾아줘", "비슷한 서비스", "허접해", "밀도가 낮다", "세련되게"라고 하거나, 시안 비교 · 초안 · 검토 · 디자인 캔버스를 만들 때 함께 연다. English (design system, design tokens, component inventory, Apple HIG, heuristic review, find references), 中文（设计系统、设计令牌、组件整理、可用性评估、找参考）, 日本語（デザインシステム、デザイントークン、コンポーネント整理、ヒューリスティック評価、参考を探す）.
---

# 디자인 시스템 · 사용성 · 레퍼런스

다른 스킬(`design-brief` · `draft-review` · `design-canvas`)이 화면을 그릴 때 기준을 대는 스킬이다. 아래 다섯 가지를 필요한 만큼만 쓴다. 사용자가 이 중 하나만 요청하면(예: "휴리스틱 평가만") 그것만 한다.

| 하는 일 | 언제 | 결과 | 참고 |
|---|---|---|---|
| A. 레퍼런스 조사 | 시안 비교 전, "레퍼런스", 처음 보는 화면 패턴(지도 · 승인 흐름 · 일정표) | `research/레퍼런스.md` 5~10건 + 화면별로 가져올 구조 | `references/reference-research.md` |
| B. 플랫폼 원칙 적용 | 시안을 그릴 때 항상, "iOS 느낌" · "HIG"면 더 엄격히 | 시안의 위계 · 간격 · 터치 영역 · 모달 사용 | `references/platform-hig.md` |
| C. 휴리스틱 평가 | 초안을 보여 주기 전 자체 점검, "사용성 평가", 검토 회차마다 | 위반 표(화면 ID · 원칙 · 심각도 · 고칠 것) → 고친 뒤 보여 줌 | `references/heuristics.md` |
| D. 토큰 · 컴포넌트 정리 | 시안이 2개 이상 · 방향 확정 후, "디자인 시스템" · "토큰" | `design-system/tokens.json` · `components.js`, theme.css `--ds-*`, 캔버스 DS 보드 | `references/tokens.md` · `references/components.md` |
| E. 기획 밀도 점검 | 초안 · 확장 뒤마다 | `check_density.mjs` 0건 | `references/planning-bar.md` |

## 지키는 것

- **제너릭 템플릿 금지.** 카드 몇 개에 숫자 몇 개를 놓은 "대시보드 틀"은 초안이 아니다. 화면마다 실제 업무 흐름의 데이터 · 상태 · 규칙이 보여야 한다(E).
- **레퍼런스는 직접 찾는다.** 사용자에게 "참고할 사이트가 있나요?"만 묻고 멈추지 않는다. 사용자가 준 레퍼런스가 있으면 그것을 먼저 보고, 비슷한 사례를 몇 개 더 찾아 비교한다(A).
- **구조를 가져오고 겉모양은 베끼지 않는다.** 레퍼런스에서는 정보 구조 · 배치 · 상호작용 패턴을 가져온다. 로고 · 문구 · 이미지 · 고유 일러스트는 가져오지 않고, 출처 링크를 남긴다.
- **기준 우선순위**: 사용자 말 > 운영 중인 사이트 실측값 > 사용자가 준 디자인 가이드 > 플랫폼 원칙(HIG 등) > 레퍼런스 > 기본값. 문서에 적힌 기준은 하한이지 상한이 아니다. 사용자 지시가 이 스킬과 어긋나면 어긋난다는 것만 한 줄로 알리고 지시대로 한다.
- **보고는 본 것으로.** 시안이 좋아졌다는 말은 다시 렌더한 화면(Artifact · 캡처 · harness)을 보고 나서 한다. 지표(밀도 · 대비)는 회귀를 막는 용도이고, 지표가 좋아졌는데 그림이 나빠졌으면 그림을 따른다.
- **고칠 때는 규칙을 고친다.** 한 화면만 맞추는 땜질보다 토큰 · 컴포넌트 · 시안 도구(`shell` · `card` · `field`)를 고쳐 모든 화면에 함께 걸리게 한다.

## 도구

```bash
node scripts/check_density.mjs <spec-kit>                 # E. 화면별 밀도 · 미달 항목 (종료 코드 1 = 미달)
python -I scripts/design_tokens.py inventory <spec-kit>   # D. theme.css의 색 · 크기 · 모서리 빈도, 합칠 후보
python -I scripts/design_tokens.py css <spec-kit>         # D. tokens.json → theme.css :root --ds-*
python -I scripts/design_tokens.py link <spec-kit>        # D. theme.css의 같은 색 값을 var(--ds-*)로
python -I scripts/design_tokens.py check <spec-kit>       # D. 반영 여부 + 대비 미달
node scripts/export_design.mjs <spec-kit> <spec-kit>/design   # DS-tokens · DS-components 보드 포함
```
토큰 시작 파일: 플러그인 루트 `templates/design-system/tokens.json` · `components.js`.

## 결과 알리기

- 레퍼런스: "레퍼런스 7건(국내 3 · 해외 4) — 가져올 것: 목록 위 상태 칩 필터(①③), 오른쪽 상세 패널(②)" 식으로 한두 줄, 표는 `research/레퍼런스.md`.
- 휴리스틱: 위반 n건 → 고친 n건 · 남긴 n건(이유). 심각도 3 이상은 남기지 않는다.
- 토큰: "색 23종 → 토큰 11개로 정리, 대비 미달 0, theme.css 변수 연결 41곳".
