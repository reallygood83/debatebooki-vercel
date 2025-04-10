import { useState } from 'react';
import { ChatBubbleLeftRightIcon, LightBulbIcon, UserGroupIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import Head from 'next/head';

export default function Home() {
  const [debateTopic, setDebateTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [debateResult, setDebateResult] = useState('');
  const [debateHistory, setDebateHistory] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-debate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: debateTopic }),
      });
      const data = await response.json();
      setDebateResult(data.result);
      setDebateHistory(prev => [...prev, debateTopic]);
      setDebateTopic('');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDebateResult = (text: string) => {
    if (!text) return [];
    
    const sections: { title: string; content: string[] }[] = [];
    let currentSection = { title: '', content: [] as string[] };
    
    const lines = text.split('\n').filter(line => line.trim() !== '');
    
    for (const line of lines) {
      if (line.includes('[') && line.includes(']')) {
        if (currentSection.title) {
          sections.push({...currentSection});
        }
        currentSection = {
          title: line.trim(),
          content: []
        };
      } else {
        currentSection.content.push(line.trim());
      }
    }
    
    if (currentSection.title) {
      sections.push(currentSection);
    }
    
    return sections;
  };

  const debateSections = formatDebateResult(debateResult);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100">
      <Head>
        <title>AI 토론 친구</title>
        <link href="https://fonts.googleapis.com/css2?family=Jua&family=Gaegu:wght@400;700&display=swap" rel="stylesheet" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 bg-white rounded-xl shadow-lg p-6 animate-float">
            <h1 className="text-4xl font-jua text-primary-dark mb-2">
              AI 토론 친구
            </h1>
            <p className="text-lg font-gaegu text-gray-700">
              AI와 함께하는 즐거운 토론 학습
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card text-center hover:shadow-xl transition-shadow">
              <LightBulbIcon className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-jua text-primary-dark mb-2">창의적 사고</h3>
              <p className="font-gaegu text-gray-600">다양한 관점에서 생각해보기</p>
            </div>
            <div className="card text-center hover:shadow-xl transition-shadow">
              <UserGroupIcon className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-jua text-primary-dark mb-2">토론 능력</h3>
              <p className="font-gaegu text-gray-600">의사소통 능력 향상</p>
            </div>
            <div className="card text-center hover:shadow-xl transition-shadow">
              <BookOpenIcon className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-jua text-primary-dark mb-2">학습 효과</h3>
              <p className="font-gaegu text-gray-600">깊이 있는 학습 경험</p>
            </div>
          </div>

          <div className="card mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="topic" className="block text-lg font-jua text-gray-700 mb-2">
                  토론 주제
                </label>
                <input
                  type="text"
                  id="topic"
                  value={debateTopic}
                  onChange={(e) => setDebateTopic(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:ring-primary focus:border-primary font-gaegu text-lg"
                  placeholder="토론하고 싶은 주제를 입력하세요"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-3 flex items-center justify-center"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    생성 중...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                    토론 시작하기
                  </span>
                )}
              </button>
            </form>
          </div>

          {debateSections.length > 0 && (
            <div className="card mb-8">
              <h2 className="text-2xl font-jua text-primary-dark mb-6 border-b-2 border-pink-200 pb-2">토론 결과</h2>
              <div className="space-y-6 font-gaegu">
                {debateSections.map((section, index) => (
                  <div key={index} className="mb-4">
                    <h3 className="text-xl font-jua text-gray-700 mb-3">{section.title}</h3>
                    <ul className="space-y-2 list-disc pl-5">
                      {section.content.map((item, i) => (
                        <li key={i} className="text-lg text-gray-600">{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {debateHistory.length > 0 && (
            <div className="card">
              <h2 className="text-2xl font-jua text-primary-dark mb-4 border-b-2 border-pink-200 pb-2">최근 토론 주제</h2>
              <ul className="space-y-2 divide-y divide-pink-100">
                {debateHistory.map((topic, index) => (
                  <li key={index} className="font-gaegu text-gray-700 text-lg py-2">
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 