"""디자인 토큰 도구 — theme.css에서 쓰는 값을 세고, tokens.json(W3C DTCG 형식)을 CSS 변수로 넣고, 대비를 잰다.

사용:  python -I design_tokens.py <명령> <프로젝트 폴더>
  inventory  theme.css의 색 · 글자 크기 · 모서리 · 그림자 · 간격을 빈도순으로 세고, 거의 같은 색(정리 후보)을 묶어 보여 준다
  css        design-system/tokens.json → theme.css 맨 위 /* ds-tokens */ 블록에 :root { --ds-* } 로 쓴다 (다시 실행하면 블록만 바꾼다)
  link       theme.css 안의 색 값 중 토큰과 같은 것을 var(--ds-*)로 바꾼다 (바꾼 개수 보고, theme.css.bak 남김)
  contrast   tokens.json의 $extensions.pairs([글자, 바탕, 기준]) 대비를 재고 WCAG 기준(본문 4.5 · 큰 글자 · UI 3.0) 미달을 알린다
  check      css + contrast를 한 번에 (토큰이 theme.css에 반영됐는지, 대비 미달이 없는지). 문제가 있으면 종료 코드 1

tokens.json 예 (값은 "{color.navy.700}"처럼 다른 토큰을 가리켜도 된다):
{
  "color": { "navy": { "700": { "$type": "color", "$value": "#1F4E79" } },
             "text": { "$type": "color", "$value": "#000000", "$description": "본문" },
             "primary": { "$type": "color", "$value": "{color.navy.700}" } },
  "radius": { "md": { "$type": "dimension", "$value": "6px" } },
  "$extensions": { "pairs": [["color.text", "color.surface", 4.5], ["color.on-primary", "color.primary", 4.5]] }
}
"""
import json, re, sys
from collections import Counter
from pathlib import Path

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

START, END = '/* ds-tokens: design_tokens.py가 만든 블록 — 직접 고치지 말고 tokens.json을 고친다 */', '/* /ds-tokens */'


def flat(o, pre=''):
    out = {}
    for k, v in o.items():
        if k.startswith('$'):
            continue
        n = pre + '.' + k if pre else k
        if isinstance(v, dict) and '$value' in v:
            out[n] = v
        elif isinstance(v, dict):
            out.update(flat(v, n))
    return out


def resolve(toks, name, seen=()):
    v = toks[name]['$value']
    m = re.fullmatch(r'\{([\w.-]+)\}', v) if isinstance(v, str) else None
    if m:
        if m.group(1) in seen or m.group(1) not in toks:
            raise SystemExit('토큰 참조 오류: %s → %s' % (name, v))
        return resolve(toks, m.group(1), seen + (name,))
    return v


def css_value(v, t):
    if t == 'shadow' and isinstance(v, dict):
        return '%s %s %s %s %s' % (v.get('offsetX', '0'), v.get('offsetY', '0'), v.get('blur', '0'), v.get('spread', '0'), v.get('color', '#0000'))
    if t == 'typography' and isinstance(v, dict):
        return '%s %s/%s %s' % (v.get('fontWeight', 400), v.get('fontSize', '14px'), v.get('lineHeight', '1.5'), v.get('fontFamily', 'sans-serif'))
    if isinstance(v, list):
        return ', '.join(json.dumps(x) if ' ' in x else x for x in v)
    return str(v)


def var(name):
    return '--ds-' + name.replace('.', '-')


