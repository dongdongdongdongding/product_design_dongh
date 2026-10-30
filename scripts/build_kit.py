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
import json, re, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from build_flowmap import parse  # noqa: E402

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

ENGINE = Path(__file__).resolve().parent.parent / 'engine'


def translator(lang):
    """engine/i18n.json으로 엔진 문구를 바꾼다(긴 문구부터). 주석 · 정규식의 한국어는 \\u 이스케이프로 써 두어 바뀌지 않는다."""
    table = json.loads((ENGINE / 'i18n.json').read_text(encoding='utf8'))
    if lang not in ('en', 'zh', 'ja'):
        raise SystemExit('kit.json lang은 ko · en · zh · ja 중 하나: ' + lang)
    # 번역문이 JS 문자열 · HTML 속성 안에 들어가므로 ' " 는 ’ ” 로 바꿔 따옴표가 닫히지 않게 한다
    safe = lambda s: s.replace("'", '’').replace('"', '”').replace('\\', '')
    pairs = sorted(((k, safe(v[lang])) for k, v in table.items() if not k.startswith('$')), key=lambda kv: -len(kv[0]))
    def tr(t):
        # 주석은 번역하지 않는다(줄 주석 · 블록 주석은 그대로 두고 나머지만 바꾼다)
        parts = re.split(r'(/\*[\s\S]*?\*/|(?m:^\s*//.*$)|<!--[\s\S]*?-->)', t)
        for i in range(0, len(parts), 2):
            for k, v in pairs:
                if k in parts[i]:
                    parts[i] = parts[i].replace(k, v)
        return ''.join(parts)
    return tr


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
    # 캔버스에서 가져온 화면(design-import/<ID>.html, import_design.mjs가 만든다)은 H[ID]보다 우선한다 — export_design.mjs와 같은 규칙
    imp = P / 'design-import'
    over = {f.stem: f.read_text(encoding='utf8') for f in sorted(imp.glob('*.html'))} if imp.is_dir() else {}
    css = '\n'.join(f.read_text(encoding='utf8') for f in sorted(imp.glob('*.css'))) if imp.is_dir() else ''
    pjs = rd('project.js') + ('\n;(function (O) { for (const k in O) H[k] = () => O[k]; })(' + json.dumps(over, ensure_ascii=False).replace('</', '<\\/') + ');\n' if over else '')
    # 엔진 UI 언어: kit.json "lang" = ko(기본) · en · zh · ja. 엔진 파일의 문구만 바꾸고 프로젝트 내용은 쓴 언어 그대로 둔다
    lang = cfg.get('lang', 'ko')
    tr = (lambda t: t) if lang == 'ko' else translator(lang)
    html = tr((ENGINE / 'template.html').read_text(encoding='utf8'))
    sbjs = tr((ENGINE / 'sb-head.js').read_text(encoding='utf8')) + '\n' + rd('sb-pages.js') + '\n' + tr((ENGINE / 'sb-tail.js').read_text(encoding='utf8'))
    html = html.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n<meta name="lang" content="%s">' % lang, 1)
    # 한자는 언어마다 글자 모양이 달라서 중국어 · 일본어면 그 언어 글꼴을 앞에 둔다
    first = {'zh': '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", ', 'ja': '"Hiragino Sans", "Yu Gothic", "Noto Sans JP", ', 'en': '"Inter", '}.get(lang, '')
    if first:
        html = html.replace('--ui: ', '--ui: ' + first, 1)
    for k, v in [('/*__THEME_CSS__*/', rd('theme.css') + ('\n' + css if css else '')), ('/*__SBCSS__*/', (ENGINE / 'sb.css').read_text(encoding='utf8')),
                 ('//__PROJECT_JS__', pjs), ('//__SBJS__', sbjs),
                 ('__TITLE__', cfg.get('title', '플로우 맵')), ('__SUBTITLE__', cfg.get('subtitle', '')),
                 ('__DOCS_TITLE__', cfg.get('docsTitle', '문서')), ('__DOCS_SUB__', cfg.get('docsSub', ''))]:
        if k not in html:
            raise SystemExit('엔진 템플릿에 자리표시자가 없음: ' + k)
        html = html.replace(k, v)
    html = html.replace('__DOCDATA__', json.dumps(data, ensure_ascii=False).replace('</', '<\\/'))
    if lang != 'ko':
        # 주석을 뺀 엔진 코드에 한국어가 남았는지 (i18n.json에 없는 새 문구)
        code = re.sub(r'/\*[\s\S]*?\*/|<!--[\s\S]*?-->', '', ''.join(tr((ENGINE / f).read_text(encoding='utf8')) for f in ('template.html', 'sb-head.js', 'sb-tail.js')))
        code = re.sub(r'(?m)(^|\s)//.*$', '', code)
        left = sorted(set(w.strip() for w in re.findall(r'[가-힣][가-힣 ·]*', code) if w.strip()))
        print('engine lang=%s · 번역 안 된 엔진 문구 %d개%s' % (lang, len(left), (': ' + ', '.join(left[:12])) if left else ''))
    out = P / cfg.get('out', 'flowmap.html')
    out.write_text(html, encoding='utf8')
    print(('design-import %d화면 우선 · ' % len(over) if over else '') + 'ok %s · features=%d ex=%d at=%d rtm=%d fields=%d map.scr=%d wbs=%.1f · %d bytes' % (out.name, len(data['features']), len(data['ex']), len(data['at']), len(data['rtm']), len(data['fields']), len(data['map']['scr']), data['wbsBase'], len(html)))


if __name__ == '__main__':
    main()
