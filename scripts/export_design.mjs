// 프로젝트 화면 시안(project.js의 H · SCREENS · FLOWS)을 Claude Design 캔버스 보드로 내보낸다.
// 사용: node export_design.mjs <프로젝트 폴더> <출력 폴더(design)> [--variants-only]
//   → <출력>/project/<화면ID>.dc.html · theme.css · canvas.json
// 화면 안의 data-go="X"(다른 화면으로 가는 버튼)는 <a href="X.dc.html" data-go="X" data-tag="원래 태그">로 바꿔 캔버스 프로토타입에서도 이동된다.
//   data-tag는 import_design.mjs가 캔버스에서 고친 보드를 시안으로 되돌릴 때 쓴다.
// 프로젝트 폴더에 있으면 함께 내보낸다(모두 선택):
//   variants.js                 → 맨 위 '시안 비교' 행: V-<key>.dc.html (같은 화면의 다른 방향 2~4개)
//   design-system/tokens.json   → DS-tokens.dc.html (색 · 글자 · 간격 · 모서리 · 그림자)
//   design-system/components.js → DS-components.dc.html (컴포넌트 × 상태 표)
//   design-import/<ID>.html     → 캔버스에서 가져온 화면이 H[ID]보다 우선한다 (build_kit.py와 같은 규칙)
// --variants-only: 화면이 아직 없을 때(2단계) 시안 비교 · 디자인 시스템 보드만 만든다.
// 지도처럼 여러 보드에 반복되는 부분은 내보낸 뒤 Claude Design에서 공통 컴포넌트(dc-import)로 묶어 다듬는다(skills/design-canvas).
import fs from 'node:fs';
import path from 'node:path';
import { loadProject, linkify, esc } from './dc-lib.mjs';

const args = process.argv.slice(2), flags = args.filter((a) => a.startsWith('--')), [projDir, outDir] = args.filter((a) => !a.startsWith('--'));
if (!projDir || !outDir) { console.error('사용: node export_design.mjs <프로젝트 폴더> <출력 폴더> [--variants-only]'); process.exit(1); }
const ONLY_V = flags.includes('--variants-only');
const P = path.resolve(projDir), O = path.resolve(outDir, 'project');
fs.mkdirSync(O, { recursive: true });
const { H, SCREENS, FLOWS, VARIANTS, COMPONENTS, kit, tokens } = loadProject(P);

const W = 1440, Hh = 900, GAPX = 80, ROW = Hh + 700;
const boards = {}, order = [], notes = {};
function board(file, title, body, o) {
  fs.writeFileSync(path.join(O, file), `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<title>${esc(title)}</title>
<script src="./support.js"></script>
<link rel="stylesheet" href="theme.css">
</head>
<body>
<x-dc>
<helmet>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Overpass:wght@300;400;600;700;800&amp;display=swap">
<style>body{margin:0} a{color:inherit}${o.css ? '\n' + o.css : ''}</style>
</helmet>
${body.replace(/\{\{/g, '{ {')}
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":${W},"height":${o.h || Hh}}}'>
class Component extends DCLogic {
  renderVals() {
    return {};
  }
}
</script>
</body>
</html>
`, 'utf8');
  boards[file] = { x: o.x, y: o.y, w: W, h: o.h || Hh, title, expand: 'fill', is_interactive: true };
  order.push(file);
}

