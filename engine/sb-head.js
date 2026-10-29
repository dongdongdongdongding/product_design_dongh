  // ---------- 화면설계서(SB) ----------
  // 관리자 SB 형식: 머리줄(관리자 · 화면 경로) → 화면(빨간 번호) → Description(번호별 요소 · 규칙 · [예외] · 데이터) → 하위 번호 상태 예시 → 판정표 페이지.
  // 문구 토큰: {저장} {서버} {기존} {조건부} {EX-nn} {→화면ID} {→SB-nn}, "문구"는 화면 문구, '- '는 2단 항목, '[..]'는 소제목.
  const SBP = [];
  const pg = (o) => { o.no = 'SB-' + String(SBP.length).padStart(2, '0'); SBP.push(o); return o; };
  const mk = (n, q, t, b, o) => Object.assign({ n: n, q: q, t: t, b: b }, o || {});

  const SW = (title, text, btns) => '<div class="sw">' + (title ? '<h5>' + title + '</h5>' : '') + '<div>' + text + '</div><div class="bt">' + (btns || ['확인']).map((b) => '<span' + (b[0] === '~' ? ' class="s"' : b[0] === '!' ? ' class="d"' : '') + '>' + b.replace(/^[~!]/, '') + '</span>').join('') + '</div></div>';
  const FX = (label, val, o) => { o = o || {}; return '<div class="fx"><div class="lab">' + label + (o.req ? ' <em>*</em>' : '') + '</div><div class="in' + (o.err ? ' err' : '') + (o.ph ? ' ph' : '') + '">' + val + '</div>' + (o.m ? '<div class="m ' + (o.mc || '') + '">' + o.m + '</div>' : '') + '</div>'; };
  const TST = (t) => '<div class="fx" style="border:0;padding:0"><div class="tst"><span style="color:#10B759;font-weight:800">✓</span><span>' + t + '</span></div></div>';

  // 표준 문서 페이지: 프로젝트 sb-pages.js 맨 앞에서 pgDocs()를 부른다
  function pgDocs(o) {
    o = o || {};
    pg({ kind: 'doc', id: 'cover', title: '표지 · 목차', path: o.coverPath || '화면설계서', render: () => sbCover() });
    pg({ kind: 'doc', id: 'ref', title: o.refTitle || '작성 기준', path: o.refPath || '화면설계서 문법', render: () => sbRef() });
    pg({ kind: 'doc', id: 'flow', title: '메뉴 구조 · 화면 흐름', path: '메뉴 · 화면 전이 · 업무 흐름', render: () => sbFlow() });
    pg({ kind: 'doc', id: 'dict', title: '상태값 · 공통 문구', path: '화면 사이에서 이어지는 상태값과 문구', render: () => sbDict() });
  }
  // 지도 표현 기준 · 최종 검증: 원하는 위치에서 부르고, 안 부르면 맨 뒤에 자동으로 붙는다
  const pgMap = () => pg({ kind: 'doc', id: 'map', title: '지도 표현 기준', path: '공통 > 지도 그리기 (상세명세 13장)', render: () => sbMap() });
  const pgVerify = () => pg({ kind: 'doc', id: 'verify', title: '최종 검증', path: '요구사항 · 문서 · 화면 정합 검증', render: () => sbVerify() });
