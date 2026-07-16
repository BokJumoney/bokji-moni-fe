# 복지머니 (BokJuMoney) — 프론트엔드

> 대한민국 복지 정책을 **대화형 AI**로 쉽게 탐색하고 신청까지 보조하는 웹 서비스

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **프로젝트명** | 복지머니 (AI 미니 프로젝트) |
| **목적** | 대한민국의 복지 정책을 사용자에게 대화형으로 전달하고 신청을 보조 |
| **프론트엔드 역할** | 사용자 인터페이스 제공 — 챗봇 대화, 복지 정보 탐색, 회원가입/로그인 등 |
| **현재 상태** | 주요 UI 및 라우팅 구현 완료, 인증 기능 및 백엔드 API 연동 작업 중 |

---

## 2. 기술 스택

| 기술 | 용도 |
|------|------|
| **React (v19)** | UI 라이브러리 |
| **Vite** | 빌드 도구 · 개발 서버 |
| **React Router v7** | 페이지 라우팅 관리 |
| **Context API** | 사용자 인증 및 전역 상태 관리 (`useAuth`) |
| **CSS Modules / Vanilla CSS** | 컴포넌트 스타일링 |
| **ESLint / Babel** | 코드 린팅 및 컴파일러 플러그인 (React Compiler 등) |

---

## 3. 폴더 구조 (현재 상태)

```
bokji-moni-fe/
├── public/                  # 정적 파일 (favicon, SVG 아이콘 등)
├── src/
│   ├── api/                 # 어드민 전용 등 기타 API 파일 (adminFiles.js 등)
│   ├── assets/              # 이미지, 로고 등 정적 에셋
│   ├── components/          # 재사용 가능한 UI 컴포넌트
│   │   ├── BrandSection/    # 브랜딩 관련 UI 컴포넌트
│   │   ├── common/          # 공통 UI 컴포넌트 (버튼, 인풋 등)
│   │   ├── drawer/          # 사이드 메뉴/서랍장 UI 컴포넌트
│   │   └── welfare/         # 복지 정보 관련 컴포넌트
│   ├── context/             # 전역 상태 관리 Context (`useAuth.js` 등)
│   ├── hooks/               # 커스텀 React 훅
│   ├── layouts/             # 공통 레이아웃 컴포넌트 (`ChatLayout.jsx` 등)
│   ├── pages/               # 라우트별 페이지 컴포넌트
│   │   ├── Chat/            # AI 챗봇 대화 페이지
│   │   ├── Login/           # 로그인 페이지
│   │   ├── Main/            # 메인 / 랜딩 페이지
│   │   ├── Manager/         # 관리자 전용 페이지
│   │   ├── MyPage/          # 마이페이지
│   │   └── Signup/          # 회원가입 페이지
│   ├── services/            # API 호출 모듈 (도메인별로 분리)
│   │   ├── chat/            # 챗봇 관련 API (`chatApi.js` 등)
│   │   ├── common/          # 공통 API 모듈 (`request.js` 등)
│   │   ├── login/           # 로그인 관련 API
│   │   └── signup/          # 회원가입 관련 API
│   ├── utils/               # 유틸리티 함수
│   ├── App.jsx              # 라우팅 설정 및 최상위 컴포넌트
│   ├── App.css              # 앱 레벨 전역 스타일
│   ├── main.jsx             # React 엔트리 포인트
│   └── index.css            # 글로벌 CSS 변수 · 리셋
├── index.html               # HTML 메인 템플릿
├── vite.config.js           # Vite 번들러 설정
├── eslint.config.js         # ESLint 린트 규칙 설정
└── package.json             # 프로젝트 의존성 관리
```

---

## 4. 핵심 화면 및 라우팅 구조

현재 프론트엔드는 `react-router-dom`을 이용하여 다음과 같이 라우팅이 구성되어 있습니다. `useAuth` Context를 활용하여 사용자의 로그인 여부에 따라 접근이 제어됩니다.

### 4.1 로그인 및 회원가입 (`/login`, `/signup`)
- **접근 권한:** 비로그인 사용자 전용 (`PublicOnlyRoute`)
- **주요 기능:** 이메일 및 비밀번호 기반 로그인/회원가입 처리

### 4.2 메인 페이지 (`/`)
- **접근 권한:** 제한 없음 (ChatLayout 내에 표시)
- **주요 기능:** 
  - 복지머니 서비스 안내 및 브랜드 소개
  - AI 챗봇으로 이동하기 위한 진입점 제공

### 4.3 AI 챗봇 페이지 (`/chat`, `/chat/:chatRoomId`)
- **접근 권한:** 로그인 사용자 전용 (`ProtectedRoute`)
- **주요 기능:**
  - 사용자의 채팅 방 ID별로 분리된 실시간 대화형 인터페이스
  - 사용자의 정보와 질문을 바탕으로 맞춤형 복지 정책 탐색 및 답변 추천

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
