"""개발 문서 3종(기능정의서 · 상세명세 · WBS)의 정합을 검사한다.

사용: python -I check_docs.py --docs <docs 폴더> [문서 이름 옵션은 build_flowmap.py와 같음]
검사: 기능 ID 중복 · WBS 합계 · 기능 ↔ WBS 연결 · 예외(EX) ↔ 검수(AT) 연결 · 요구 추적표의 기능 ID 존재 ·
      12.2 입력 필드의 화면 ID · 문서 안 시연 표기(선택). 실패가 있으면 종료 코드 1.
"""
import argparse, re, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from build_flowmap import parse  # noqa: E402

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

ID = re.compile(r'([A-Z]{2,5})-(\d\d)(?:~(\d\d))?')


def expand(txt):
    out = []
    for m in ID.finditer(txt):
        p, a, b = m.group(1), int(m.group(2)), int(m.group(3) or m.group(2))
        out += ['%s-%02d' % (p, i) for i in range(a, b + 1)]
    return out


def ex_nums(s):
    n = set()
    for q in s.split(','):
        q = q.strip()
        if '~' in q:
            a, b = q.split('~'); n.update(range(int(a), int(b) + 1))
        elif q.isdigit():
            n.add(int(q))
    return n


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--docs', required=True)
    ap.add_argument('--feature-doc', default='추가개발-기능정의서.md'); ap.add_argument('--spec-doc', default='추가개발-상세명세.md'); ap.add_argument('--wbs-doc', default='추가개발-WBS.md')
    ap.add_argument('--screens', default='', help='화면 ID 목록(쉼표). 주면 12.2 필드의 화면 ID를 검사')
    a = ap.parse_args()
    d = parse(Path(a.docs), a.feature_doc, a.spec_doc, a.wbs_doc)
    fails, ok = [], []
    ids = [f['id'] for f in d['features']]
    dup = sorted({i for i in ids if ids.count(i) > 1})
    (fails if dup else ok).append('기능 ID %d개, 중복 %s' % (len(ids), dup or '없음'))
    inwbs = set(x for w in d['wbs'] for x in expand(w['feat']))
    miss = [i for i in ids if i not in inwbs]
    (fails if miss else ok).append('WBS에 없는 기능: %s' % (miss or '없음'))
    ok.append('WBS 기준 합계 %.1f인일 (괄호 작업 제외)' % d['wbsBase'])
    covered = set()
    for t in d['at']:
        covered |= ex_nums(t['ex'])
    exn = [int(x['id'][3:]) for x in d['ex']]
    nc = ['EX-%02d' % n for n in exn if n not in covered]
    (fails if nc else ok).append('검수에 연결 안 된 예외: %s' % (nc or '없음') + ' (전체 %d)' % len(exn))
    bad = []
    for r in d['rtm']:
        if '전체' in r['ids']:
            continue
        xs = expand(r['ids'])
        if not xs or any(x not in ids for x in xs):
            bad.append(r['src'] + ' ' + r['ids'])
    (fails if bad else ok).append('요구 추적표의 잘못된 기능 ID: %s' % (bad or '없음') + ' (전체 %d행)' % len(d['rtm']))
    if a.screens:
        S = set(a.screens.split(','))
        unk = sorted({f['scr'] for f in d['fields']} - S)
        (fails if unk else ok).append('12.2 필드의 알 수 없는 화면 ID: %s' % (unk or '없음'))
    for m in ok:
        print('  OK  ', m)
    for m in fails:
        print('  FAIL', m)
    sys.exit(1 if fails else 0)


if __name__ == '__main__':
    main()
