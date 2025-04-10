import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
    당신은 초등학교 6학년 학생들을 위한 토론 학습 도우미입니다.
    다음 주제에 대해 토론을 생성해주세요:
    
    주제: ${topic}
    
    다음 형식으로 응답해주세요:
    
    [찬성 측 주장]
    - 주장 1
    - 주장 2
    - 주장 3
    
    [반대 측 주장]
    - 주장 1
    - 주장 2
    - 주장 3
    
    [토론 포인트]
    - 포인트 1
    - 포인트 2
    - 포인트 3
    
    [결론]
    - 요약
    - 배운 점
    - 추가 생각해볼 점
    
    학생들이 이해하기 쉽게 간단하고 명확하게 작성해주세요.
    각 섹션은 명확하게 구분되어야 합니다.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ result: text });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 