  // 컴포넌트 × 상태 표 (export_design.mjs → DS-components 보드). project.js와 같은 범위라 field() · seg() 같은 시안 도구를 쓴다.
  const COMPONENTS = [
    { name: '버튼', desc: '주 버튼은 화면마다 하나, 오른쪽 끝', states: [
      { label: '주', html: '<span class="btn pri">저장</span>' }, { label: '보조', html: '<span class="btn">취소</span>' },
      { label: '위험', html: '<span class="btn danger">반려</span>' }, { label: '비활성(권한 없음)', html: '<span class="btn pri dis">승인</span>' }, { label: '작게', html: '<span class="btn sm">수정</span>' }] },
    { name: '입력', desc: '라벨 위, 오류는 입력 아래', states: [
      { label: '기본', html: field('시설명', '캠핑장 A구역', { req: 1 }) }, { label: '빈 값', html: field('안내 문구', '시민에게 보이는 안내', { ph: 1 }) },
      { label: '오류', html: field('수용 인원', '0', { err: 1, msg: '1 이상의 숫자를 입력하세요.' }) }, { label: '읽기 전용', html: field('등록일', '2026-10-28', { ro: 1 }) }] },
    { name: '선택 · 세그먼트', states: [{ label: '선택', html: field('유형', '캠핑', { sel: 1 }) }, { label: '세그먼트', html: seg(['운영', '점검 중'], 0) }, { label: '상태 탭', html: seg(['전체 18', '승인 대기 4', '승인 12', '반려 2'], 1) }] },
    { name: '상태 배지', desc: '예약 · 시설 상태', states: [{ label: '운영 · 승인', html: '<span class="tg t-ok">운영</span>' }, { label: '대기 · 점검', html: '<span class="tg t-wr">승인 대기</span>' }, { label: '반려', html: '<span class="tg">반려</span>' }] },
    { name: '안내', desc: '공통 상태 (SCR-C1)', states: [{ label: '정보', html: '<div class="note i">핀을 누르면 수정 화면으로 갑니다.</div>' }, { label: '성공', html: '<div class="note g">저장했습니다.</div>' }, { label: '주의', html: '<div class="note w">이미 처리된 예약입니다.</div>' }, { label: '오류', html: '<div class="note e">불러오지 못했습니다.</div>' }] }
  ];
