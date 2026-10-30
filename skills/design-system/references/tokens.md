# 디자인 토큰 정리

시안이 여러 화면 · 시안으로 늘어나면 색 · 크기가 흩어진다. 토큰은 그 값을 **이름 있는 결정**으로 묶어 모든 화면 · 캔버스 · 개발 전달물이 같은 값을 쓰게 한다.

## 1. 3층 구조

| 층 | 예 | 규칙 |
|---|---|---|
| 기본값(primitive) | `color.navy.700 = #1F4E79`, `space.4 = 16px` | 팔레트 · 척도. 화면에서 직접 쓰지 않는다 |
| 의미(semantic) | `color.text`, `color.surface`, `color.primary`, `color.danger`, `color.border` | 역할 이름. 값은 기본값을 가리킨다(`"{color.navy.700}"`). 다크 모드 · 브랜드 교체는 이 층만 바꾼다 |
| 컴포넌트(component) | `button.primary.bg`, `table.row.height` | 필요할 때만. 의미 토큰을 가리킨다 |

## 2. 형식 — W3C Design Tokens(DTCG)

`design-system/tokens.json`. `$type`: color · dimension · fontFamily · fontWeight · number · shadow · typography · duration. 참조는 `"{그룹.이름}"`.
대비 검사할 짝은 `$extensions.pairs`에 `[글자, 바탕, 기준]`으로 적는다(본문 4.5, 큰 글자 · 아이콘 · 입력 테두리 3.0).
시작 파일: 플러그인 루트 `templates/design-system/tokens.json`.

## 3. 순서

1. **세기** — `python -I scripts/design_tokens.py inventory <spec-kit>`: theme.css의 색 · 글자 크기 · 모서리 · 그림자 · 간격 빈도와 거의 같은 색 쌍.
2. **정하기** — 자주 쓰는 값은 역할 이름으로, 거의 같은 색은 하나로 합친다(합친 것은 브리프에 "합침: #E8EBF1 ≈ #E9ECEF"로 남긴다). 간격 · 크기는 척도(4 · 8 · 12 · 16 · 24 · 32)에 맞춘다.
3. **넣기** — `css`로 theme.css 맨 위에 `:root { --ds-* }` 블록을 쓰고, `link`로 같은 색 값을 `var(--ds-*, 원래값)`으로 바꾼다(원래값을 함께 남겨 변수가 없어도 같은 모양).
4. **재기** — `check`: 블록이 최신인지 + 대비 미달. 미달이면 값을 고치고 사용자에게 알린다.
5. **보여 주기** — `export_design.mjs`가 `DS-tokens.dc.html` 보드를 만든다. 사용자가 캔버스에서 토큰 보드를 고쳤다고 하면 그 값을 tokens.json에 옮기고 3~4를 다시 한다(보드는 결과물이지 원본이 아니다).

## 4. 이름 규칙

- 소문자 · 점 경로: `color.text.muted`, `radius.md`, `font.size.body`. CSS 변수는 `--ds-color-text-muted`.
- 값이 아니라 역할로: `color.blue` 대신 `color.primary`(기본값 층은 예외).
- 상태는 끝에: `color.primary.hover`, `color.border.focus`.

## 5. 전달

개발 전달 시 tokens.json을 그대로 준다(Style Dictionary 등으로 플랫폼 변환 가능). 화면설계서 · 디자인 캔버스와 같은 값이라는 것을 `check` 결과로 함께 보고한다.
