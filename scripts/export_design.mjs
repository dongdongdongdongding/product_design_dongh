// 프로젝트 화면 시안(project.js의 H · SCREENS · FLOWS)을 Claude Design 캔버스 보드로 내보낸다.
// 사용: node export_design.mjs <프로젝트 폴더> <출력 폴더(design)>
//   → <출력>/project/<화면ID>.dc.html · theme.css · canvas.json
// 화면 안의 data-go="X"(다른 화면으로 가는 버튼)는 <a href="X.dc.html">로 바꿔 캔버스 프로토타입에서도 이동된다.
// 지도처럼 여러 보드에 반복되는 부분은 내보낸 뒤 Claude Design에서 공통 컴포넌트(dc-import)로 묶어 다듬는다(skills/design-canvas).
import fs from 'node:fs';
import path from 'node:path';

const [, , projDir, outDir] = process.argv;
if (!projDir || !outDir) { console.error('사용: node export_design.mjs <프로젝트 폴더> <출력 폴더>'); process.exit(1); }
const P = path.resolve(projDir), O = path.resolve(outDir, 'project');
fs.mkdirSync(O, { recursive: true });
const kit = JSON.parse(fs.readFileSync(path.join(P, 'kit.json'), 'utf8'));
const src = fs.readFileSync(path.join(P, 'project.js'), 'utf8');
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const pick = new Function('esc', 'DOC', src + '\n;return { PROJECT, H, SCREENS, FLOWS };');
const { H, SCREENS, FLOWS } = pick(esc, { wbsBase: 0, features: [], ex: [], at: [], rtm: [], fields: [], map: { sym: [], scr: [], base: [], rules: [] } });

// data-go가 붙은 요소를 <a href>로 바꾼다 (같은 이름 태그의 짝을 세어 닫는 태그까지 바꾼다)
function linkify(html) {
  let out = '', i = 0;
  const open = /<(span|div|b|button)(\s[^>]*?)\sdata-go="([A-Za-z0-9]+)"([^>]*)>/g;
  let m;
  while ((m = open.exec(html))) {
    const tag = m[1], start = m.index, afterOpen = open.lastIndex;
    let depth = 1, j = afterOpen; const re = new RegExp('<(/?)' + tag + '(\\s|>)', 'g'); re.lastIndex = afterOpen; let t;
    while (depth && (t = re.exec(html))) { depth += t[1] ? -1 : 1; j = t.index; }
    if (depth) continue;
    const attrs = (m[2] + m[4]).replace(/\sstyle="([^"]*)"/, (s, st) => ' style="' + st + ';text-decoration:none;color:inherit;cursor:pointer"');
    const styled = /\sstyle="/.test(attrs) ? attrs : attrs + ' style="text-decoration:none;color:inherit;cursor:pointer"';
    out += html.slice(i, start) + '<a href="' + m[3] + '.dc.html"' + styled + ' data-go="' + m[3] + '">' + html.slice(afterOpen, j) + '</a>';
    i = j + ('</' + tag + '>').length; open.lastIndex = i;
  }
  return out + html.slice(i);
}

const W = 1440, Hh = 900, GAPX = 80, ROW = Hh + 700;
const boards = {}, order = [], notes = {};
FLOWS.forEach((f, r) => {
  notes['t' + r] = { x: 0, y: r * ROW - 300, text: f.no + ' ' + f.title + ' · ' + f.desc, kind: 'title1', maxW: Math.max(W, f.screens.length * (W + GAPX) - GAPX) };
  f.screens.forEach((id, c) => {
    const s = SCREENS.find((x) => x.id === id);
    const body = linkify(H[id]()).replace(/\{\{/g, '{ {');
    const file = id + '.dc.html';
    fs.writeFileSync(path.join(O, file), `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<title>${esc(id + ' ' + s.title)}</title>
<script src="./support.js"></script>
<link rel="stylesheet" href="theme.css">
</head>
<body>
<x-dc>
<helmet>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Overpass:wght@300;400;600;700;800&amp;display=swap">
<style>body{margin:0} a{color:inherit}</style>
</helmet>
${body}
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":${W},"height":${Hh}}}'>
class Component extends DCLogic {
  renderVals() {
    return {};
  }
}
</script>
</body>
</html>
`, 'utf8');
    boards[file] = { x: c * (W + GAPX), y: r * ROW, w: W, h: Hh, title: id + ' ' + s.title, expand: 'fill', is_interactive: true };
    order.push(file);
    notes['s-' + id] = { x: c * (W + GAPX), y: r * ROW + Hh + 60, w: W, size: 's', fill: 'gray', text: id + ' · ' + s.feat.join('·') + ' — ' + s.purpose };
  });
});
fs.copyFileSync(path.join(P, 'theme.css'), path.join(O, 'theme.css'));
const canvas = { v: 3, createdOnFiles: { v: 1, at: new Date().toISOString().replace(/\.\d+Z$/, 'Z') }, title: (kit.designTitle || kit.title.replace(/플로우 맵$/, '').trim() + ' 화면 디자인'), launch: { view: 'canvas' }, pages: [], boards, order, notes, designSystems: [] };
fs.writeFileSync(path.join(O, 'canvas.json'), JSON.stringify(canvas, null, 1), 'utf8');
console.log('ok', order.length, 'boards →', O);