def rgb(h):
    h = h.lstrip('#')
    if len(h) == 3:
        h = ''.join(c * 2 for c in h)
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def lum(h):
    def ch(c):
        c /= 255
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = (ch(c) for c in rgb(h))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def ratio(a, b):
    la, lb = sorted((lum(a), lum(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


def load(P):
    f = P / 'design-system' / 'tokens.json'
    if not f.exists():
        raise SystemExit('없음: %s (templates/design-system/tokens.json을 복사해 시작)' % f)
    raw = json.loads(f.read_text(encoding='utf8'))
    return raw, flat(raw)


def body_without_block(css):
    return re.sub(re.escape(START) + r'[\s\S]*?' + re.escape(END) + r'\n?', '', css)


def cmd_inventory(P):
    css = body_without_block((P / 'theme.css').read_text(encoding='utf8'))
    hexes = Counter(h.upper() if len(h) == 7 else '#' + ''.join(c * 2 for c in h[1:]).upper() for h in re.findall(r'#[0-9A-Fa-f]{6}\b|#[0-9A-Fa-f]{3}\b', css))
    sizes = Counter(re.findall(r'font(?:-size)?:\s*(?:\d{3}\s+)?([\d.]+px)', css))
    radii = Counter(re.findall(r'border-radius:\s*([^;}]+)', css))
    shadows = Counter(s.strip() for s in re.findall(r'box-shadow:\s*([^;}]+)', css))
    space = Counter(re.findall(r'(?:padding|margin|gap):\s*([^;}]+)', css))
    print('색 %d종 (상위 20)' % len(hexes))
    for h, n in hexes.most_common(20):
        print('  %s ×%d' % (h, n))
    cs = list(hexes)
    near = [(a, b) for i, a in enumerate(cs) for b in cs[i + 1:] if sum(abs(x - y) for x, y in zip(rgb(a), rgb(b))) <= 18]
    print('\n거의 같은 색 (합칠 후보) %d쌍' % len(near))
    for a, b in near[:20]:
        print('  %s ×%d ≈ %s ×%d' % (a, hexes[a], b, hexes[b]))
    for t, c in [('글자 크기', sizes), ('모서리', radii), ('그림자', shadows), ('간격(padding · margin · gap)', space)]:
        print('\n%s %d종: %s' % (t, len(c), ' · '.join('%s ×%d' % kv for kv in c.most_common(12))))
    print('\n→ 자주 쓰는 값을 역할 이름(color.text · color.primary · radius.md …)으로 tokens.json에 적고 `css` · `link`를 실행한다.')


def block(raw, toks):
    lines = [START, ':root {']
    for n, t in toks.items():
        v = resolve(toks, n)
        lines.append('  %s: %s;%s' % (var(n), css_value(v, t.get('$type', '')), ('  /* ' + t['$description'] + ' */') if t.get('$description') else ''))
    lines += ['}', END]
    return '\n'.join(lines) + '\n'


def cmd_css(P, quiet=False):
    raw, toks = load(P)
    f = P / 'theme.css'
    css = f.read_text(encoding='utf8')
    b = block(raw, toks)
    new = (re.sub(re.escape(START) + r'[\s\S]*?' + re.escape(END) + r'\n?', lambda m: b, css) if START in css else b + css)
    changed = new != css
    if changed:
        f.write_text(new, encoding='utf8')
    if not quiet:
        print('theme.css 토큰 블록 %s · 변수 %d개' % ('갱신' if changed else '그대로', len(toks)))
    return changed


def cmd_link(P):
    raw, toks = load(P)
    f = P / 'theme.css'
    css = f.read_text(encoding='utf8')
    head = re.search(re.escape(START) + r'[\s\S]*?' + re.escape(END) + r'\n?', css)
    pre, rest = (css[:head.end()], css[head.end():]) if head else ('', css)
    # 같은 값의 토큰이 여럿이면 의미 층(color.*)을 먼저, 그다음 tokens.json 순서의 첫 토큰을 쓴다
    by = {}
    for n, t in sorted(toks.items(), key=lambda kv: not kv[0].startswith('color.')):
        if t.get('$type') == 'color':
            v = str(resolve(toks, n)).upper()
            if re.fullmatch(r'#[0-9A-F]{6}', v):
                by.setdefault(v, n)
    cnt = Counter()

    def rep(m):
        if m.group(1):          # 이미 var(--ds-*, #값)인 곳은 그대로
            return m.group(0)
        h = m.group(0).upper()
        if h in by:
            cnt[by[h]] += 1
            return 'var(%s, %s)' % (var(by[h]), m.group(0))
        return m.group(0)
    out = re.sub(r'(var\(--ds-[\w-]+, #[0-9A-Fa-f]{6}\))|#[0-9A-Fa-f]{6}\b', rep, rest)
    if cnt:
        (P / 'theme.css.bak').write_text(css, encoding='utf8')
        f.write_text(pre + out, encoding='utf8')
    print('바꾼 곳 %d개: %s' % (sum(cnt.values()), ' · '.join('%s ×%d' % kv for kv in cnt.most_common())))


def cmd_contrast(P):
    raw, toks = load(P)
    pairs = raw.get('$extensions', {}).get('pairs', [])
    if not pairs:
        print('대비 검사할 짝이 없음 ($extensions.pairs)')
        return 0
    bad = 0
    for fg, bg, need in pairs:
        r = ratio(resolve(toks, fg), resolve(toks, bg))
        ok = r >= need
        bad += not ok
        print('  %s %s on %s = %.2f : 1 (기준 %.1f)' % ('OK ' if ok else '미달', fg, bg, r, need))
    print('대비 미달 %d건' % bad)
    return bad


def main():
    if len(sys.argv) < 3 or sys.argv[1] not in ('inventory', 'css', 'link', 'contrast', 'check'):
        raise SystemExit(__doc__)
    P = Path(sys.argv[2]).resolve()
    c = sys.argv[1]
    if c == 'inventory':
        cmd_inventory(P)
    elif c == 'css':
        cmd_css(P)
    elif c == 'link':
        cmd_link(P)
    elif c == 'contrast':
        sys.exit(1 if cmd_contrast(P) else 0)
    else:
        changed = cmd_css(P, quiet=True)
        bad = cmd_contrast(P)
        print('토큰 블록: ' + ('갱신함(반영 안 돼 있었음)' if changed else '최신'))
        sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
