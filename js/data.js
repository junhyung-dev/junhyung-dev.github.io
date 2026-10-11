/*
 * 이력서 콘텐츠 — 이 파일만 고치면 사이트 전체가 바뀝니다.
 *
 * 모든 항목은 같은 모양을 씁니다 (프로젝트 · 경력 · 수상 · 활동 · 학력 공통)
 *   period  : 왼쪽 칸 기간
 *   label   : 왼쪽 칸 기간 아래 짧은 라벨 (예: '4명 · 백엔드')
 *   title   : 제목 (굵게)
 *   aside   : 제목 옆 회색 보조 문구
 *   meta    : 제목 아래 회색 한 줄 (기관명 등)
 *   stack   : 기술 스택 — '더보기' 맨 아래에 'Stack | …' 로 표시 (더보기가 없으면 요약 아래)
 *   text    : 2~3줄 요약 문단 — 핵심 수치는 **두 별표**로 감싸면 굵게 강조
 *   figures : 항목명 / 값 표 [{ label, value }] (학점 등)
 *   note    : 표 아래 작은 메모
 *   details : '더보기'를 누르면 펼쳐지는 상세 [{ title, body }] — 인쇄(PDF) 시 자동으로 펼쳐짐
 *   links   : [{ label, href }]
 * 필요 없는 칸은 지우거나 '' / [] 로 두면 화면에서 숨겨집니다.
 *
 * ⚠ 아래 내용·수치는 모두 임시 예시입니다. 실제 값으로 교체하세요.
 */

