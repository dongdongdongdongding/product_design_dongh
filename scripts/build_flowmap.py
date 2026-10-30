"""문서 Markdown 표를 읽어 플로우 맵 템플릿에 DOCDATA JSON으로 넣고 단일 HTML을 만든다.

사용:
  python -I build_flowmap.py --docs <docs 폴더> --template <templates/flowmap 폴더> --out <flowmap.html>
         [--feature-doc 추가개발-기능정의서.md] [--spec-doc 추가개발-상세명세.md] [--wbs-doc 추가개발-WBS.md]
         [--expect features=34,ex=59,at=21]

표는 머리행의 앞부분으로 찾는다(references/doc-tables.md). 표를 못 찾으면 그 이름을 알려 주고 멈춘다.
"""
import argparse, json, re, sys
from pathlib import Path

try:
    sys.stdout.reconfigure(encoding='utf-8')  # Windows cp949 콘솔에서 한글 출력
except Exception:
    pass


# 표 머리행 (한국어 · English · 中文 · 日本語). 머리행이 이 중 하나로 시작하면 그 표를 읽는다. 공백 · 대소문자는 무시한다.
HEAD = {
    'feat': ['| ID |'],
    'wbs': ['| WBS |'],
    'ex': ['| ID | 상황 |', '| ID | Situation |', '| ID | 情况 |', '| ID | 状況 |'],
    'at': ['| ID | 대상 기능 |', '| ID | Target feature', '| ID | 对象功能 |', '| ID | 対象機能 |'],
    'rtm': ['| 원본 | 요구 항목 |', '| Source | Requirement |', '| 原始 | 需求项 |', '| 元 | 要求項目 |'],
    'log': ['| 버전 | 변경 |', '| Version | Change |', '| 版本 | 变更 |', '| バージョン | 変更 |'],
    'risks': ['| ID | 리스크 |', '| ID | Risk |', '| ID | 风险 |', '| ID | リスク |'],
    'proc': ['| 기능 | 입력 | 처리 위치 |', '| Feature | Input | Processed at |', '| 功能 | 输入 | 处理位置 |', '| 機能 | 入力 | 処理場所 |'],
    'fields': ['| 화면 | 필드 | 키 |', '| Screen | Field | Key |', '| 画面 | 字段 | 键 |', '| 画面 | フィールド | キー |'],
    'links': ['| 연동 | 흐름 |', '| Integration | Flow |', '| 对接 | 流程 |', '| 連携 | フロー |'],
    'apis': ['| 기능 | 메서드 · 경로 (제안) |', '| Feature | Method · path (proposed) |', '| 功能 | 方法 · 路径 (提案) |', '| 機能 | メソッド · パス (提案) |'],
    'tables': ['| 테이블 (제안) |', '| Table (proposed) |', '| 表 (提案) |', '| テーブル (提案) |'],
    'mapBase': ['| 항목 | 값 | 비고 |', '| Item | Value | Notes |', '| 项目 | 值 | 备注 |', '| 項目 | 値 | 備考 |'],
    'mapSym': ['| 객체 | 카카오 객체 |', '| 객체 | 지도 객체 |', '| Object | Map SDK object |', '| Object | Kakao object |', '| 对象 | 地图对象 |', '| オブジェクト | 地図オブジェクト |'],
    'mapScr': ['| 화면 | 기본 표시 |', '| Screen | Default display |', '| 画面 | 默认显示 |', '| 画面 | 既定表示 |'],
}
_norm = lambda l: re.sub(r'\s+', ' ', l).strip().lower()


def rows(text, header_start, required=True):
    """header_start(문자열 또는 HEAD 목록)로 시작하는 첫 표의 본문 행을 셀 리스트로 돌려준다."""
    heads = [_norm(h) for h in ([header_start] if isinstance(header_start, str) else header_start)]
    lines = text.splitlines()
    for i, l in enumerate(lines):
        if any(_norm(l).startswith(h) for h in heads):
            out, j = [], i + 2
            while j < len(lines) and lines[j].startswith('|'):
                out.append([c.strip() for c in lines[j].strip().strip('|').split('|')])
                j += 1
            return out
    if required:
        raise SystemExit('표를 찾지 못함 (table not found): ' + ' / '.join(heads))
    return []


def chapter(text, num):
    """'## 13.' 처럼 번호로 장을 찾는다(장 제목 언어와 무관)."""
    m = re.search(r'^## ' + re.escape(num) + r'(?=\s|$).*$', text, re.M)
    return text[m.end():] if m else ''


def md_inline(s):
    return re.sub(r'`([^`]+)`', r'\1', s.replace('**', ''))


def section(text, title):
    return text.split(title, 1)[1] if title in text else ''


