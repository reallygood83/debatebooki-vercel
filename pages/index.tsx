import { useState, useEffect } from 'react';
import { 
  ChatBubbleLeftRightIcon, 
  LightBulbIcon, 
  UserGroupIcon, 
  BookOpenIcon, 
  QuestionMarkCircleIcon, 
  CheckCircleIcon, 
  PencilIcon,
  GlobeAltIcon,
  NewspaperIcon
} from '@heroicons/react/24/outline';
import Head from 'next/head';

// 탭 인덱스 타입
type TabIndex = 0 | 1 | 2 | 3 | 4 | 5;

export default function Home() {
  // 공통 상태
  const [activeTab, setActiveTab] = useState<TabIndex>(0);
  const [isLoading, setIsLoading] = useState(false);

  // 토론 주제 생성 상태
  const [topicRecommendations, setTopicRecommendations] = useState('');
  const [topicCategory, setTopicCategory] = useState('');

  // 토론 생성 상태
  const [debateTopic, setDebateTopic] = useState('');
  const [debateResult, setDebateResult] = useState('');
  const [debateHistory, setDebateHistory] = useState<string[]>([]);

  // 찬반 논거 생성 상태
  const [argumentTopic, setArgumentTopic] = useState('');
  const [argumentResult, setArgumentResult] = useState('');

  // 의견 피드백 상태
  const [feedbackTopic, setFeedbackTopic] = useState('');
  const [studentArgument, setStudentArgument] = useState('');
  const [feedbackResult, setFeedbackResult] = useState('');

  // 토론 마무리 활동 상태
  const [finishTopic, setFinishTopic] = useState('');
  const [proOpinion, setProOpinion] = useState('');
  const [proGoodPoints, setProGoodPoints] = useState('');
  const [conOpinion, setConOpinion] = useState('');
  const [conGoodPoints, setConGoodPoints] = useState('');
  const [newSolution, setNewSolution] = useState('');
  const [reflection, setReflection] = useState('');
  const [summaryCompleted, setSummaryCompleted] = useState(false);

  // 컴포넌트 마운트 시 초기 토론 주제 추천 로드
  useEffect(() => {
    if (activeTab === 1 && topicRecommendations === '') {
      handleRecommendTopics();
    }
  }, [activeTab]);

  // 토론 결과 형식화 함수
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

  // 토론 주제 추천 요청 처리
  const handleRecommendTopics = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-debate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'recommend_topics',
          category: topicCategory 
        }),
      });
      const data = await response.json();
      setTopicRecommendations(data.result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 토론 생성 요청 처리
  const handleGenerateDebate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-debate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'generate_debate',
          topic: debateTopic 
        }),
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

  // 찬반 논거 생성 요청 처리
  const handleGenerateArguments = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-debate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'generate_arguments',
          topic: argumentTopic 
        }),
      });
      const data = await response.json();
      setArgumentResult(data.result);
      setArgumentTopic('');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 의견 피드백 요청 처리
  const handleProvideFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-debate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'provide_feedback',
          topic: feedbackTopic,
          argument: studentArgument
        }),
      });
      const data = await response.json();
      setFeedbackResult(data.result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 토론 추천 토픽 선택 처리
  const handleSelectTopic = (topic: string) => {
    setDebateTopic(topic);
    setActiveTab(2);
  };

  const debateSections = formatDebateResult(debateResult);

  // 탭 제목 및 아이콘 배열
  const tabs = [
    { title: "경기 토론 수업 모형", icon: <BookOpenIcon className="h-5 w-5" /> },
    { title: "토론 주제 추천", icon: <LightBulbIcon className="h-5 w-5" /> },
    { title: "토론 생성하기", icon: <ChatBubbleLeftRightIcon className="h-5 w-5" /> },
    { title: "찬반 논거 아이디어", icon: <UserGroupIcon className="h-5 w-5" /> },
    { title: "의견 피드백 받기", icon: <PencilIcon className="h-5 w-5" /> },
    { title: "토론 마무리 활동", icon: <QuestionMarkCircleIcon className="h-5 w-5" /> },
    { title: "뉴스 읽기자료", icon: <NewspaperIcon className="h-5 w-5" />, externalLink: "https://pebble-stallion-abb.notion.site/11a10244f99781308ab2c963d3a5967a?v=13610244f99780e29096000c92406e63&pvs=4" },
    { title: "그로스 허브", icon: <GlobeAltIcon className="h-5 w-5" />, externalLink: "https://script.google.com/macros/s/AKfycbxRh28gE6v7s7Xf-iuvWjMqORcBGZa-9U4Pqap4-Qlqc7u-KJ8aBN9L7shN0vxXqOVD/exec" },
    { title: "하이러닝 바로가기", icon: <GlobeAltIcon className="h-5 w-5" />, externalLink: "https://hi.goe.go.kr/" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100">
      <Head>
        <title>AI 토론 친구</title>
        <link href="https://fonts.googleapis.com/css2?family=Nanum+Square+Round:wght@400;700&family=Noto+Sans+KR:wght@400;500;700&display=swap" rel="stylesheet" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 bg-white rounded-xl shadow-lg p-6 animate-float">
            <h1 className="text-4xl font-nanum-square text-primary-dark mb-2">
              🦉 토론부기 - 지혜로운 토론 친구
            </h1>
            <p className="text-lg font-noto-sans-kr text-gray-700">
              AI를 활용한 경기 토론 수업 모형 지원 도구
            </p>
          </div>

          {/* 탭 네비게이션 */}
          <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
            <div className="flex flex-wrap justify-center">
              {tabs.map((tab, idx) => (
                <button
                  key={idx}
                  className={`flex items-center py-3 px-4 font-nanum-square text-sm sm:text-base transition-all duration-300 ${
                    activeTab === idx && !tab.externalLink
                      ? "bg-primary text-white" 
                      : "hover:bg-pink-50 text-gray-700"
                  }`}
                  onClick={() => tab.externalLink ? window.open(tab.externalLink, '_blank') : setActiveTab(idx as TabIndex)}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.title}
                </button>
              ))}
            </div>
          </div>

          {/* 탭 컨텐츠 */}
          <div className="card">
            {/* 1. 경기 토론 수업 모형 */}
            {activeTab === 0 && (
              <div>
                <h2 className="text-2xl font-nanum-square text-primary-dark mb-6 pb-2 border-b-2 border-pink-200 text-center">
                  경기 토론 수업 모형 소개
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="card text-center hover:shadow-xl transition-shadow flex flex-col items-center">
                    <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                      <span className="text-xl font-bold text-primary-dark">1</span>
                    </div>
                    <h3 className="text-xl font-nanum-square text-primary-dark mb-3">다름 드러내기</h3>
                    <p className="font-noto-sans-kr text-gray-600 whitespace-nowrap">서로 다른 생각과 관점을 자유롭게 표현</p>
                  </div>
                  <div className="card text-center hover:shadow-xl transition-shadow flex flex-col items-center">
                    <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                      <span className="text-xl font-bold text-primary-dark">2</span>
                    </div>
                    <h3 className="text-xl font-nanum-square text-primary-dark mb-3">다름 이해하기</h3>
                    <p className="font-noto-sans-kr text-gray-600 whitespace-nowrap">서로 다른 의견의 이유와 배경을 이해</p>
                  </div>
                  <div className="card text-center hover:shadow-xl transition-shadow flex flex-col items-center">
                    <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                      <span className="text-xl font-bold text-primary-dark">3</span>
                    </div>
                    <h3 className="text-xl font-nanum-square text-primary-dark mb-3">다름과 공존하기</h3>
                    <p className="font-noto-sans-kr text-gray-600 whitespace-nowrap">다양한 의견이 함께 존재할 수 있음을 인정</p>
                  </div>
                </div>

                <div className="bg-pink-50 rounded-lg p-6 mb-8">
                  <h3 className="text-xl font-nanum-square text-primary-dark mb-4">경기 토론 수업 모형이란?</h3>
                  <p className="font-noto-sans-kr text-gray-700 mb-4">
                    경기 토론 수업 모형은 학생들이 서로 다른 의견과 관점을 이해하고, 존중하는 태도를 기르기 위한 토론 수업 방법입니다.
                    단순히 찬성과 반대의 대립이 아닌, '다름'을 인정하고 함께 살아가는 방법을 배우는 과정입니다.
                  </p>
                  <p className="font-noto-sans-kr text-gray-700">
                    이 토론 모형은 특히 서로 다른 가치관이 충돌하는 사회적 쟁점에 대해 다양한 관점에서 생각해볼 수 있는 기회를 제공합니다.
                  </p>
                </div>

                <div className="bg-white border border-pink-200 rounded-lg p-6">
                  <h3 className="text-xl font-nanum-square text-primary-dark mb-4">토론부기를 활용하는 방법</h3>
                  <ol className="list-decimal list-inside space-y-3 font-noto-sans-kr text-gray-700">
                    <li><span className="font-bold text-primary-dark">토론 주제 추천:</span> AI가 초등학교 6학년 수준에 적합한 토론 주제를 추천해드립니다.</li>
                    <li><span className="font-bold text-primary-dark">토론 생성하기:</span> 선택한 주제에 대한 찬반 의견과 토론 포인트를 자동으로 생성합니다.</li>
                    <li><span className="font-bold text-primary-dark">찬반 논거 아이디어:</span> 토론을 위한 다양한 논거 아이디어를 제공합니다.</li>
                    <li><span className="font-bold text-primary-dark">의견 피드백 받기:</span> 여러분의 의견에 대한 건설적인 피드백을 받아보세요.</li>
                  </ol>
                </div>
              </div>
            )}

            {/* 2. 토론 주제 추천 */}
            {activeTab === 1 && (
              <div>
                <h2 className="text-2xl font-nanum-square text-primary-dark mb-6 pb-2 border-b-2 border-pink-200">
                  토론 주제 추천
                </h2>
                
                <form onSubmit={handleRecommendTopics} className="mb-6 space-y-4">
                  <div>
                    <label htmlFor="topicCategory" className="block text-lg font-nanum-square text-gray-700 mb-2">
                      주제 분야 (선택사항)
                    </label>
                    <input
                      type="text"
                      id="topicCategory"
                      value={topicCategory}
                      onChange={(e) => setTopicCategory(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:ring-primary focus:border-primary font-noto-sans-kr text-lg"
                      placeholder="예: 환경, 학교생활, 과학기술, 사회문제 등"
                    />
                    <p className="mt-2 text-sm text-gray-500 font-noto-sans-kr">
                      특정 분야의 토론 주제를 추천받고 싶다면 입력해보세요. 비워두면 다양한 분야의 주제를 추천해드립니다.
                    </p>
                  </div>
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary py-3 flex items-center justify-center w-full"
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        주제 추천 중...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <LightBulbIcon className="h-5 w-5 mr-2" />
                        토론 주제 추천받기
                      </span>
                    )}
                  </button>
                </form>

                {topicRecommendations && (
                  <div className="prose max-w-none font-noto-sans-kr">
                    <div dangerouslySetInnerHTML={{ __html: topicRecommendations.replace(/\n/g, '<br />') }} />
                    <div className="mt-6 border-t-2 border-pink-100 pt-4">
                      <p className="font-nanum-square text-primary-dark mb-3">마음에 드는 주제가 있나요? 선택하여 토론을 시작해보세요!</p>
                      <input
                        type="text"
                        value={debateTopic}
                        onChange={(e) => setDebateTopic(e.target.value)}
                        placeholder="토론하고 싶은 주제를 직접 입력하거나 위에서 선택하세요"
                        className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:ring-primary focus:border-primary font-noto-sans-kr text-lg mb-4"
                      />
                      <button
                        onClick={() => setActiveTab(2)}
                        className="btn-primary py-3 flex items-center justify-center w-full"
                      >
                        <span className="flex items-center">
                          <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                          이 주제로 토론 시작하기
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. 토론 생성하기 */}
            {activeTab === 2 && (
              <div>
                <h2 className="text-2xl font-nanum-square text-primary-dark mb-6 pb-2 border-b-2 border-pink-200">
                  토론 생성하기
                </h2>
                
                <form onSubmit={handleGenerateDebate} className="space-y-4 mb-8">
                  <div>
                    <label htmlFor="topic" className="block text-lg font-nanum-square text-gray-700 mb-2">
                      토론 주제
                    </label>
                    <input
                      type="text"
                      id="topic"
                      value={debateTopic}
                      onChange={(e) => setDebateTopic(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:ring-primary focus:border-primary font-noto-sans-kr text-lg"
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
                        토론 생성 중...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                        토론 시작하기
                      </span>
                    )}
                  </button>
                </form>

                {debateSections.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-nanum-square text-primary-dark mb-6 border-b-2 border-pink-200 pb-2">토론 결과</h3>
                    <div className="space-y-6 font-noto-sans-kr">
                      {debateSections.map((section, index) => (
                        <div key={index} className="mb-4">
                          <h3 className="text-xl font-nanum-square text-gray-700 mb-3">{section.title}</h3>
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
                  <div>
                    <h3 className="text-xl font-nanum-square text-primary-dark mb-4 border-b-2 border-pink-200 pb-2">최근 토론 주제</h3>
                    <ul className="space-y-2 divide-y divide-pink-100">
                      {debateHistory.map((topic, index) => (
                        <li key={index} className="font-noto-sans-kr text-gray-700 text-lg py-2">
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* 4. 찬반 논거 아이디어 */}
            {activeTab === 3 && (
              <div>
                <h2 className="text-2xl font-nanum-square text-primary-dark mb-6 pb-2 border-b-2 border-pink-200">
                  찬반 논거 아이디어
                </h2>
                
                <form onSubmit={handleGenerateArguments} className="space-y-4 mb-8">
                  <div>
                    <label htmlFor="argumentTopic" className="block text-lg font-nanum-square text-gray-700 mb-2">
                      토론 주제
                    </label>
                    <input
                      type="text"
                      id="argumentTopic"
                      value={argumentTopic}
                      onChange={(e) => setArgumentTopic(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:ring-primary focus:border-primary font-noto-sans-kr text-lg"
                      placeholder="논거를 생성할 토론 주제를 입력하세요"
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
                        논거 생성 중...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <UserGroupIcon className="h-5 w-5 mr-2" />
                        논거 생성하기
                      </span>
                    )}
                  </button>
                </form>

                {argumentResult && (
                  <div className="prose max-w-none font-noto-sans-kr">
                    <div dangerouslySetInnerHTML={{ __html: argumentResult.replace(/\n/g, '<br />') }} />
                  </div>
                )}
              </div>
            )}

            {/* 5. 의견 피드백 받기 */}
            {activeTab === 4 && (
              <div>
                <h2 className="text-2xl font-nanum-square text-primary-dark mb-6 pb-2 border-b-2 border-pink-200">
                  의견 피드백 받기
                </h2>
                
                <form onSubmit={handleProvideFeedback} className="space-y-4 mb-8">
                  <div>
                    <label htmlFor="feedbackTopic" className="block text-lg font-nanum-square text-gray-700 mb-2">
                      토론 주제
                    </label>
                    <input
                      type="text"
                      id="feedbackTopic"
                      value={feedbackTopic}
                      onChange={(e) => setFeedbackTopic(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:ring-primary focus:border-primary font-noto-sans-kr text-lg"
                      placeholder="토론 주제를 입력하세요"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="studentArgument" className="block text-lg font-nanum-square text-gray-700 mb-2">
                      나의 의견
                    </label>
                    <textarea
                      id="studentArgument"
                      value={studentArgument}
                      onChange={(e) => setStudentArgument(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:ring-primary focus:border-primary font-noto-sans-kr text-lg"
                      placeholder="이 주제에 대한 자신의 의견을 자유롭게 적어보세요"
                      rows={5}
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
                        피드백 생성 중...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <PencilIcon className="h-5 w-5 mr-2" />
                        피드백 받기
                      </span>
                    )}
                  </button>
                </form>

                {feedbackResult && (
                  <div className="prose max-w-none font-noto-sans-kr bg-pink-50 p-6 rounded-lg">
                    <div dangerouslySetInnerHTML={{ __html: feedbackResult.replace(/\n/g, '<br />') }} />
                  </div>
                )}
              </div>
            )}

            {/* 6. 토론 마무리 활동 */}
            {activeTab === 5 && (
              <div>
                <h2 className="text-2xl font-nanum-square text-primary-dark mb-6 pb-2 border-b-2 border-pink-200">
                  토론 마무리 활동
                </h2>
                
                <div className="mb-8 bg-pink-50 p-6 rounded-lg">
                  <h3 className="text-xl font-nanum-square text-primary-dark mb-4">😀 토론 마무리 활동 TIP! 이렇게 해보세요!</h3>
                  <p className="font-noto-sans-kr text-gray-700 mb-4">토론이 끝난 후에 친구들과 함께 할 수 있는, 생각을 정리하고 나누는 활동이에요.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {/* 팁 1 */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center mb-2">
                        <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">1</div>
                        <h4 className="font-nanum-square text-lg">📝 요약하기</h4>
                      </div>
                      <p className="font-noto-sans-kr text-gray-600 text-sm">토론에서 나온 중요한 생각들을 정리해 봐요.</p>
                    </div>
                    
                    {/* 팁 2 */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center mb-2">
                        <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">2</div>
                        <h4 className="font-nanum-square text-lg">💭 공감하기</h4>
                      </div>
                      <p className="font-noto-sans-kr text-gray-600 text-sm">내 생각과 다른 의견에서도 배울 점을 찾아봐요.</p>
                    </div>
                    
                    {/* 팁 3 */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center mb-2">
                        <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">3</div>
                        <h4 className="font-nanum-square text-lg">❓ 질문하기</h4>
                      </div>
                      <p className="font-noto-sans-kr text-gray-600 text-sm">"왜 그렇게 생각해요?", "예시를 들어줄래요?"</p>
                    </div>
                    
                    {/* 팁 4 */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center mb-2">
                        <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">4</div>
                        <h4 className="font-nanum-square text-lg">🤗 존중하기</h4>
                      </div>
                      <p className="font-noto-sans-kr text-gray-600 text-sm">다른 의견도 소중해요!</p>
                    </div>
                    
                    {/* 팁 5 */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center mb-2">
                        <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">5</div>
                        <h4 className="font-nanum-square text-lg">🌱 마음 열기</h4>
                      </div>
                      <p className="font-noto-sans-kr text-gray-600 text-sm">내 생각이 바뀔 수도 있어요.</p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg mt-4">
                    <p className="font-noto-sans-kr text-blue-700">토론은 정답을 찾는 게 아니라, 여러 생각을 나누는 거예요! 🦉✨</p>
                  </div>
                </div>
                
                {/* 토론 마무리 활동 폼 */}
                {!summaryCompleted ? (
                  <div className="space-y-6">
                    <h3 className="text-xl font-nanum-square text-primary-dark">💬 토론 마무리 활동</h3>
                    <p className="font-noto-sans-kr text-gray-600">토론에서 나온 생각들을 정리하고 새로운 해결책을 찾아보세요.</p>
                    
                    {/* 토론 주제 입력 */}
                    <div>
                      <label htmlFor="finishTopic" className="block text-lg font-nanum-square text-gray-700 mb-2">
                        📌 토론했던 주제는 무엇인가요?
                      </label>
                      <input
                        type="text"
                        id="finishTopic"
                        value={finishTopic}
                        onChange={(e) => setFinishTopic(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:ring-primary focus:border-primary font-noto-sans-kr"
                        placeholder="예: 학교에서 스마트폰 사용 허용 여부"
                      />
                    </div>
                    
                    {/* 찬성/반대 의견 입력 */}
                    <h4 className="text-lg font-nanum-square text-gray-700">📋 토론에서 나온 주요 의견들</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="text-md font-nanum-square text-primary mb-2">💙 찬성 측 의견</h5>
                        <textarea
                          value={proOpinion}
                          onChange={(e) => setProOpinion(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:ring-primary focus:border-primary font-noto-sans-kr mb-4"
                          placeholder="찬성 측의 주요 의견은 무엇이었나요?"
                          rows={4}
                        />
                        
                        <textarea
                          value={proGoodPoints}
                          onChange={(e) => setProGoodPoints(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:ring-primary focus:border-primary font-noto-sans-kr"
                          placeholder="찬성 의견에서 가치 있다고 생각하는 점은?"
                          rows={2}
                        />
                      </div>
                      
                      <div>
                        <h5 className="text-md font-nanum-square text-primary mb-2">💜 반대 측 의견</h5>
                        <textarea
                          value={conOpinion}
                          onChange={(e) => setConOpinion(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:ring-primary focus:border-primary font-noto-sans-kr mb-4"
                          placeholder="반대 측의 주요 의견은 무엇이었나요?"
                          rows={4}
                        />
                        
                        <textarea
                          value={conGoodPoints}
                          onChange={(e) => setConGoodPoints(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:ring-primary focus:border-primary font-noto-sans-kr"
                          placeholder="반대 의견에서 가치 있다고 생각하는 점은?"
                          rows={2}
                        />
                      </div>
                    </div>
                    
                    {/* 공통된 해결책 찾기 */}
                    <div>
                      <label htmlFor="newSolution" className="block text-lg font-nanum-square text-gray-700 mb-2">
                        🌈 함께 만드는 새로운 해결책
                      </label>
                      <textarea
                        id="newSolution"
                        value={newSolution}
                        onChange={(e) => setNewSolution(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:ring-primary focus:border-primary font-noto-sans-kr"
                        placeholder="두 관점의 좋은 점을 모아 새로운 해결책을 만들어 보세요."
                        rows={4}
                      />
                    </div>
                    
                    {/* 성찰하기 */}
                    <div>
                      <label htmlFor="reflection" className="block text-lg font-nanum-square text-gray-700 mb-2">
                        🌱 나의 성장 일기
                      </label>
                      <textarea
                        id="reflection"
                        value={reflection}
                        onChange={(e) => setReflection(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:ring-primary focus:border-primary font-noto-sans-kr"
                        placeholder="토론을 통해 내 생각이 어떻게 변했나요? 무엇을 새롭게 배웠나요?"
                        rows={4}
                      />
                    </div>
                    
                    {/* 정리하기 버튼 */}
                    <div className="flex justify-center mt-8">
                      <button
                        onClick={() => {
                          if (finishTopic) {
                            setSummaryCompleted(true);
                          } else {
                            alert("토론 주제를 입력해주세요!");
                          }
                        }}
                        className="btn-primary py-3 px-8"
                      >
                        🔖 마무리 활동 정리하기
                      </button>
                    </div>
                  </div>
                ) : (
                  /* 정리 결과 보여주기 */
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h3 className="text-xl font-nanum-square text-primary-dark mb-6 text-center">📋 토론 마무리 정리</h3>
                      
                      <div className="mb-6">
                        <h4 className="text-lg font-nanum-square text-gray-700 mb-2">📌 토론 주제</h4>
                        <div className="bg-blue-50 p-4 rounded-lg font-noto-sans-kr">{finishTopic}</div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="text-lg font-nanum-square text-gray-700 mb-2">💙 찬성 측 의견과 가치</h4>
                          <div className="bg-blue-50 p-4 rounded-lg font-noto-sans-kr mb-2">{proOpinion}</div>
                          
                          <h5 className="text-md font-nanum-square text-gray-700 mb-1">가치 있는 점:</h5>
                          <div className="bg-blue-50 p-4 rounded-lg font-noto-sans-kr">{proGoodPoints}</div>
                        </div>
                        
                        <div>
                          <h4 className="text-lg font-nanum-square text-gray-700 mb-2">💜 반대 측 의견과 가치</h4>
                          <div className="bg-blue-50 p-4 rounded-lg font-noto-sans-kr mb-2">{conOpinion}</div>
                          
                          <h5 className="text-md font-nanum-square text-gray-700 mb-1">가치 있는 점:</h5>
                          <div className="bg-blue-50 p-4 rounded-lg font-noto-sans-kr">{conGoodPoints}</div>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="text-lg font-nanum-square text-gray-700 mb-2">🌟 우리가 함께 만든 새로운 해결책</h4>
                        <div className="bg-blue-50 p-4 rounded-lg font-noto-sans-kr">{newSolution}</div>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="text-lg font-nanum-square text-gray-700 mb-2">🌱 나의 성장과 배움</h4>
                        <div className="bg-blue-50 p-4 rounded-lg font-noto-sans-kr">{reflection}</div>
                      </div>
                      
                      {/* 결과 다운로드 버튼 */}
                      <div className="flex justify-center mt-8 space-x-4">
                        <button
                          onClick={() => {
                            // 텍스트 파일 생성 및 다운로드
                            const element = document.createElement("a");
                            const fileContent = `토론 주제: ${finishTopic}
                            
찬성 측 의견:
${proOpinion}

찬성 측 가치 있는 점:
${proGoodPoints}

반대 측 의견:
${conOpinion}

반대 측 가치 있는 점:
${conGoodPoints}

함께 만든 해결책:
${newSolution}

나의 성장과 배움:
${reflection}`;
                            const file = new Blob([fileContent], {type: 'text/plain'});
                            element.href = URL.createObjectURL(file);
                            element.download = "토론마무리_결과.txt";
                            document.body.appendChild(element);
                            element.click();
                          }}
                          className="btn-primary py-2 px-4"
                        >
                          📥 정리 내용 다운로드
                        </button>
                        
                        <button
                          onClick={() => setSummaryCompleted(false)}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-nanum-square py-2 px-4 rounded-md transition duration-300"
                        >
                          ✏️ 내용 수정하기
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 푸터 */}
        <footer className="mt-12 py-6 border-t border-pink-200">
          <div className="text-center text-gray-600 font-noto-sans-kr">
            <p>© 2025 안양 박달초 김문정 ㅣ 
              <a href="https://www.youtube.com/@%EB%B0%B0%EC%9B%80%EC%9D%98%EB%8B%AC%EC%9D%B8-p5v" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-primary-dark hover:underline ml-1">
                유튜브 배움의 달인
              </a>
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
} 