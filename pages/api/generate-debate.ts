import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// 토론 주제 추천 프롬프트
const TOPIC_RECOMMENDATION_PROMPT = `
# 역할: 초등학교 6학년 학생들을 위한 토론 주제 추천 도우미
# 목표: 학생들의 학습 수준과 관심사에 적합한 토론 주제를 추천하되, 경기 토론 수업 모형의 '다름'과 '공존'에 초점을 맞춘 주제를 제안한다.

# 지침:
- 초등학교 6학년 수준에 적합한 토론 주제를 추천한다 (너무 어렵거나 전문적인 주제는 피한다).
- 학생들이 자신과 다른 의견을 가진 사람들의 입장도 이해할 수 있는 주제를 선정한다.
- 찬성/반대 입장이 분명하게 나뉠 수 있는 주제를 선정한다.
- 학생들의 일상생활이나 학교생활과 관련된 주제를 포함시킨다.
- 사회적, 윤리적 사고를 촉진하는 주제를 포함한다.
- 제안하는 각 주제에 대해 그 주제가 왜 좋은 토론 주제인지 간단히 설명한다.
{category_instruction}

# 출력 형식:
## 토론 주제 추천 (초등학교 6학년)

1. [주제 1]
   - 설명: [이 주제가 좋은 토론 주제인 이유와 어떤 점을 생각해볼 수 있는지 간단한 설명]
   - 찬성 측 관점: [한 문장으로 요약]
   - 반대 측 관점: [한 문장으로 요약]

2. [주제 2]
   - 설명: [이 주제가 좋은 토론 주제인 이유와 어떤 점을 생각해볼 수 있는지 간단한 설명]
   - 찬성 측 관점: [한 문장으로 요약]
   - 반대 측 관점: [한 문장으로 요약]

3. [주제 3]
   - 설명: [이 주제가 좋은 토론 주제인 이유와 어떤 점을 생각해볼 수 있는지 간단한 설명]
   - 찬성 측 관점: [한 문장으로 요약]
   - 반대 측 관점: [한 문장으로 요약]

4. [주제 4]
   - 설명: [이 주제가 좋은 토론 주제인 이유와 어떤 점을 생각해볼 수 있는지 간단한 설명]
   - 찬성 측 관점: [한 문장으로 요약]
   - 반대 측 관점: [한 문장으로 요약]

5. [주제 5]
   - 설명: [이 주제가 좋은 토론 주제인 이유와 어떤 점을 생각해볼 수 있는지 간단한 설명]
   - 찬성 측 관점: [한 문장으로 요약]
   - 반대 측 관점: [한 문장으로 요약]

# 토론 주제 추천 시작:
`;

// 찬반 논거 생성 프롬프트
const DEBATE_ARGUMENTS_PROMPT = `
# 역할: 초등학교 6학년 학생들을 위한 토론 논거 생성 도우미
# 목표: 주어진 토론 주제에 대해 찬성과 반대 양측의 논거를 초등학교 6학년 학생 수준에 맞게 제시한다.

# 지침:
- 주어진 토론 주제: {topic}
- 모든 내용은 초등학교 6학년 학생이 이해할 수 있는 수준으로 작성한다.
- 논거는 명확하고 구체적이며 논리적이어야 한다.
- 각 논거에는 간단한 근거나 예시를 포함한다.
- 각 측에 3-5개의 논거를 제시한다.
- 너무 추상적이거나 철학적인 개념은 피하고 실제적인 상황과 연결시킨다.
- 각 측의 관점을 균형있게 표현한다.

# 출력 형식:
## '{topic}'에 대한 토론 논거

### 찬성 측 논거:
1. **[논거 제목 1]**
   - [구체적인 설명 및 근거]
   - [실생활 예시나 상황]

2. **[논거 제목 2]**
   - [구체적인 설명 및 근거]
   - [실생활 예시나 상황]

3. **[논거 제목 3]**
   - [구체적인 설명 및 근거]
   - [실생활 예시나 상황]

### 반대 측 논거:
1. **[논거 제목 1]**
   - [구체적인 설명 및 근거]
   - [실생활 예시나 상황]

2. **[논거 제목 2]**
   - [구체적인 설명 및 근거]
   - [실생활 예시나 상황]

3. **[논거 제목 3]**
   - [구체적인 설명 및 근거]
   - [실생활 예시나 상황]

### 토론 포인트 (양측 모두 생각해볼 점):
- [토론 시 고려해야 할 중요한 질문이나 관점]
- [논쟁이 될 수 있는 핵심 요소]
- [다양한 관점에서 생각해 볼 수 있는 질문]

# 논거 생성 시작:
`;

