# 이력서 웹사이트

빌드 없이 동작하는 정적 사이트입니다. 내용은 모두 `js/data.js` 한 파일에 있습니다.

```
index.html        페이지 뼈대 (제목·공유 미리보기 문구만 직접 수정)
js/data.js        ← 이력서 내용 전부 (여기만 고치면 됩니다)
js/render.js      화면 그리기 · 더보기 · 목차 하이라이트
css/tokens.css    색 · 글자 크기 · 간격 값
css/style.css     레이아웃 · 인쇄(A4) 스타일
assets/           프로필 사진 등 이미지
```

## 내용 바꾸기

`js/data.js`를 열어 임시 내용을 실제 내용으로 바꿉니다. 파일 맨 위 주석에 칸별 설명이 있습니다.

- 문장 안의 `**굵게**` → 굵은 강조 (성과 수치에 사용)
- 항목 칸: `period` 기간 · `label` 기간 아래 라벨 · `title` 제목 · `aside` 제목 옆 보조 문구 · `meta` 회색 한 줄 · `text` 요약 문단 · `details` 더보기 내용 · `stack` 기술 스택(더보기 맨 아래) · `links` 링크
- 필요 없는 칸은 지우면 화면에서 사라지고, 섹션 배열을 `[]`로 비우면 섹션과 목차 항목이 함께 사라집니다.
- `index.html`의 `<title>`, `description`, `og:*`도 이름·직무에 맞게 수정하세요. (링크 공유 미리보기에 쓰입니다)

## 프로필 사진

1. 사진을 `assets/profile.jpg`로 저장합니다. (세로 4:5 비율, 가로 400px 이상 권장)
2. `js/data.js`에서 `photo: 'assets/profile.jpg'`로 바꿉니다.

## 로컬에서 보기

`index.html`을 브라우저로 바로 열면 됩니다. WSL이라면:

```bash
explorer.exe "$(wslpath -w index.html)"
```

## PDF로 저장 (A4)

브라우저에서 `Ctrl + P` → 대상 `PDF로 저장` → 머리글/바닥글 끄기.
인쇄 시에는 목차가 숨겨지고 `더보기` 내용이 모두 펼쳐집니다.

## GitHub Pages 배포

1. GitHub에 `<아이디>.github.io` 이름으로 저장소를 만듭니다. (다른 이름이면 주소가 `<아이디>.github.io/<저장소>`가 됩니다)
2. 이 폴더를 올립니다.
   ```bash
   git init
   git add .
   git commit -m "Add resume site"
   git branch -M main
   git remote add origin https://github.com/<아이디>/<아이디>.github.io.git
   git push -u origin main
   ```
3. 저장소 **Settings → Pages → Build and deployment**에서 Source를 `Deploy from a branch`, Branch를 `main` / `/ (root)`로 선택합니다.
4. 1~2분 뒤 `https://<아이디>.github.io`에서 확인합니다.

`.nojekyll` 파일은 GitHub Pages가 파일을 그대로 서비스하도록 두는 빈 파일이니 지우지 마세요.
