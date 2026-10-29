---
description: 새 프로젝트의 화면 설계 폴더(spec-kit)를 시작 틀로 만들고 원본 자료 읽기부터 시작한다
argument-hint: <작업 폴더> [원본 파일 · 사이트 URL …]
---

screen-spec-kit 스킬을 연다. 그다음:

1. `$ARGUMENTS`의 첫 값을 작업 폴더로 보고, 플러그인의 `templates/project-starter`를 `<작업 폴더>/spec-kit`으로 복사한다(이미 있으면 덮어쓰지 않고 사용자에게 알린다).
2. `templates/intake/progress.md`를 `<작업 폴더>/spec-kit/progress.md`로 복사한다. 나머지 값(원본 파일 경로 · 배포 사이트 URL)으로 source-intake 스킬을 따라 `research/근거노트.md`를 만든다. 자료가 없으면 `templates/intake/자료요청.md` 표를 보여 주고 받는다.
3. 범위 원칙 · 산출물 용도(실제 개발 문서인지 시연인지) · 참고 화면설계서 유무를 한 번에 확인한다.
4. 단계 지도(자료 → 디자인 질문 → 초안 → 검토 · 개선 → 전체 확장 → SB · 디자인 → 검수)를 짧게 보여 주고 1단계 확인 지점부터 진행한다. 안내 없이 처음부터 대화로 하려면 `/screen-spec-kit:start`.
