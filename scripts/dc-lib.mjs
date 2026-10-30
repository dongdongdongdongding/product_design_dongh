// export_design.mjs · import_design.mjs가 함께 쓰는 것: 프로젝트 읽기, data-go ↔ <a href> 변환, 보드 본문 꺼내기
import fs from 'node:fs';
import path from 'node:path';

export const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const LINK_STYLE = 'text-decoration:none;color:inherit;cursor:pointer';

// 프로젝트 폴더를 읽는다. variants.js · design-system/components.js는 project.js와 같은 범위라 shell() · card() 같은 시안 도구를 그대로 쓴다.
// design-import/<ID>.html(캔버스에서 가져온 화면)이 있으면 H[ID]보다 우선한다 — build_kit.py와 같은 규칙.
export function loadProject(projDir) {
  const P = path.resolve(projDir);
  const opt = (f) => (fs.existsSync(path.join(P, f)) ? fs.readFileSync(path.join(P, f), 'utf8') : '');
  const pick = new Function('esc', 'DOC', opt('project.js') + '\n;' + opt('variants.js') + '\n;' + opt('design-system/components.js') +
    '\n;return { H, SCREENS, FLOWS, ISSUES: typeof ISSUES === "undefined" ? [] : ISSUES, VARIANTS: typeof VARIANTS === "undefined" ? null : VARIANTS, COMPONENTS: typeof COMPONENTS === "undefined" ? null : COMPONENTS };');
  const r = pick(esc, { wbsBase: 0, features: [], ex: [], at: [], rtm: [], fields: [], map: { sym: [], scr: [], base: [], rules: [] } });
  const IMP = path.join(P, 'design-import');
  r.imported = [];
  if (fs.existsSync(IMP)) for (const f of fs.readdirSync(IMP)) { const m = /^([A-Za-z0-9]+)\.html$/.exec(f); if (m) { const t = fs.readFileSync(path.join(IMP, f), 'utf8'); r.H[m[1]] = () => t; r.imported.push(m[1]); } }
  r.kit = JSON.parse(opt('kit.json') || '{}');
  r.tokens = opt('design-system/tokens.json') ? JSON.parse(opt('design-system/tokens.json')) : null;
  r.P = P;
  return r;
}

// data-go가 붙은 요소를 <a href>로 바꾼다 (같은 이름 태그의 짝을 세어 닫는 태그까지 바꾼다). 원래 태그는 data-tag에 남긴다
export function linkify(html) {
  let out = '', i = 0;
  const open = /<(span|div|b|button)(\s[^>]*?)?\sdata-go="([A-Za-z0-9]+)"([^>]*)>/g;
  let m;
  while ((m = open.exec(html))) {
    const tag = m[1], start = m.index, afterOpen = open.lastIndex;
    let depth = 1, j = afterOpen; const re = new RegExp('<(/?)' + tag + '(\\s|>)', 'g'); re.lastIndex = afterOpen; let t;
    while (depth && (t = re.exec(html))) { depth += t[1] ? -1 : 1; j = t.index; }
    if (depth) continue;
    const a0 = (m[2] || '') + m[4];
    const styled = /\sstyle="/.test(a0) ? a0.replace(/\sstyle="([^"]*)"/, (s, st) => ' style="' + st + ';' + LINK_STYLE + '"') : a0 + ' style="' + LINK_STYLE + '"';
    out += html.slice(i, start) + '<a href="' + m[3] + '.dc.html"' + styled + ' data-go="' + m[3] + '" data-tag="' + tag + '">' + html.slice(afterOpen, j) + '</a>';
    i = j + ('</' + tag + '>').length; open.lastIndex = i;
  }
  return out + html.slice(i);
}

// linkify의 반대: <a href="X.dc.html" … data-go="X" data-tag="T">…</a> → <T … data-go="X">…</T>
// 캔버스에서 새로 만든 링크(data-go 없는 <a href="X.dc.html">)도 data-go로 바꾼다(태그는 span)
export function unlinkify(html) {
  let out = '', i = 0;
  const open = /<a\s([^>]*?)>/g;
  let m;
  while ((m = open.exec(html))) {
    const attrs = m[1], href = /href="([A-Za-z0-9]+)\.dc\.html"/.exec(attrs);
    if (!href) continue;
    const start = m.index, afterOpen = open.lastIndex;
    let depth = 1, j = afterOpen; const re = /<(\/?)a(\s|>)/g; re.lastIndex = afterOpen; let t;
    while (depth && (t = re.exec(html))) { depth += t[1] ? -1 : 1; j = t.index; }
    if (depth) continue;
    const tag = (/data-tag="(\w+)"/.exec(attrs) || [, 'span'])[1];
    let a = ' ' + attrs.replace(/\s*href="[^"]*"/, '').replace(/\s*data-go="[^"]*"/, '').replace(/\s*data-tag="[^"]*"/, '').trim();
    a = a.replace(/\sstyle="([^"]*)"/, (s, st) => { const v = st.replace(';' + LINK_STYLE, '').replace(LINK_STYLE, ''); return v ? ' style="' + v + '"' : ''; });
    if (a === ' ') a = '';
    out += html.slice(i, start) + '<' + tag + a + ' data-go="' + href[1] + '">' + unlinkify(html.slice(afterOpen, j)) + '</' + tag + '>';
    i = j + 4; open.lastIndex = i;
  }
  return out + html.slice(i);
}

// .dc.html에서 화면 본문(<x-dc> 안, helmet 제외)과 helmet의 <style>을 꺼낸다
export function readBoard(text) {
  const x = /<x-dc>([\s\S]*)<\/x-dc>/.exec(text);
  if (!x) return null;
  const helm = /<helmet>([\s\S]*?)<\/helmet>/.exec(x[1]);
  const style = helm ? (/<style>([\s\S]*?)<\/style>/.exec(helm[1]) || [, ''])[1] : '';
  const body = x[1].replace(/<helmet>[\s\S]*?<\/helmet>/, '').trim().replace(/\{ \{/g, '{{');
  return { body, style: style.replace('body{margin:0} a{color:inherit}', '').trim() };
}
