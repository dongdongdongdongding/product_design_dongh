  // 컴포넌트 × 상태 표 (export_design.mjs → DS-components 보드). project.js와 같은 범위라 field() · seg() 같은 시안 도구를 쓴다.
  // 화면에서 3번 이상 나오는 것을 넣는다. 상태는 해당하는 것만 (skills/design-system/references/components.md).
  const COMPONENTS = [
    { name: '버튼', desc: '주 버튼은 화면마다 하나', states: [
      { label: '주', html: '<span class="btn pri">저장</span>' }, { label: '보조', html: '<span class="btn">취소</span>' },
      { label: '위험', html: '<span class="btn danger">삭제</span>' }, { label: '비활성', html: '<span class="btn pri dis">저장</span>' }, { label: '작게', html: '<span class="btn sm">수정</span>' }] },
    { name: '입력', states: [
      { label: '기본', html: field('이름', '홍길동', { req: 1 }) }, { label: '빈 값', html: field('메모', '내용을 입력하세요', { ph: 1 }) },
      { label: '오류', html: field('인원', '0', { err: 1, msg: '1명 이상 입력하세요' }) }, { label: '읽기 전용', html: field('등록일', '2026-10-28', { ro: 1 }) }] },
    { name: '선택 · 세그먼트', states: [{ label: '선택', html: field('분류', '분류 1', { sel: 1 }) }, { label: '세그먼트', html: seg(['전체', '사용', '중지'], 0) }] },
    { name: '상태 배지', states: [{ label: '정상', html: '<span class="tg t-ok">정상</span>' }, { label: '주의', html: '<span class="tg t-wr">확인 필요</span>' }, { label: '위험', html: '<span class="tg t-bad">중지</span>' }] }
  ];
