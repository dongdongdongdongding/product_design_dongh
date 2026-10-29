// Claude Design 캔버스 점검 — templates/design/harness.html 을 127.0.0.1로 열고 javascript_tool로 실행
// harness.html 이 .dc.html 을 직접 해석해 그린다(캔버스 런타임 파일은 실행하지 않는다).
// 먼저 같은 출처에서 flowmap-sb.js 를 돌려 두면 localStorage('fmLabels')로 플로우 맵 시안과 항목을 비교한다.
// BOARDS: 점검할 보드 이름(.dc.html 앞부분). 프로젝트에 맞게 고친다.
(async () => {
  const BOARDS = ['Main', 'R1', 'R2', 'R3', 'S1', 'S2', 'P1', 'P4', 'P2', 'P3', 'M1', 'M2', 'M3', 'C1'];
  if (!window.renderAll) return 'harness.html 에서 실행하세요';
  await renderAll(BOARDS); await new Promise((r) => setTimeout(r, 400));
  // 지도 컴포넌트가 지도 상자를 꽉 채우는지 (dc-import 에 style="height:100%" 가 없으면 200 px로 줄어든다)
  const mapBad = [...document.querySelectorAll('.mapbox')].filter((m) => { const h = m.querySelector('.dcimport[data-name=Map]'); return h && Math.abs(h.firstElementChild.getBoundingClientRect().height - m.getBoundingClientRect().height) > 2; }).length;
  // 화면 틀 아래 빈 띠 (틀 최소 높이가 보드 높이보다 작을 때)
  const strip = [...document.querySelectorAll('.board')].map((b) => { const B = b.getBoundingClientRect(), a = b.querySelector('.app'); return a ? Math.round(B.bottom - a.getBoundingClientRect().bottom) : 0; }).filter((x) => x > 2).length;
  const all = audit().split('\n').filter(Boolean);
  const blank = all.filter((l) => /빈 공간/.test(l)), rest = all.filter((l) => !/빈 공간/.test(l));
  return '지도 높이 불일치 ' + mapBad + ' · 보드 아래 빈 띠 ' + strip + '\n잘림 · 겹침 · 누락:\n' + (rest.join('\n') || '0건') + '\n\n빈 공간(판단 필요):\n' + (blank.join('\n') || '0건');
})();
