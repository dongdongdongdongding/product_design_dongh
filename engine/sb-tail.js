  // ===== 엔진 =====

  // ===== 표준 페이지 (SBCONF로 프로젝트 값을 받는다) =====
  if (!SBP.some((p) => p.id === 'map') && DOC.map && DOC.map.sym && DOC.map.sym.length) pgMap();
  if (!SBP.some((p) => p.id === 'verify')) pgVerify();
  const CONF = (typeof SBCONF !== 'undefined' && SBCONF) || {};
  const sbGroups = () => [['문서', (p) => p.kind === 'doc'], ['공통', (p) => !!p.common]].concat(FLOWS.map((f) => [f.no + ' ' + f.title, (p) => p.scr && !p.common && byId[p.scr] && byId[p.scr].flow === f.id]));
  const HOWTO = '<div class="bx" style="margin-top:12px"><h3>읽는 법</h3><ul><li><span class="rt">빨간 번호</span>는 화면 요소와 오른쪽 Description 항목을 잇습니다. 번호나 항목에 마우스를 올리면 서로 강조됩니다.</li><li><b>5-1</b>처럼 붙은 번호는 그 요소를 눌렀을 때 나오는 팝업 · 알림 · 오류 상태입니다.</li><li>조합이 많은 예외는 <b>판정표 페이지</b>로 따로 둡니다.</li><li><span class="tk save">저장</span> 브라우저 저장 · <span class="tk srv">서버</span> 기존 서버 · DB 처리 · <span class="tk old">기존 유지</span> 바꾸지 않음 · <span class="tk cond">조건부</span> 결정 후 · <span class="tk ex">EX-nn</span> 상세명세 예외 · <span class="tk go">→ 화면</span> 이어지는 페이지</li><li>페이지 아래 <b>들어오는 곳 · 나가는 곳</b>은 시안의 버튼 연결에서 자동으로 뽑았습니다.</li></ul></div>';
  function sbCover() {
    const C = CONF.cover || {};
    return '<div class="cover"><div>' + (C.badge ? '<div class="sh-chip new" style="margin-bottom:8px">' + esc(C.badge) + '</div>' : '') + '<div class="ttl">' + (C.titleHTML || esc(PROJECT.title) + '<br>화면설계서 (SB)') + '</div>' + (C.intro ? '<p>' + C.intro + '</p>' : '') +
      (C.sources && C.sources.length ? '<div class="bx" style="margin-top:12px"><h3>근거 문서</h3><ul>' + C.sources.map((s) => '<li>' + esc(s) + '</li>').join('') + '</ul></div>' : '') + HOWTO + '</div>' +
      '<div><div class="bx"><h3>목차</h3>' + sbGroups().map((g) => { const ps = SBP.filter(g[1]); return ps.length ? '<div style="margin:6px 0 2px;font-weight:700">' + esc(g[0]) + '</div>' + ps.map((p) => '<div style="display:flex;gap:8px;padding:2px 0;cursor:pointer" data-sb="' + p.i + '"><span style="font-family:var(--mono);color:#888;width:46px">' + p.no + '</span><span>' + (p.kind === 'mx' ? '└ ' : '') + esc(p.title) + '</span></div>').join('') : ''; }).join('') + '</div>' +
      (C.history && C.history.length ? '<div class="bx" style="margin-top:12px"><h3>개정 이력</h3><table class="mxt"><tr><th>버전</th><th>일자</th><th>내용</th></tr>' + C.history.map((h) => '<tr><td>' + esc(h[0]) + '</td><td>' + esc(h[1]) + '</td><td class="l">' + rt(h[2]) + '</td></tr>').join('') + '</table></div>' : '') + '</div></div>';
  }
  function sbRef() {
    if (CONF.ref) return CONF.ref();
    return '<h2>화면설계서 한 페이지의 문법</h2><div class="cols"><div class="bx"><h3>구성</h3><ol><li>머리줄 <b>관리자 | 화면 경로</b></li><li>왼쪽 실제 화면 위에 빨간 번호. 묶음 요소는 상자로 감쌈</li><li>오른쪽 <b>Description</b>: 번호마다 “N. 요소명” 아래 구성 → 입력 규칙(placeholder · 자릿수 · 형식 · 기본값) → 동작(누르면 결과) → [예외] 정확한 문구 → 데이터(저장 · 서버 · DB)</li><li>팝업 · 알림 · 오류 상태는 같은 페이지에 <b>하위 번호</b>(5-1, 6-2)로 붙임</li></ol></div>' +
      '<div class="bx"><h3>예외와 맥락</h3><ol><li>본 화면에는 [예외]로 요약, 조합이 많으면 <b>판정표 페이지</b>로 펼침 (입력 O/X × 조건 → 결과 · 문구)</li><li>문구는 마침표까지 그대로 적음</li><li>한 화면에서 만든 상태값 · 값이 다른 화면에 같은 이름으로 다시 나오게 함 → 상태값 사전 · 업무 흐름 페이지</li><li>범위 밖 기능은 배지로 표시</li></ol></div></div>';
  }
  function sbFlow() {
    const ch = (nodes) => '<div class="chain">' + nodes.map((n) => n.e ? '<div class="ed">' + esc(n.e) + '<i>→</i></div>' : '<div class="nd" data-scr="' + n.id + '" style="cursor:pointer"><b>' + n.id + ' ' + esc(byId[n.id] ? byId[n.id].title : '') + '</b><small>' + esc(n.s || '') + '</small>' + (n.k ? '<span class="tk ' + n.k + '">' + (n.k === 'save' ? '저장' : '서버') + '</span>' : '') + '</div>').join('') + '</div>';
    const M = CONF.menus || [], J = CONF.journeys || [];
    return (M.length ? '<h2>메뉴 구조</h2><table class="mxt"><tr><th>메뉴 코드</th><th>메뉴명</th><th>이번 변경</th><th>화면</th></tr>' + M.map((m) => '<tr><td style="font-family:var(--mono)">' + esc(m[0]) + '</td><td class="l">' + esc(m[1]) + '</td><td><span class="sh-chip ' + (m[4] || 'old') + '">' + esc(m[2]) + '</span></td><td>' + esc(m[3]) + '</td></tr>').join('') + '</table>' + (CONF.menuNote ? '<p class="nt" style="font-size:12px;color:#555">' + esc(CONF.menuNote) + '</p>' : '') : '') +
      (J.length ? '<h2>업무 흐름 — 값이 넘어가는 사슬</h2><p>한 화면에서 만든 값이 다음 화면의 판단 근거가 됩니다. 상자를 누르면 그 화면 페이지로 갑니다.</p>' + J.map((j, k) => '<div class="bx" style="margin-top:' + (k ? 10 : 8) + 'px"><h3>' + esc(j.t) + '</h3>' + ch(j.nodes) + '</div>').join('') : '') +
      '<h2>메뉴별 화면</h2>' + FLOWS.map((f) => '<div class="lane"><b>' + f.no + ' ' + esc(f.title) + '<small>' + esc(f.desc) + '</small></b><div class="nds">' + f.screens.map((id) => '<button data-scr="' + id + '"><span>' + id + '</span>' + esc(byId[id].title) + '</button>').join('') + '</div></div>').join('') +
      '<h2>화면 전이 전체 <span style="font-weight:500;color:#777;font-size:13px">(' + TRANS.length + '건 · 시안의 버튼 연결에서 자동 생성)</span></h2><div class="wrapx"><table class="mxt"><tr><th>출발 화면</th><th>누르는 곳</th><th>도착 화면</th></tr>' + TRANS.map((x) => '<tr><td class="l">' + goChip(x.f) + '</td><td class="l">' + esc(x.l || '-') + '</td><td class="l">' + goChip(x.t) + '</td></tr>').join('') + '</table></div>';
  }
  function sbDict() {
    const D = CONF.dict || { rows: [], msgs: [] };
    return '<h2>상태값 사전</h2><p>한 화면에서 정한 상태값이 다른 화면에 같은 이름으로 나옵니다. 이름을 바꿀 때는 이 표의 모든 화면을 함께 바꿉니다.</p><div class="wrapx"><table class="mxt"><tr><th>분류</th><th>값</th><th>뜻</th><th>정하는 곳</th><th>보이는 곳</th></tr>' + (D.rows || []).map((r) => '<tr><td><b>' + esc(r[0]) + '</b></td><td class="l">' + esc(r[1]) + '</td><td class="l">' + esc(r[2]) + '</td><td>' + esc(r[3]) + '</td><td>' + esc(r[4]) + '</td></tr>').join('') + '</table></div>' +
      '<h2>공통 문구</h2><p>여러 화면에 나오는 문구는 여기 적힌 그대로 씁니다.</p><div class="wrapx"><table class="mxt"><tr><th>상황</th><th>문구</th><th>근거</th></tr>' + (D.msgs || []).map((r) => '<tr><td><b>' + esc(r[0]) + '</b></td><td class="l"><q style="quotes:none;color:#0B5CAD">“' + esc(r[1]) + '”</q></td><td>' + esc(r[2]) + '</td></tr>').join('') + '</table></div>';
  }
  // 지도 기호 견본: 프로젝트 견본이 없으면 카카오 객체 종류와 첫 색으로 그린다
  function swatch(r) {
    const own = (CONF.swatches || {})[r.obj], col = ((r.style || '').match(/#[0-9A-Fa-f]{6}/) || ['#3D6FD6'])[0];
    const gen = /Polygon/.test(r.kakao) ? '<path d="M6 30C10 12 30 6 44 12 56 18 58 34 46 40 30 46 10 42 6 30z" fill="' + col + '" fill-opacity=".18" stroke="' + col + '" stroke-width="2" stroke-dasharray="6 4"/>' : /Polyline/.test(r.kakao) ? '<path d="M6 40C18 14 40 40 58 12" fill="none" stroke="' + col + '" stroke-width="5" stroke-linecap="round"/>' : /Marker/.test(r.kakao) ? '<g transform="translate(32 36)"><path d="M0 0C-3-6-11-11-11-19a11 11 0 0 1 22 0c0 8-8 13-11 19z" fill="' + col + '" stroke="#FFF" stroke-width="1.5"/><circle cy="-19" r="4" fill="#FFF"/></g>' : '<circle cx="32" cy="26" r="8" fill="#FFFFFF" stroke="' + col + '" stroke-width="2"/>';
    return '<svg width="64" height="48" viewBox="0 0 64 48" aria-hidden="true" style="display:block;background:#EEF1EC;border-radius:4px">' + (own || gen) + '</svg>';
  }
  const scrAlias = (id) => (CONF.screenAlias || {})[id] || id;

  function sbMap() {
    const M = DOC.map, tb = (cols, rows) => '<div class="wrapx"><table class="mxt"><tr>' + cols.map((c) => '<th>' + esc(c) + '</th>').join('') + '</tr>' + rows.join('') + '</table></div>';
    return '<p>' + (CONF.mapIntro || '신규 화면의 지도 기호와 화면별 지도 구성입니다. 근거: 상세명세 13장.') + '</p>' +
      '<h2>1. 지도 기본 설정</h2>' + tb(['항목', '값', '비고'], M.base.map((r) => '<tr><td><b>' + esc(r.k) + '</b></td><td class="l">' + rt(r.v) + '</td><td class="l">' + rt(r.n) + '</td></tr>')) +
      '<h2>2. 지도 기호</h2>' + (CONF.mapNote ? '<p>' + CONF.mapNote + '</p>' : '') +
      tb(['견본', '객체', '카카오 객체', '모양', '색 · 선', '쌓임', '라벨 · 상호작용'], M.sym.map((r) => '<tr><td>' + swatch(r) + '</td><td><b>' + esc(r.obj) + '</b></td><td style="font-family:var(--mono);font-size:11.5px">' + esc(r.kakao) + '</td><td class="l">' + esc(r.shape) + '</td><td class="l">' + esc(r.style) + '</td><td>' + esc(r.z) + '</td><td class="l">' + rt(r.act) + '</td></tr>')) +
      '<h2>3. 화면별 지도 구성</h2>' + tb(['화면', '기본 표시', '토글', '초기 범위', '클릭 동작', '범례', '비었을 때 · 실패'], M.scr.map((r) => { const id = (r.scr.match(/^([A-Z]\d+)/) || [])[1]; const i = sbOf(scrAlias(id)); return '<tr><td class="l">' + (i >= 0 ? '<span class="tk go" data-sb="' + i + '" role="link" tabindex="0">' + esc(r.scr) + '</span>' : esc(r.scr)) + '</td><td class="l">' + esc(r.show) + '</td><td class="l">' + esc(r.toggle) + '</td><td class="l">' + esc(r.fit) + '</td><td class="l">' + esc(r.click) + '</td><td class="l">' + esc(r.legend) + '</td><td class="l">' + rt(r.empty) + '</td></tr>'; })) +
      '<h2>4. 그리기 규칙</h2><ul>' + M.rules.map((x) => '<li>' + rt(x) + '</li>').join('') + '</ul>' +
      '<h2>5. 구현 순서 (개발 참고)</h2><ol><li>지도 상자를 100% 채우는 컨테이너에 <code>new kakao.maps.Map(el, { center, level })</code> 생성, 확대 컨트롤 추가</li><li>fixture GeoJSON을 읽어 <code>[lng, lat]</code> → <code>LatLng(lat, lng)</code>로 한 번 변환</li><li>쌓임 순서대로 Polygon → Polyline → Marker · CustomOverlay 생성, 각 객체에 <code>zIndex</code> 지정</li><li>표시 객체 전체로 <code>LatLngBounds</code>를 만들어 <code>setBounds(bounds, 40, 40, 40, 40)</code></li><li>클릭 이벤트는 <code>kakao.maps.event.addListener</code>로 붙이고 목록 · 표 선택 상태와 같은 상태 값을 바꿈</li><li>탭 전환 · 패널 열림 · 창 크기 변경 시 <code>map.relayout()</code> 후 중심 유지</li><li>조건이 바뀌면 이전 객체를 <code>setMap(null)</code>로 지우고 다시 그림</li></ol>';
  }


  // 최종 검증: 문서 데이터와 시안에서 바로 계산한다
  function sbVerify() {
    const ids = (txt) => expandIds(txt), onScr = (f) => SCREENS.filter((s) => s.feat.indexOf(f) >= 0).map((s) => s.id);
    const ok = (b, t) => '<span class="sh-chip ' + (b ? 'old' : 'new') + '">' + (t || (b ? '충족' : '확인 필요')) + '</span>';
    const rtm = DOC.rtm.map((r) => { const fs = ids(r.ids), sc = [...new Set([].concat(...fs.map(onScr)))]; const pass = r.ids.indexOf('전체') >= 0 || (fs.length > 0 && fs.every((f) => FEAT[f])); return { r: r, fs: fs, sc: sc, pass: pass }; });
    const CROSS = CONF.crossFeatures || {}; const noScreen = DOC.features.filter((f) => !onScr(f.id).length && !CROSS[f.id]);
    const scrText = {}; SCREENS.forEach((s) => { const d = document.createElement('div'); d.innerHTML = H[s.id](); d.querySelectorAll('.dimmed').forEach((x) => x.remove()); scrText[s.id] = d.textContent.replace(/\s+/g, ''); });
    const norm = (x) => x.replace(/\([^)]*\)/g, '').replace(/[\s·]/g, '');
    const fieldRes = DOC.fields.map((f) => { const lb = norm(f.label.split('·')[0]); const t = scrText[f.scr] || ''; const AL = CONF.fieldAliases || {}; const hit = t.indexOf(AL[lb] || lb) >= 0 || (CONF.fieldPass ? !!CONF.fieldPass(f) : false); return { f: f, hit: hit }; });
    const exInAt = DOC.ex.filter((x) => { const n = +x.id.slice(3); return DOC.at.some((a) => a.ex.split(',').some((q) => { q = q.trim(); if (q.indexOf('~') > 0) { const z = q.split('~'); return n >= +z[0] && n <= +z[1]; } return +q === n; })); }).length;
    const mapScr = DOC.map.scr.map((r) => { const id = (r.scr.match(/^([A-Z]\d+)/) || [])[1]; const sid = scrAlias(id); const html = byId[sid] ? H[sid]() : ''; return { r: r, sid: sid, has: /class="map"/.test(html) }; });
    const FB = CONF.forbidden === undefined ? null : CONF.forbidden, EXM2 = CONF.forbiddenExempt || {}; const demoLeft = FB ? SCREENS.filter((s) => !EXM2[s.id] && FB.test(scrText[s.id] || '')).map((s) => s.id) : [];
    const fieldMiss = fieldRes.filter((x) => !x.hit);
    const tb = (cols, rows) => '<div class="wrapx"><table class="mxt"><tr>' + cols.map((c) => '<th>' + esc(c) + '</th>').join('') + '</tr>' + rows.join('') + '</table></div>';
    const chk = [
      ['원본 요구 ' + DOC.rtm.length + '항목이 기능 ID로 연결됨', rtm.every((x) => x.pass), rtm.filter((x) => x.pass).length + ' / ' + rtm.length],
      ['기능 ' + DOC.features.length + '개가 화면에 배치됨', noScreen.length === 0, (DOC.features.length - noScreen.length) + ' / ' + DOC.features.length + (Object.keys(CROSS).length ? ' · ' + Object.values(CROSS).join(' · ') : '') + (noScreen.length ? ' · 화면 없음: ' + noScreen.map((f) => f.id).join(', ') : '')],
      DOC.fields.length && ['12.2 입력 필드가 화면에 있음', fieldMiss.length === 0, (fieldRes.length - fieldMiss.length) + ' / ' + fieldRes.length + (fieldMiss.length ? ' · 없음: ' + fieldMiss.map((x) => x.f.scr + ' ' + x.f.label).join(', ') : '')],
      ['예외 ' + DOC.ex.length + '개가 검수 시나리오에 연결됨', exInAt === DOC.ex.length, exInAt + ' / ' + DOC.ex.length],
      mapScr.length && ['13.3 화면별 지도가 시안에 있음', mapScr.every((x) => x.has), mapScr.filter((x) => x.has).length + ' / ' + mapScr.length],
      FB && ['화면에 금지 표기 없음', demoLeft.length === 0, demoLeft.length ? '남음: ' + demoLeft.join(', ') : (Object.values(EXM2).join(' · ') || '없음')],
      ['WBS 기준 공수', true, DOC.wbsBase.toFixed(1) + '인일 (여유 포함 ' + (DOC.wbsBase * 1.2).toFixed(1) + '~' + (DOC.wbsBase * 1.3).toFixed(1) + ')']
    ];
    const rules = CONF.instructions ? CONF.instructions() : [];
    return '<h2>1. 원본 요구사항 → 기능 → 화면</h2>' + tb(['원본', '요구 항목', '기능 ID', '화면 · 화면설계서', '판정'], rtm.map((x) => '<tr><td><b>' + esc(x.r.src) + '</b></td><td class="l">' + esc(x.r.req) + '</td><td class="l" style="font-family:var(--mono);font-size:11.5px">' + esc(x.r.ids) + '</td><td class="l">' + (x.sc.length ? x.sc.map((s) => goChip(s)).join(' ') : '<span style="color:#888">전 화면 공통</span>') + '</td><td>' + ok(x.pass, x.r.how.indexOf('C') >= 0 ? '충족 · 조건부 포함' : '') + '</td></tr>')) +
      '<h2>2. 자동 검사</h2>' + tb(['검사', '결과', '판정'], chk.filter(Boolean).map((c) => '<tr><td class="l"><b>' + esc(c[0]) + '</b></td><td class="l">' + esc(c[2]) + '</td><td>' + ok(c[1]) + '</td></tr>')) +
      (noScreen.length ? '<p class="nt" style="font-size:12px;color:#555">화면이 없는 기능은 화면 전체에 걸친 공통 기능입니다: ' + noScreen.map((f) => f.id + ' ' + esc(f.name)).join(', ') + '. 기능정의서와 검수 시나리오에서 확인합니다.</p>' : '') +
      (rules.length ? '<h2>3. 작업 지시 반영</h2>' + tb(['지시', '반영 위치 · 근거'], rules.map((r) => '<tr><td class="l"><b>' + esc(r[0]) + '</b></td><td class="l">' + rt(r[1]) + '</td></tr>')) : '') +
      ((CONF.openItems || []).length ? '<h2>4. 남은 확인 사항</h2><ul>' + CONF.openItems.map((x) => '<li>' + rt(x) + '</li>').join('') + '</ul>' : '');
  }

  const SBX = {}; SBP.forEach((p, i) => { p.i = i; if (p.kind === 'scr' && !(p.scr in SBX) && !p.common) SBX[p.scr] = i; });
  const sbOf = (key) => { if (/^SB-\d\d$/.test(key)) return SBP.findIndex((p) => p.no === key); return key in SBX ? SBX[key] : -1; };
  const sbLabel = (i) => SBP[i].no + ' ' + (SBP[i].scr && SBP[i].kind === 'scr' ? SBP[i].scr + ' ' : '') + SBP[i].title;
  const rt = (s) => esc(s)
    .replace(/&quot;(.+?)&quot;/g, '<q>$1</q>')
    .replace(/\{저장\}/g, '<span class="tk save">저장</span>').replace(/\{서버\}/g, '<span class="tk srv">서버</span>')
    .replace(/\{기존\}/g, '<span class="tk old">기존 유지</span>').replace(/\{조건부\}/g, '<span class="tk cond">조건부</span>')
    .replace(/\{(EX-\d\d)\}/g, (m, id) => '<span class="tk ex" title="' + esc(EXM[id] ? EXM[id].sit + ' → ' + EXM[id].how : '') + '">' + id + '</span>')
    .replace(/\{→#([\w-]+)\}/g, (m, k) => { const i = SBP.findIndex((p) => p.id === k || (p.kind === 'scr' && p.scr === k)); return i < 0 ? k : '<span class="tk go" data-sb="' + i + '" role="link" tabindex="0">→ ' + esc(sbLabel(i)) + '</span>'; })
    .replace(/\{→([A-Z]\d|SB-\d\d)\}/g, (m, k) => { const i = sbOf(k); return i < 0 ? k : '<span class="tk go" data-sb="' + i + '" role="link" tabindex="0">→ ' + esc(sbLabel(i)) + '</span>'; });
  const bullets = (b) => { let h = '', open = false; b.forEach((x) => { if (/^\[.+\]$/.test(x)) { if (open) { h += '</ul>'; open = false; } h += '<div class="lb">' + esc(x) + '</div>'; return; } if (!open) { h += '<ul>'; open = true; } h += x.indexOf('- ') === 0 ? '<li class="l2">' + rt(x.slice(2)) + '</li>' : '<li>' + rt(x) + '</li>'; }); return h + (open ? '</ul>' : ''); };

  // 화면 사이 이동: 시안의 data-go(눌러서 가는 곳)를 그대로 읽는다
  const TRANS = [];
  SCREENS.forEach((s) => { const d = document.createElement('div'); d.innerHTML = H[s.id](); d.querySelectorAll('[data-go]').forEach((e) => { if (e.closest('.dimmed')) return; const t = e.dataset.go; if (t === s.id) return; const lb = (e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 34) || (e.classList.contains('x') ? '닫기' : ''); if (!TRANS.some((x) => x.f === s.id && x.t === t && x.l === lb)) TRANS.push({ f: s.id, t: t, l: lb }); }); });
  const goChip = (id, lb) => { const i = sbOf(id); return '<span class="tk go" data-sb="' + i + '" role="link" tabindex="0">' + id + ' ' + esc(byId[id].title) + '</span>' + (lb ? '<span style="color:#666">' + esc(lb) + '</span>' : ''); };

  function locate(root, m) {
    let q = m.q, e = null;
    if (q[0] === '$') e = root.querySelector(q.slice(1));
    else {
      const card = q[0] === '^'; if (card) q = q.slice(1);
      let bl = 1e9;
      root.querySelectorAll('*').forEach((x) => { if (x.closest('.dimmed') || x.closest('svg')) return; const t = x.textContent; if (t.indexOf(q) >= 0 && t.length < bl) { e = x; bl = t.length; } });
      if (e && card) e = e.closest('.c, .modal') || e;
    }
    if (!e) return null;
    for (let k = 0; k < (m.up || 0) && e.parentElement; k++) e = e.parentElement;
    if (m.cl) e = e.closest(m.cl) || e;
    return e;
  }
  function rectOf(e, sib) {
    const rs = [e.getBoundingClientRect()]; let n = e;
    for (let k = 0; k < (sib || 0); k++) { n = n.nextElementSibling; if (!n) break; rs.push(n.getBoundingClientRect()); }
    return { l: Math.min.apply(null, rs.map((r) => r.left)), t: Math.min.apply(null, rs.map((r) => r.top)), r: Math.max.apply(null, rs.map((r) => r.right)), b: Math.max.apply(null, rs.map((r) => r.bottom)) };
  }
  function drawShot(p, host) {
    const k = host.clientWidth / 1440; host.style.height = Math.round(900 * k) + 'px';
    host.innerHTML = '<div class="sb-scale" style="transform:scale(' + k + ')">' + H[p.scr]() + '<div class="sb-ov"></div></div>';
    const root = host.querySelector('.scr'), ov = host.querySelector('.sb-ov'), base = root.getBoundingClientRect();
    const d = Math.max(30, 26 / k), lw = Math.max(2, 2 / k), bw = Math.max(3, 2.4 / k);
    // 글자 영역(화면 좌표 → 1440×900 좌표): 번호 원이 다른 글자를 덮지 않게 자리를 고른다
    const texts = [], tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), rg = document.createRange();
    for (let nd = tw.nextNode(); nd; nd = tw.nextNode()) { if (!nd.textContent.trim()) continue; rg.selectNodeContents(nd); [...rg.getClientRects()].forEach((q) => { if (q.width > 0) texts.push({ n: nd, l: (q.left - base.left) / k, t: (q.top - base.top) / k, r: (q.right - base.left) / k, b: (q.bottom - base.top) / k }); }); }
    const placed = []; let h = '', lines = '';
    p.marks.forEach((m) => {
      const e = locate(root, m); if (!e) { console.warn('[SB] 마커 위치를 찾지 못함', p.no, m.n, m.q); return; }
      const r = rectOf(e, m.sib), x = (r.l - base.left) / k - 4, y = (r.t - base.top) / k - 4, w = (r.r - r.l) / k + 8, hh = (r.b - r.t) / k + 8;
      const C = { tl: [x - d * .15, y - d * .15], tr: [x + w + d * .15, y - d * .15], bl: [x - d * .15, y + hh + d * .15], br: [x + w + d * .15, y + hh + d * .15], l: [x - d * .65, y + Math.min(hh / 2, d)], r: [x + w + d * .65, y + Math.min(hh / 2, d)], t: [x + Math.min(w / 2, d * 1.5), y - d * .65], b: [x + Math.min(w / 2, d * 1.5), y + hh + d * .65], tlo: [x - d * .75, y - d * .75], tro: [x + w + d * .75, y - d * .75] };
      const order = [m.at || 'tl'].concat(['tl', 'tr', 'bl', 'br', 'l', 'r', 't', 'b', 'tlo', 'tro'].filter((o) => o !== (m.at || 'tl')));
      let best = null;
      order.forEach((o, oi) => {
        const cx = Math.min(1440 - d / 2 - 2, Math.max(d / 2 + 2, C[o][0])), cy = Math.min(900 - d / 2 - 2, Math.max(d / 2 + 2, C[o][1])), rr = d / 2 + 2;
        let sc = oi * .01;
        texts.forEach((q) => { if (cx + rr > q.l && cx - rr < q.r && cy + rr > q.t && cy - rr < q.b) sc += e.contains(q.n) ? .5 : 2; });
        placed.forEach((c) => { if (Math.hypot(c[0] - cx, c[1] - cy) < d * 1.05) sc += 5; });
        if (!best || sc < best.sc) best = { sc: sc, cx: cx, cy: cy, o: o };
      });
      const cx = best.cx, cy = best.cy; placed.push([cx, cy]);
      if (best.o.length > 2 || 'lrtb'.indexOf(best.o) >= 0) { const tx = Math.min(x + w, Math.max(x, cx)), ty = Math.min(y + hh, Math.max(y, cy)); lines += '<line x1="' + cx + '" y1="' + cy + '" x2="' + tx + '" y2="' + ty + '" stroke="#E5252A" stroke-width="' + bw + '"/>'; }
      h += '<div class="sbm" data-n="' + m.n + '"><div class="sbm-box" style="left:' + x + 'px;top:' + y + 'px;width:' + w + 'px;height:' + hh + 'px;border-width:' + bw + 'px"></div>' +
        '<div class="sbm-n" role="button" tabindex="0" aria-label="' + m.n + '번 ' + esc(m.t) + '" style="left:' + (cx - d / 2) + 'px;top:' + (cy - d / 2) + 'px;width:' + d + 'px;height:' + d + 'px;font-size:' + (d * (m.n.length > 1 ? .44 : .52)) + 'px;box-shadow:0 0 0 ' + lw + 'px #FFFFFF">' + m.n + '</div></div>';
    });
    ov.innerHTML = '<svg width="1440" height="900" style="position:absolute;left:0;top:0;overflow:visible" aria-hidden="true">' + lines + '</svg>' + h;
  }
  const mxTable = (x) => '<div class="mx"><h3><b>' + x.n + '</b>' + esc(x.t) + '</h3><div class="wrapx"><table class="mxt"><tr>' + x.cols.map((c) => '<th>' + esc(c) + '</th>').join('') + '</tr>' +
    x.rows.map((r) => '<tr>' + r.map((c, i) => '<td class="' + (c === 'O' ? 'o' : c === 'X' || c === '-' ? 'x' : (i === r.length - 1 || String(c).length > 14 ? 'l' : '')) + '">' + rt(c) + '</td>').join('') + '</tr>').join('') + '</table></div>' + (x.note ? '<p class="nt">' + rt(x.note) + '</p>' : '') + '</div>';

  function sheetHead(p) {
    const s = p.scr ? byId[p.scr] : null;
    const tag = p.tag ? '<span class="sh-chip ' + p.tag + '">' + esc(p.tagT || (p.tag === 'new' ? '신규' : '기존 유지')) + '</span>' : '';
    return '<div class="sh-top"><h1>관리자</h1><span class="path">' + esc(p.path) + '</span><span class="meta">' + tag + (s ? '<span class="sh-chip mono">SCR-' + s.id + '</span>' + s.feat.map((f) => '<span class="sh-chip mono" title="' + esc(FEAT[f] ? FEAT[f].name : '') + '">' + f + '</span>').join('') : '') + '<span class="sh-chip mono">' + p.no + '</span></span></div>';
  }
  function flowRows(p) {
    if (!p.scr || !!p.common) return '';
    const ins = TRANS.filter((x) => x.t === p.scr), outs = TRANS.filter((x) => x.f === p.scr);
    const list = (a, key) => a.length ? a.map((x) => goChip(x[key], (key === 't' ? '“' + x.l + '” 누르면' : '“' + x.l + '”에서'))).join('<span class="ar">·</span>') : '<span style="color:#888">없음</span>';
    return '<div>들어오는 곳</div><div>' + list(ins, 'f') + '</div><div>나가는 곳</div><div>' + list(outs, 't') + '</div>';
  }
  const ctxBox = (p) => { const f = flowRows(p); const c = (p.ctx || []).map((r) => '<div>' + esc(r[0]) + '</div><div>' + rt(r[1]) + '</div>').join(''); return f || c ? '<div class="ctx">' + f + c + '</div>' : ''; };

  let sbCur = 0;
  function renderSB() {
    const p = SBP[sbCur];
    $('sbIdx').querySelectorAll('button').forEach((b) => b.setAttribute('aria-current', String(+b.dataset.sb === sbCur)));
    $('sbPos').textContent = (sbCur + 1) + ' / ' + SBP.length + ' · ' + sbLabel(sbCur);
    $('sbPrev').disabled = sbCur === 0; $('sbNext').disabled = sbCur === SBP.length - 1;
    $('sbMap').hidden = !p.scr;
    const box = $('sbSheet');
    let h = sheetHead(p) + (p.purpose || (p.scr && p.kind === 'scr' && !p.common) ? '<p class="sh-purpose">' + esc(p.purpose || byId[p.scr].purpose) + '</p>' : '');
    if (p.kind === 'doc') h += '<div class="dp">' + p.render() + '</div>';
    else if (p.kind === 'mx') h += p.mx.map(mxTable).join('') + ctxBox(p);
    else {
      h += '<div class="sh-body"><div><div class="sb-shot" id="sbShot"></div>' + (p.subs ? '<div class="subs">' + p.subs.map((s) => '<div class="sub" data-n="' + s.n.split('-')[0] + '"><span class="sn">' + s.n + '</span><div class="scap">' + esc(s.cap) + '</div>' + s.html + '</div>').join('') + '</div>' : '') + '</div>' +
        '<div class="desc"><div class="dh">Description</div>' + p.marks.map((m) => '<div class="dr" data-n="' + m.n + '"><div class="dt"><b>' + m.n + '</b>' + esc(m.t) + '</div>' + bullets(/지도/.test(m.t) ? m.b.concat(['그리는 기준은 {→#map} (상세명세 13장)']) : m.b) + ((p.subs || []).filter((s) => s.n.split('-')[0] === m.n).map((s) => '<div class="lb">' + s.n + '. ' + esc(s.cap) + '</div>').join('')) + '</div>').join('') + '</div></div>' +
        (p.mx ? '<div style="margin-top:18px">' + p.mx.map(mxTable).join('') + '</div>' : '') + ctxBox(p);
    }
    box.innerHTML = h;
    $('sbMain').scrollTop = 0;
    if (p.kind === 'scr') drawShot(p, $('sbShot'));
    box.querySelectorAll('[data-sb]').forEach((b) => { const go = () => sbGo(+b.dataset.sb); b.onclick = go; b.onkeydown = (e) => { if (e.key === 'Enter') go(); }; });
    box.querySelectorAll('[data-scr]').forEach((b) => b.onclick = () => sbGo(sbOf(b.dataset.scr)));
    const hi = (n, on) => box.querySelectorAll('.sbm[data-n="' + n + '"], .dr[data-n="' + n + '"]').forEach((x) => x.classList.toggle('hi', on));
    box.querySelectorAll('.dr, .sbm-n').forEach((x) => { const n = (x.dataset.n || x.parentElement.dataset.n); x.onmouseenter = () => hi(n, true); x.onmouseleave = () => hi(n, false); });
    box.querySelectorAll('.sbm-n').forEach((x) => { const go = () => { const r = box.querySelector('.dr[data-n="' + x.parentElement.dataset.n + '"]'); if (r) { r.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); hi(x.parentElement.dataset.n, true); setTimeout(() => hi(x.parentElement.dataset.n, false), 1200); } }; x.onclick = go; x.onkeydown = (e) => { if (e.key === 'Enter') go(); }; });
    try { localStorage.setItem('fm.sb', JSON.stringify({ mode: app.classList.contains('mode-sb') ? 'sb' : 'map', page: sbCur })); } catch (e) { /* 저장 불가 무시 */ }
  }
  function sbGo(i) { if (i < 0 || i >= SBP.length) return; sbCur = i; renderSB(); }
  function setMode(m) {
    app.classList.toggle('mode-sb', m === 'sb');
    document.querySelectorAll('#modeSw button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.mode === m)));
    if (m === 'sb') renderSB(); else { try { localStorage.setItem('fm.sb', JSON.stringify({ mode: 'map', page: sbCur })); } catch (e) { /* 무시 */ } requestAnimationFrame(() => { layout(); drawMini(); }); }
  }

  // ----- 문서 페이지 -----
  // ----- 틀 연결 -----
  (function mountSB() {
    const brand = document.querySelector('.top .brand');
    const sw = el('div', 'mode'); sw.id = 'modeSw'; sw.setAttribute('role', 'tablist'); sw.setAttribute('aria-label', '보기');
    sw.innerHTML = '<button role="tab" data-mode="map" aria-selected="true">플로우 맵</button><button role="tab" data-mode="sb" aria-selected="false">화면설계서</button>';
    brand.after(sw);
    sw.querySelectorAll('button').forEach((b) => b.onclick = () => setMode(b.dataset.mode));
    document.querySelectorAll('.top .layers, .top .sep, #zoomOut, #zoomVal, #zoomIn, #fitAll, #play, #btnLeft, #btnRight').forEach((x) => x.classList.add('map-only'));
    const v = el('section', 'sbv'); v.setAttribute('aria-label', '화면설계서');
    const groups = sbGroups();
    v.innerHTML = '<nav class="sbx" id="sbIdx" aria-label="화면설계서 목차">' + groups.map((g) => '<h4>' + esc(g[0]) + '</h4>' + SBP.filter(g[1]).map((p) => '<button data-sb="' + p.i + '"><span>' + p.no + '</span><span>' + (p.kind === 'mx' ? '└ ' : '') + esc(p.title) + '</span>' + (p.scr && p.kind === 'scr' ? '<small>SCR-' + p.scr + '</small>' : '') + '</button>').join('')).join('') + '</nav>' +
      '<div class="sbmain" id="sbMain"><div class="sbnav"><button class="tb" id="sbPrev" aria-label="이전 페이지">‹ 이전</button><button class="tb" id="sbNext" aria-label="다음 페이지">다음 ›</button><span class="t" id="sbPos"></span><button class="tb" id="sbMap">플로우 맵에서 보기</button></div><article class="sheet" id="sbSheet"></article></div>';
    app.appendChild(v);
    $('sbIdx').querySelectorAll('button').forEach((b) => b.onclick = () => sbGo(+b.dataset.sb));
    $('sbPrev').onclick = () => sbGo(sbCur - 1); $('sbNext').onclick = () => sbGo(sbCur + 1);
    $('sbMap').onclick = () => { const p = SBP[sbCur]; setMode('map'); if (p.scr) { select(p.scr); setTimeout(() => focus(p.scr), 60); } };
    window.addEventListener('keydown', (e) => {
      if (!app.classList.contains('mode-sb') || !$('docs').hidden) return;
      if (e.target.closest && e.target.closest('input,textarea,select')) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') { sbGo(sbCur + 1); e.preventDefault(); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { sbGo(sbCur - 1); e.preventDefault(); }
      else if (e.key === 'm' || e.key === 'M') setMode('map');
      if (e.key !== 'd' && e.key !== 'D') e.stopPropagation();
    }, true);
    let rz = 0; window.addEventListener('resize', () => { if (!app.classList.contains('mode-sb')) return; clearTimeout(rz); rz = setTimeout(() => { const p = SBP[sbCur]; if (p.kind === 'scr') drawShot(p, $('sbShot')); }, 150); });
    window.openSB = (id) => { sbCur = Math.max(0, sbOf(id)); setMode('sb'); };
    try { const s = JSON.parse(localStorage.getItem('fm.sb') || 'null'); if (s && s.mode === 'sb') { sbCur = Math.min(SBP.length - 1, s.page || 0); setTimeout(() => setMode('sb'), 0); } } catch (e) { /* 무시 */ }
  })();
  // 로컬 검수용: 마커 대상이 잘리거나 가려졌는지, 마커끼리 겹치는지, 화면 안에서 내용이 넘쳐 잘리는지
  if (location.hostname === '127.0.0.1') window.__sbAudit = () => {
    const out = [], prev = sbCur, seen = {};
    const clipVis = (e, stop) => { const r = e.getBoundingClientRect(); let v = { l: r.left, t: r.top, r: r.right, b: r.bottom }; for (let a = e.parentElement; a && a !== stop; a = a.parentElement) { const cs = getComputedStyle(a); if (cs.overflowX !== 'visible' || cs.overflowY !== 'visible') { const q = a.getBoundingClientRect(); v = { l: Math.max(v.l, q.left), t: Math.max(v.t, q.top), r: Math.min(v.r, q.right), b: Math.min(v.b, q.bottom) }; } } const A = Math.max(1, (r.right - r.left) * (r.bottom - r.top)); return { r: r, v: v, ratio: Math.max(0, v.r - v.l) * Math.max(0, v.b - v.t) / A }; };
    const txt = (e) => (e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40);
    SBP.forEach((p, i) => {
      if (p.kind !== 'scr') return; sbGo(i);
      const host = $('sbShot'), root = host.querySelector('.scr');
      p.marks.forEach((m) => {
        const e = locate(root, m); if (!e) { out.push([p.no, m.n, m.t, '대상 없음']); return; }
        const c = clipVis(e, host); if (c.ratio < .97) out.push([p.no, m.n, m.t, '대상이 잘림 ' + Math.round(c.ratio * 100) + '%']);
        e.scrollIntoView({ block: 'center' });
        const c2 = clipVis(e, host), pts = [[.5, .5], [.15, .5], [.85, .5]];
        pts.forEach((f) => { const x = c2.v.l + (c2.v.r - c2.v.l) * f[0], y = c2.v.t + (c2.v.b - c2.v.t) * f[1]; const t = document.elementFromPoint(x, y); if (!t) return; if (t.closest('.sbm-n')) { if (t.closest('.sbm').dataset.n !== m.n) out.push([p.no, m.n, m.t, (t.closest('.sbm').dataset.n) + '번 원이 대상을 덮음']); } else if (!e.contains(t) && !t.contains(e)) out.push([p.no, m.n, m.t, '다른 요소가 덮음: ' + (t.className || t.tagName) + ' "' + txt(t) + '"']); });
      });
      const gl = []; { const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), rg = document.createRange(); for (let nd = tw.nextNode(); nd; nd = tw.nextNode()) { if (!nd.textContent.trim() || (nd.parentElement && nd.parentElement.closest('.dimmed'))) continue; rg.selectNodeContents(nd); [...rg.getClientRects()].forEach((q) => { if (q.width > 0) gl.push([nd, q]); }); } }
      host.querySelectorAll('.sbm-n').forEach((c) => { const n = c.parentElement.dataset.n, m = p.marks.find((x) => x.n === n), tg = m && locate(root, m); const r = c.getBoundingClientRect(), pad = r.width * .12; const hit = {}; gl.forEach((g) => { const q = g[1]; if (r.right - pad > q.left && r.left + pad < q.right && r.bottom - pad > q.top && r.top + pad < q.bottom && !(tg && tg.contains(g[0]))) hit[g[0].textContent.trim().slice(0, 30)] = 1; }); Object.keys(hit).forEach((h) => out.push([p.no, n, m ? m.t : '', '원이 다른 글자를 가림: "' + h + '"'])); });
      const ns = [...host.querySelectorAll('.sbm-n')].map((x) => [x.textContent, x.getBoundingClientRect()]);
      for (let a = 0; a < ns.length; a++) for (let b = a + 1; b < ns.length; b++) { const A = ns[a][1], B = ns[b][1]; const d = Math.hypot((A.left + A.right - B.left - B.right) / 2, (A.top + A.bottom - B.top - B.bottom) / 2); if (d < A.width * .95) out.push([p.no, ns[a][0] + '·' + ns[b][0], '', '번호 원끼리 겹침']); }
      if (!seen[p.scr]) { const kk = host.clientWidth / 1440, cs = [...root.querySelectorAll('.c, .modal, .note, .ph, .tabsx, .row, .g, .ct > *')].filter((x) => !x.closest('.dimmed'));
        for (let a = 0; a < cs.length; a++) for (let b = a + 1; b < cs.length; b++) { const A = cs[a], B = cs[b]; if (A.contains(B) || B.contains(A) || A.closest('.modal') !== B.closest('.modal')) continue; const P = A.getBoundingClientRect(), Q = B.getBoundingClientRect(), ox = Math.min(P.right, Q.right) - Math.max(P.left, Q.left), oy = Math.min(P.bottom, Q.bottom) - Math.max(P.top, Q.top); if (ox > 2 && oy > 2) out.push([p.scr, '-', '"' + txt(A).slice(0, 14) + '" × "' + txt(B).slice(0, 14) + '"', '영역끼리 겹침 ' + Math.round(ox / kk) + '×' + Math.round(oy / kk)]); } }
      if (!seen[p.scr]) { seen[p.scr] = 1; root.querySelectorAll('*').forEach((x) => { if (x.closest('.dimmed') || x.closest('svg')) return; const cs = getComputedStyle(x); if ((cs.overflowX !== 'visible' || cs.overflowY !== 'visible') && cs.textOverflow !== 'ellipsis' && (x.scrollWidth > x.clientWidth + 2 || x.scrollHeight > x.clientHeight + 2)) out.push([p.scr, '-', (x.className || x.tagName) + ' "' + txt(x) + '"', '화면 내용 넘침 ' + (x.scrollWidth - x.clientWidth) + '×' + (x.scrollHeight - x.clientHeight)]); }); }
    });
    sbGo(prev); return out.map((r) => r.join(' | ')).join('\n');
  };
