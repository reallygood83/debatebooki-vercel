# AI 토론 친구 (DebateBooki)

AI를 활용한 초등학교 6학년 대상 토론 학습 도우미 웹 애플리케이션입니다.

## 주요 기능

- AI 기반 토론 주제 생성
- 찬성/반대 측 주장 자동 생성
- 토론 포인트 제시
- 결론 도출

## 기술 스택

- Next.js
- TypeScript
- Tailwind CSS
- Google Gemini AI API

## 설치 및 실행

1. 저장소 클론
```bash
git clone https://github.com/your-username/debatebooki-vercel.git
cd debatebooki-vercel
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정
`.env.local` 파일을 생성하고 다음 내용을 추가:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

4. 개발 서버 실행
```bash
npm run dev
```

## 배포

Vercel을 통해 배포됩니다:
1. Vercel 계정 생성
2. GitHub 저장소 연결
3. 환경 변수 설정
4. 배포

## 라이센스

MIT License 