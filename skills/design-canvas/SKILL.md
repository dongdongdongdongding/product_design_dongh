---
name: design-canvas
description: 프로젝트 화면 시안을 Claude Design 캔버스(Design 타입 Artifact, 보드별 .dc.html)로 만들고 다듬고 게시한다. "디자인 캔버스", "클로드 디자인으로", "편집 가능한 화면 디자인", "스크린샷 말고 실제 디자인"을 요청하거나 캔버스 보드의 잘림 · 빈 공간 · 지도 여백을 고칠 때 쓴다.
---

# Claude Design 캔버스

〔6/7 디자인 · 선택〕 사용자가 Claude Design 보드를 원할 때만 한다. 다음 예고: "〔7/7 검수〕"

## 1. 내보내기로 시작

```bash
node scripts/export_design.mjs <프로젝트 폴더> <프로젝트 폴더>/design
```
project.js의 H · SCREENS · FLOWS를 보드로 바꾼다: 화면마다 `<ID>.dc.html`(theme.css 링크, `data-go` → `<a href="X.dc.html">`), 메뉴별 행 배치와 제목 · 화면 설명 메모가 든 `canvas.json`. 이 상태로 바로 게시할 수 있고, 시안과 캔버스가 같은 원본에서 나온다.

## 2. 다듬기 (편집 가능한 디자인으로)

반복되는 부분은 공통 컴포넌트로 뺀다. 예시: `examples/demo-park/design-export/`(공통 사이드바를 쓰는 보드).
- `.dc.html` 형식: `<script src="./support.js">`(Claude Design이 게시할 때 넣는 런타임이라 저장소에는 없다. 로컬 점검은 harness.html로 한다) · `<x-dc>` 안에 마크업 · `<helmet>`(폰트 · 스타일) · `{{값}}` 구멍(점 경로만) · `<sc-for list="{{목록}}" as="x">` · `<sc-if value="{{조건}}">` · `<dc-import name="Map" 속성=…>` · 끝에 `<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":1440,"height":940}}'>class Component extends DCLogic { renderVals() { return {…}; } }</script>`.
- 보드 사이 이동은 `<a href="P2.dc.html">`. 속성 이름은 kebab-case → props는 camelCase(`zone-on` → `zoneOn`).
- **`dc-import`는 높이 없는 칸(`sc-host`)에 들어간다.** 상자를 채워야 하는 컴포넌트(지도 등)는 `style="display:block;width:100%;height:100%"`를 준다. 안 주면 컴포넌트가 최소 높이로 그려지고 아래가 빈다.
- 보드 높이와 화면 틀 최소 높이를 맞춘다(보드 940이면 `.app`/`.side` min-height 940). 다르면 모든 보드 아래에 빈 띠가 생긴다.
- 본문 행에 `flex: 1`을 줘서 남는 높이를 지도 · 목록이 채우게 한다.
- 지도 SDK가 못 그리는 표현은 쓰지 않는다(카카오 Polygon 무늬 채움 → 반투명 단색 + 점선).
- 시안(project.js)과 캔버스를 둘 다 고쳤다면 같은 내용인지 검수의 "플로우 맵 대비 없음" 항목으로 확인한다.

## 3. 게시

- 처음: `Artifact quickstart(intent: design)` → Design 타입 `type_url`로 새 Artifact를 만들고, `root`=디자인 폴더, `file_path`=보드 하나, `files`=나머지(project/*.dc.html · theme.css · canvas.json)로 게시한다.
- 갱신: 같은 `url` + `root` + 바뀐 파일만 `files`로. 다른 사람이 저장한 새 버전이 있다고 하면 `read`(paths)로 최신본을 받아 파일별로 비교하고, 내 수정 전과 같으면 그대로, 다르면 병합해 게시한다.
- 캔버스 런타임 파일(dc-runtime.js 등)은 읽기만 하고 실행하지 않는다.

## 4. 점검

`templates/design/harness.html`을 디자인 폴더(project/의 부모)에 복사해 127.0.0.1로 열고 `scripts/audits/design-canvas.js`를 실행한다(`artifact-qa`). 실제 캔버스를 화면에서 열어 확인하지 못했다면 그렇다고 보고한다 — 캔버스 화면에서 클릭하면 편집이 일어날 수 있으니 조심한다.
