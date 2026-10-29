---
description: 검수가 끝난 플로우 맵과 디자인 캔버스를 Artifact로 게시(또는 갱신)한다
argument-hint: <spec-kit 폴더> [플로우 맵 URL] [디자인 캔버스 URL]
---

1. 마지막 검수 결과가 0건인지 확인한다. 아니면 먼저 audit을 권한다.
2. 플로우 맵: URL이 없으면 새로 게시(icon `map`), 있으면 그 URL로 갱신한다. 같은 대화에서 게시한 파일이면 같은 file_path로 다시 게시한다.
3. 디자인 캔버스: design-canvas 스킬의 게시 절차(Design 타입, root · file_path · files). 갱신 전에 최신본을 읽어 다른 사람이 바꾼 파일이 있는지 비교한다.
4. 링크 공유 상태라 보는 사람에게 즉시 반영되면 그렇다고 알린다. 두 링크와 버전을 보고한다.
