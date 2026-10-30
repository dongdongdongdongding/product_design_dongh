// 시안 · 화면 정의의 밀도를 잰다 — "보기에는 화면인데 기획이 비어 있는" 초안을 거른다.
// 사용: node check_density.mjs <프로젝트 폴더> [--json]
// 화면마다: 요소 수 · 보이는 글자 수 · 표 행 · 입력 · 연결 · SCREENS의 parts/states/rules/ex/at 개수를 재고 기준 미달을 표시한다.
// 기준은 실무 납품 수준의 개발용 화면설계 산출물(화면 14개 · 기능 34 · 예외 59 · 검수 21)을 잰 값의 하한이다(skills/design-system/references/planning-bar.md).
// 기준은 하한이지 목표가 아니다. 숫자를 맞추려고 의미 없는 요소 · 문구를 넣지 않는다 — 미달이면 빠진 기획(상태 · 규칙 · 예외)을 찾는다.
import { loadProject } from './dc-lib.mjs';

const args = process.argv.slice(2), dir = args.find((a) => !a.startsWith('--'));
if (!dir) { console.error('사용: node check_density.mjs <프로젝트 폴더> [--json]'); process.exit(1); }
const { H, SCREENS, ISSUES } = loadProject(dir);

const PAGE = { elems: 110, chars: 450, parts: 4, states: 2, rules: 2, ex: 2, at: 1 };
const OVER = { elems: 100, chars: 250, parts: 3, states: 1, rules: 1, ex: 1, at: 1 };   // 팝업 · 오버레이 · 패널 · 상태 예시 (뒤 화면 제외)
const own = (h) => h.replace(/<div class="dimmed">[\s\S]*?<\/div><div class="shade"><\/div>/, '');
const rows = SCREENS.map((s) => {
  const over = /오버레이|팝업|모달|패널|상태/.test(s.kind || ''), bar = over ? OVER : PAGE;
  const h = own(H[s.id] ? H[s.id]() : '');
  const m = {
    elems: (h.replace(/<svg[\s\S]*?<\/svg>/g, '<svg>').match(/<[a-z]/g) || []).length,   // 지도 · 아이콘 SVG 속 도형은 한 요소로 센다
    chars: h.replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, '').length,
    tr: (h.match(/<tr/g) || []).length,
    inputs: (h.match(/class="(inp|sel)[ "]/g) || []).length,
    links: (h.match(/data-go=/g) || []).length,
    parts: (s.parts || []).length, states: (s.states || []).length, rules: (s.rules || []).length, ex: (s.ex || []).length, at: (s.at || []).length,
  };
  const low = Object.keys(bar).filter((k) => m[k] < bar[k]).map((k) => k + ' ' + m[k] + '<' + bar[k]);
  if (!h) low.unshift('시안 없음');
  return { id: s.id, kind: s.kind, ...m, low };
});
const n = rows.length, sum = (k) => rows.reduce((a, r) => a + r[k], 0);
const proj = [];
if (n && sum('ex') / n < 3) proj.push('화면당 예외 ' + (sum('ex') / n).toFixed(1) + ' < 3 (입력 오류 · 빈 상태 · 권한 · 저장 실패 · 충돌을 화면마다 확인)');
if (n && ISSUES.length < Math.ceil(n / 2)) proj.push('검토 이슈 ' + ISSUES.length + ' < 화면 수의 절반 ' + Math.ceil(n / 2) + ' (원본 대비 해석 · 결정 · 미결을 이슈로 남겼는지)');
if (!rows.some((r) => /상태|공통/.test(r.kind || ''))) proj.push('공통 상태 화면 없음 (저장 실패 · 손상 · 빈 상태 · 권한 없음 예시 화면)');
if (args.includes('--json')) { console.log(JSON.stringify({ rows, proj }, null, 1)); process.exit(0); }
const cols = ['elems', 'chars', 'tr', 'inputs', 'links', 'parts', 'states', 'rules', 'ex', 'at'];
console.log('화면  ' + cols.map((c) => c.padStart(6)).join('') + '  미달');
for (const r of rows) console.log(r.id.padEnd(6) + cols.map((c) => String(r[c]).padStart(6)).join('') + '  ' + (r.low.join(' · ') || 'OK'));
const bad = rows.filter((r) => r.low.length).length;
console.log('\n화면 ' + n + ' · 미달 화면 ' + bad + ' · 프로젝트 기준 ' + (proj.length ? '미달 ' + proj.length + '\n  - ' + proj.join('\n  - ') : 'OK'));
process.exit(bad || proj.length ? 1 : 0);
