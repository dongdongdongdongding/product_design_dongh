# project.js · theme.css 계약

## 엔진이 읽는 이름

| 이름 | 형태 | 쓰는 곳 |
|---|---|---|
| `PROJECT` | `{ title, eyebrow, intro, start, dataLead?, issueStates?: {done, ask}, overviewTop?(done) → html, overviewBottom?: html, transData?: {'A>B': 설명} }` | 인스펙터 기본 화면, 프로토타입 시작, 문서 패널, 연결 정보 |
| `SHARE` | `{ 화면ID: ['원래화면:필드키'] }` | 12.2 입력 필드를 다른 화면 패널에도 보여 줄 때 |
| `H` | `{ 화면ID: () => html }` | 캔버스 프레임 · 프로토타입 · 화면설계서 · 디자인 내보내기 |
| `SCREENS` | `[{ id, flow, kind, title, purpose, feat[], parts[], states[], rules[], ex[], at[] }]` | 캔버스 · 인스펙터 · 기능정의 카드 · 최종 검증 |
| `FLOWS` | `[{ id, no, title, desc, screens[] }]` | 캔버스 섹션 · 화면설계서 목차 · 디자인 보드 배치 |
| `ISSUES` | `[{ id, scr|null, sev: high|mid|low, st: done|ask, t, src, p, fx, rest? }]` | 핀 · 검토 이슈 탭 |

엔진이 만들어 주는 것: `byId` · `flowOf` · `SEV` · `ST` · 연결선(`data-go`에서) · DOCDATA(문서 표).
엔진 안에서 쓸 수 있는 도구: `esc(s)` · `DOC`(문서 데이터) · `FEAT[id]` · `EXM[id]`.

## 시안 규칙

- 최상위는 `shell()`이 만든 `<div class="scr">` (1440 × 900 고정 그리드: 사이드바 240 · 상단 60 · 본문 · 하단 40).
- 본문 `.ct`는 세로 flex. 남는 높이는 행(`.row`)에 `style="flex:1"`을 줘서 채운다.
- 다른 화면으로 가는 요소: `data-go="화면ID"`. 같은 화면 안 동작은 data-go를 붙이지 않는다.
- 팝업 화면: `shell(메뉴키, '<div class="dimmed">' + nogo(H.뒤화면()) + '</div>', { over: '<div class="shade"></div><div class="modal" style="left:…;top:…;width:…">…</div>' })` — `nogo`는 뒤 화면의 data-go를 꺼서 연결선이 겹치지 않게 한다(예시 project.js에 정의).
- 지도: `.mapw` 상자 안에 SVG(`class="map"`)를 꽉 채운다. 실제 지도 SDK가 그리지 못하는 표현(무늬 채움 등)은 쓰지 않는다. 범례 `.lgd`, 정보 상자 `.ibox`, 확대 `.zoom`, 축척 `.scale`.

## theme.css 주요 클래스

틀: `.scr .sb .sbh .logo .nav .nv(.on) .tp .user .ct .ftr`
머리: `.ph .crumb .acts .stp`(진행 단계) `.tabsx`(화면 탭)
카드: `.c .ch .r .cnt .kpi .k .v .s .row .g`
입력: `.lab(em=필수) .inp(.ro .err .ph-t .u) .sel .seg span(.on) .ck(i.on) .fr`(라벨-값 2열) `.msg(.err .wrn)`
표 · 목록: `table.t(.tight .wrap) .lbox .li(.on) .tt .sub`
배지 · 안내: `.tg .t-ok .t-wr .t-bad .t-mu .t-in .t-ops .t-na` · `.note(.w .e)`
버튼: `.btn(.pri .sec .sm .lg .danger .dis)`
팝업: `.shade .modal h3 .x .mb .foot .toast .dimmed`
지도: `.mapw .map .zoom .scale .mtag .lgd .ibox`

값(색 · 크기)은 바꾸고 이름은 유지한다. 검수 스크립트 · 화면설계서 마커 위치 찾기가 이 이름을 쓴다.
