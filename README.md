# Eventure 🎉

**Event + Adventure: 여행과 모험 사이, 그 경계를 잇다**

오늘의 설렘이 내일의 기억이 되는 곳  
낯선 곳에서 이어지는 우리의 이야기  
발견은 인연이 되고, 순간은 이야기가 된다

---

## 🖥️ 데모 링크

🔗 배포 사이트: (배포 후 추가 예정)

---

## 👥 팀 소개

### 팀명: TwoWice

| 이름   | 역할           | GitHub |
| ------ | -------------- | ------ |
| 최광혁 | 팀장 / 개발 구현 | [@광혁]() |
| 박영준 | 개발 구현       | [@영준]() |
| 김수현 | 개발 구현       | [@수현]() |
| 옥예빈 | 개발 구현       | [@예빈]() |

---

## 📖 프로젝트 개요

### 컨셉
> 오늘의 설렘이 내일의 기억이 되는 곳

Eventure는 지역 이벤트 탐색부터 여행 일지 기록까지, 여행의 모든 순간을 특별하게 만드는 플랫폼입니다.

### 기대효과

| 키워드           | 의미                                  | 경험 가치                            |
| ---------------- | ------------------------------------- | ------------------------------------ |
| 🔍 **탐색**      | 지역 이벤트를 간편하게 서칭       | 여행의 이유를 발견하는 즐거움         |
| 🤝 **연결**      | 파티원 모집 / 관심사 매칭 / 커뮤니티  | 낯선 곳에서 만나는 인연이라는 설렘    |
| 📝 **기록**      | 나만의 여행 일지                      | 추억을 기억으로 남기는 확장성         |

---

## ⏱️ 제작 기간

2025.12.02 ~ 2026.01.08

---

## 🚀 기술 스택

