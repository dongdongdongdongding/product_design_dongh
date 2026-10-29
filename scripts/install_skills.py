"""스킬을 다른 에이전트에 설치한다 (Claude Code 플러그인 설치 없이 쓸 때).

사용:
  python scripts/install_skills.py --codex            # ~/.agents/skills/ (Codex)
  python scripts/install_skills.py --claude           # ~/.claude/skills/ (Claude Code 개인 스킬)
  python scripts/install_skills.py --to <폴더>        # 원하는 폴더 (예: 프로젝트의 .agents/skills)
  python scripts/install_skills.py --zip <폴더>       # 스킬마다 zip (claude.ai 설정 > 기능 > 스킬 업로드용)

스킬은 엔진 · 템플릿 · 스크립트를 이 저장소에서 쓰므로, 복사한 SKILL.md 끝에 `KIT_ROOT: <저장소 경로>` 줄을 붙인다.
저장소를 옮기면 다시 실행한다. 같은 이름의 스킬이 있으면 덮어쓴다(--dry-run으로 먼저 확인).
"""
import argparse, shutil, sys, zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILLS = ROOT / 'skills'


def stamp(skill_md: Path):
    t = skill_md.read_text(encoding='utf8').rstrip('\n').split('\n')
    t = [l for l in t if not l.startswith('KIT_ROOT:')]
    skill_md.write_text('\n'.join(t) + '\n\nKIT_ROOT: ' + ROOT.as_posix() + '  (이 스킬의 templates/ · scripts/ · engine/ 경로는 여기 기준)\n', encoding='utf8')


def main():
    ap = argparse.ArgumentParser()
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument('--codex', action='store_true'); g.add_argument('--claude', action='store_true')
    g.add_argument('--to'); g.add_argument('--zip')
    ap.add_argument('--dry-run', action='store_true')
    a = ap.parse_args()
    names = sorted(p.name for p in SKILLS.iterdir() if (p / 'SKILL.md').exists())
    if a.zip:
        out = Path(a.zip).expanduser(); out.mkdir(parents=True, exist_ok=True)
        for n in names:
            z = out / (n + '.zip')
            if a.dry_run:
                print('zip', z); continue
            with zipfile.ZipFile(z, 'w', zipfile.ZIP_DEFLATED) as zf:
                for f in (SKILLS / n).rglob('*'):
                    if f.is_file():
                        data = f.read_text(encoding='utf8') if f.name == 'SKILL.md' else None
                        arc = (Path(n) / f.relative_to(SKILLS / n)).as_posix()
                        if data is not None:
                            zf.writestr(arc, data.rstrip('\n') + '\n\nKIT_ROOT: (claude.ai에서는 저장소 파일을 대화에 첨부하거나 github.com/donghk-cloud/screen-spec-kit 를 참고)\n')
                        else:
                            zf.write(f, arc)
            print('ok', z)
        return
    dest = Path(a.to).expanduser() if a.to else Path.home() / ('.agents' if a.codex else '.claude') / 'skills'
    for n in names:
        d = dest / n
        print(('would copy' if a.dry_run else 'copy'), SKILLS / n, '->', d, '(덮어씀)' if d.exists() else '')
        if a.dry_run:
            continue
        if d.exists():
            shutil.rmtree(d)
        shutil.copytree(SKILLS / n, d)
        stamp(d / 'SKILL.md')
    if not a.dry_run:
        print('완료: %d개 스킬 → %s' % (len(names), dest))
        print('Codex는 다시 시작한 뒤 `$screen-spec-kit` 또는 "기획서로 화면설계서 만들어줘"로 부릅니다.' if a.codex else '')


if __name__ == '__main__':
    sys.exit(main())
