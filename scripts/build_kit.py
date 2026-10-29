"""프로젝트 폴더(kit.json · theme.css · project.js · sb-pages.js + 문서)를 공통 엔진과 합쳐 flowmap.html을 만든다.

사용:  python -I build_kit.py <프로젝트 폴더>
kit.json 예:
{
  "title": "OO 관리 플로우 맵", "subtitle": "추가개발 v1.0 · 화면 · 연결 · 기능정의 · 검토 이슈",
  "docsTitle": "추가개발 문서 v1.0", "docsSub": "docs/*.md에서 생성",
  "docs": "../../프로젝트/docs",            // 프로젝트 폴더 기준 상대 경로 가능
  "featureDoc": "추가개발-기능정의서.md", "specDoc": "추가개발-상세명세.md", "wbsDoc": "추가개발-WBS.md",
  "expect": "features=34,ex=59,at=21",      // 선택: 문서 개수 고정 검사
  "out": "flowmap.html"
}
"""
import json, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from build_flowmap import parse  # noqa: E402

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

ENGINE = Path(__file__).resolve().parent.parent / 'engine'


def main():
    if len(sys.argv) < 2:
        raise SystemExit('사용: python -I build_kit.py <프로젝트 폴더>')
    P = Path(sys.argv[1]).resolve()
    cfg = json.loads((P / 'kit.json').read_text(encoding='utf8'))
    docs = (P / cfg['docs']).resolve()
    data = parse(docs, cfg.get('featureDoc', '추가개발-기능정의서.md'), cfg.get('specDoc', '추가개발-상세명세.md'), cfg.get('wbsDoc', '추가개발-WBS.md'))
    for kv in filter(None, cfg.get('expect', '').split(',')):
        k, v = kv.split('=')
        if len(data[k]) != int(v):
            raise SystemExit('개수 불일치: %s = %d (kit.json expect %s)' % (k, len(data[k]), v))
    rd = lambda n: (P / n).read_text(encoding='utf8')
    html = (ENGINE / 'template.html').read_text(encoding='utf8')
    sbjs = (ENGINE / 'sb-head.js').read_text(encoding='utf8') + '\n' + rd('sb-pages.js') + '\n' + (ENGINE / 'sb-tail.js').read_text(encoding='utf8')
    for k, v in [('/*__THEME_CSS__*/', rd('theme.css')), ('/*__SBCSS__*/', (ENGINE / 'sb.css').read_text(encoding='utf8')),
                 ('//__PROJECT_JS__', rd('project.js')), ('//__SBJS__', sbjs),
                 ('__TITLE__', cfg.get('title', '플로우 맵')), ('__SUBTITLE__', cfg.get('subtitle', '')),
                 ('__DOCS_TITLE__', cfg.get('docsTitle', '문서')), ('__DOCS_SUB__', cfg.get('docsSub', ''))]:
        if k not in html:
            raise SystemExit('엔진 템플릿에 자리표시자가 없음: ' + k)
        html = html.replace(k, v)
    html = html.replace('__DOCDATA__', json.dumps(data, ensure_ascii=False).replace('</', '<\\/'))
    out = P / cfg.get('out', 'flowmap.html')
    out.write_text(html, encoding='utf8')
    print('ok %s · features=%d ex=%d at=%d rtm=%d fields=%d map.scr=%d wbs=%.1f · %d bytes' % (out.name, len(data['features']), len(data['ex']), len(data['at']), len(data['rtm']), len(data['fields']), len(data['map']['scr']), data['wbsBase'], len(html)))


if __name__ == '__main__':
    main()
