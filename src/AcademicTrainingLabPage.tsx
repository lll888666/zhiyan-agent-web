import { useMemo, useState } from 'react';
import {
  errorCaseList,
  trainingFaqList,
  trainingQuizList,
  type FAQCategory,
  type TrainingLabTab,
} from './training-lab-data';
import UnifiedPageHeader from './components/UnifiedPageHeader';
import './academic-training-lab.css';

const tabs: Array<{ key: TrainingLabTab; label: string }> = [
  { key: 'qa', label: '学术规范问答' },
  { key: 'cases', label: '错误案例辨析' },
  { key: 'quiz', label: '科研避坑挑战题' },
];

function AcademicTrainingLabPage() {
  const [activeTab, setActiveTab] = useState<TrainingLabTab>('qa');
  const [selectedCategory, setSelectedCategory] = useState<'全部' | FAQCategory>('全部');
  const [expandedMap, setExpandedMap] = useState<Record<number, boolean>>({});
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});

  const categories = useMemo(() => {
    return ['全部', ...Array.from(new Set(trainingFaqList.map((item) => item.category)))] as const;
  }, []);

  const filteredFaq = useMemo(() => {
    if (selectedCategory === '全部') {
      return trainingFaqList.map((item, index) => ({ item, index }));
    }
    return trainingFaqList
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => item.category === selectedCategory);
  }, [selectedCategory]);

  const score = useMemo(() => {
    return trainingQuizList.reduce((sum, item, index) => {
      return quizAnswers[index] === item.correct_answer ? sum + 1 : sum;
    }, 0);
  }, [quizAnswers]);

  const answeredCount = useMemo(() => Object.keys(quizAnswers).length, [quizAnswers]);

  const toggleAnswer = (index: number) => {
    setExpandedMap((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    setQuizAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
  };

  return (
    <main className="container">
      <UnifiedPageHeader
        tag="Academic Training Lab"
        title="科研规范训练场"
        subtitle="面向本科生科研写作与规范训练的学习、自测与辨析空间"
        links={[
          { to: '/report', label: '返回智能优化报告' },
          { to: '/revision-viewer', label: '可解释润色查看器' },
          { to: '/risk-radar', label: '科研风险雷达面板' },
        ]}
      />

      <section className="panel lab-overview-panel">
        <div className="lab-overview-grid">
          <article className="lab-overview-item">
            <h2>学习问答</h2>
            <p>围绕摘要、文献、图表、结论与学术诚信快速建立规范意识。</p>
          </article>
          <article className="lab-overview-item">
            <h2>案例辨析</h2>
            <p>通过常见错误与推荐改法对照，训练科研写作判断力。</p>
          </article>
          <article className="lab-overview-item">
            <h2>避坑挑战</h2>
            <p>单选题即时反馈，帮助你把“知道规范”转化为“会用规范”。</p>
          </article>
        </div>
      </section>

      <section className="panel">
        <div className="lab-tabs" role="tablist" aria-label="科研规范训练场标签页">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.key}
              className={`lab-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {activeTab === 'qa' ? (
        <section className="panel">
          <div className="lab-section-head">
            <h2>学术规范问答</h2>
            <p>{filteredFaq.length} 条内容</p>
          </div>

          <div className="lab-category-list" role="group" aria-label="问答分类筛选">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`lab-category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="qa-list">
            {filteredFaq.map(({ item, index }) => {
              const expanded = expandedMap[index] ?? false;
              return (
                <article key={`${item.question}-${index}`} className="qa-card">
                  <div className="qa-card-head">
                    <div>
                      <p className="qa-category">{item.category}</p>
                      <h3>{item.question}</h3>
                    </div>
                    <button type="button" className="lab-toggle-btn" onClick={() => toggleAnswer(index)}>
                      {expanded ? '收起答案' : '展开答案'}
                    </button>
                  </div>
                  {expanded ? <p className="qa-answer">{item.answer}</p> : null}
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      {activeTab === 'cases' ? (
        <section className="panel">
          <div className="lab-section-head">
            <h2>错误案例辨析</h2>
            <p>{errorCaseList.length} 个典型案例</p>
          </div>

          <div className="case-grid">
            {errorCaseList.map((item, index) => (
              <article key={`case-${index}`} className="case-card">
                <h3>案例 {index + 1}</h3>

                <div className="case-block case-block-wrong">
                  <h4>错误表达</h4>
                  <p>{item.wrong_text}</p>
                </div>

                <div className="case-block">
                  <h4>问题分析</h4>
                  <p>{item.problem_analysis}</p>
                </div>

                <div className="case-block case-block-better">
                  <h4>推荐改法</h4>
                  <p>{item.better_version}</p>
                </div>

                <p className="case-rule">
                  <strong>对应规则：</strong>
                  {item.related_rule}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {activeTab === 'quiz' ? (
        <section className="panel">
          <div className="lab-section-head">
            <h2>科研避坑挑战题</h2>
            <p>
              已作答 {answeredCount} / {trainingQuizList.length}
            </p>
          </div>

          <div className="quiz-list">
            {trainingQuizList.map((item, questionIndex) => {
              const selected = quizAnswers[questionIndex];
              const answered = selected !== undefined;
              const isCorrect = answered && selected === item.correct_answer;

              return (
                <article key={`quiz-${questionIndex}`} className="quiz-card">
                  <h3>
                    {questionIndex + 1}. {item.question}
                  </h3>

                  <div className="quiz-options">
                    {item.options.map((option, optionIndex) => (
                      <button
                        key={`${questionIndex}-${option}`}
                        type="button"
                        className={`quiz-option ${selected === optionIndex ? 'selected' : ''}`}
                        onClick={() => handleSelectOption(questionIndex, optionIndex)}
                      >
                        {String.fromCharCode(65 + optionIndex)}. {option}
                      </button>
                    ))}
                  </div>

                  {answered ? (
                    <div className={`quiz-feedback ${isCorrect ? 'correct' : 'wrong'}`}>
                      <p className="quiz-feedback-title">{isCorrect ? '回答正确' : '回答错误'}</p>
                      <p>
                        <strong>解析：</strong>
                        {item.explanation}
                      </p>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>

          <div className="quiz-footer">
            <p className="quiz-score">
              当前得分：{score} / {trainingQuizList.length}
            </p>
            <button type="button" className="import-btn" onClick={handleResetQuiz}>
              重新开始挑战
            </button>
          </div>
        </section>
      ) : null}
    </main>
  );
}

export default AcademicTrainingLabPage;
