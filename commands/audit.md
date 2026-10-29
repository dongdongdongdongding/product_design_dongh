---
description: 플로우 맵 · 화면설계서 · 디자인 캔버스를 로컬 서버와 Chrome으로 자동 검수하고 최종 검증 결과를 보고한다
argument-hint: <spec-kit 폴더>
---

artifact-qa 스킬을 따른다.

1. spec-kit 폴더의 부모에서 `python -m http.server 8768 --bind 127.0.0.1`을 백그라운드로 띄운다.
2. Chrome 새 탭에서 flowmap.html을 열고 `scripts/audits/flowmap-sb.js`, `flowmap-routes.js`를 `await`로 실행한다.
3. 디자인 폴더가 있으면 harness.html을 복사해 열고 `design-canvas.js`를 실행한다(BOARDS를 프로젝트 화면 ID로 바꿔서).
4. 결과를 "검사 · 결과 · 판정" 표로 보고하고, 고칠 것을 제안한다. 사용자가 고치라고 하면 고친 뒤 같은 검사를 다시 돌린다.
5. 서버를 끄고 탭을 닫는다.
