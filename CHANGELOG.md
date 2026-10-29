# Changelog

형식은 [Keep a Changelog](https://keepachangelog.com/ko/1.1.0/)를 따르고, 버전은 [SemVer](https://semver.org/lang/ko/)를 씁니다.

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
