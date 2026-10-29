// 플로우 맵의 화면설계서(SB) 탭 점검 — http://127.0.0.1:<port>/.../flowmap.html 에서 javascript_tool로 실행 (앞에 await를 붙인다)
// (__sbAudit은 호스트가 127.0.0.1일 때만 생긴다)
// 1) 모든 SB 화면 페이지: 번호 대상이 잘림 · 다른 요소에 덮임 · 번호 원끼리 겹침 · 원이 다른 글자를 가림 · 영역끼리 겹침 · 화면 내용 넘침
// 2) 시안 라벨을 모아 localStorage('fmLabels')에 저장 — 디자인 캔버스 점검(design-canvas.js)이 비교 기준으로 씀
// 3) 최종 검증 페이지(id 'verify')의 자동 검사 결과와 '확인 필요' 개수
(async () => {
  const sw = document.querySelector('#modeSw [data-mode=sb]'); if (!sw) return 'SB 탭이 없는 플로우 맵입니다';
  sw.click(); await new Promise((r) => setTimeout(r, 300));
  if (!window.__sbAudit) return '__sbAudit 없음: 127.0.0.1로 열었는지 확인';
  const audit = window.__sbAudit();
  const L = {};
  for (const b of document.querySelectorAll('#sbIdx button')) {
    const sm = b.querySelector('small'); if (!sm) continue;
    const id = sm.textContent.replace('SCR-', ''); if (L[id]) continue;
    b.click(); const r = document.querySelector('#sbShot .scr'); if (!r) continue; const set = new Set();
    r.querySelectorAll('.lab, .ch, .btn, th, .tabsx span, .kpi .k, .modal h3, .li .tt, .ck, .tg, .crumb').forEach((e) => {
      if (e.closest('.dimmed') || e.closest('.sb')) return;
      const t = (e.childNodes[0] && e.childNodes[0].nodeType === 3 ? e.childNodes[0].textContent : e.textContent).replace(/\s+/g, ' ').trim();
      if (t && t.length < 40) set.add(t);
    });
    L[id] = [...set];
  }
  try { localStorage.setItem('fmLabels', JSON.stringify(L)); } catch (e) { /* 무시 */ }
  const vb = [...document.querySelectorAll('#sbIdx button')].find((b) => /최종 검증/.test(b.textContent));
  let verify = '(최종 검증 페이지 없음)', fail = 0;
  if (vb) {
    vb.click();
    const t = document.getElementById('sbSheet').innerText, i = t.indexOf('2. 자동 검사'), j = t.indexOf('\n3. ', i + 3);
    verify = t.slice(i, j > 0 ? j : undefined).trim();
    fail = document.querySelectorAll('#sbSheet .sh-chip.new').length;
  }
  return 'SB 점검: ' + (audit ? '\n' + audit : '0건') + '\n\n' + verify + '\n확인 필요 칩: ' + fail + '\n라벨 수집 화면: ' + Object.keys(L).length;
})();