### Frontend
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Shadcn/ui](https://img.shields.io/badge/Shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)

### Backend & Authentication
![Next.js](https://img.shields.io/badge/Next.js_API-000000?style=for-the-badge&logo=next.js&logoColor=white)
![NextAuth.js](https://img.shields.io/badge/NextAuth.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)

### OAuth Providers
![Kakao](https://img.shields.io/badge/Kakao-FFCD00?style=for-the-badge&logo=kakao&logoColor=black)
![Naver](https://img.shields.io/badge/Naver-03C75A?style=for-the-badge&logo=naver&logoColor=white)
![Google](https://img.shields.io/badge/Google-4285F4?style=for-the-badge&logo=google&logoColor=white)

### Database
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

### AI
![OpenAI](https://img.shields.io/badge/OpenAI_API-412991?style=for-the-badge&logo=openai&logoColor=white)

### Tools & Collaboration
![VSCode](https://img.shields.io/badge/VSCode-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white)
![Figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)
![Jira](https://img.shields.io/badge/Jira-0052CC?style=for-the-badge&logo=jira&logoColor=white)

---

## 📌 주요 기능

### 🔐 인증 시스템
- 소셜 로그인 (카카오, 네이버, 구글)
- 자체 회원가입 / 로그인
- Auth.js 기반 세션 관리

### 🔍 이벤트 탐색
- 지역 기반 이벤트 검색
- 카테고리별 필터링

### 🤝 파티원 모집
- 관심사 기반 매칭
- 파티 생성 및 참여
- 실시간 채팅 (Socket.io)

### 📝 여행 일지
- 이벤트 참여 기록
- 사진 및 메모 저장
- 타임라인 뷰

### 💬 실시간 소통
- 이벤트별 채팅방
- 파티원 간 실시간 메시지
- 알림 기능

---

## 📂 폴더 구조
```
eventure/
├─ app/
│  ├─ api/
│  │  ├─ auth/              # 인증 관련 API
│  │  ├─ events/            # 이벤트 API
│  │  └─ chat/              # 채팅 API
│  ├─ (auth)/
│  │  ├─ login/
│  │  └─ signup/
│  ├─ events/
│  │  ├─ [id]/
│  │  └─ create/
│  ├─ party/
│  ├─ journal/
│  └─ dashboard/
├─ components/
│  ├─ ui/                   # Shadcn UI 컴포넌트
│  ├─ auth/
│  ├─ events/
│  └─ chat/
├─ lib/
│  ├─ supabase.ts           # Supabase 클라이언트
│  ├─ openai.ts             # OpenAI API
│  └─ utils.ts
├─ types/
│  ├─ auth.ts
│  └─ events.ts
├─ socket/                  # Socket.io 서버
└─ public/
   └─ images/
```

---

## 🎯 수행 계획

### 개발 단계

1. **요구사항 / 기능 정의**
   - 사용자 스토리 작성
   - 기능 명세서 작성

2. **시스템 + DB 설계**
   - ERD 설계
   - DB 테이블 설계
   - API 명세서 작성

3. **와이어프레임 및 프로토타입**
   - Figma 디자인 시스템 구축
   - 주요 페이지 프로토타입 제작

4. **구현 및 테스트**
   - 기능별 개발 및 단위 테스트
   - 통합 테스트
   - 사용자 테스트

---

## 📋 Issue 관리

### 작업 전
- GitHub Issue 탭에서 `[태그] 작업 내용` 형식으로 이슈 생성
- Jira와 연동하여 스프린트 관리
- 예시: `[Feat] 이벤트 추천 알고리즘 구현`

### 작업 후
- 커밋 메시지에 `#이슈번호` 포함
- 예시: `[Feat] AI 기반 이벤트 추천 기능 추가 #12`

---

## 📐 개발 규칙

### 페이지 관리
- `app` 폴더 안에 페이지 이름으로 폴더 생성
- 폴더 안에 파일명은 반드시 `page.tsx`로 작성
  - 예시: 이벤트 목록 → `app/events/page.tsx`
  
- 이미지는 `public/images/` 폴더 안에 페이지별 폴더 생성
  - 예시: `public/images/events/banner.png`

### 컴포넌트 관리
- 재사용 컴포넌트: `components/` 폴더
- UI 컴포넌트 (Shadcn): `components/ui/` 폴더
- 페이지 전용 컴포넌트: 해당 페이지 폴더 내 생성

### 코드 스타일
- TypeScript strict mode 사용
- ESLint + Prettier 설정 준수
- 함수형 컴포넌트 사용
- 커스텀 Hook 적극 활용

---

## 🌿 브랜치 전략

### 주요 브랜치
- **main**: 프로덕션 브랜치 (실제 서비스 중인 안정 버전)
- **dev**: 개발 통합 브랜치 (다음 배포 준비 중인 코드)

### 작업 브랜치
- **feature**: 새로운 기능 개발
  - 네이밍: `feature/기능명/담당자`
  - 예시: `feature/event-recommendation/영준`

### 브랜치 워크플로우
```
1. dev 브랜치에서 작업 브랜치 생성
   ↓
2. 개발 중 add → commit → push
   ↓
3. 작업 완료 후 dev 브랜치에 PR 생성
   ↓
4. 코드 리뷰 (최소 1명 이상 승인 필요)
   ↓
5. dev 브랜치에 merge
   ↓
6. 스프린트 종료 시 dev → main merge
```

---

## 💬 커밋 메시지 규칙

### 커밋 타입

| 타입       | 설명                                     |
| ---------- | ---------------------------------------- |
| `feat`     | 새로운 기능 추가                         |
| `fix`      | 버그 수정                                |
| `design`   | UI/UX 변경 (CSS, 레이아웃)               |
| `refactor` | 코드 리팩토링 (기능 변경 없음)           |

### 커밋 메시지 형식
```
[타입] 제목 #이슈번호

- 상세 내용 1
- 상세 내용 2
```

### 예시
```bash
git commit -m "[feat] AI 기반 이벤트 추천 기능 구현 #12

- OpenAI API 연동
- 사용자 선호도 기반 추천 알고리즘
- 추천 결과 캐싱 로직 추가"
```
```bash
git commit -m "[design] 메인 페이지 반응형 레이아웃 적용 #20

- 모바일/태블릿/데스크톱 breakpoint 설정
- 이벤트 카드 그리드 레이아웃 개선"
```

---

## 🔄 Git 작업 프로세스

### 1. 작업 시작 전 브랜치 확인 ⭐
```bash
git branch  # 현재 브랜치 확인 (필수!)
```

### 2. dev 브랜치 최신화
```bash
git checkout dev
git pull origin dev
```

### 3. 새 작업 브랜치 생성
```bash
git checkout -b feature/event-recommendation/영준
```

### 4. 코드 수정 및 커밋
```bash
git add .
git commit -m "[feat] 이벤트 추천 UI 구현 #12"
```

### 5. 원격 저장소에 푸시
```bash
git push origin feature/event-recommendation/영준
```

### 6. GitHub에서 Pull Request 생성
1. GitHub 저장소 접속
2. **Pull Request** 탭 클릭
3. `feature/event-recommendation/영준` → `dev` 브랜치로 PR 생성
4. 리뷰어 지정 (최소 1명)
5. 코드 리뷰 및 승인 대기
6. 승인 후 merge

---

## ⚠️ 주의사항

1. **작업 전 반드시 브랜치 확인**: `git branch`로 현재 위치 확인
2. **main 브랜치에 직접 커밋 금지**: 항상 작업 브랜치에서 작업
3. **dev 브랜치 최신화**: 새 브랜치 생성 전 `git pull origin dev`
4. **명확한 커밋 메시지**: 변경 내용을 구체적으로 작성
5. **환경 변수 관리**: `.env` 파일은 절대 커밋하지 않기
6. **PR 전 로컬 테스트**: 기능이 정상 작동하는지 확인 후 PR
7. **코드 리뷰**: 팀원의 피드백을 적극 반영
8. **Jira 이슈 연동**: 작업 시작 전 Jira 이슈 확인 및 상태 업데이트

---

## 🚀 시작하기

### 1. 저장소 클론
```bash
git clone https://github.com/TwoWice/eventure.git
cd eventure
```

### 2. 패키지 설치
```bash
npm install
```

### 3. 환경 변수 설정
`.env.local` 파일 생성 후 아래 내용 추가:
```env
# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Database (Supabase)
DATABASE_URL=your-supabase-database-url
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# OAuth
KAKAO_CLIENT_ID=your-kakao-id
KAKAO_CLIENT_SECRET=your-kakao-secret
NAVER_CLIENT_ID=your-naver-id
NAVER_CLIENT_SECRET=your-naver-secret
GOOGLE_CLIENT_ID=your-google-id
GOOGLE_CLIENT_SECRET=your-google-secret

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Socket.io
SOCKET_SERVER_URL=http://localhost:3001
```

### 4. 데이터베이스 설정
```bash
# Supabase 마이그레이션 실행
npm run db:migrate
```

### 5. 개발 서버 실행
```bash
# Next.js 서버
npm run dev

# Socket.io 서버 (별도 터미널)
npm run socket:dev
```

브라우저에서 `http://localhost:3000` 접속

---


## 💡 프로젝트 비전

> "Eventure는 단순한 이벤트 플랫폼을 넘어,  
> 여행의 모든 순간을 특별한 경험으로 만드는  
> 감성 기반 여행 커뮤니티를 지향합니다."

**발견은 인연이 되고, 순간은 이야기가 된다** 🎉
>>>>>>> 55751b2e04d1a31a43776c083d525ea2a091b919
