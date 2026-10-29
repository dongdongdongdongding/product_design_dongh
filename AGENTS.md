# AGENTS.md — Codex · 기타 코딩 에이전트용 안내

이 저장소는 기획서 · 요구사항 정의서로부터 화면 초안 → 플로우 맵 → 화면설계서(SB) → 디자인 보드 → 검수를 만드는 키트입니다. Claude Code에서는 플러그인으로, 다른 에이전트에서는 아래처럼 씁니다.

## 사용자가 "시작", "화면설계서 만들어줘", "기획서 보고 화면 설계"라고 하면

1. `skills/screen-spec-kit/SKILL.md`를 읽고 그 **작업 폴더 · 첫 메시지 형식 · 단계 지도 · 진행 규칙**을 그대로 따른다(0. 시작 질문부터). 이 저장소 안에서 열렸다면 결과물은 저장소 밖 작업 폴더(기본 `../<프로젝트명>-spec`)에 만든다.
2. 각 단계에서 표에 적힌 하위 스킬 파일(`skills/<이름>/SKILL.md`)을 읽는다.
3. 단계마다 `〔n/7 단계명〕` 머리말, 확인 질문, 다음 단계 예고를 붙인다. 사용자가 "알아서 끝까지"라고 하면 자동 모드.
4. 진행 상황은 작업 폴더의 `spec-kit/progress.md`에 기록한다(양식: `templates/intake/progress.md`).

## Claude 전용 도구 대신 쓰는 것

- Artifact 게시 → 작업 폴더에서 `python -m http.server 8768 --bind 127.0.0.1`을 백그라운드로 띄우고 `http://127.0.0.1:8768/spec-kit/flowmap.html`을 알려 준다. 다 보면 서버를 끈다. 못 띄우면 `flowmap.html` 파일 경로(더블클릭으로도 보임).
- Claude in Chrome(사이트 측정 · 자동 검수) → 사용자에게 캡처와 개발자 도구 결과를 받고, 검수는 `check_docs.py` · 빌드 숫자로 대신한 뒤 "브라우저 검수 안 함"이라고 보고한다. Playwright가 있으면 `scripts/audits/*.js`를 페이지에서 실행해도 된다.
- AskUserQuestion → 번호 목록 질문(항목마다 기본값).

## 명령

```bash
python scripts/check_docs.py --docs <docs 폴더> --screens D1,F1,...
python scripts/build_kit.py <spec-kit 폴더>                       # → flowmap.html
node scripts/export_design.mjs <spec-kit 폴더> <spec-kit 폴더>/design      # → design/project/*.dc.html
python scripts/install_skills.py --codex                           # 스킬을 ~/.agents/skills 로 설치
```

## 지킬 것

- `engine/`은 고치지 않는다. 프로젝트 값은 `project.js` · `sb-pages.js` · `theme.css` · `docs/`에 쓴다.
- 운영 사이트에 로그인하거나 저장 · 삭제를 누르지 않는다. 비밀번호 · 키를 입력하지 않는다.
- 예시(`examples/demo-park`)는 가상이다. 실제 기관 · 개인 정보를 넣지 않는다.