let row = 0;
// 0행: 시안 비교 — 같은 화면을 다른 방향으로 2~4개. 시안별 css는 .v-<key> 범위로 쓴다
if (VARIANTS && VARIANTS.items && VARIANTS.items.length) {
  const its = VARIANTS.items;
  notes['t-var'] = { x: 0, y: -300, text: '시안 비교 · ' + (VARIANTS.title || VARIANTS.screen) + ' — 고를 시안을 말하거나 섞어 주세요(예: "B로, 색은 A"). 보드에서 직접 고쳐도 됩니다.', kind: 'title1', maxW: its.length * (W + GAPX) - GAPX };
  its.forEach((v, c) => {
    board('V-' + v.key + '.dc.html', '시안 ' + v.key + ' · ' + v.name, '<div class="v-' + v.key + '">' + linkify(v.html()) + '</div>', { x: c * (W + GAPX), y: 0, css: v.css || '' });
    notes['v-' + v.key] = { x: c * (W + GAPX), y: Hh + 60, w: W, size: 's', fill: 'gray', text: '시안 ' + v.key + ' · ' + v.name + ' — ' + (v.desc || '') };
  });
  row++;
}
// 화면 행 (메뉴 흐름별)
if (!ONLY_V) FLOWS.forEach((f) => {
  notes['t' + row] = { x: 0, y: row * ROW - 300, text: f.no + ' ' + f.title + ' · ' + f.desc, kind: 'title1', maxW: Math.max(W, f.screens.length * (W + GAPX) - GAPX) };
  f.screens.forEach((id, c) => {
    const s = SCREENS.find((x) => x.id === id);
    board(id + '.dc.html', id + ' ' + s.title, linkify(H[id]()), { x: c * (W + GAPX), y: row * ROW });
    notes['s-' + id] = { x: c * (W + GAPX), y: row * ROW + Hh + 60, w: W, size: 's', fill: 'gray', text: id + ' · ' + s.feat.join('·') + ' — ' + s.purpose };
  });
  row++;
});
// 마지막 행: 디자인 시스템 (토큰 · 컴포넌트)
const dsY = row * ROW; let dsX = 0;
if (tokens) {
  const all = [];
  (function flat(o, pre) { for (const k in o) { if (k[0] === '$') continue; const v = o[k], n = pre ? pre + '-' + k : k; if (v && typeof v === 'object' && '$value' in v) all.push({ name: n, type: v.$type || '', value: typeof v.$value === 'object' ? JSON.stringify(v.$value) : String(v.$value), desc: v.$description || '' }); else if (v && typeof v === 'object') flat(v, n); } })(tokens, '');
  // "{palette.green.700}" 같은 참조는 실제 값으로 풀어 보여 준다 (이름 · 참조는 설명 칸에)
  const byName = Object.fromEntries(all.map((t) => [t.name, t]));
  const res = (v, n = 0) => { const m = /^\{([\w.-]+)\}$/.exec(v); const t = m && byName[m[1].replace(/\./g, '-')]; return t && n < 8 ? res(t.value, n + 1) : v; };
  all.forEach((t) => { const r = res(t.value); if (r !== t.value) { t.desc = t.value.slice(1, -1) + (t.desc ? ' · ' + t.desc : ''); t.value = r; } });
  const colors = all.filter((t) => t.type === 'color'), others = all.filter((t) => t.type !== 'color');
  const sw = (t) => '<div style="display:grid;gap:6px"><div style="height:56px;border-radius:8px;border:1px solid #E3E6EC;background:' + esc(t.value) + '"></div><b style="font-size:12px">' + esc(t.name) + '</b><span style="font-size:11px;color:#6B7482">' + esc(t.value) + (t.desc ? ' · ' + esc(t.desc) : '') + '</span></div>';
  const demo = (t) => t.type === 'shadow' ? '<div style="width:96px;height:40px;background:#FFF;border-radius:8px;box-shadow:' + esc(t.value) + '"></div>'
    : t.type === 'dimension' && /radius/.test(t.name) ? '<div style="width:64px;height:32px;background:#E8EBF1;border-radius:' + esc(t.value) + '"></div>'
    : t.type === 'dimension' ? '<div style="height:12px;background:#9AA6FF;width:' + esc(t.value) + '"></div>'
    : t.type === 'typography' || /^font/.test(t.name) ? '<span style="font:' + esc(t.value) + '">가나다 Aa 123</span>' : '';
  const sec = (h, b) => '<section style="margin:0 0 28px"><h2 style="font-size:16px;margin:0 0 12px">' + h + '</h2>' + b + '</section>';
  const body = '<div style="width:1440px;min-height:900px;background:#FFF;padding:48px 56px;box-sizing:border-box;font:14px/1.5 Overpass,\'Malgun Gothic\',sans-serif;color:#1F2430">' +
    '<h1 style="font-size:24px;margin:0 0 4px">디자인 토큰</h1><p style="margin:0 0 28px;color:#6B7482">design-system/tokens.json · theme.css의 --ds-* 변수와 같은 값</p>' +
    sec('색 ' + colors.length, '<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:16px">' + colors.map(sw).join('') + '</div>') +
    (others.length ? sec('크기 · 글자 · 그림자 ' + others.length, '<table style="border-collapse:collapse">' + others.map((t) => '<tr><td style="padding:8px 12px;font-size:12px;font-weight:700;white-space:nowrap">' + esc(t.name) + '</td><td style="padding:8px 12px;font-size:12px;color:#6B7482">' + esc(t.value) + '</td><td style="padding:8px 12px">' + demo(t) + '</td></tr>').join('') + '</table>') : '') + '</div>';
  board('DS-tokens.dc.html', '디자인 토큰', body, { x: dsX, y: dsY, h: Math.max(Hh, 260 + Math.ceil(colors.length / 6) * 130 + others.length * 50) });
  dsX += W + GAPX;
}
if (COMPONENTS && COMPONENTS.length) {
  const body = '<div class="scr" style="display:block;height:auto;min-height:900px;padding:48px 56px;overflow:visible;box-sizing:border-box"><h1 style="font-size:24px;margin:0 0 4px">컴포넌트</h1><p style="margin:0 0 24px;color:#6B7482">design-system/components.js · 상태별 모양</p>' +
    '<table style="border-collapse:separate;border-spacing:0 14px">' +
    COMPONENTS.map((c) => '<tr><td style="padding:0 24px 0 0;vertical-align:top;width:200px"><b>' + esc(c.name) + '</b>' + (c.desc ? '<div style="font-size:11px;color:#6B7482">' + esc(c.desc) + '</div>' : '') + '</td>' +
      c.states.map((s) => '<td style="padding:0 20px 0 0;vertical-align:top"><div style="font-size:11px;color:#6B7482;margin:0 0 6px">' + esc(s.label) + '</div>' + s.html + '</td>').join('') + '</tr>').join('') + '</table></div>';
  board('DS-components.dc.html', '컴포넌트', body, { x: dsX, y: dsY, h: Math.max(Hh, 200 + COMPONENTS.length * 90) });
}
if (tokens || (COMPONENTS && COMPONENTS.length)) notes['t-ds'] = { x: 0, y: dsY - 300, text: '디자인 시스템 · 토큰과 컴포넌트', kind: 'title1', maxW: W * 2 + GAPX };

fs.copyFileSync(path.join(P, 'theme.css'), path.join(O, 'theme.css'));
const canvas = { v: 3, createdOnFiles: { v: 1, at: new Date().toISOString().replace(/\.\d+Z$/, 'Z') }, title: (kit.designTitle || kit.title.replace(/플로우 맵$/, '').trim() + ' 화면 디자인'), launch: { view: 'canvas' }, pages: [], boards, order, notes, designSystems: [] };
fs.writeFileSync(path.join(O, 'canvas.json'), JSON.stringify(canvas, null, 1), 'utf8');
console.log('ok', order.length, 'boards →', O, '·', order.join(' '));
