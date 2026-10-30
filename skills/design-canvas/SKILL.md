---
name: design-canvas
description: 프로젝트 화면을 Claude Design 캔버스(Design 타입 Artifact, 보드별 .dc.html)로 만들고, 같은 URL에 시안 비교 · 초안 · 전체 화면 · 디자인 시스템 보드를 쌓아 게시하고, 사용자가 캔버스에서 직접 고친 보드를 받아 시안으로 되가져온다. "디자인 캔버스", "클로드 디자인으로", "편집 가능한 디자인", "디자인 아티팩트", "디자인에서 고쳤어", "캔버스 수정 반영", "스크린샷 말고 실제 디자인"을 요청하거나, 시안 비교 · 초안을 보여 줄 때, 캔버스 보드의 잘림 · 빈 공간 · 지도 여백을 고칠 때 쓴다.
---

# Claude Design 캔버스

시안 비교(`design-brief`)부터 쓴다. 프로젝트마다 **디자인 Artifact 하나**를 만들고 같은 URL에 계속 쌓는다: 맨 위 시안 비교(V-*) → 메뉴별 화면 → 디자인 시스템(DS-*). URL은 `progress.md`에 적는다.

## 1. 내보내기

```bash
node scripts/export_design.mjs <spec-kit> <spec-kit>/design                  # 화면 + (있으면) 시안 비교 · DS 보드
node scripts/export_design.mjs <spec-kit> <spec-kit>/design --variants-only  # 화면이 아직 없을 때
```
- 화면마다 `<ID>.dc.html`(theme.css 링크, `data-go` → `<a href="X.dc.html" data-go data-tag>`), `canvas.json`(행 배치 · 제목 · 화면 설명 메모).
- `variants.js` → `V-<key>.dc.html`, `design-system/tokens.json` → `DS-tokens.dc.html`, `design-system/components.js` → `DS-components.dc.html`.
- `design-import/<ID>.html`(캔버스에서 가져온 화면)이 있으면 그 내용으로 내보낸다.

## 2. 게시 · 갱신

- **처음**: `Artifact quickstart(intent: design)` → Design 타입 `type_url`로 새 Artifact를 만들고, `root`=`<spec-kit>/design`, `file_path`=보드 하나, `files`=나머지(project/*.dc.html · theme.css · canvas.json)로 게시한다.
- **갱신**: 같은 `url` + `root` + 바뀐 파일만 `files`로. 보드가 추가되면 canvas.json도 함께.
- **사용자가 그 사이 고쳤을 수 있다.** 갱신 전에 사용자가 캔버스를 고쳤다고 했거나 게시가 거절되면(더 새 버전이 있음) 3절로 먼저 가져온 뒤 다시 내보내 게시한다. 사용자가 고친 보드를 덮어쓰지 않는다.
- 캔버스 런타임 파일(support.js · dc-runtime.js 등)은 읽기만 하고 실행하지 않는다.

## 3. 캔버스에서 고친 것 가져오기

1. `Artifact read`로 최신본을 받는다 — `url` + `paths`(고쳤다는 보드 · `project/theme.css` · 모르면 `scope: "files"` 목록에서 화면 보드 전부). 결과에 저장 위치가 나온다.
2. `node scripts/import_design.mjs <받은 폴더> <spec-kit>` → 보드별로 같음 / 바뀜 / 스타일만 바뀜 / 수동 반영 필요 / 새 보드.
3. `--apply` → `design-import/<ID>.html`(이후 그 화면의 원본) · `<ID>.css`(helmet 스타일) · theme.css(바뀌었으면, 이전 것은 .bak).
4. 수동 반영 필요(`{{}}` · `sc-for` · `dc-import`로 컴포넌트화된 보드): 보드를 읽고 같은 모양을 시안 HTML로 옮긴다. 새 보드: SCREENS · FLOWS에 넣을지 사용자에게 한 줄로 확인.
5. 시안 비교 보드(V-*)를 고쳤으면 `variants.js`에, 토큰 보드를 고쳤으면 `tokens.json`에 옮긴다(보드는 결과물, 원본은 파일).
6. 빌드 · 검수(`check_docs.py` · `check_density.mjs`) → 플로우 맵 · SB가 캔버스와 같은 내용인지 확인하고 보고: "캔버스 수정 2화면 반영(F1 필터 순서, B2 버튼 위치) · theme.css 주 색 변경".

## 4. 다듬기 (편집 가능한 디자인으로)

반복되는 부분은 공통 컴포넌트로 뺀다. 예시: `examples/demo-park/design-export/`. 컴포넌트 이름은 `design-system/components.js`와 같게 짓는다.
- `.dc.html` 형식: `<script src="./support.js">`(Claude Design이 게시할 때 넣는 런타임이라 저장소에는 없다. 로컬 점검은 harness.html로 한다) · `<x-dc>` 안에 마크업 · `<helmet>`(폰트 · 스타일) · `{{값}}` 구멍(점 경로만) · `<sc-for list="{{목록}}" as="x">` · `<sc-if value="{{조건}}">` · `<dc-import name="Map" 속성=…>` · 끝에 `<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":1440,"height":940}}'>class Component extends DCLogic { renderVals() { return {…}; } }</script>`.
- 보드 사이 이동은 `<a href="P2.dc.html">`. 속성 이름은 kebab-case → props는 camelCase(`zone-on` → `zoneOn`).
- **`dc-import`는 높이 없는 칸(`sc-host`)에 들어간다.** 상자를 채워야 하는 컴포넌트(지도 등)는 `style="display:block;width:100%;height:100%"`를 준다.
- 보드 높이와 화면 틀 최소 높이를 맞춘다(보드 940이면 `.app`/`.side` min-height 940).
- 본문 행에 `flex: 1`을 줘서 남는 높이를 지도 · 목록이 채우게 한다.
- 지도 SDK가 못 그리는 표현은 쓰지 않는다(카카오 Polygon 무늬 채움 → 반투명 단색 + 점선).
- 컴포넌트화한 보드는 import_design이 자동으로 되돌리지 못한다 — 다듬기는 화면이 확정된 뒤(전체 확장 후)에 한다.

## 5. 점검

`templates/design/harness.html`을 디자인 폴더(project/의 부모)에 복사해 127.0.0.1로 연다.
- 보기: `harness.html?boards=V-A,V-B,V-C`(나란히 · 이름표). Design 타입이 없는 환경에서 시안 비교를 보여 줄 때도 이것을 쓴다.
- 검수: `scripts/audits/design-canvas.js`(BOARDS를 프로젝트에 맞게, `artifact-qa`).
실제 캔버스를 화면에서 열어 확인하지 못했다면 그렇다고 보고한다 — 캔버스 화면에서 클릭하면 편집이 일어날 수 있으니 조심한다.
