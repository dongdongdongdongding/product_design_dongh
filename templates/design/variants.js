  // 시안 비교 — 같은 화면을 서로 다른 방향 2~4개로 (export_design.mjs → 캔버스 맨 위 '시안 비교' 행, V-<key>.dc.html)
  // project.js와 같은 범위라 shell() · head() · card() · field() 같은 시안 도구와 H를 그대로 쓴다.
  // 시안끼리 의미 있는 축 1~2개가 달라야 한다(밀도 · 배치 · 탐색 · 편집 방식 · 톤). 색만 다른 시안은 시안이 아니다.
  // css는 그 시안에만 걸리게 .v-<key> 로 시작한다. 시안도 기획 밀도 기준을 지킨다(실제 데이터 · 필터 · 상태).
  const VARIANTS = {
    screen: 'L1', title: '항목 목록 — 방향 3가지',
    items: [
      { key: 'A', name: '운영 사이트 톤 그대로', desc: '표 중심 · 행 40px · 기존 사이드바 (근거: 운영 사이트 측정)', css: '', html: () => H.L1() },
      { key: 'B', name: '정제형', desc: '8px 격자 · 카드 반경 12 · 주 색 면적 최소 · 그림자 약하게 (근거: HIG 위계 · 레퍼런스 ②)',
        css: '.v-B .scr .c { border-radius: 12px; box-shadow: 0 1px 3px rgba(17,24,39,.06); border: 1px solid #EEF0F3 } .v-B .scr .btn { border-radius: 8px; height: 34px } .v-B .scr table.t td { height: 44px }',
        html: () => H.L1() },
      { key: 'C', name: '분할 패널', desc: '목록 + 오른쪽 상세 패널, 촘촘한 표 · 목록을 떠나지 않고 편집 (근거: 레퍼런스 ④⑥)',
        css: '.v-C .scr table.t td { height: 32px; font-size: 13px }',
        html: () => shell('item', head(['항목 관리'], '<span class="btn pri sm">+ 신규</span>') + '<div class="row" style="flex:1">' +
          card('항목 목록 <span class="cnt">12건</span>', '<table class="t"><tr><th>이름</th><th>상태</th><th>수정일</th></tr><tr><td>항목 A</td><td><span class="tg t-wr">확인 필요</span></td><td>10-28</td></tr><tr><td>항목 B</td><td><span class="tg t-ok">정상</span></td><td>10-27</td></tr></table>', { style: 'flex:1.4' }) +
          card('항목 A', '<div style="display:grid;gap:12px">' + field('이름', '항목 A', { req: 1 }) + field('분류', '분류 1', { sel: 1 }) + '<div style="display:flex;gap:6px;justify-content:flex-end"><span class="btn">취소</span><span class="btn pri">저장</span></div></div>', { style: 'flex:1' }) + '</div>') }
    ]
  };
