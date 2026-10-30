// Claude Design 캔버스에서 사용자가 고친 보드를 프로젝트 시안으로 되가져온다.
// 사용: node import_design.mjs <받은 디자인 폴더> <프로젝트 폴더> [--apply]
//   <받은 디자인 폴더>: Artifact read(paths)로 내려받은 최신본 (project/*.dc.html · theme.css가 든 폴더나 그 부모)
//   기본은 무엇이 바뀌었는지만 보고한다. --apply면:
//     화면 보드(<ID>.dc.html) → <프로젝트>/design-import/<ID>.html  (이후 이 파일이 H[ID]보다 우선, 빌드 · 내보내기 모두)
//     theme.css가 다르면 → <프로젝트>/theme.css (이전 것은 theme.css.bak)
//     helmet에 추가된 스타일 → design-import/<ID>.css 로 따로 남기고 보고 (theme.css로 옮길지 사람이 정한다)
//   시안 비교 보드(V-*) · 디자인 시스템 보드(DS-*)는 바뀌었는지만 알린다.
//   {{…}} · <sc-for> · <sc-if> · <dc-import>가 생긴 보드는 컴포넌트로 바뀐 것이라 자동 반영하지 않는다(수동 반영 필요).
import fs from 'node:fs';
import path from 'node:path';
import { loadProject, linkify, unlinkify, readBoard } from './dc-lib.mjs';

const args = process.argv.slice(2), APPLY = args.includes('--apply'), [inDir, projDir] = args.filter((a) => !a.startsWith('--'));
if (!inDir || !projDir) { console.error('사용: node import_design.mjs <받은 디자인 폴더> <프로젝트 폴더> [--apply]'); process.exit(1); }
const D = fs.existsSync(path.join(inDir, 'project')) ? path.resolve(inDir, 'project') : path.resolve(inDir);
const pr = loadProject(projDir), P = pr.P;
const norm = (s) => s.replace(/\s+/g, ' ').replace(/> </g, '><').trim();
const rows = [], imp = path.join(P, 'design-import');
let applied = 0;

for (const f of fs.readdirSync(D).filter((f) => f.endsWith('.dc.html')).sort()) {
  const id = f.replace(/\.dc\.html$/, ''), b = readBoard(fs.readFileSync(path.join(D, f), 'utf8'));
  if (!b) { rows.push([id, '읽을 수 없음', '<x-dc> 없음']); continue; }
  if (/^(V|DS)-/.test(id)) { rows.push([id, '참고', id[0] === 'V' ? '시안 비교 보드 — 선택은 대화로 받는다' : '디자인 시스템 보드 — tokens.json · components.js를 직접 고친다']); continue; }
  if (!pr.H[id]) { rows.push([id, '새 보드', '프로젝트에 없는 화면 — SCREENS · FLOWS에 추가할지 정한다']); continue; }
  const comp = /\{\{|<sc-for|<sc-if|<dc-import/.test(b.body);
  const back = unlinkify(b.body), cur = pr.H[id]();
  const same = norm(back) === norm(cur) || norm(b.body) === norm(linkify(cur));
  const note = [];
  if (b.style) note.push('helmet 스타일 추가 ' + b.style.length + '자');
  if (same && !b.style) { rows.push([id, '같음', '']); continue; }
  if (comp) { rows.push([id, '수동 반영 필요', '컴포넌트 문법(' + (b.body.match(/\{\{|<sc-for|<sc-if|<dc-import/g) || []).length + '곳)이 생김 — 보드를 읽고 시안에 옮긴다']); continue; }
  rows.push([id, same ? '스타일만 바뀜' : '바뀜', note.join(' · ') + (pr.imported.includes(id) ? ' (이미 가져온 화면 갱신)' : '')]);
  if (APPLY) {
    fs.mkdirSync(imp, { recursive: true });
    if (!same) fs.writeFileSync(path.join(imp, id + '.html'), back, 'utf8');
    if (b.style) fs.writeFileSync(path.join(imp, id + '.css'), b.style + '\n', 'utf8');
    applied++;
  }
}
const th = path.join(D, 'theme.css');
if (fs.existsSync(th)) {
  const a = fs.readFileSync(th, 'utf8'), c = fs.readFileSync(path.join(P, 'theme.css'), 'utf8');
  if (norm(a) !== norm(c)) {
    rows.push(['theme.css', '바뀜', '캔버스에서 테마를 고침']);
    if (APPLY) { fs.writeFileSync(path.join(P, 'theme.css.bak'), c, 'utf8'); fs.writeFileSync(path.join(P, 'theme.css'), a, 'utf8'); applied++; }
  } else rows.push(['theme.css', '같음', '']);
}
const w = Math.max(...rows.map((r) => r[0].length), 4);
console.log(rows.map((r) => r[0].padEnd(w) + '  ' + r[1] + (r[2] ? '  — ' + r[2] : '')).join('\n'));
const changed = rows.filter((r) => /바뀜|수동|새 보드/.test(r[1])).length;
console.log(APPLY ? '\n반영 ' + applied + '건 → ' + path.relative(process.cwd(), imp) + ' (다시 빌드: build_kit.py)' : '\n바뀐 것 ' + changed + '건. 반영하려면 --apply');
