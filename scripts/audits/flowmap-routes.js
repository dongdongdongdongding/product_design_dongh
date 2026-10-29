// 플로우 맵 캔버스의 연결선 점검 — 플로우 맵 탭에서 javascript_tool로 실행
// 우회 모드로 바꾼 뒤 각 연결선을 20 px 간격으로 따라가며 화면(프레임 + 기능정의 카드)을 가로지르는지 본다.
// 결과: 연결선 수 · 관통 수 · 관통한 연결 목록. 끝나면 원래 모드로 되돌린다.
(async () => {
  const sw = document.querySelector('#modeSw [data-mode=map]'); if (sw) sw.click();
  const btns = [...document.querySelectorAll('#edgeMode button')]; if (!btns.length) return '연결선 모드 버튼(#edgeMode)이 없습니다';
  const prev = btns.find((b) => b.getAttribute('aria-pressed') === 'true');
  btns.find((b) => b.dataset.em === 'route').click(); await new Promise((r) => setTimeout(r, 300));
  const fr = [...document.querySelectorAll('.world > .frame')].map((f) => ({ id: f.dataset.id, x: f.offsetLeft, y: f.offsetTop, w: f.offsetWidth, h: f.querySelector('.shot').offsetHeight + 64 + (f.querySelector('.spec') ? f.querySelector('.spec').offsetHeight : 0) }));
  const hits = [];
  document.querySelectorAll('svg.edges g.eg').forEach((g) => {
    const p = g.querySelector('path.e'), L = p.getTotalLength();
    for (let s = 40; s < L - 40; s += 20) {
      const q = p.getPointAtLength(s), f = fr.find((r) => q.x > r.x + 4 && q.x < r.x + r.w - 4 && q.y > r.y + 4 && q.y < r.y + r.h - 4);
      if (f) { hits.push((g.querySelector('title') || {}).textContent + ' @' + f.id); break; }
    }
  });
  if (prev) prev.click();
  return '연결선 ' + document.querySelectorAll('svg.edges g.eg').length + ' · 화면 관통 ' + hits.length + (hits.length ? '\n' + hits.join('\n') : '');
})();
