  // =====================================================================
  // 가상 예시: 푸른숲 도시공원 시설 예약 관리 — 실제 기관 · 서비스와 관계없음
  // 엔진 계약: PROJECT · SHARE · H · SCREENS · FLOWS · ISSUES
  // =====================================================================
  const PROJECT = {
    title: '푸른숲공원 예약 관리 플로우 맵',
    eyebrow: '푸른숲공원 예약 관리 · 추가개발 v1.1 (가상 예시)',
    intro: '공원 시설(캠핑장 · 체육시설 · 회의실)을 지도에서 등록하고, 시민 예약을 승인 · 반려하는 관리자 화면 흐름입니다.',
    start: 'D1',
    issueStates: { done: 'v1.1 반영', ask: '반영 · 운영팀 확인' },
    dataLead: '상세명세 12장. 시설 등록은 기존 시설 API로 저장하고, 예약 승인 · 반려는 기존 예약 테이블의 상태만 바꿉니다. 새 테이블은 만들지 않습니다.',
    docs: { logTitle: 'v1.1 검토 보완', rtmLead: '요청서 · 기획서 요구 항목이 어느 기능 ID로 처리되는지 보여 줍니다.', atLead: '테스트 데이터로만 수행합니다. 실제 시민 예약은 승인 · 반려하지 않습니다.' },
    overviewTop: (done) => '<div><h5>검토 결과 <span>' + done + '/' + ISSUES.length + ' 반영</span></h5><ul><li>시설 위치는 지도에서만 고르고 좌표를 직접 입력하지 않습니다.</li><li>반려 시 사유를 필수로 받습니다.</li><li>동시에 처리된 예약은 다시 승인하지 않습니다.</li><li>WBS 기준 ' + DOC.wbsBase.toFixed(1) + '인일.</li></ul></div>',
    overviewBottom: '<div><h5>범위 원칙</h5><p style="margin:0">기존 예약 · 결제 흐름은 유지합니다. 신규는 관리자 화면과 상태 변경뿐이며 새 DB 테이블은 없습니다.</p></div>',
    transData: { 'D1>B1': '상태 필터(승인 대기)', 'D1>B2': '예약 ID', 'D1>F1': '없음', 'F1>F2': '시설 ID (신규면 없음)', 'F2>F1': '저장한 시설 ID', 'B1>B2': '예약 ID', 'B2>B1': '처리 결과 · 목록 새로고침' }
  };
  const SHARE = {};

  // ---------- 시안 도구 (배포 사이트 틀: 사이드바 · 상단 바 · 브레드크럼 · 카드) ----------
  const I = { tree: '<path d="M12 3l6 8h-4l4 6H6l4-6H6z"/><path d="M12 17v4"/>', cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>', dash: '<rect x="3" y="3" width="8" height="10" rx="1" fill="currentColor" stroke="none"/><rect x="13" y="3" width="8" height="6" rx="1" fill="currentColor" stroke="none"/><rect x="3" y="15" width="8" height="6" rx="1" fill="currentColor" stroke="none"/><rect x="13" y="11" width="8" height="10" rx="1" fill="currentColor" stroke="none"/>', list: '<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>', cog: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3"/>' };
  const ic = (k) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' + (I[k] || '') + '</svg>';
  // 사이드 메뉴: [키, 아이콘, 이름, 이동 화면ID, 신규 여부]
  const NAV = [['dash', 'dash', '대시보드', 'D1', 0], ['fac', 'tree', '시설 관리', 'F1', 1], ['book', 'cal', '예약 관리', 'B1', 1], ['sys', 'cog', '시스템관리', '', 0]];
  const BRAND = '푸른숲공원 <b>관리자</b>', USER = '운영팀 님', FOOTER = 'Copyright © Example Park Office. All Rights Reserved';
  function shell(active, body, o) {
    o = o || {};
    const nav = NAV.map((n) => '<div class="nv' + (n[0] === active ? ' on' : '') + '"' + (n[3] ? ' data-nav="' + n[3] + '"' : '') + '>' + ic(n[1]) + n[2] + (n[4] ? '<small>신규</small>' : '') + '</div>').join('');
    return '<div class="scr"><aside class="sb"><div class="sbh"><div class="logo"><i></i><span>' + BRAND + '</span></div><div class="burger"><i></i><i></i><i></i></div></div><div class="nav">' + nav + '</div></aside>' +
      '<header class="tp"><span class="user">' + USER + '<i></i></span></header><div class="ct">' + body + '</div><footer class="ftr">' + FOOTER + '</footer>' + (o.over || '') + '</div>';
  }
  const crumb = (path) => '<span class="crumb"><span class="h">홈</span>' + path.map((p) => '<s>&gt;</s>' + p).join('') + '</span>';
  const head = (path, extra) => '<div class="ph">' + crumb(path) + '<div class="acts">' + (extra || '') + '</div></div>';
  const seg = (opts, on) => '<div class="seg">' + opts.map((t, i) => '<span class="' + (i === on ? 'on' : '') + '">' + t + '</span>').join('') + '</div>';
  const kpi = (k, v, s, go) => '<div class="c kpi"' + (go ? ' data-go="' + go + '"' : '') + '><div class="k">' + k + '</div><div class="v">' + v + '</div><div class="s">' + s + '</div></div>';
  const card = (title, body, o) => { o = o || {}; return '<div class="c"' + (o.style ? ' style="' + o.style + '"' : '') + '><div class="ch">' + title + (o.r ? '<span class="r">' + o.r + '</span>' : '') + '</div>' + body + '</div>'; };
  const field = (label, val, o) => { o = o || {}; return '<div><div class="lab">' + label + (o.req ? ' <em>*</em>' : '') + '</div><div class="' + (o.sel ? 'sel' : 'inp') + (o.ph ? ' ph-t' : '') + (o.ro ? ' ro' : '') + (o.err ? ' err' : '') + '">' + val + '</div>' + (o.msg ? '<div class="msg' + (o.err ? ' err' : '') + '">' + o.msg + '</div>' : '') + '</div>'; };
  // 팝업 화면: 뒤 화면을 깔 때 그 화면의 연결(data-go)을 끈다 → shell(키, '<div class="dimmed">' + nogo(H.L1()) + '</div>', { over: '<div class="shade"></div><div class="modal" style="left:420px;top:160px;width:600px"><h3>제목<span class="x" data-go="L1">✕</span></h3><div class="mb">…</div><div class="foot">…</div></div>' })
  const nogo = (h) => h.replace(/ data-go="/g, ' data-x="');
  // 설계용 지도 자리 (실제 지도 SDK가 아님). 지도가 없는 프로젝트는 쓰지 않는다
  // 설계용 지도 자리 (실제 지도 SDK가 아님): 공원 녹지 · 산책로 · 호수 위에 시설 핀
  const PIN = { ok: '#2E9E6B', off: '#9AA3AF', sel: '#E8554E' };
  const mapBox = (pins, style) => '<div class="mapw" style="' + (style || '') + '"><svg class="map" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="800" height="500" fill="#EEF3EA"/>' +
    '<path d="M60 60h520l120 140-40 260H90z" fill="#D9EBCF"/><ellipse cx="430" cy="300" rx="120" ry="70" fill="#CFE6F5"/><path d="M0 420C180 380 360 440 800 360" stroke="#FBDB72" stroke-width="8" fill="none"/><path d="M120 120C260 200 300 160 420 220S640 180 660 300" stroke="#FFFFFF" stroke-width="5" stroke-dasharray="2 8" stroke-linecap="round" fill="none"/>' +
    (pins || []).map((p) => '<g transform="translate(' + p[0] + ' ' + p[1] + ')"><path d="M0 0C-3-6-11-11-11-19a11 11 0 0 1 22 0c0 8-8 13-11 19z" fill="' + PIN[p[2] || 'ok'] + '" stroke="#FFF" stroke-width="1.5"/><circle cy="-19" r="4" fill="#FFF"/></g>').join('') + '</svg></div>';
  const PINS = [[180, 170, 'ok'], [300, 240, 'ok'], [560, 200, 'off'], [620, 330, 'ok'], [250, 360, 'ok']];

  // ---------- 화면 시안 ----------
  const H = {};
  H.D1 = () => shell('dash', head(['대시보드']) +
    '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px">' + kpi('오늘 예약', '18건', '어제보다 +4', 'B1') + kpi('승인 대기', '4건', '24시간 안에 처리', 'B1') + kpi('점검 중 시설', '1곳', '전체 5곳', 'F1') + '</div>' +
    '<div class="row" style="flex:1">' + card('시설 위치', mapBox(PINS, 'height:100%'), { style: 'flex:1.5;display:flex;flex-direction:column' }) +
      card('승인 대기 예약', '<table class="t tight"><tr><th>시설</th><th>이용일</th><th></th></tr>' + [['캠핑장 A구역', '11-02'], ['풋살장', '11-03'], ['숲속 회의실', '11-05']].map((r) => '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td class="r"><span class="btn sm" data-go="B2">확인</span></td></tr>').join('') + '</table>', { style: 'flex:1' }) + '</div>');
  const FAC = [['캠핑장 A구역', '캠핑', '40명', '<span class="tg t-ok">운영</span>'], ['풋살장', '체육', '20명', '<span class="tg t-ok">운영</span>'], ['숲속 회의실', '실내', '16명', '<span class="tg t-ok">운영</span>'], ['야외 무대', '공연', '200명', '<span class="tg t-wr">점검 중</span>'], ['피크닉장', '야외', '60명', '<span class="tg t-ok">운영</span>']];
  H.F1 = () => shell('fac', head(['시설 관리'], '<span class="btn pri sm" data-go="F2">+ 시설 등록</span>') +
    '<div class="row" style="flex:1">' + card('시설 지도', mapBox(PINS, 'height:100%'), { style: 'flex:1;display:flex;flex-direction:column' }) +
    card('시설 목록 <span class="cnt">5곳</span>', '<div class="inp ph-t" style="margin-bottom:12px">시설명 검색</div><table class="t"><tr><th>시설명</th><th>유형</th><th>수용</th><th>상태</th><th></th></tr>' +
      FAC.map((r) => '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td><td class="r"><span class="btn sm" data-go="F2">수정</span></td></tr>').join('') + '</table>', { style: 'flex:1.2' }) + '</div>');
  H.F2 = () => shell('fac', head(['시설 관리', '등록']) +
    '<div class="row" style="flex:1">' + card('시설 정보', '<div style="display:grid;gap:12px">' + field('시설명', '캠핑장 B구역', { req: 1 }) + field('유형', '캠핑', { sel: 1 }) +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' + field('수용 인원', '30', { req: 1 }) + field('이용 시간', '09:00 ~ 21:00') + '</div>' +
      '<div><div class="lab">운영 상태</div>' + seg(['운영', '점검 중'], 0) + '</div>' + field('안내 문구', '시민에게 보이는 안내 (500자 이하)', { ph: 1 }) +
      '<div style="display:flex;gap:6px;justify-content:flex-end"><span class="btn" data-go="F1">취소</span><span class="btn pri" data-go="F1">저장</span></div></div>', { style: 'flex:1' }) +
    card('위치 선택', '<div class="note i" style="margin-bottom:10px">지도를 눌러 위치를 고르세요. 좌표는 직접 입력하지 않습니다.</div>' + mapBox(PINS.concat([[470, 160, 'sel']]), 'flex:1') + '<div class="msg">선택한 위치: 북쪽 잔디광장 옆</div>', { style: 'flex:1.3;display:flex;flex-direction:column' }) + '</div>');
  const BK = [['R-1102-07', '캠핑장 A구역', '11-02', '김○○', '<span class="tg t-wr">승인 대기</span>'], ['R-1103-02', '풋살장', '11-03', '이○○', '<span class="tg t-wr">승인 대기</span>'], ['R-1101-11', '숲속 회의실', '11-01', '박○○', '<span class="tg t-ok">승인</span>'], ['R-1031-04', '피크닉장', '10-31', '최○○', '<span class="tg">반려</span>']];
  H.B1 = () => shell('book', head(['예약 관리']) +
    card('예약 목록 <span class="cnt">4건</span>', '<div style="display:flex;gap:10px;margin-bottom:12px">' + seg(['전체', '승인 대기', '승인', '반려'], 1) + '<div class="inp ph-t" style="flex:1">예약 번호 · 신청자 검색</div></div><table class="t"><tr><th>예약 번호</th><th>시설</th><th>이용일</th><th>신청자</th><th>상태</th><th></th></tr>' +
      BK.map((r) => '<tr><td class="mono">' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td><td>' + r[4] + '</td><td class="r"><span class="btn sm" data-go="B2">상세</span></td></tr>').join('') + '</table>', { style: 'flex:1' }));
  H.B2 = () => shell('book', '<div class="dimmed">' + nogo(H.B1()) + '</div>', { over: '<div class="shade"></div><div class="modal" style="left:470px;top:150px;width:560px"><h3>예약 상세 · R-1102-07<span class="x" data-go="B1">✕</span></h3><div class="mb">' +
    '<table class="t tight"><tr><td>시설</td><td>캠핑장 A구역</td></tr><tr><td>이용일</td><td>11-02 (토) 1박</td></tr><tr><td>인원</td><td>4명</td></tr><tr><td>신청자</td><td>김○○ · 010-****-1234</td></tr></table>' +
    field('반려 사유', '반려할 때만 입력 (200자 이하)', { ph: 1 }) + '</div><div class="foot"><span class="btn danger" data-go="B1">반려</span><span class="btn pri" data-go="B1">승인</span></div></div>' });

  // ---------- 화면 정의 ----------
  const SCREENS = [
    { id: 'D1', flow: 'dash', kind: '페이지', title: '대시보드', purpose: '오늘 예약과 처리할 일을 한 화면에서 봅니다.', feat: ['DASH-01', 'DASH-02'], parts: ['현황 카드 3개', '시설 위치 지도', '승인 대기 예약'], states: ['대기 0건 → "처리할 예약이 없습니다."'], rules: ['카드 수치는 예약 목록과 같은 기준'], ex: ['EX-01'], at: ['AT-01'] },
    { id: 'F1', flow: 'fac', kind: '페이지', title: '시설 목록 · 지도', purpose: '시설을 지도와 목록으로 함께 관리합니다.', feat: ['FAC-01'], parts: ['시설 지도', '검색', '시설 목록', '시설 등록 버튼'], states: ['검색 결과 없음'], rules: ['점검 중 시설은 회색 핀'], ex: ['EX-01', 'EX-06'], at: ['AT-02'] },
    { id: 'F2', flow: 'fac', kind: '페이지', title: '시설 등록 · 위치 선택', purpose: '시설 정보를 입력하고 위치를 지도에서 고릅니다.', feat: ['FAC-02', 'FAC-03'], parts: ['시설명 · 유형 · 수용 인원 · 이용 시간 · 운영 상태 · 안내 문구', '위치 지도', '취소 · 저장'], states: ['위치 미선택 → 저장 차단', '시설명 중복 → 안내'], rules: ['좌표 직접 입력 없음'], ex: ['EX-02', 'EX-03', 'EX-07'], at: ['AT-03'] },
    { id: 'B1', flow: 'book', kind: '페이지', title: '예약 목록', purpose: '예약을 상태별로 보고 처리합니다.', feat: ['BOOK-01'], parts: ['상태 탭', '검색', '예약 목록'], states: ['검색 결과 없음'], rules: ['기본 탭은 승인 대기'], ex: ['EX-06'], at: ['AT-04'] },
    { id: 'B2', flow: 'book', kind: '팝업', title: '예약 상세 · 승인/반려', purpose: '예약 내용을 확인하고 승인하거나 반려합니다.', feat: ['BOOK-02'], parts: ['예약 정보', '반려 사유', '반려 · 승인'], states: ['반려 사유 공백 → 반려 차단', '이미 처리됨 → 안내 후 새로고침'], rules: ['신청자 연락처는 가려서 표시'], ex: ['EX-04', 'EX-05'], at: ['AT-04'] }
  ];
  const FLOWS = [
    { id: 'dash', no: '01', title: '대시보드', desc: '오늘 현황과 처리할 일', screens: ['D1'] },
    { id: 'fac', no: '02', title: '시설 관리', desc: '시설 등록 · 수정 · 위치', screens: ['F1', 'F2'] },
    { id: 'book', no: '03', title: '예약 관리', desc: '예약 승인 · 반려', screens: ['B1', 'B2'] }
  ];
  const ISSUES = [
    { id: 'RV-01', scr: 'F2', sev: 'high', st: 'done', t: '좌표 직접 입력으로 위치 오류', src: '기획서 3쪽', p: '위도 · 경도 입력칸이 있어 잘못된 좌표가 저장될 수 있습니다.', fx: '지도 선택만 허용하고 입력칸을 없앴습니다(FAC-03, EX-03).' },
    { id: 'RV-02', scr: 'B2', sev: 'mid', st: 'done', t: '반려 사유 없이 반려 가능', src: '요청서 2.3', p: '시민이 반려 이유를 알 수 없습니다.', fx: '반려 시 사유 필수(EX-04).' },
    { id: 'RV-03', scr: 'B2', sev: 'mid', st: 'ask', t: '두 관리자가 같은 예약을 동시에 처리', src: '운영 인터뷰', p: '먼저 처리된 예약을 다시 승인할 수 있습니다.', fx: '저장 직전 상태를 다시 확인하고 안내(EX-05).', rest: '서버의 상태 확인 응답 형식 확인 필요' },
    { id: 'RV-04', scr: 'D1', sev: 'low', st: 'done', t: '카드 수치와 목록 수 불일치', src: '기획서 1쪽', p: '대시보드는 전체, 목록은 오늘 기준이었습니다.', fx: '같은 기준으로 맞췄습니다.' }
  ];
