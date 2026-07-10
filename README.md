# 복지머니 (BokJuMoney) — 프론트엔드

> 대한민국 복지 정책을 **대화형 AI**로 쉽게 탐색하고 신청까지 보조하는 웹 서비스

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **프로젝트명** | 복지머니 (AI 미니 프로젝트) |
| **목적** | 대한민국의 복지 정책을 사용자에게 대화형으로 전달하고 신청을 보조 |
| **프론트엔드 역할** | 사용자 인터페이스 제공 — 챗봇 대화, 복지 정보 탐색, 신청 안내 |
| **현재 상태** | 기획 완료 · 프론트엔드 작업 시작 |

---

## 2. 기술 스택

| 기술 | 용도            |
|------|---------------|
| **React** | UI 라이브러리      |
| **Vite** | 빌드 도구 · 개발 서버 |
| FastAPI | REST / WebSocket API 서버 |
| PostgreDB + pgvector | 벡터 검색 기반 복지 정보 저장 |
| LangChain · LangGraph | AI 대화 파이프라인 |

---

## 3. 폴더 구조 (계획)

```
bokji-moni-fe/
├── public/                  # 정적 파일 (favicon, 아이콘 등)
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/              # 이미지, SVG 등 정적 에셋
│   ├── components/          # 재사용 가능한 UI 컴포넌트
│   │   ├── common/          #   공통 (Button, Input, Modal 등)
│   │   ├── chat/            #   챗봇 관련 (ChatBubble, ChatInput 등)
│   │   └── welfare/         #   복지 정보 관련 (WelfareCard 등)
│   ├── pages/               # 라우트별 페이지 컴포넌트
│   │   ├── HomePage.jsx     #   랜딩 / 메인 페이지
│   │   ├── ChatPage.jsx     #   AI 챗봇 대화 페이지
│   │   └── WelfarePage.jsx  #   복지 정보 탐색 페이지
│   ├── hooks/               # 커스텀 React 훅
│   ├── services/            # API 호출 모듈 (백엔드 통신)
│   ├── store/               # 전역 상태 관리
│   ├── styles/              # 글로벌 스타일 · 디자인 토큰
│   ├── utils/               # 유틸리티 함수
│   ├── App.jsx              # 루트 컴포넌트 · 라우팅 설정
│   ├── App.css              # 앱 레벨 스타일
│   ├── main.jsx             # 엔트리 포인트
│   └── index.css            # 글로벌 CSS 변수 · 리셋
├── index.html               # HTML 템플릿
├── vite.config.js           # Vite 설정
├── eslint.config.js         # ESLint 설정
├── package.json
└── README.md                # ← 이 문서
```

---

## 4. 핵심 화면 · 기능

### 4.1 메인 페이지 (`HomePage`)
- 서비스 소개 및 핵심 가치 전달
- AI 챗봇으로 바로 이동하는 CTA 버튼
- 인기 복지 정책 미리보기 카드

### 4.2 AI 챗봇 페이지 (`ChatPage`)
- 실시간 대화형 인터페이스 (WebSocket 또는 SSE)
- 사용자 질문 → AI가 맞춤 복지 정책 추천
- 대화 히스토리 표시
- 추천 정책 카드 인라인 표시

### 4.3 복지 정보 탐색 (`WelfarePage`)
- 카테고리별 복지 정책 목록
- 검색 · 필터링 기능
- 상세 정보 모달 / 페이지
- 신청 방법 안내 링크

---

## 5. API 연동 구조 (예정)

```
프론트엔드 (React)
    │
    ├── REST API ──────── FastAPI 서버
    │   ├── GET  /api/welfare          복지 정책 목록
    │   ├── GET  /api/welfare/:id      복지 정책 상세
    │   └── POST /api/welfare/search   검색 (pgvector)
    │
    └── WebSocket / SSE ── FastAPI 서버
        └── /api/chat                  AI 대화 스트리밍
```

---

## 6. 개발 환경 설정

### 사전 요구사항
- **Node.js** 20.x 이상
- **npm** 10.x 이상

### 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (HMR 지원)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview

# 린트 검사
npm run lint
```

### 환경 변수 (예정)

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/api/chat
```

---

## 7. 컨벤션

| 항목 | 규칙 |
|------|------|
| **컴포넌트** | PascalCase (`ChatBubble.jsx`) |
| **훅** | camelCase, `use` 접두사 (`useChat.js`) |
| **스타일** | 컴포넌트명과 동일 (`ChatBubble.css`) |
| **상수** | UPPER_SNAKE_CASE |
| **API 모듈** | camelCase (`welfareApi.js`) |

---

## 8. 향후 로드맵

- [ ] 프로젝트 폴더 구조 세팅
- [ ] React Router 도입 · 페이지 라우팅 구성
- [ ] 디자인 시스템 (색상, 타이포, 컴포넌트) 정의
- [ ] 메인 페이지 UI 구현
- [ ] AI 챗봇 페이지 UI 구현
- [ ] 백엔드 API 연동
- [ ] 복지 정보 탐색 페이지 구현
- [ ] 반응형 · 모바일 최적화
- [ ] 배포 파이프라인 구성