def parse(docs, fdoc, sdoc, wdoc):
    F = (docs / fdoc).read_text(encoding='utf8')
    S = (docs / sdoc).read_text(encoding='utf8')
    W = (docs / wdoc).read_text(encoding='utf8')
    features = []
    for sec, title in re.findall(r'^### (6\.\d) (.+)$', F, re.M):
        block = F.split('### %s %s' % (sec, title), 1)[1]
        for c in rows(block, HEAD['feat']):
            features.append({'id': c[0], 'name': c[1], 'impl': c[2], 'desc': md_inline(c[3]), 'group': title})
    wbs = [{'id': c[0], 'task': c[1], 'feat': c[2], 'out': md_inline(c[3]), 'dep': c[4], 'role': c[5], 'days': c[6]} for c in rows(W, HEAD['wbs']) if c[0]]
    d = {
        'features': features, 'wbs': wbs,
        'ex': [{'id': c[0], 'sit': md_inline(c[1]), 'how': md_inline(c[2]), 'pri': c[3]} for c in rows(S, HEAD['ex'])],
        'at': [{'id': c[0], 'feat': c[1], 'how': md_inline(c[2]), 'ex': c[3], 'pri': c[4]} for c in rows(S, HEAD['at'])],
        'rtm': [{'src': c[0], 'req': c[1], 'ids': c[2], 'how': c[3]} for c in rows(F, HEAD['rtm'])],
        'log': [{'ver': c[0], 'what': md_inline(c[1]), 'why': c[2]} for c in rows(F, HEAD['log'])],
        'risks': [{'id': c[0], 'risk': c[1], 'fix': md_inline(c[2])} for c in rows(W, HEAD['risks'])],
        'proc': [{'feat': c[0], 'input': md_inline(c[1]), 'where': c[2], 'target': md_inline(c[3]), 'impact': md_inline(c[4])} for c in rows(S, HEAD['proc'], False)],
        'fields': [{'scr': c[0], 'label': c[1], 'key': c[2], 'type': c[3], 'req': c[4], 'rule': md_inline(c[5]), 'def': c[6], 'store': c[7]} for c in rows(S, HEAD['fields'], False)],
        'links': [{'name': c[0], 'flow': c[1], 'path': md_inline(c[2]), 'state': c[3], 'how': c[4]} for c in rows(S, HEAD['links'], False)],
        'apis': [{'name': c[0], 'path': c[1], 'req': c[2], 'res': c[3], 'rule': c[4]} for c in rows(S, HEAD['apis'], False)],
        'tables': [{'name': c[0], 'cols': c[1], 'keys': c[2], 'note': c[3]} for c in rows(S, HEAD['tables'], False)],
        'srv': [md_inline(l[2:]) for l in section(S, '### 12.6').splitlines() if l.startswith('- ')],
    }
    S13 = chapter(S, '13.')
    d['map'] = {
        'base': [{'k': c[0], 'v': md_inline(c[1]), 'n': md_inline(c[2])} for c in rows(S13, HEAD['mapBase'], False)],
        'sym': [{'obj': c[0], 'kakao': c[1], 'shape': c[2], 'style': c[3], 'z': c[4], 'act': md_inline(c[5])} for c in rows(S13, HEAD['mapSym'], False)],
        'scr': [{'scr': c[0], 'show': c[1], 'toggle': c[2], 'fit': c[3], 'click': c[4], 'legend': c[5], 'empty': c[6]} for c in rows(S13, HEAD['mapScr'], False)],
        'rules': [md_inline(l[2:]) for l in section(S13, '### 13.4').splitlines() if l.startswith('- ')],
    }
    d['wbsBase'] = sum(float(r['days']) for r in wbs if r['days'] and not r['days'].startswith('('))
    return d


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--docs', required=True); ap.add_argument('--template', required=True); ap.add_argument('--out', required=True)
    ap.add_argument('--feature-doc', default='추가개발-기능정의서.md'); ap.add_argument('--spec-doc', default='추가개발-상세명세.md'); ap.add_argument('--wbs-doc', default='추가개발-WBS.md')
    ap.add_argument('--expect', default='', help='예: features=34,ex=59,at=21 — 문서 개수가 다르면 멈춘다')
    a = ap.parse_args()
    data = parse(Path(a.docs), a.feature_doc, a.spec_doc, a.wbs_doc)
    for kv in filter(None, a.expect.split(',')):
        k, v = kv.split('=')
        if len(data[k]) != int(v):
            raise SystemExit('개수 불일치: %s = %d (기대 %s)' % (k, len(data[k]), v))
    T = Path(a.template)
    tpl = (T / 'template.html').read_text(encoding='utf8')
    tpl = tpl.replace('/*__SBCSS__*/', (T / 'sb.css').read_text(encoding='utf8')).replace('//__SBJS__', (T / 'sb.js').read_text(encoding='utf8'))
    html = tpl.replace('__DOCDATA__', json.dumps(data, ensure_ascii=False).replace('</', '<\\/'))
    Path(a.out).write_text(html, encoding='utf8')
    print('ok features=%d wbs=%d ex=%d at=%d rtm=%d fields=%d map.scr=%d base=%.1f bytes=%d' % (len(data['features']), len(data['wbs']), len(data['ex']), len(data['at']), len(data['rtm']), len(data['fields']), len(data['map']['scr']), data['wbsBase'], len(html)))


if __name__ == '__main__':
    main()
