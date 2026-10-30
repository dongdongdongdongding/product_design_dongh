# AGENTS.md — Codex · 기타 코딩 에이전트용 안내

이 저장소는 기획서 · 요구사항 정의서 · 아이디어로부터 기획 분해 → 시안 비교 → 화면 초안 → 플로우 맵 → 화면설계서(SB) → 디자인 시스템 → 검수를 만드는 키트입니다. Claude Code에서는 플러그인으로, 다른 에이전트에서는 아래처럼 씁니다.

## 사용자가 "시작", "화면설계서 만들어줘", "기획서 보고 화면 설계", "이런 앱 기획해줘"라고 하면

1. `skills/screen-spec-kit/SKILL.md`를 읽고 **첫 응답 · 일하는 방식 · 작업 폴더 · 품질 기준**을 따른다. 이 저장소 안에서 열렸다면 결과물은 저장소 밖 작업 폴더(기본 `../<프로젝트명>-spec`)에 만든다.
2. 작업 표에 적힌 하위 스킬 파일(`skills/<이름>/SKILL.md`)을 그때그때 읽는다. 순서는 강제가 아니다 — 사용자가 원하는 작업부터.
3. 아이디어만 받아도 `skills/plan-decompose`로 메뉴 · 화면 · 기능 · 컴포넌트 · 동작 · 연결 · 데이터 · 권한 · 예외까지 직접 분해한다. 사용자에게 기획을 묻지 않고 해석을 보여 준다.
4. 디자인 방향은 글로 묻지 않고 `skills/design-brief`대로 시안 2~4개를 그려 보여 준다. 품질 기준은 `skills/design-system`(레퍼런스 · HIG · 휴리스틱 · 토큰 · 컴포넌트 · 밀도).
5. 사용자 언어(한국어 · English · 中文 · 日本語)로 답하고 산출물도 그 언어로 만든다. `kit.json`의 `"lang"`을 맞추면 엔진 UI도 그 언어로 빌드된다(진입 스킬 "언어" 절).
6. 진행 상황은 작업 폴더의 `spec-kit/progress.md`에 기록한다(양식: `templates/intake/progress.md`). 응답 끝에 현황 한 줄과 다음 추천 한 줄.

## Claude 전용 도구 대신 쓰는 것

- Claude Design 캔버스(편집 가능한 디자인) → `node scripts/export_design.mjs <spec-kit> <spec-kit>/design` 후 `templates/design/harness.html`을 `design/`에 복사, 로컬 서버로 `harness.html?boards=V-A,V-B,V-C`(시안 비교) 또는 화면 ID 목록을 보여 준다. 사용자가 `.dc.html`을 직접 고치면 `node scripts/import_design.mjs <design> <spec-kit> --apply`로 가져온다.
- Artifact 게시 → 작업 폴더에서 `python -m http.server 8768 --bind 127.0.0.1`을 백그라운드로 띄우고 `http://127.0.0.1:8768/spec-kit/flowmap.html`을 알려 준다. 다 보면 서버를 끈다. 못 띄우면 `flowmap.html` 파일 경로(더블클릭으로도 보임).
- 웹 검색(레퍼런스 조사) → 검색 도구가 있으면 쓰고, 없으면 `skills/design-system/references/reference-research.md`의 공개 디자인 시스템 목록 · 원칙으로 대신하고 "외부 검색 안 함"이라고 보고한다.
- Claude in Chrome(사이트 측정 · 자동 검수) → 사용자에게 캡처와 개발자 도구 결과를 받고, 검수는 `check_docs.py` · `check_density.mjs` · 빌드 숫자로 대신한 뒤 "브라우저 검수 안 함"이라고 보고한다. Playwright가 있으면 `scripts/audits/*.js`를 페이지에서 실행해도 된다.
- AskUserQuestion → 번호 목록 질문(항목마다 기본안).

## 명령

```bash
python scripts/check_docs.py --docs <docs 폴더> --screens D1,F1,...   # 문서 정합
node scripts/check_density.mjs <spec-kit 폴더>                        # 기획 밀도 (미달 0)
python scripts/build_kit.py <spec-kit 폴더>                           # → flowmap.html
node scripts/export_design.mjs <spec-kit 폴더> <spec-kit 폴더>/design  # → design/project/*.dc.html (시안 · 화면 · DS 보드)
node scripts/import_design.mjs <받은 디자인 폴더> <spec-kit 폴더>       # 캔버스 수정 확인 (--apply로 반영)
python scripts/design_tokens.py inventory|css|link|check <spec-kit 폴더>
python scripts/install_skills.py --codex                              # 스킬을 ~/.agents/skills 로 설치
```

## 지킬 것

- `engine/`은 고치지 않는다. 프로젝트 값은 `project.js` · `variants.js` · `sb-pages.js` · `theme.css` · `design-system/` · `docs/`에 쓴다.
- 운영 사이트에 로그인하거나 저장 · 삭제를 누르지 않는다. 비밀번호 · 키를 입력하지 않는다.
- 레퍼런스에서는 구조만 가져온다. 로고 · 문구 · 이미지를 복사하지 않고 링크로 남긴다.
- 예시(`examples/demo-park`)는 가상이다. 실제 기관 · 개인 정보를 넣지 않는다.
