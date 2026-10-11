/*
 * 렌더러 — data.js(window.RESUME)를 읽어 화면을 그립니다.
 * 콘텐츠 수정은 data.js에서 하세요. 이 파일은 구조/동작만 담당합니다.
 */
(function () {
  'use strict';

  var R = window.RESUME;
  if (!R) return;

  /* ── helpers ─────────────────────────────────────────── */

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  // **강조** → <strong>
  function rich(s) {
    return esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  }
  function has(a) { return Array.isArray(a) ? a.length > 0 : !!a; }
  function isExternal(href) { return /^https?:\/\//.test(href || ''); }
  function linkAttrs(href) {
    return 'href="' + esc(href) + '"' + (isExternal(href) ? ' target="_blank" rel="noopener"' : '');
  }

  /* ── section registry (nav order = page order) ──────── */

  var SECTIONS = [
    { id: 'about',      label: '소개',        render: renderAbout },
    { id: 'projects',   label: '프로젝트',     render: renderProjects,  when: function () { return has(R.projects) || has(R.otherProjects); } },
    { id: 'experience', label: '경력',        render: renderExperience, when: function () { return has(R.experience); } },
    { id: 'skills',     label: '기술 스택',    render: renderSkills,     when: function () { return has(R.skills); } },
    { id: 'certs',      label: certsLabel(),  render: renderCerts,      when: function () { return certGroups().length > 0; } },
    { id: 'activities', label: '활동',        render: renderActivities, when: function () { return has(R.activities); } },
    { id: 'education',  label: '학력',        render: renderEducation,  when: function () { return has(R.education); } },
  ].filter(function (s) { return !s.when || s.when(); });

  /* ── rail / top bar ──────────────────────────────────── */

  function renderRail() {
    var p = R.profile;
    var items = SECTIONS.map(function (s) {
      return '<li><a class="rail__link" href="#' + s.id + '" data-target="' + s.id + '">' + esc(s.label) + '</a></li>';
    }).join('');
    var contact = [];
    (p.links || []).forEach(function (l) {
      contact.push('<li><a ' + linkAttrs(l.href) + '>' + esc(l.label) + '</a></li>');
    });
    if (p.email) contact.push('<li><a href="mailto:' + esc(p.email) + '">메일</a></li>');

    return (
      '<a class="rail__brand" href="#about">' +
        '<span class="rail__name">' + esc(p.name) + '</span>' +
        (p.role ? '<span class="rail__role">' + esc(p.role) + '</span>' : '') +
      '</a>' +
      '<ul class="rail__list" id="rail-list">' + items + '</ul>' +
      (contact.length ? '<ul class="rail__contact">' + contact.join('') + '</ul>' : '')
    );
  }

  /* ── 0. about: headline + identity ───────────────────── */

  function renderAbout() {
    var p = R.profile, id = R.identity || {};
    var photo = p.photo
      ? '<img class="intro__photo" src="' + esc(p.photo) + '" alt="' + esc(p.name) + ' 프로필 사진" width="160" height="200">'
      : '<div class="intro__photo intro__photo--empty" aria-hidden="true">사진</div>';

    var links = (p.links || []).map(function (l) {
      return '<li><a ' + linkAttrs(l.href) + '>' + esc(l.label) + '</a></li>';
    });
    if (p.email) links.push('<li class="intro__mail"><a href="mailto:' + esc(p.email) + '">' + esc(p.email) + '</a></li>');

    return (
      '<section class="sec sec--about" id="about" aria-label="소개">' +
        '<header class="intro">' +
          photo +
          '<div class="intro__body">' +
            '<h1 class="intro__name">' + esc(p.name) +
              (p.nameEn ? '<span class="intro__name-en" lang="en">' + esc(p.nameEn) + '</span>' : '') +
            '</h1>' +
            '<p class="intro__edu"><span>' + [p.school, p.major].filter(Boolean).map(esc).join(' ') + '</span>' +
              (p.graduation ? '<span class="intro__sep" aria-hidden="true">·</span><span class="intro__grad">' + esc(p.graduation) + '</span>' : '') + '</p>' +
          '</div>' +
          (links.length ? '<ul class="intro__links">' + links.join('') + '</ul>' : '') +
        '</header>' +
        '<div class="identity">' +
          '<p class="identity__line">' + rich(id.headline) + '</p>' +
          (id.summary ? '<p class="identity__summary">' + rich(id.summary) + '</p>' : '') +
        '</div>' +
      '</section>'
    );
  }

  /* ── shared: section shell + entry ───────────────────── */

  function section(id, title, body, aside) {
    return (
      '<section class="sec" id="' + id + '" aria-labelledby="' + id + '-title">' +
        '<div class="sec__head"><h2 class="sec__title" id="' + id + '-title">' + esc(title) + '</h2>' +
          (aside ? '<span class="sec__aside">' + esc(aside) + '</span>' : '') + '</div>' +
        body +
      '</section>'
    );
  }

  function links(list) {
    if (!has(list)) return '';
    return '<ul class="entry__links">' + list.map(function (l) {
      return '<li><a ' + linkAttrs(l.href) + '>' + esc(l.label) + '<span class="arrow" aria-hidden="true">↗</span></a></li>';
    }).join('') + '</ul>';
  }

  /*
   * One entry shape for every section.
   *   left : period + label
   *   right: title (+ aside) · meta · text · figures (label/value rows) · note · [더보기 → details + Stack] · links
   * opts.compact → tighter spacing (other projects, awards, education)
   * opts.level   → heading level for the title (h3 default)
   */
  var moreSeq = 0;
  function entry(e, opts) {
    opts = opts || {};
    var h = opts.level || 'h3';
    var title = e.link
      ? '<a class="entry__title-link" ' + linkAttrs(e.link) + '>' + esc(e.title) + '<span class="arrow" aria-hidden="true">↗</span></a>'
      : esc(e.title);

    var stack = e.stack
      ? '<p class="stack"><span class="stack__label">Stack</span><span class="stack__items">' + rich(e.stack) + '</span></p>'
      : '';
    var toggle = '', more = '';
    if (has(e.details)) {
      var mid = 'more-' + (++moreSeq);
      toggle = '<button class="more__toggle" type="button" aria-expanded="false" aria-controls="' + mid + '">' +
        '<span class="more__open">더보기</span><span class="more__close">접기</span></button>';
      more = '<div class="more__panel" id="' + mid + '" hidden><ul class="more__list">' + e.details.map(function (d) {
        return '<li>' + (d.title ? '<strong class="more__lead">' + rich(d.title) + '</strong>' : '') +
          '<span class="more__body">' + rich(d.body) + '</span></li>';
      }).join('') + '</ul>' + stack + '</div>';
      stack = '';
    }

    var foot = (toggle || has(e.links))
      ? '<div class="entry__foot">' + toggle + links(e.links) + '</div>' + more
      : '';

    return (
      '<li class="entry' + (opts.compact ? ' entry--compact' : '') + '">' +
        '<div class="entry__side">' +
          (e.period ? '<p class="entry__period">' + esc(e.period) + '</p>' : '') +
          (e.label ? '<p class="entry__label">' + esc(e.label) + '</p>' : '') +
        '</div>' +
        '<div class="entry__main">' +
          '<' + h + ' class="entry__title">' + title +
            (e.aside ? '<span class="entry__aside">' + esc(e.aside) + '</span>' : '') +
          '</' + h + '>' +
          (e.meta ? '<p class="entry__meta">' + rich(e.meta) + '</p>' : '') +
          (e.text ? '<p class="entry__text">' + rich(e.text) + '</p>' : '') +
          (has(e.figures)
            ? '<dl class="figs">' + e.figures.map(function (f) {
                return '<div class="figs__row"><dt>' + esc(f.label) + '</dt><dd>' + rich(f.value) + '</dd></div>';
              }).join('') + '</dl>'
            : '') +
          (e.note ? '<p class="entry__note">' + rich(e.note) + '</p>' : '') +
          stack +
          foot +
        '</div>' +
      '</li>'
    );
  }

  function entries(list, opts) {
    return '<ul class="entries' + (opts && opts.compact ? ' entries--compact' : '') + '">' +
      list.map(function (e) { return entry(e, opts); }).join('') + '</ul>';
  }

  /* ── sections ────────────────────────────────────────── */

  function renderProjects() {
    var main = R.projects || [], other = R.otherProjects || [];
    return section('projects', '프로젝트',
      entries(main) +
      (other.length
        ? '<div class="sub"><h3 class="sub__title">기타 프로젝트</h3>' + entries(other, { compact: true, level: 'h4' }) + '</div>'
        : ''));
  }

  function renderExperience() {
    return section('experience', '경력', entries(R.experience));
  }

  function renderSkills() {
    return section('skills', '기술 스택',
      '<dl class="skills">' + R.skills.map(function (g) {
        return '<div class="skills__row"><dt>' + esc(g.category) + '</dt><dd>' + rich(g.items) + '</dd></div>';
      }).join('') + '</dl>');
  }

  // 자격증 · 어학 · 수상 share one section; the title lists only the groups that have items
  function certGroups() {
    return [['자격증', R.certifications], ['어학', R.languages], ['수상', R.awards]]
      .filter(function (g) { return has(g[1]); });
  }
  function certsLabel() {
    return certGroups().map(function (g) { return g[0]; }).join(' · ');
  }
  function renderCerts() {
    return section('certs', certsLabel(), certGroups().map(function (g, i) {
      return '<div class="sub' + (i === 0 ? ' sub--first' : '') + '"><h3 class="sub__title">' + g[0] + '</h3>' +
        entries(g[1], { compact: true, level: 'h4' }) + '</div>';
    }).join(''));
  }

  function renderActivities() {
    return section('activities', '활동', entries(R.activities));
  }

  function renderEducation() {
    return section('education', '학력', entries(R.education));
  }

  /* ── footer ──────────────────────────────────────────── */

  function renderFooter() {
    var p = R.profile;
    return (
      '<footer class="foot">' +
        '<span>© ' + new Date().getFullYear() + ' ' + esc(p.name) +
          (p.email ? '<span class="foot__sep" aria-hidden="true">·</span><a class="foot__mail" href="mailto:' + esc(p.email) + '">' + esc(p.email) + '</a>' : '') +
        '</span>' +
        (p.updated ? '<span>최종 수정 ' + esc(p.updated) + '</span>' : '') +
      '</footer>'
    );
  }

  /* ── mount ───────────────────────────────────────────── */

  document.title = R.profile.name + ' · ' + (R.profile.role || '이력서');
  document.getElementById('rail').innerHTML = renderRail();
  document.getElementById('main').innerHTML =
    SECTIONS.map(function (s) { return s.render(); }).join('') + renderFooter();

  /* ── behaviour: 더보기 toggle (print CSS shows everything) ── */

  document.addEventListener('click', function (ev) {
    var btn = ev.target.closest('.more__toggle');
    if (!btn) return;
    var open = btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', String(open));
    document.getElementById(btn.getAttribute('aria-controls')).hidden = !open;
  });

  /* ── behaviour: scroll spy ───────────────────────────── */

  var navLinks = {};
  document.querySelectorAll('.rail__link').forEach(function (a) { navLinks[a.getAttribute('data-target')] = a; });
  var list = document.getElementById('rail-list');

  function markActive(id) {
    Object.keys(navLinks).forEach(function (k) {
      if (k === id) navLinks[k].setAttribute('aria-current', 'true');
      else navLinks[k].removeAttribute('aria-current');
    });
    // mobile: keep the active link visible inside the horizontal strip
    var a = navLinks[id];
    if (a && list.scrollWidth > list.clientWidth) {
      var left = a.offsetLeft - (list.clientWidth - a.offsetWidth) / 2;
      list.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
    }
  }

  if ('IntersectionObserver' in window) {
    var visible = {};
    var io = new IntersectionObserver(function (items) {
      items.forEach(function (en) { visible[en.target.id] = en.isIntersecting; });
      for (var i = 0; i < SECTIONS.length; i++) {
        if (visible[SECTIONS[i].id]) { markActive(SECTIONS[i].id); break; }
      }
    }, { rootMargin: '-20% 0px -70% 0px' });
    SECTIONS.forEach(function (s) {
      var el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
  }
  markActive(SECTIONS[0].id);
})();
