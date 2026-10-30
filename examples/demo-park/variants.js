  // 시안 비교 — 시설 목록(F1)을 방향 3가지로. 디자인 캔버스 맨 위 행(V-A · V-B · V-C)
  // 근거 번호(가상 예시): ① 공공 체육시설 예약 관리자 화면 ② Apple HIG 위계 · 간격 ③ 데이터 표 패턴(Carbon) ④ 분할 상세 패널(Polaris)
  const fRows = FAC.map((r) => '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td><td>' + r[6] + '</td><td>' + r[4] + '</td><td>' + r[5] + '</td></tr>').join('');
  const VARIANTS = {
    screen: 'F1', title: '시설 목록 · 지도 — 방향 3가지',
    items: [
      { key: 'A', name: '지도 · 목록 나란히 (운영 사이트 톤)', desc: '지금 F1 그대로. 지도에서 위치를 보며 목록을 고친다 — 시설 위치가 업무의 중심일 때 (근거: 운영 사이트 측정 · ①)', css: '', html: () => H.F1() },
      { key: 'B', name: '목록 중심 · 정제형', desc: '표를 넓게, 지도는 위 띠로 줄임. 8px 격자 · 카드 반경 12 · 그림자 약하게 · 행 44px — 시설이 많아 비교 · 정렬이 주 업무일 때 (근거: ② · ③)',
        css: '.v-B .scr .c { border-radius: 12px; box-shadow: 0 1px 3px rgba(17,24,39,.06); border: 1px solid #EEF0F3 } .v-B .scr .btn { border-radius: 8px } .v-B .scr table.t td { height: 44px }',
        html: () => shell('fac', head(['시설 관리'], '<span class="btn sm">목록 내려받기</span><span class="btn pri sm" data-go="F2">+ 시설 등록</span>') +
          card('시설 지도 <span class="cnt">운영 7 · 점검 중 1</span>', mapBox(PINS, 'height:130px'), { r: '<span class="btn sm">지도 크게 보기</span>' }) +
          card('시설 목록 <span class="cnt">8곳</span>', '<div style="display:flex;gap:8px;margin-bottom:12px"><div class="inp ph-t" style="flex:1">시설명 검색</div><div class="sel" style="width:120px">유형 전체</div>' + seg(['전체', '운영', '점검 중'], 0) + '<div class="sel" style="width:170px">정렬: 이번 달 예약 순</div></div><table class="t"><tr><th>시설명</th><th>유형</th><th>수용</th><th>예약 단위</th><th>사용료</th><th>이번 달 예약</th><th>상태</th></tr>' + fRows + '</table>', { style: 'flex:1' })) },
      { key: 'C', name: '분할 패널 · 고밀도', desc: '목록 + 오른쪽 상세 · 수정 패널. 목록을 떠나지 않고 바로 고친다. 표 행 32px — 하루에 여러 시설을 자주 고칠 때 (근거: ④)',
        css: '.v-C .scr table.t td { height: 32px; font-size: 13px } .v-C .scr table.t th { font-size: 12px }',
        html: () => shell('fac', head(['시설 관리'], '<span class="btn pri sm" data-go="F2">+ 시설 등록</span>') + '<div class="row" style="flex:1">' +
          card('시설 목록 <span class="cnt">8곳</span>', '<div style="display:flex;gap:8px;margin-bottom:10px"><div class="inp ph-t" style="flex:1">시설명 검색</div>' + seg(['전체', '운영', '점검 중'], 0) + '</div><table class="t"><tr><th>시설명</th><th>유형</th><th>수용</th><th>단위</th><th>사용료</th><th>이번 달</th><th>상태</th></tr>' + fRows + '</table>', { style: 'flex:1.5' }) +
          card('캠핑장 A구역 <span class="tg t-ok">운영</span>', '<div style="display:grid;gap:10px">' + mapBox([[300, 240, 'sel']], 'height:150px') + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">' + field('수용 인원', '40', { req: 1 }) + field('예약 단위', '1박', { sel: 1 }) + field('사용료', '30,000원') + '<div><div class="lab">운영 상태</div>' + seg(['운영', '점검 중'], 0) + '</div></div>' + field('안내 문구', '화로 사용은 지정 구역에서만', {}) + '<div style="display:flex;gap:6px;justify-content:flex-end"><span class="btn">되돌리기</span><span class="btn pri">저장</span></div></div>', { style: 'flex:1' }) + '</div>') }
    ]
  };
