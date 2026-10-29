# 기여 안내

고마워요! 버그 · 아이디어 · 문서 개선 모두 환영합니다.

## 시작

```bash
git clone https://github.com/donghk-cloud/screen-spec-kit && cd screen-spec-kit
python scripts/check_docs.py --docs examples/demo-park/docs --screens D1,F1,F2,B1,B2
python scripts/build_kit.py examples/demo-park
python -m http.server 8768 --bind 127.0.0.1
```

브라우저에서 `http://127.0.0.1:8768/examples/demo-park/flowmap.html`을 열고, 개발자 도구 콘솔에서 검수 스크립트를 돌립니다.

```js
await (0, eval)(await (await fetch('/scripts/audits/flowmap-sb.js')).text())      // "SB 점검: 0건" 이어야 함
await (0, eval)(await (await fetch('/scripts/audits/flowmap-routes.js')).text())  // "화면 관통 0" 이어야 함
```

## PR 전 확인

- [ ] `check_docs.py`가 모두 OK
- [ ] `build_kit.py examples/demo-park`가 성공
- [ ] 엔진을 고쳤다면 두 검수 스크립트가 0건
- [ ] 문서 표 머리행을 바꿨다면 `skills/spec-docs/references/doc-tables.md`도 고침
- [ ] 예시에 실제 기관 · 서비스 · 개인 정보가 들어가지 않음

## 좋은 첫 기여

- 새 가상 예시(예: 사내 장비 대여, 민원 접수) — 다른 화면 패턴을 시험합니다.
- `theme.css` 프리셋(부트스트랩 관리자, Ant Design 등).
- 영어 문서 · 영어 SB 라벨.
- 지도가 없는 프로젝트를 위한 SB 지도 페이지 자동 생략 개선.
- `source-intake`의 원본 형식 추가(HWPX 표, Figma 링크).

## 규칙

- 엔진(`engine/`)에는 특정 프로젝트 문구를 넣지 않습니다. 프로젝트별 값은 `project.js` · `sb-pages.js`의 설정으로 받습니다.
- 커밋 메시지는 한국어 · 영어 모두 좋습니다. 무엇을 왜 바꿨는지 한 줄로 씁니다.
