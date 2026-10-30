  // =====================================================================
  // 가상 예시: 푸른숲 도시공원 시설 예약 관리 — 실제 기관 · 서비스와 관계없음
  // 엔진 계약: PROJECT · SHARE · H · SCREENS · FLOWS · ISSUES
  // =====================================================================
  const PROJECT = {
    title: '푸른숲공원 예약 관리 플로우 맵',
    eyebrow: '푸른숲공원 예약 관리 · 추가개발 v1.2 (가상 예시)',
    intro: '공원 시설(캠핑장 · 체육시설 · 회의실)을 지도에서 등록하고, 시민 예약을 승인 · 반려하는 관리자 화면 흐름입니다.',
    start: 'D1',
    issueStates: { done: 'v1.2 반영', ask: '반영 · 운영팀 확인' },
    dataLead: '상세명세 12장. 시설 등록은 기존 시설 API로 저장하고, 예약 승인 · 반려는 기존 예약 테이블의 상태만 바꿉니다. 새 테이블은 만들지 않습니다.',
    docs: { logTitle: 'v1.2 검토 보완', rtmLead: '요청서 · 기획서 요구 항목이 어느 기능 ID로 처리되는지 보여 줍니다.', atLead: '테스트 데이터로만 수행합니다. 실제 시민 예약은 승인 · 반려하지 않습니다.' },
    overviewTop: (done) => '<div><h5>검토 결과 <span>' + done + '/' + ISSUES.length + ' 반영</span></h5><ul><li>시설 위치는 지도에서만 고르고 좌표를 직접 입력하지 않습니다.</li><li>반려 시 사유를 필수로 받습니다.</li><li>동시에 처리된 예약은 다시 승인하지 않습니다.</li><li>WBS 기준 ' + DOC.wbsBase.toFixed(1) + '인일.</li></ul></div>',
    overviewBottom: '<div><h5>범위 원칙</h5><p style="margin:0">기존 예약 · 결제 흐름은 유지합니다. 신규는 관리자 화면과 상태 변경뿐이며 새 DB 테이블은 없습니다.</p></div>',
    transData: { 'D1>B1': '상태 필터(승인 대기)', 'D1>B2': '예약 ID', 'D1>F1': '없음',  'F1>F2': '시설 ID (신규면 없음)', 'F2>F1': '저장한 시설 ID', 'B1>B2': '예약 ID', 'B2>B1': '처리 결과 · 목록 새로고침' }
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
  // 설계용 지도 자리 (실제 지도 SDK가 아님): 공원 녹지 · 산책로 · 호수 위에 시설 핀
  const PIN = { ok: '#2E9E6B', off: '#9AA3AF', sel: '#E8554E' };
  const mapBox = (pins, style) => '<div class="mapw" style="' + (style || '') + '"><svg class="map" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="800" height="500" fill="#EEF3EA"/>' +
    '<path d="M60 60h520l120 140-40 260H90z" fill="#D9EBCF"/><ellipse cx="430" cy="300" rx="120" ry="70" fill="#CFE6F5"/><path d="M0 420C180 380 360 440 800 360" stroke="#FBDB72" stroke-width="8" fill="none"/><path d="M120 120C260 200 300 160 420 220S640 180 660 300" stroke="#FFFFFF" stroke-width="5" stroke-dasharray="2 8" stroke-linecap="round" fill="none"/>' +
    (pins || []).map((p) => '<g transform="translate(' + p[0] + ' ' + p[1] + ')"><path d="M0 0C-3-6-11-11-11-19a11 11 0 0 1 22 0c0 8-8 13-11 19z" fill="' + PIN[p[2] || 'ok'] + '" stroke="#FFF" stroke-width="1.5"/><circle cy="-19" r="4" fill="#FFF"/></g>').join('') + '</svg></div>';
  const PINS = [[180, 170, 'ok'], [230, 210, 'ok'], [300, 240, 'ok'], [380, 150, 'ok'], [470, 380, 'ok'], [520, 260, 'ok'], [560, 200, 'off'], [250, 360, 'ok']];

  // ---------- 화면 시안 ----------
  const H = {};
  const ck = (on) => '<span class="ck"><i class="' + (on ? 'on' : '') + '"></i></span>';
  const pager = (t) => '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;font-size:12px;color:#6B7482"><span>' + t + '</span><div style="display:flex;gap:4px"><span class="btn sm">‹</span><span class="btn sm pri">1</span><span class="btn sm">2</span><span class="btn sm">›</span></div></div>';
  const legend = (items) => '<div style="display:flex;gap:12px;margin-top:8px;font-size:12px;color:#5B6472">' + items.map((i) => '<span style="display:flex;align-items:center;gap:5px"><i style="width:9px;height:9px;border-radius:50%;background:' + i[1] + '"></i>' + i[0] + '</span>').join('') + '</div>';
  const updated = '<span class="cnt">마지막 갱신 10-30 09:42</span>';
  const PEND = [['R-1102-07', '캠핑장 A구역', '11-02 (토)', '김○○', '4명'], ['R-1103-02', '풋살장', '11-03 (일)', '이○○', '10명'], ['R-1103-05', '바비큐장', '11-03 (일)', '정○○', '8명'], ['R-1105-01', '숲속 회의실', '11-05 (화)', '한○○', '12명'], ['R-1106-03', '피크닉장', '11-06 (수)', '오○○', '25명']];
  H.D1 = () => shell('dash', head(['대시보드'], updated + seg(['오늘', '이번 주', '이번 달'], 0)) +
    '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:20px">' + kpi('오늘 예약', '18건', '어제보다 +4 · 취소 1 · 노쇼 0', 'B1') + kpi('승인 대기', '4건', '24시간 안에 처리 · 가장 오래된 19시간', 'B1') + kpi('이번 주 이용률', '72%', '지난주 65% · 캠핑장 94%') + kpi('점검 중 시설', '1곳', '전체 8곳 · 야외 무대', 'F1') + '</div>' +
    '<div class="row" style="flex:1">' + card('시설 위치', mapBox(PINS, 'height:100%') + legend([['운영 7', PIN.ok], ['점검 중 1', PIN.off]]), { style: 'flex:1.3;display:flex;flex-direction:column', r: '전체 8곳' }) +
      '<div style="flex:1;display:flex;flex-direction:column;gap:8px;min-width:0">' +
      card('승인 대기 예약 <span class="cnt">5건 · 이용일 가까운 순</span>', '<table class="t tight"><tr><th>시설</th><th>이용일</th><th>신청자</th><th>인원</th><th></th></tr>' + PEND.map((r) => '<tr><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td><td>' + r[4] + '</td><td class="r"><span class="btn sm" data-go="B2">확인</span></td></tr>').join('') + '</table>', { r: '<span class="cnt" data-go="B1">전체 보기 ›</span>' }) +
      card('최근 처리 이력', '<table class="t tight"><tr><th>시각</th><th>내용</th><th>처리자</th></tr>' + [['09:31', 'R-1101-11 숲속 회의실 승인', '운영팀 김'], ['09:12', 'R-1031-04 피크닉장 반려 (인원 초과)', '운영팀 박'], ['08:55', '야외 무대 점검 중으로 변경', '시설팀 이'], ['어제 17:40', '바비큐장 등록', '시설팀 이'], ['어제 16:05', 'R-1030-02 테니스장 선택 승인 3건', '운영팀 김']].map((r) => '<tr><td class="mono">' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td></tr>').join('') + '</table>', { style: 'flex:1' }) + '</div></div>');
  const FAC = [['캠핑장 A구역', '캠핑', '40명', '1박', '31건', '<span class="tg t-ok">운영</span>', '30,000원'], ['캠핑장 B구역', '캠핑', '30명', '1박', '22건', '<span class="tg t-ok">운영</span>', '25,000원'], ['풋살장', '체육', '20명', '2시간', '46건', '<span class="tg t-ok">운영</span>', '20,000원'], ['테니스장', '체육', '4명', '1시간', '58건', '<span class="tg t-ok">운영</span>', '8,000원'], ['숲속 회의실', '실내', '16명', '1시간', '19건', '<span class="tg t-ok">운영</span>', '15,000원'], ['바비큐장', '야외', '30명', '3시간', '12건', '<span class="tg t-ok">운영</span>', '10,000원'], ['야외 무대', '공연', '200명', '1일', '0건', '<span class="tg t-wr">점검 중</span>', '협의'], ['피크닉장', '야외', '60명', '1일', '27건', '<span class="tg t-ok">운영</span>', '무료']];
  H.F1 = () => shell('fac', head(['시설 관리'], '<span class="btn sm">목록 내려받기</span><span class="btn pri sm" data-go="F2">+ 시설 등록</span>') +
    '<div class="row" style="flex:1">' + card('시설 지도', mapBox(PINS, 'height:100%') + legend([['운영', PIN.ok], ['점검 중', PIN.off]]) + '<table class="t tight" style="margin-top:8px"><tr><td>선택한 시설</td><td>캠핑장 A구역 · 운영 · 수용 40명</td></tr><tr><td>다음 예약</td><td>11-02 (토) 김○○ 4명 · 승인 대기</td></tr><tr><td>최근 수정</td><td>10-27 시설팀 이 · 안내 문구 변경</td></tr></table><div class="note i" style="margin-top:8px">핀을 누르면 그 시설의 수정 화면으로 갑니다. 점검 중 시설은 시민 예약 화면에서 숨겨집니다.</div>', { style: 'flex:1;display:flex;flex-direction:column' }) +
    card('시설 목록 <span class="cnt">8곳 · 운영 7 · 점검 중 1</span>', '<div style="display:flex;gap:8px;margin-bottom:12px"><div class="inp ph-t" style="flex:1">시설명 검색</div><div class="sel" style="width:110px">유형 전체</div>' + seg(['전체', '운영', '점검 중'], 0) + '</div><table class="t"><tr><th>시설명</th><th>유형</th><th>수용</th><th>예약 단위</th><th>사용료</th><th>이번 달 예약</th><th>상태</th><th></th></tr>' +
      FAC.map((r) => '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td><td>' + r[6] + '</td><td>' + r[4] + '</td><td>' + r[5] + '</td><td class="r"><span class="btn sm" data-go="F2">수정</span></td></tr>').join('') + '</table>' + pager('1–8 / 8곳 · 이름순 · 점검 중 포함'), { style: 'flex:1.45' }) + '</div>');
  H.F2 = () => shell('fac', head(['시설 관리', '등록']) +
    '<div class="row" style="flex:1">' + card('시설 정보', '<div style="display:grid;gap:12px">' + field('시설명', '캠핑장 C구역', { req: 1, msg: '시민 예약 화면에 그대로 보입니다. 1~50자' }) +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' + field('유형', '캠핑', { sel: 1 }) + field('예약 단위', '1박', { sel: 1, msg: '1박이면 종료 시간은 다음 날' }) + field('수용 인원', '30', { req: 1, msg: '1~999명' }) + field('사용료', '25,000원 / 1박') + field('이용 시간', '14:00 ~ 다음 날 11:00') + '<div><div class="lab">운영 상태</div>' + seg(['운영', '점검 중'], 0) + '</div></div>' +
      field('안내 문구', '시민에게 보이는 안내 (500자 이하) — 예: 화로 사용은 지정 구역에서만', { ph: 1 }) +
      '<div><div class="lab">시설 사진</div><div style="display:flex;gap:8px"><div style="width:72px;height:48px;border:1px dashed #C3C8D1;border-radius:4px;display:grid;place-items:center;font-size:12px;color:#6B7482">+ 추가</div><div style="width:72px;height:48px;border-radius:4px;background:#E3EEE6"></div><div style="width:72px;height:48px;border-radius:4px;background:#DCE8DF"></div></div><div class="msg">JPG · PNG, 장당 5MB 이하, 최대 5장</div></div>' +
      '<div style="display:flex;gap:6px;justify-content:flex-end;align-items:center"><span class="cnt" style="margin-right:auto">* 필수 · 작성 중 나가면 확인합니다</span><span class="btn" data-go="F1">취소</span><span class="btn pri" data-go="F1">저장</span></div></div>', { style: 'flex:1.1' }) +
    card('위치 선택', '<div class="note i" style="margin-bottom:10px">지도를 눌러 위치를 고르세요. 좌표는 직접 입력하지 않습니다. 공원 경계(초록 면) 밖은 고를 수 없습니다.</div>' + mapBox(PINS.concat([[470, 160, 'sel']]), 'flex:1') +
      '<table class="t tight" style="margin-top:10px"><tr><td>공원 경계</td><td>푸른숲공원 전체 구역 안 · 수변 산책로 제외</td></tr><tr><td>선택한 위치</td><td>북쪽 잔디광장 옆 · 정문에서 도보 6분</td></tr><tr><td>가까운 시설</td><td>캠핑장 A구역 120m · 피크닉장 210m</td></tr></table><div style="display:flex;gap:6px;margin-top:8px"><span class="btn sm">핀 다시 놓기</span><span class="btn sm">주소로 찾기</span></div><table class="t tight" style="margin-top:10px"><tr><th>변경 이력</th><th></th><th></th></tr><tr><td class="mono">10-27 14:20</td><td>안내 문구 변경</td><td>시설팀 이</td></tr><tr><td class="mono">10-12 10:05</td><td>사용료 20,000원 → 25,000원</td><td>운영팀 김</td></tr></table>', { style: 'flex:1.2;display:flex;flex-direction:column' }) + '</div>');
  const BK = [['R-1102-07', '캠핑장 A구역', '11-02 (토)', '4명', '김○○', '10-28', '<span class="tg t-wr">승인 대기</span>', 1], ['R-1103-02', '풋살장', '11-03 (일)', '10명', '이○○', '10-29', '<span class="tg t-wr">승인 대기</span>', 1], ['R-1103-05', '바비큐장', '11-03 (일)', '8명', '정○○', '10-29', '<span class="tg t-wr">승인 대기</span>', 0], ['R-1105-01', '숲속 회의실', '11-05 (화)', '12명', '한○○', '10-30', '<span class="tg t-wr">승인 대기</span>', 0], ['R-1101-11', '숲속 회의실', '11-01 (금)', '9명', '박○○', '10-27', '<span class="tg t-ok">승인</span>', 0], ['R-1101-08', '테니스장', '11-01 (금)', '4명', '윤○○', '10-27', '<span class="tg t-ok">승인</span>', 0], ['R-1031-09', '캠핑장 B구역', '10-31 (목)', '6명', '서○○', '10-26', '<span class="tg t-ok">승인</span>', 0], ['R-1031-04', '피크닉장', '10-31 (목)', '70명', '최○○', '10-25', '<span class="tg">반려</span>', 0]];
  H.B1 = () => shell('book', head(['예약 관리'], updated + '<span class="btn sm">목록 내려받기</span>') +
    card('예약 목록 <span class="cnt">승인 대기 4건 · 전체 18건</span>', '<div style="display:flex;gap:8px;margin-bottom:10px">' + seg(['전체 18', '승인 대기 4', '승인 12', '반려 2'], 1) + '<div class="inp ph-t" style="flex:1">예약 번호 · 신청자 검색</div><div class="sel" style="width:120px">시설 전체</div><div class="inp" style="width:190px">11-01 ~ 11-30</div></div>' +
      '<div class="note g" style="margin-bottom:10px">2건 선택됨 — <b>선택 승인</b> · 선택 반려(사유 입력) · 선택 해제</div>' +
      '<table class="t"><tr><th>' + ck(0) + '</th><th>예약 번호</th><th>시설</th><th>이용일</th><th>인원</th><th>신청자</th><th>신청일</th><th>상태</th><th></th></tr>' +
      BK.map((r) => '<tr><td>' + ck(r[7]) + '</td><td class="mono">' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td><td>' + r[4] + '</td><td>' + r[5] + '</td><td>' + r[6] + '</td><td class="r"><span class="btn sm" data-go="B2">상세</span></td></tr>').join('') + '</table>' + pager('1–8 / 18건 · 이용일 가까운 순'), { style: 'flex:1' }));
  H.B2 = () => shell('book', '<div class="dimmed">' + nogo(H.B1()) + '</div>', { over: '<div class="shade"></div><div class="modal" style="left:420px;top:90px;width:640px"><h3>예약 상세 · R-1102-07 <span class="tg t-wr">승인 대기</span><span class="x" data-go="B1">✕</span></h3><div class="mb">' +
    '<table class="t tight"><tr><td>시설</td><td>캠핑장 A구역 (수용 40명 · 1박)</td></tr><tr><td>이용일</td><td>11-02 (토) 14:00 ~ 11-03 (일) 11:00 · 1박</td></tr><tr><td>인원</td><td>4명 (성인 2 · 어린이 2)</td></tr><tr><td>신청자</td><td>김○○ · 010-****-1234</td></tr><tr><td>신청일</td><td>10-28 21:14 · 온라인</td></tr><tr><td>요청 사항</td><td>차량 1대 진입 문의</td></tr><tr><td>같은 날 예약</td><td>캠핑장 A구역 11-02 승인 3건 · 남은 자리 21명</td></tr></table>' +
    field('반려 사유', '반려할 때만 입력 (200자 이하)', { ph: 1 }) + '<div class="note i" style="margin-top:8px">승인 · 반려하면 신청자에게 문자로 안내됩니다. 처리 직전에 다른 관리자의 처리 여부를 다시 확인합니다.</div>' +
    '<table class="t tight" style="margin-top:8px"><tr><th>처리 이력</th><th></th></tr><tr><td class="mono">10-28 21:14</td><td>신청 접수 (시민)</td></tr><tr><td class="mono">10-29 09:02</td><td>차량 진입 문의 메모 (운영팀 김)</td></tr></table>' +
    '</div><div class="foot"><span class="btn danger" data-go="B1">반려</span><span class="btn pri" data-go="B1">승인</span></div></div>' });
  const stateCard = (t, body) => card(t, body, { style: 'min-height:0' });
  H.C1 = () => shell('book', head(['공통 상태']) +
    '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:20px;flex:1">' +
    stateCard('불러오는 중', '<div style="display:grid;gap:8px">' + [90, 70, 80, 60].map((w) => '<div style="height:12px;width:' + w + '%;border-radius:4px;background:#EEF0F3"></div>').join('') + '</div><div class="cnt" style="margin-top:10px">3초 넘게 걸리면 "조금 더 걸리고 있습니다" 안내</div>') +
    stateCard('빈 상태 · 결과 없음', '<div style="text-align:center;padding:18px 0"><b>검색 결과가 없습니다.</b><div class="cnt" style="margin:6px 0 12px">검색어 "풋살" · 상태 반려 · 11월</div><span class="btn sm">필터 초기화</span></div>') +
    stateCard('목록 조회 실패', '<div class="note e">예약 목록을 불러오지 못했습니다. 잠시 후 다시 시도하세요.</div><div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px"><span class="cnt">마지막 성공 09:42 기준 목록을 보여 주는 중</span><span class="btn sm pri">다시 시도</span></div>') +
    stateCard('권한 없음 (열람자)', '<div class="note w">열람 권한으로는 승인 · 반려할 수 없습니다. 운영팀 권한이 필요합니다.</div><div style="display:flex;gap:6px;justify-content:flex-end;margin-top:12px"><span class="btn dis">반려</span><span class="btn pri dis">승인</span></div><div class="cnt" style="margin-top:8px">버튼에 마우스를 올리면 같은 이유를 보여 줍니다.</div>') +
    stateCard('저장 실패', field('시설명', '캠핑장 C구역', { req: 1 }) + '<div class="note e" style="margin-top:10px">저장하지 못했습니다(네트워크 오류). 입력한 내용은 그대로 남아 있습니다.</div><div style="display:flex;justify-content:flex-end;margin-top:10px"><span class="btn sm pri">다시 저장</span></div>') +
    stateCard('작성 중 나가기', '<div style="border:1px solid #E8EBF1;border-radius:6px;padding:14px"><b>작성 중인 내용이 있습니다.</b><div class="cnt" style="margin:6px 0 12px">나가면 입력한 시설 정보가 사라집니다.</div><div style="display:flex;gap:6px;justify-content:flex-end"><span class="btn sm">계속 작성</span><span class="btn sm danger">나가기</span></div></div>') +
    stateCard('저장 완료', '<div class="note g">저장했습니다.</div><div class="cnt" style="margin:8px 0">오른쪽 위 알림으로 3초 보이고, 목록의 해당 행을 잠시 강조합니다.</div><table class="t tight"><tr><td>캠핑장 C구역</td><td><span class="tg t-ok">운영</span></td></tr></table>') +
    stateCard('동시 처리 충돌', '<div class="note w">이미 처리된 예약입니다.</div><div class="cnt" style="margin:8px 0">R-1102-07 · 운영팀 박이 09:40에 승인함</div><div style="display:flex;justify-content:flex-end"><span class="btn sm pri">목록 새로고침</span></div>') +
    stateCard('선택 승인 일부 실패', '<div class="note w">3건 중 2건 승인, 1건 실패</div><table class="t tight" style="margin-top:8px"><tr><td class="mono">R-1103-02</td><td>이미 다른 관리자가 반려함</td></tr></table><div class="cnt" style="margin-top:8px">실패한 1건만 선택된 채로 남깁니다.</div>') + '</div>');

  // ---------- 화면 정의 ----------
  const SCREENS = [
    { id: 'D1', flow: 'dash', kind: '페이지', title: '대시보드', purpose: '오늘 예약 · 처리할 일 · 시설 상태를 한 화면에서 보고 바로 처리 화면으로 갑니다.', feat: ['DASH-01', 'DASH-02'], parts: ['기간 선택 · 마지막 갱신', '현황 카드 4개', '시설 위치 지도 · 범례', '승인 대기 예약 5건', '최근 처리 이력'], states: ['대기 0건 → "처리할 예약이 없습니다."', '지도 로드 실패 → 안내, 카드 · 표는 유지', '조회 실패 → 마지막 성공 값 + 다시 시도'], rules: ['카드 수치는 예약 목록과 같은 기준(기간 선택을 따름)', '승인 대기는 이용일 가까운 순 5건', '이용률 = 예약된 단위 ÷ 운영 단위'], ex: ['EX-01', 'EX-06', 'EX-10'], at: ['AT-01', 'AT-05'] },
    { id: 'F1', flow: 'fac', kind: '페이지', title: '시설 목록 · 지도', purpose: '시설을 지도와 목록으로 함께 보고 등록 · 수정으로 갑니다.', feat: ['FAC-01'], parts: ['시설 지도 · 범례', '검색 · 유형 · 상태 필터', '시설 목록(이번 달 예약 수)', '시설 등록 · 목록 내려받기'], states: ['검색 결과 없음 → 필터 초기화', '지도 로드 실패 → 목록만'], rules: ['점검 중 시설은 회색 핀', '기본 정렬 이름순', '이번 달 예약은 승인 기준'], ex: ['EX-01', 'EX-06', 'EX-10'], at: ['AT-02', 'AT-05'] },
    { id: 'F2', flow: 'fac', kind: '페이지', title: '시설 등록 · 위치 선택', purpose: '시설 정보를 입력하고 위치를 지도에서 고릅니다.', feat: ['FAC-02', 'FAC-03'], parts: ['시설명 · 유형 · 예약 단위 · 수용 인원 · 사용료 · 이용 시간 · 운영 상태 · 안내 문구', '시설 사진', '위치 지도 · 선택 위치 · 가까운 시설', '취소 · 저장'], states: ['위치 미선택 → 저장 차단', '시설명 중복 → 안내', '저장 실패 → 입력 보존 · 다시 저장', '작성 중 이탈 → 확인'], rules: ['좌표 직접 입력 없음', '공원 경계 밖 선택 불가', '이용 시간 시작 < 종료(1박은 다음 날 허용)'], ex: ['EX-02', 'EX-03', 'EX-07', 'EX-09', 'EX-12', 'EX-13', 'EX-14'], at: ['AT-03', 'AT-05', 'AT-06'] },
    { id: 'B1', flow: 'book', kind: '페이지', title: '예약 목록', purpose: '예약을 상태별로 보고 하나씩 또는 여러 건을 한 번에 처리합니다.', feat: ['BOOK-01'], parts: ['상태 탭(건수)', '검색 · 시설 · 기간 필터', '선택 작업 바', '예약 목록 · 페이지'], states: ['검색 결과 없음', '조회 실패 → 다시 시도', '선택 승인 일부 실패 → 실패 건만 남김'], rules: ['기본 탭은 승인 대기', '기본 정렬 이용일 가까운 순', '선택 반려는 사유 하나를 모든 건에 적용'], ex: ['EX-06', 'EX-08', 'EX-10', 'EX-15'], at: ['AT-04', 'AT-06'] },
    { id: 'B2', flow: 'book', kind: '팝업', title: '예약 상세 · 승인/반려', purpose: '예약 내용과 같은 날 예약 현황을 확인하고 승인하거나 반려합니다.', feat: ['BOOK-02'], parts: ['예약 정보 · 같은 날 예약', '반려 사유', '처리 이력', '반려 · 승인'], states: ['반려 사유 공백 → 반려 차단', '이미 처리됨 → 안내 후 새로고침', '점검 중 시설 → 경고 후 확인'], rules: ['신청자 연락처는 가려서 표시', '처리 직전 상태 재확인'], ex: ['EX-04', 'EX-05', 'EX-08', 'EX-09', 'EX-11'], at: ['AT-04', 'AT-05', 'AT-06'] },
    { id: 'C1', flow: 'com', kind: '공통 상태', title: '공통 상태 예시', purpose: '모든 화면이 같은 모양으로 쓰는 빈 상태 · 실패 · 권한 · 이탈 · 일부 실패 표시입니다.', feat: ['COM-01'], parts: ['불러오는 중', '저장 완료', '빈 상태', '조회 실패', '권한 없음', '저장 실패', '작성 중 나가기', '동시 처리 충돌', '선택 처리 일부 실패'], states: ['각 카드가 하나의 상태', '문구는 상세명세 8장과 같음'], rules: ['실패해도 입력 · 마지막 목록을 지우지 않음', '권한 없는 버튼은 숨기지 않고 비활성 + 이유'], ex: ['EX-05', 'EX-06', 'EX-08', 'EX-09', 'EX-10', 'EX-14', 'EX-15'], at: ['AT-04', 'AT-05', 'AT-06'] }
  ];
  const FLOWS = [
    { id: 'dash', no: '01', title: '대시보드', desc: '오늘 현황과 처리할 일', screens: ['D1'] },
    { id: 'fac', no: '02', title: '시설 관리', desc: '시설 등록 · 수정 · 위치', screens: ['F1', 'F2'] },
    { id: 'book', no: '03', title: '예약 관리', desc: '예약 승인 · 반려 · 선택 처리', screens: ['B1', 'B2'] },
    { id: 'com', no: '04', title: '공통 상태', desc: '빈 상태 · 실패 · 권한 · 이탈', screens: ['C1'] }
  ];
  const ISSUES = [
    { id: 'RV-01', scr: 'F2', sev: 'high', st: 'done', t: '좌표 직접 입력으로 위치 오류', src: '기획서 3쪽', p: '위도 · 경도 입력칸이 있어 잘못된 좌표가 저장될 수 있습니다.', fx: '지도 선택만 허용하고 입력칸을 없앴습니다(FAC-03, EX-03 · EX-13).' },
    { id: 'RV-02', scr: 'B2', sev: 'mid', st: 'done', t: '반려 사유 없이 반려 가능', src: '요청서 2.3', p: '시민이 반려 이유를 알 수 없습니다.', fx: '반려 시 사유 필수(EX-04).' },
    { id: 'RV-03', scr: 'B2', sev: 'mid', st: 'ask', t: '두 관리자가 같은 예약을 동시에 처리', src: '운영 인터뷰', p: '먼저 처리된 예약을 다시 승인할 수 있습니다.', fx: '저장 직전 상태를 다시 확인하고 안내(EX-05).', rest: '서버의 상태 확인 응답 형식 확인 필요' },
    { id: 'RV-04', scr: 'D1', sev: 'low', st: 'done', t: '카드 수치와 목록 수 불일치', src: '기획서 1쪽', p: '대시보드는 전체, 목록은 오늘 기준이었습니다.', fx: '같은 기준으로 맞추고 기간 선택을 카드에 함께 적용했습니다.' },
    { id: 'RV-05', scr: 'B1', sev: 'mid', st: 'done', t: '주말 예약 몰림 — 한 건씩 처리하기 어려움', src: '운영 인터뷰', p: '금요일 오후에 승인 대기가 30건 넘게 쌓입니다.', fx: '목록에서 여러 건 선택 승인 · 반려, 일부 실패 시 실패 건만 남김(EX-15).' },
    { id: 'RV-06', scr: 'C1', sev: 'mid', st: 'ask', t: '열람 권한 계정의 처리 버튼', src: '요청서 1.1', p: '권한 없는 계정에 버튼이 보이면 눌러 본 뒤 실패합니다.', fx: '버튼을 숨기지 않고 비활성 + 이유 표시(EX-08).', rest: '역할 이름(운영팀 · 열람자) 운영팀 확인' }
  ];
