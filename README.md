# MONO.fm

레트로 턴테이블 UI의 음악 플레이어

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)

## 주요 기능

- **음악 검색** - Spotify API를 통한 음악 검색
- **레트로 턴테이블 UI** - BPM에 맞춰 회전하는 LP 디스크 애니메이션
- **30초 미리듣기** - Spotify/Deezer를 통한 음악 프리뷰
- **이퀄라이저** - Web Audio API 기반 6밴드 EQ + 8가지 프리셋
- **플레이리스트 관리** - 좋아요, 내 리스트 저장/관리
- **반응형 디자인** - 데스크톱/모바일 최적화

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **State**: Zustand (with persist)
- **Audio**: Web Audio API
- **APIs**: Spotify, Deezer

## 시작하기

### 1. 설치

```bash
git clone https://github.com/04mmii/mono-fm.git
cd mono-fm
npm install
```

### 2. 환경 변수 설정

`.env` 파일 생성:

```env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

Spotify API 키는 [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)에서 발급받을 수 있습니다.

### 3. 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인

## 프로젝트 구조

```
mono-fm/
├── app/
│   ├── api/
│   │   ├── audio-proxy/    # 오디오 CORS 프록시
│   │   ├── recommend/      # 음악 검색 API
│   │   └── spotify/        # Spotify API
│   ├── page.tsx            # 메인 페이지
│   └── globals.css
├── components/
│   ├── layout/             # Header, Sidebar, RightPanel, MobileNav
│   ├── player/             # Turntable, Controls, Equalizer, WaveForm
│   └── views/              # HomeView, DetailView, FavoritesView, LibraryView
├── stores/                 # Zustand 스토어
│   ├── playerStore.ts      # 플레이어 상태
│   ├── libraryStore.ts     # 좋아요/플레이리스트
│   └── uiStore.ts          # UI 상태
├── lib/                    # API 유틸리티
└── types/                  # TypeScript 타입
```

## 주요 화면

### 홈 화면
- 오늘의 추천곡
- 카테고리별 음악
- 미니 턴테이블 (Now Playing)

### 상세 화면
- 큰 턴테이블 애니메이션
- 파형 시각화
- 좋아요 / 플레이리스트 추가
- YouTube 전체곡 링크

### 이퀄라이저
- 6밴드 주파수 조절
- 8가지 프리셋 (기본, 베이스, 고음, 보컬, 락, 재즈, 일렉, 어쿠스틱)

## 배포

Vercel에 배포 시 환경 변수 설정 필요:
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`

## 라이선스

MIT License