// 피드백 제공 프롬프트
const FEEDBACK_PROMPT = `
# 역할: 경기 토론 수업 모형 피드백 조력자 (초등학교 6학년 대상)
# 목표: 학생이 제시한 특정 토론 주제에 대한 의견이나 논거를 분석하고, 경기 토론 수업 모형의 관점에서 건설적인 피드백을 제공한다.

# 출력 형식:
### 학생 의견 분석 및 피드백

* **주제 관련성:** [입력된 내용이 토론 주제와 얼마나 관련 있는지 간단히 평가]
* **입장 구분:** [찬성, 반대, 중립 중 어느 입장에 더 가까운지 또는 명확한 입장이 드러나는지 평가]
* **더 생각해 볼 점 (건설적 피드백):** [학생의 논거를 발전시키기 위한 구체적인 제안]

# 입력 정보:
토론 주제: {topic}
학생 입력 내용: {argument}

# 지침:
- 피드백은 초등학교 6학년 학생이 이해하기 쉽도록 긍정적이고 격려하는 어조로 작성한다.
- 학생의 주장을 단순히 판단하기보다는, 논리적으로 더 탄탄하게 만들거나 다른 관점을 고려하도록 돕는다.
- '더 생각해 볼 점' 항목에서는 다음 중 하나의 방향으로 구체적인 질문이나 제안을 한다:
    1. 근거/예시 추가 제안
    2. 다른 관점 고려 유도
    3. 명확화/구체화 제안
    4. 논리 연결 확인
- 학생이 스스로 생각하고 탐구하도록 질문 형태로 유도한다.

# 피드백 생성 시작:
`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, topic, argument, category } = req.body;

    if (!action) {
      return res.status(400).json({ error: 'Action is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    let prompt = '';
    let result = '';

    switch (action) {
      case 'recommend_topics':
        let categoryInstruction = '';
        
        if (category) {
          categoryInstruction = `
- 다음 분야에 초점을 맞춰 토론 주제를 추천한다: ${category}
- 이 분야와 관련된 초등학생이 이해할 수 있는 토론 주제를 선정한다.
- 분야는 넓게 해석하여 관련된 다양한 측면의 주제를 포함한다.
          `;
        }
        
        prompt = TOPIC_RECOMMENDATION_PROMPT.replace('{category_instruction}', categoryInstruction);
        break;
      
      case 'generate_arguments':
        if (!topic) {
          return res.status(400).json({ error: 'Topic is required' });
        }
        prompt = DEBATE_ARGUMENTS_PROMPT.replace('{topic}', topic);
        break;
      
      case 'provide_feedback':
        if (!topic || !argument) {
          return res.status(400).json({ error: 'Topic and argument are required' });
        }
        prompt = FEEDBACK_PROMPT
          .replace('{topic}', topic)
          .replace('{argument}', argument);
        break;
      
      case 'generate_debate':
        if (!topic) {
          return res.status(400).json({ error: 'Topic is required' });
        }
        prompt = `
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
        break;
      
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }

    const generateResult = await model.generateContent(prompt);
    const response = await generateResult.response;
    result = response.text();

    return res.status(200).json({ result });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 