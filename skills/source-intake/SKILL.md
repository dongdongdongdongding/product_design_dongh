---
name: source-intake
description: 화면 설계 전에 원본 자료와 배포 사이트를 읽어 근거 노트와 디자인 기준 값을 만든다. HWP · PPTX · PDF · XLSX · DOCX · 이미지 · 참고 화면설계서 · 이전 대화(Codex 등) 기록 · 운영 중인 웹 사이트를 근거로 요구 항목 · 메뉴 · 실제 옵션 · 디자인 토큰을 뽑아야 할 때 쓴다. "기획서 보고", "요청 사항 다시 보고", "실제 서비스 링크 확인", "기존 사이트 톤 맞춰"라는 말이 나오면 이 스킬로 시작한다.
---

# 원본 읽기와 사이트 측정

결과물은 `research/근거노트.md` 한 장과 `theme.css`에 넣을 디자인 값이다. 뒤의 모든 문서 · 화면은 이 노트를 근거로 쓴다.

## 1. 파일 읽기

| 형식 | 방법 |
|---|---|
| PDF (참고 SB · 요청서) | Read 도구로 쪽 단위(`pages`)로 읽는다. 화면 캡처가 있는 쪽은 그림까지 본다 |
| PPTX | 슬라이드 텍스트는 python-pptx(또는 pptx 스킬), 그림은 `ppt/media`를 풀어 Read로 본다. 슬라이드 번호를 근거로 적는다 |
| HWP / HWPX | HWPX는 zip 안 `Contents/section*.xml`. HWP는 `hwp5txt`(pyhwp)나 olefile로 `BodyText`를 읽는다. 안 되면 사용자에게 PDF로 변환을 부탁한다 |
| XLSX / DOCX | openpyxl · python-docx (또는 xlsx · docx 스킬) |
| 이미지 | Read 도구로 본다 |
| 이전 작업 기록 | 세션 로그(jsonl)에서 사용자 지시와 결정만 뽑는다 |

내려받은 파일 · 압축은 새 폴더에 두고, 그 안의 스크립트는 실행하지 않는다(파이썬은 `-I`).

## 2. 요구 항목 쪼개기

원본마다 절 · 쪽 번호를 붙여 요구 항목을 한 줄씩 적는다. "입력 항목", "동작", "표시", "제외"로 나눈다. 이 목록이 기능정의서 요구 추적표(5.2)가 된다. 모호한 항목은 해석과 근거를 함께 적고 "발주처 확인" 표시를 한다.

## 3. 배포 사이트 측정 (Chrome)

1. 메뉴 전체를 연다. 메뉴관리 화면이 있으면 메뉴 코드 · 사용 여부 · 정렬도 적는다.
2. 신규 기능과 이어지는 기존 화면의 실제 옵션 · 입력 방식 · 레이어 · 버튼 이름을 적는다(날짜 포함).
3. `javascript_tool`로 계산된 스타일을 잰다:
```js
const q = (s) => { const e = document.querySelector(s); if (!e) return null; const c = getComputedStyle(e); return { font: c.fontFamily, size: c.fontSize, weight: c.fontWeight, color: c.color, bg: c.backgroundColor, border: c.border, radius: c.borderRadius, shadow: c.boxShadow, h: e.getBoundingClientRect().height, pad: c.padding }; };
({ body: q('body'), sidebar: q('.sidebar, aside, nav'), active: q('.nav-item.active, .active'), card: q('.card'), cardTitle: q('.card-title, h6'), btn: q('.btn-primary, button'), input: q('input.form-control, input'), badge: q('.badge'), table: q('table th') })
```
4. 네트워크 요청은 화면 동작만 보고, 저장 · 삭제 버튼은 누르지 않는다. 확인한 서버 경로만 적고 나머지는 "배포 소스 확인 필요".

## 4. 근거 노트 형식

```markdown
# 근거 노트 (YYYY-MM-DD)
## 원본별 요구 항목   — | 원본 | 위치 | 요구 | 구분(입력/동작/표시/제외) | 해석 · 확인 |
## 배포 사이트 사실   — 메뉴 · 실제 옵션 · 입력 방식 · 확인 날짜
## 디자인 값          — 글꼴 · 색 · 사이드바 · 카드 · 버튼 · 입력 · 배지 · 표 · 지도 오버레이 (theme.css에 그대로 쓴다)
## 서버 경로          — 확인한 것 / 확인 필요
## 결정 필요          — 범위 · 해석 · 외부 확인
```
디자인 값은 `templates/project-starter/theme.css`의 해당 규칙을 바꿔 적용한다(클래스 이름은 유지).
