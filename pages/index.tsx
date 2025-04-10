import { useState } from 'react';
import Head from 'next/head';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [debateTopic, setDebateTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [debateResult, setDebateResult] = useState('');

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
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100">
      <Head>
        <title>AI 토론 친구</title>
        <meta name="description" content="AI를 활용한 토론 학습 도우미" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Jua&family=Gaegu:wght@400;700&display=swap" rel="stylesheet" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-jua text-primary-dark mb-4">
              AI 토론 친구
            </h1>
            <p className="text-lg font-gaegu text-gray-700">
              AI와 함께하는 즐거운 토론 학습
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                  토론 주제
                </label>
                <input
                  type="text"
                  id="topic"
                  value={debateTopic}
                  onChange={(e) => setDebateTopic(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  placeholder="토론 주제를 입력하세요"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-jua py-2 px-4 rounded-md transition duration-300 flex items-center justify-center"
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

          {debateResult && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-jua text-primary-dark mb-4">토론 결과</h2>
              <div className="prose max-w-none font-gaegu">
                {debateResult.split('\n').map((line, i) => (
                  <p key={i} className="mb-4">{line}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 