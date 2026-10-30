// 빌드한 flowmap.html 안의 인라인 스크립트가 문법 오류 없이 읽히는지 본다 (번역 · 프로젝트 문구가 따옴표를 깨는 사고를 잡는다).
// 사용: node check_build.mjs <flowmap.html> [...]
import fs from 'node:fs';

let bad = 0;
for (const f of process.argv.slice(2)) {
  const h = fs.readFileSync(f, 'utf8');
  const re = /<script(?![^>]*(?:type="application\/json"|src=))[^>]*>([\s\S]*?)<\/script>/g;
  let m, n = 0, e = 0;
  while ((m = re.exec(h))) {
    n++;
    try { new Function(m[1]); } catch (err) { e++; console.log(f + ' · 스크립트 ' + n + ': ' + err.message); }
  }
  console.log((e ? '실패 ' : 'ok ') + f + ' · 스크립트 ' + n + '개 · 문법 오류 ' + e);
  bad += e;
}
process.exit(bad ? 1 : 0);
