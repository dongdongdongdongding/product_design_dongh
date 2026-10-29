# screen-spec-kit — 작업 메모 (Claude Code용)

- 이 저장소는 Claude Code 플러그인이다. 진입점 스킬은 `skills/screen-spec-kit/SKILL.md`.
- 엔진(`engine/`)은 프로젝트 공통이다. 특정 프로젝트 문구 · ID 접두어를 넣지 말고 `PROJECT` · `SBCONF` 설정으로 받는다.
- 빌드: `python scripts/build_kit.py <프로젝트 폴더>` → `<폴더>/flowmap.html`. 문서 검사: `python scripts/check_docs.py --docs <docs>`.
- 검수는 `python -m http.server --bind 127.0.0.1`로 띄우고 `scripts/audits/*.js`를 페이지에서 실행한다(`file://` 안 됨).
- 문자열을 일괄 치환할 때는 먼저 등장 횟수를 센다. 같은 글자가 다른 화면 제목에도 있을 수 있다.
- 예시(`examples/demo-park`)는 가상이다. 실제 기관 · 개인 정보를 넣지 않는다.
- 엔진을 고친 뒤에는 예시를 다시 빌드하고 두 검수 스크립트가 0건인지 확인한다.
