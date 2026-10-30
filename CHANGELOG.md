# Changelog

형식은 [Keep a Changelog](https://keepachangelog.com/ko/1.1.0/)를 따르고, 버전은 [SemVer](https://semver.org/lang/ko/)를 씁니다.

## [1.3.0] - 2026-10-30

### 추가
- `plan-decompose` 스킬 · `templates/intake/기획분해.md`: 기획서 · 요구사항 정의서 · 아이디어 한 줄을 역할 → 메뉴 → 화면 → 기능 → 컴포넌트 · 동작 → 연결 → 데이터 · 상태 · 권한 → 예외 → 기본 결정까지 분해.
- `design-system` 스킬: 외부 레퍼런스 조사, Apple HIG 원칙 · 수치, 닐슨 휴리스틱 평가, 디자인 토큰(W3C DTCG), 컴포넌트 × 상태, 기획 밀도 기준.
- 시안 비교: `variants.js` → 캔버스 맨 위 `V-*` 보드. `templates/design/variants.js`.
- `scripts/import_design.mjs` · `scripts/dc-lib.mjs`: Claude Design 캔버스에서 고친 보드를 `design-import/`로 가져와 빌드 · 내보내기에 반영(data-go ↔ 링크 왕복).
- `scripts/design_tokens.py`(inventory · css · link · contrast · check), `templates/design-system/tokens.json` · `components.js`, 캔버스 `DS-tokens` · `DS-components` 보드.
- `scripts/check_density.mjs`: 화면별 요소 · 글자 · 구성 · 상태 · 규칙 · 예외 · 검수 밀도 하한 검사.
- 4개 언어(한국어 · English · 中文 · 日本語): `kit.json` `"lang"` → 엔진 UI 번역(`engine/i18n.json`, 389문구), 문서 표 머리행 4개 언어 인식, 언어별 글꼴 순서, 스킬 설명에 영어 · 중국어 · 일본어 트리거, `README.en.md` · `README.zh-CN.md` · `README.ja.md`.
- `scripts/check_build.mjs`: 빌드한 HTML의 스크립트 문법 검사(번역문 따옴표 사고 방지).
- `harness.html?boards=…`: Claude Design이 없는 환경에서 보드를 나란히 보기, 보드별 높이 반영, 푸터 겹침 검사.

### 바뀜
- 플러그인 이름 `screen-spec-kit` → `product_design_dongh`(명령은 `/product_design_dongh:start` 등). 저장소 · 스킬 이름은 그대로.
- 진입 스킬: 0~7단계 강제를 없애고 작업 메뉴 · 하나의 세션으로. 멈추는 곳은 분해 확인 · 시안 선택 · 범위 증가뿐, 응답마다 현황 줄.
- `design-brief`: 글 질문 대신 레퍼런스 + 시안 2~4개를 캔버스로 보여 주고 고르기. 묻는 것은 그림으로 알 수 없는 것(0~4개)만.
- `draft-review`: 초안을 디자인 캔버스와 플로우 맵 둘 다로, 보여 주기 전 밀도 · 휴리스틱 자체 점검, 캔버스 수정 가져오기.
- `design-canvas`: 시안 비교부터 같은 Artifact URL에 쌓기, 갱신 전 사용자 수정 가져오기.
- 예시 `demo-park` v1.2: 화면 6(공통 상태 추가) · 예외 15 · 검수 6 · 선택 승인 · 시안 3 · 토큰 · 컴포넌트. 주 색 #2E9E6B → #1F7A52(흰 글자 대비 3.4 → 5.3).

## [1.2.0] - 2026-10-29

### 추가
- 안내 흐름: 진입 스킬을 0~7단계 지도로 재구성(시작 질문 · 확인 지점 · 다음 단계 예고 · 건너뛰기 · 자동 모드).
- `design-brief` 스킬과 디자인 질문 목록(21개, 모두 기본값).
- `draft-review` 스킬: 핵심 화면 초안 → 유지/수정/추가/질문 피드백 → 반복 → 전체 확장.
- `templates/intake/`: 진행 기록(progress.md) · 자료 요청 목록 · 디자인 브리프 양식.
- 명령 `start` · `status`.
- Codex 지원: `AGENTS.md`, `scripts/install_skills.py`(`--codex` · `--claude` · `--to` · `--zip`).

### 바뀜
- `source-intake`: 기획서 · 요구사항 정의서 받기 안내, 원래 요구 ID 유지, 요구 목록 확인 지점.
- 각 하위 스킬에 단계 번호와 다음 단계 예고.

## [1.1.0] - 2026-10-29

### 추가
- 가상 예시 `examples/demo-park`(도시공원 시설 예약 관리): 화면 5 · SB 12쪽 · 판정표 · 지도 명세 · 디자인 내보내기.
- `PROJECT.docs` 설정: 문서 패널의 변경 이력 제목 · 안내 문구 · WBS 단계 이름 · 신규/보강 강조를 프로젝트에서 지정.
- GitHub Actions 검증(문서 정합 · 예시 빌드 · 디자인 내보내기 · JS 문법).

### 바뀜
- 문서 패널 탭의 기능 · 검수 개수를 문서에서 세어 표시.
- 최신 버전 강조를 변경 이력 마지막 행에서 자동으로 정함.

### 고침
- 기능 ID 접두어가 특정 프로젝트(COM · DASH · …)로 고정돼 다른 접두어(FAC · BOOK 등)의 요구 추적 · 검증이 실패하던 문제.

## [1.0.0] - 2026-10-28

### 추가
- 공통 엔진과 프로젝트 데이터 분리(`build_kit.py`).
- 스킬 7개(screen-spec-kit · source-intake · spec-docs · flowmap-artifact · sb-screen-spec · design-canvas · artifact-qa), 명령 4개(new · build · audit · publish).
- 연결선 우회 / 화면 앞 / 화면 뒤 모드와 연결선 정보 패널.
- 자동 검수 스크립트(SB 마커 · 연결선 관통 · 디자인 보드).
