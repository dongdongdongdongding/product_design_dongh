  // =====================================================================
  // 프로젝트 데이터 (엔진 계약) — 이 파일이 정의해야 하는 이름:
  //   PROJECT · SHARE · H(화면ID → 시안 HTML 함수) · SCREENS · FLOWS · ISSUES
  // 시안은 theme.css 의 .scr 클래스로 그린다. 1440 × 900, 다른 화면으로 가는 요소에는 data-go="화면ID".
  // =====================================================================
  const PROJECT = {
    title: '<서비스명> 플로우 맵',
    eyebrow: '<서비스명> · 추가개발 v1.0',
    intro: '<무엇을 추가 · 개편하는 범위의 화면 흐름인지 한두 문장>',
    start: 'D1',
    dataLead: '상세명세 12장. 신규 입력의 처리 위치와 서버 · DB 영향입니다.',
    // 오른쪽 기본 패널 (검토 결과 · 디자인 링크 등)
    overviewTop: (done) => '<div><h5>검토 결과 <span>' + done + '/' + ISSUES.length + ' 반영</span></h5><ul><li>&lt;검토에서 바꾼 핵심 1&gt;</li></ul></div>',
    overviewBottom: '<div><h5>범위 원칙</h5><p style="margin:0">&lt;기존 기능 유지 · 신규는 UI와 고정 데이터 · 운영 API · DB 신규 없음 등&gt;</p></div>',
    // 연결선 정보 패널의 '넘기는 값' ('출발>도착': 설명)
    transData: { 'L1>E1': '선택한 항목 ID' }
  };
  const SHARE = {};   // 12.2 입력 필드를 다른 화면에도 보여 줄 때: 화면ID → ['원래화면:키']

  // ---------- 시안 도구 (배포 사이트 틀: 사이드바 · 상단 바 · 브레드크럼 · 카드) ----------
  const I = { dash: '<rect x="3" y="3" width="8" height="10" rx="1" fill="currentColor" stroke="none"/><rect x="13" y="3" width="8" height="6" rx="1" fill="currentColor" stroke="none"/><rect x="3" y="15" width="8" height="6" rx="1" fill="currentColor" stroke="none"/><rect x="13" y="11" width="8" height="10" rx="1" fill="currentColor" stroke="none"/>', list: '<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>', cog: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3"/>' };
  const ic = (k) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' + (I[k] || '') + '</svg>';
  // 사이드 메뉴: [키, 아이콘, 이름, 이동 화면ID, 신규 여부]
  const NAV = [['dash', 'dash', '대시보드', 'D1', 0], ['item', 'list', '항목 관리', 'L1', 1], ['sys', 'cog', '시스템관리', '', 0]];
  const BRAND = '<서비스> <b>관리자</b>', USER = '관리자 님', FOOTER = 'Copyright © <회사>. All Rights Reserved';
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
  const mapBox = (pins, style) => '<div class="mapw" style="' + (style || '') + '"><svg class="map" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="800" height="500" fill="#EEF1EC"/><path d="M0 380C200 350 420 372 800 300" stroke="#FBDB72" stroke-width="8" fill="none"/>' + (pins || []).map((p) => '<g transform="translate(' + p[0] + ' ' + p[1] + ')"><path d="M0 0C-3-6-11-11-11-19a11 11 0 0 1 22 0c0 8-8 13-11 19z" fill="#3C83E8" stroke="#FFF" stroke-width="1.5"/></g>').join('') + '</svg></div>';

  // ---------- 화면 시안 ----------
  const H = {};
  H.D1 = () => shell('dash', head(['대시보드']) +
    '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px">' + kpi('등록 항목', '12건', '이번 달 +3', 'L1') + kpi('확인 필요', '2건', '정보 부족', 'L1') + kpi('최근 수정', '10-28', '관리자') + '</div>' +
    '<div class="row" style="flex:1">' + card('위치', mapBox([[300, 260], [480, 220]], 'height:100%'), { style: 'flex:1.5;display:flex;flex-direction:column' }) +
      card('먼저 확인하세요', '<table class="t tight"><tr><td>항목 A 정보 부족</td><td class="r"><span class="btn sm" data-go="E1">확인</span></td></tr></table>', { style: 'flex:1' }) + '</div>');
  H.L1 = () => shell('item', head(['항목 관리'], '<span class="btn pri sm" data-go="E1">+ 신규</span>') +
    card('항목 목록 <span class="cnt">12건</span>', '<table class="t"><tr><th>이름</th><th>상태</th><th>수정일</th><th></th></tr>' +
      [['항목 A', '<span class="tg t-wr">확인 필요</span>'], ['항목 B', '<span class="tg t-ok">정상</span>']].map((r) => '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td>10-28</td><td class="r"><span class="btn sm" data-go="E1">수정</span></td></tr>').join('') + '</table>', { style: 'flex:1' }));
  H.E1 = () => shell('item', head(['항목 관리', '수정']) +
    card('항목 편집', '<div style="display:grid;gap:12px;max-width:520px">' + field('이름', '항목 A', { req: 1 }) + field('분류', '분류 1', { sel: 1 }) + '<div><div class="lab">상태</div>' + seg(['사용', '사용 안 함'], 0) + '</div>' + field('비고', '설정 근거 (1,000자 이하)', { ph: 1 }) +
      '<div style="display:flex;gap:6px;justify-content:flex-end"><span class="btn" data-go="L1">취소</span><span class="btn pri" data-go="L1">저장</span></div></div>', { style: 'flex:1' }));

  // ---------- 화면 정의 ----------
  // id · flow(FLOWS id) · kind · title · purpose · feat(기능 ID) · parts · states · rules · ex · at
  const SCREENS = [
    { id: 'D1', flow: 'dash', kind: '페이지', title: '대시보드', purpose: '<이 화면의 목적>', feat: ['DASH-01'], parts: ['현황 카드 3개', '위치 지도', '먼저 확인하세요'], states: ['목록 0건 → 빈 상태 안내'], rules: ['카드 수치는 목록과 같은 기준으로 계산'], ex: ['EX-01'], at: ['AT-01'] },
    { id: 'L1', flow: 'item', kind: '페이지', title: '항목 목록', purpose: '<목적>', feat: ['COM-01'], parts: ['목록 표', '신규 버튼'], states: ['검색 결과 없음'], rules: [], ex: [], at: [] },
    { id: 'E1', flow: 'item', kind: '패널 상태', title: '항목 편집', purpose: '<목적>', feat: ['COM-01'], parts: ['이름 · 분류 · 상태 · 비고', '취소 · 저장'], states: ['이름 공백 → 저장 차단'], rules: [], ex: [], at: [] }
  ];
  const FLOWS = [
    { id: 'dash', no: '01', title: '대시보드', desc: '<메뉴 설명>', screens: ['D1'] },
    { id: 'item', no: '02', title: '항목 관리', desc: '<메뉴 설명>', screens: ['L1', 'E1'] }
  ];
  // 검토 이슈: { id, scr(화면ID 또는 null), sev: high|mid|low, st: done|ask, t, src, p(문제), fx(조치), rest(남은 확인) }
  const ISSUES = [
    { id: 'RV-01', scr: 'D1', sev: 'mid', st: 'done', t: '<검토에서 찾은 문제>', src: '<근거 문서 위치>', p: '<문제 설명>', fx: '<문서 · 화면에 반영한 내용>' }
  ];
