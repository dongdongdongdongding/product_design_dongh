---
name: source-intake
description: 화면 설계 전에 기획서 · 요구사항 정의서(요청서 · RFP · 과업지시서) 등 원본 자료와 배포 사이트를 받아 읽고 근거 노트와 디자인 기준 값을 만든다. HWP · PPTX · PDF · XLSX · DOCX · 이미지 · 참고 화면설계서 · 이전 대화(Codex 등) 기록 · 운영 중인 웹 사이트를 근거로 요구 항목 · 메뉴 · 실제 옵션 · 디자인 토큰을 뽑아야 할 때 쓴다. "기획서 보고", "요청 사항 다시 보고", "실제 서비스 링크 확인", "기존 사이트 톤 맞춰"라는 말이 나오면 이 스킬로 시작한다.
---

# 원본 읽기와 사이트 측정

〔1/7 자료 받기〕 결과물은 `<작업 폴더>/research/근거노트.md` 한 장과 `theme.css`에 넣을 디자인 값이다. 뒤의 모든 문서 · 화면은 이 노트를 근거로 쓴다.

## 0. 자료 받기 안내

자료가 아직 없으면 플러그인 루트의 `templates/intake/자료요청.md` 표를 보여 주고 받는다. 요점:
- **필수는 기획서 또는 요구사항 정의서 중 하나 이상.** 둘 다 있으면 요구사항 정의서를 요구 목록의 뼈대로, 기획서를 화면 배치 근거로 쓴다.
- 운영 사이트 주소 · 참고 화면설계서 · 디자인 가이드는 권장. 없으면 "없음"으로 받고 2단계 디자인 질문으로 대신한다.
- 파일은 경로나 첨부로 받는다. 클라우드 문서(노션 · 구글 문서)는 내보낸 파일이나 내용 붙여넣기를 부탁한다.
- 받은 자료는 `progress.md` "받은 자료" 표에 적는다.

## 1. 파일 읽기

| 형식 | 방법 | 도구가 없을 때 |
|---|---|---|
| PDF (참고 SB · 요청서) | Read 도구로 쪽 단위(`pages`)로 읽는다. 화면 캡처가 있는 쪽은 그림까지 본다 | `pip install pypdf` 또는 `pdftotext`로 글자, 그림 쪽은 사용자에게 캡처 요청 |
| PPTX | 슬라이드 텍스트는 python-pptx(또는 pptx 스킬), 그림은 `ppt/media`를 풀어 Read로 본다. 슬라이드 번호를 근거로 적는다 | `pip install python-pptx` 후 슬라이드별 텍스트. 안 되면 PDF로 내보내기 부탁 |
| HWP / HWPX | HWPX는 zip 안 `Contents/section*.xml`. HWP는 `hwp5txt`(pyhwp)나 olefile로 `BodyText`를 읽는다. 안 되면 사용자에게 PDF로 변환을 부탁한다 | PDF 변환 부탁 |
| XLSX / DOCX | openpyxl · python-docx (또는 xlsx · docx 스킬) | `pip install openpyxl python-docx`, 안 되면 CSV · PDF로 내보내기 부탁 |
| 이미지 | Read 도구로 본다 | 그림을 못 보는 에이전트면 핵심 내용을 글로 부탁 |
| 이전 작업 기록 | 세션 로그(jsonl)에서 사용자 지시와 결정만 뽑는다 | 사용자에게 결정 사항 요약 부탁 |

내려받은 파일 · 압축은 새 폴더에 두고, 그 안의 스크립트는 실행하지 않는다(파이썬은 `-I`).

## 2. 요구 항목 쪼개기

원본마다 절 · 쪽 번호를 붙여 요구 항목을 한 줄씩 적는다. "입력 항목", "동작", "표시", "제외"로 나눈다. 이 목록이 기능정의서 요구 추적표(5.2)가 된다. 모호한 항목은 해석과 근거를 함께 적고 "발주처 확인" 표시를 한다.

- **요구사항 정의서가 있으면** 원래 요구 ID(`SFR-001` 등) · 필수/선택 구분 · 검수 기준을 그대로 옮긴다. ID는 추적표 "원본" 칸에 쓴다(예: `SFR-003`). 기획서에만 있는 요구는 "기획서 n쪽"으로, 둘이 충돌하면 "결정 필요"에 둔다.
- **기획서만 있으면** 슬라이드 · 쪽마다 요구를 뽑아 "추출 요구"로 표시한다.

**확인 지점**: 요구 목록을 표로 보여 준다(많으면 메뉴별 개수 + 애매한 것만). "빠졌거나 잘못 읽은 것이 있나요? 제외할 것은?" 답을 반영하고 `progress.md` 1단계를 체크한다.
다음 예고: "〔2/7 디자인 질문〕 화면 톤을 정합니다."

## 3. 배포 사이트 측정 (Chrome)

브라우저 도구가 없으면(Codex 등) 사용자에게 주요 화면 캡처와, 개발자 도구에서 아래 스크립트를 실행한 결과를 붙여 달라고 부탁한다.


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