window.RESUME = {
  profile: {
    name: '전준형',
    nameEn: 'Junhyung Jeon',
    photo: '',                       // 예: 'assets/profile.jpg' (비우면 회색 자리표시)
    school: '경북대학교',
    major: '컴퓨터학부',
    graduation: '2027년 2월 졸업 예정',   // 비우면 숨김
    role: '백엔드 개발자',            // 네비게이션 이름 아래 표시
    email: 'knujun0423@gmail.com',
    links: [                         // 이름 아래에 링크로 표시 (이메일은 email 값이 그대로 표시됨)
      { label: 'GitHub',   href: 'https://github.com/junhyung-dev' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/%EC%A4%80%ED%98%95-%EC%A0%84-37b0a23ab/' },
    ],
    updated: '2026.10',
  },

  identity: {
    headline: '병목을 숫자로 찾고, **끝까지 해결하는** 백엔드 개발자',
    summary:
      '측정할 수 없는 개선은 믿지 않습니다. 문제를 재현하고, 원인을 좁히고, 개선 결과를 수치로 남기는 방식으로 일해 왔습니다.',
  },

  // 상세 프로젝트 — 2~3개
  projects: [
    {
      period: '2025.03 – 08',
      label: '4명 · 백엔드 · 인프라',
      title: '바로마켓',
      aside: '캠퍼스 중고거래 플랫폼',
      stack: 'Spring Boot · JPA · MySQL · Redis · AWS EC2 · GitHub Actions',
      text: '학교 메일 인증으로 같은 캠퍼스 학생끼리만 거래하는 웹 서비스입니다. 백엔드와 배포를 맡아 목록 API 응답 시간을 **1.4s에서 0.25s로 82%** 줄였고, 출시 3개월 만에 누적 가입자 **1,200명**을 모았습니다.',
      details: [
        { title: 'N+1 쿼리 제거', body: 'APM으로 목록 API에서 요청당 쿼리가 41회 나가는 것을 확인하고, fetch join과 배치 사이즈 조정으로 **41회 → 3회**로 줄였습니다.' },
        { title: '인기 목록 캐시', body: '조회의 70%가 첫 페이지에 몰린다는 로그 분석을 근거로 Redis 캐시를 붙여 적중률 **91%**를 유지했습니다.' },
        { title: '배포 자동화', body: 'GitHub Actions로 테스트·빌드·배포를 묶어 배포 시간을 **25분 → 6분**으로 줄였습니다.' },
      ],
      links: [
        { label: 'GitHub', href: 'https://github.com/junho/baromarket' },
        { label: '시연 영상', href: '#' },
      ],
    },
    {
      period: '2024.09 – 12',
      label: '3명 · 백엔드 리드',
      title: '스터디로그',
      aside: '스터디 출결·정산 서비스',
      stack: 'Node.js · NestJS · PostgreSQL · Docker',
      text: '스터디 출석과 과제 제출을 자동으로 집계하고 벌금을 정산해 주는 서비스입니다. 스터디마다 다른 규칙 **18개를 정책 타입 5개**로 일반화해, 한 학기 동안 교내 스터디 **12곳**이 정산 오류 없이 사용했습니다.',
      details: [
        { title: '요구사항 정리', body: '스터디장 인터뷰로 벌금 규칙을 표로 모은 뒤, 공통 패턴을 뽑아 정책 타입으로 설계했습니다.' },
        { title: '결정 기록', body: '주요 설계 결정 **9건**을 ADR로 남겨 신규 팀원의 온보딩 기간을 **일주일 → 이틀**로 줄였습니다.' },
      ],
      links: [{ label: 'GitHub', href: 'https://github.com/junho/studylog' }],
    },
    {
      period: '2024.03 – 06',
      label: '2명 · 백엔드',
      title: '셔틀 알림',
      aside: '실시간 셔틀버스 도착 알림',
      stack: 'Kotlin · Spring WebFlux · MongoDB',
      text: '교내 셔틀 GPS 데이터를 받아 정류장별 도착 예정 시간을 알려 주는 앱 서버입니다. 도착 예측 오차를 **±3분에서 ±40초**로 줄였고, 월간 사용자 **2,300명**이 이용했습니다.',
      details: [
        { title: '스트림 처리', body: '5초 간격으로 들어오는 GPS 이벤트를 논블로킹으로 처리해 서버 1대로 셔틀 **14대**를 감당했습니다.' },
      ],
      links: [{ label: 'GitHub', href: 'https://github.com/junho/bustime' }],
    },
  ],

  // 기타 프로젝트 — 한 줄씩 짧게 (link 가 있으면 제목이 링크가 됩니다)
  otherProjects: [
    { period: '2024.01', title: '기술 블로그 자동 배포', text: '마크다운을 푸시하면 정적 사이트로 빌드·배포', meta: 'Astro · GitHub Pages', link: '#' },
    { period: '2023.11', title: '알고리즘 풀이 통계 봇', text: '스터디원 풀이 현황을 매주 디스코드로 요약', meta: 'Python · Discord API', link: '#' },
    { period: '2023.09', title: '학과 행사 좌석 예약', text: '선착순 예약 동시성 문제를 낙관적 락으로 해결', meta: 'Spring Boot · MySQL', link: '#' },
  ],

  experience: [
    {
      period: '2025.12 – 2026.02',
      label: '인턴',
      title: '오픈데이터랩',
      aside: '백엔드 개발 인턴',
      meta: '공공데이터 수집 파이프라인 유지보수',
      text: '배치 작업을 병렬화해 일일 수집 시간을 **4시간에서 50분**으로 줄였고, 장애 대응 런북을 만들어 팀 위키에 정리했습니다.',
    },
  ],

  // 기술 스택 — category: 분류, items: 한 줄 텍스트
  skills: [
    { category: 'Language', items: 'Java · Kotlin · TypeScript · Python' },
    { category: 'Backend',  items: 'Spring Boot · JPA · NestJS · WebFlux' },
    { category: 'Data',     items: 'MySQL · PostgreSQL · Redis · MongoDB' },
    { category: 'Infra',    items: 'AWS EC2 · RDS · Docker · GitHub Actions · Nginx' },
    { category: 'Tools',    items: 'Git · Jira · Notion · Figma' },
  ],

  // 자격증 · 어학 · 수상 — 하나의 섹션 안에 소제목으로 나뉩니다. 비어 있는 그룹은 섹션 제목에서도 빠집니다.
  certifications: [
    { period: '2026.06.05', title: 'ADsP', aside: '데이터분석 준전문가', meta: '한국데이터산업진흥원' },
    { period: '2025.09.19', title: 'SQLD', aside: 'SQL 개발자', meta: '한국데이터산업진흥원' },
  ],

  languages: [
    { period: '2026.09', title: 'TOEIC Speaking', meta: 'AL (160)' },
    { period: '2025.07', title: 'TOEIC', meta: '925' },
  ],

  awards: [],

  activities: [
    { period: '2025.01 – 06', label: '800시간', title: '○○ 소프트웨어 아카데미', aside: '백엔드 부트캠프 수료', text: 'Spring 기반 웹 서비스 설계·운영 과정을 수료했습니다.' },
    { period: '2024.03 – 2025.02', label: '운영진', title: '교내 개발 동아리 ○○', text: '주간 코드 리뷰 세션을 기획하고 신입 기수를 멘토링했습니다.' },
  ],

  // figures: 항목명 / 값 표 (학점 등) · note: 표 아래 작은 메모 (예: 주요 과목 성적)
  education: [
    {
      period: '2021.03 – 2027.02',
      label: '졸업 예정',
      title: '경북대학교 컴퓨터학부',
      meta: '부전공 전자공학부',
      figures: [
        { label: '전체 평점', value: '4.25 / 4.5' },
        { label: '전공 평점', value: '4.29 / 4.5' },
        { label: '부전공 · 전자공학부', value: '4.23 / 4.5' },
      ],
      note: '',                      // 예: '자료구조 A+ · 운영체제 A+ · 데이터베이스 A+'
    },
  ],
};
