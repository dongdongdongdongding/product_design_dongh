---
description: 문서 정합 검사 후 플로우 맵(화면설계서 탭 포함)과 디자인 캔버스 보드를 다시 만든다
argument-hint: <spec-kit 폴더> [--design]
---

1. `python -I <플러그인>/scripts/check_docs.py --docs <kit.json의 docs> --screens <SCREENS id 목록>` — FAIL이 있으면 고칠 곳을 보여 주고 멈춘다.
2. `python -I <플러그인>/scripts/build_kit.py <spec-kit 폴더>` — 개수 불일치(expect)면 문서와 kit.json 중 어느 쪽이 맞는지 확인한다.
3. `--design`이 있으면 `node <플러그인>/scripts/export_design.mjs <spec-kit 폴더> <spec-kit 폴더>/design`. 이미 손으로 다듬은 캔버스가 있으면 덮어쓰지 말고 다른 폴더로 내보내 비교한다.
4. 결과 숫자(기능 · 예외 · 검수 · 필드 · 화면 · 보드)를 짧게 보고한다.
