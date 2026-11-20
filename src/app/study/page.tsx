'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Award,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Play,
  RotateCw,
  HelpCircle,
  Layers,
  ThumbsUp
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { mockQuizzes, mockFlashcardDecks } from '@/data/mockStudy';
import { QuizItem, FlashcardDeck } from '@/types';
import confetti from 'canvas-confetti';

function StudyContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  const [manualTab, setManualTab] = useState<'quizzes' | 'flashcards' | null>(null);
  const activeTab: 'quizzes' | 'flashcards' =
    manualTab ?? (tabParam === 'flashcards' ? 'flashcards' : 'quizzes');
  const setActiveTab = (tab: 'quizzes' | 'flashcards') => setManualTab(tab);

  // Quiz Player State
  const [activeQuiz, setActiveQuiz] = useState<QuizItem | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  // Flashcards Review State
  const [activeDeck, setActiveDeck] = useState<FlashcardDeck | null>(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCardIds, setMasteredCardIds] = useState<Set<string>>(() => new Set());
  const [deckFinished, setDeckFinished] = useState(false);

  const masteredCount = masteredCardIds.size;

  // Trigger confetti on good quiz/deck completion
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        disableForReducedMotion: true
      });
    } catch {
      // safe fallback
    }
  };

  // Start Quiz
  const handleStartQuiz = (quiz: QuizItem) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowExplanation(false);
    setQuizFinished(false);
  };

  // Answer Quiz Option
  const handleSelectOption = (optionIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex
    }));
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (!activeQuiz) return;
    if (currentQuestionIndex < activeQuiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
      triggerConfetti();
    }
  };

  // Calculate Quiz Score
  const calculateScore = () => {
    if (!activeQuiz) return 0;
    let score = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  // Start Flashcard Review
  const handleStartFlashcards = (deck: FlashcardDeck) => {
    setActiveDeck(deck);
    setCardIndex(0);
    setIsFlipped(false);
    setMasteredCardIds(new Set());
    setDeckFinished(false);
  };

  const handleNextCard = (known: boolean) => {
    if (!activeDeck) return;
    const currentCard = activeDeck.cards[cardIndex];
    if (known && currentCard) {
      setMasteredCardIds((prev) => {
        const next = new Set(prev);
        next.add(currentCard.id);
        return next;
      });
    }
    setIsFlipped(false);
    if (cardIndex < activeDeck.cards.length - 1) {
      setCardIndex((c) => c + 1);
    } else {
      setDeckFinished(true);
      if (known) {
        triggerConfetti();
      }
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="gw-panel gw-reveal flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="gw-badge inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                <GraduationCap className="w-3.5 h-3.5" />
                Study Center
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-[var(--gw-text)] mt-1.5 tracking-tight">
              ศูนย์การเรียนรู้และทบทวนบทเรียน
            </h1>
            <p className="text-sm text-[var(--gw-text-muted)] mt-1">
              ฝึกทำแบบทดสอบและทบทวนคำศัพท์ผ่านบัตรคำที่ AI สรุปจากเอกสารของคุณ
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="gw-segment flex items-center p-1.5 rounded-xl self-start sm:self-auto">
            <button
              type="button"
              onClick={() => {
                setActiveTab('quizzes');
                setActiveQuiz(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'quizzes'
                  ? 'gw-segment-active'
                  : 'text-[var(--gw-text-muted)] hover:text-[var(--gw-text)]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              แบบทดสอบ (Quizzes)
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('flashcards');
                setActiveDeck(null);
                setDeckFinished(false);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'flashcards'
                  ? 'gw-segment-active'
                  : 'text-[var(--gw-text-muted)] hover:text-[var(--gw-text)]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              บัตรคำจำลอง (Flashcards)
            </button>
          </div>
        </div>

        {/* ================= QUIZZES SECTION ================= */}
        {activeTab === 'quizzes' && (
          <div>
            {!activeQuiz ? (
              /* Quiz Cards List */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {mockQuizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="gw-panel gw-reveal rounded-2xl p-6 hover:border-[var(--gw-accent)] transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="gw-badge inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold">
                          <Sparkles className="w-3.5 h-3.5" />
                          {quiz.questionCount} ข้อคำถาม
                        </span>
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                            quiz.difficulty === 'ง่าย'
                              ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/20'
                              : quiz.difficulty === 'ปานกลาง'
                              ? 'bg-amber-500/15 text-amber-500 border-amber-500/20'
                              : 'bg-rose-500/15 text-rose-500 border-rose-500/20'
                          }`}
                        >
                          ระดับ: {quiz.difficulty}
                        </span>
                      </div>

                      <h3 className="font-bold text-base text-[var(--gw-text)] mt-2">
                        {quiz.title}
                      </h3>
                      <p className="text-xs text-[var(--gw-text-muted)] mt-1">
                        อ้างอิงจากเอกสาร: <strong className="text-[var(--gw-text)]">{quiz.documentTitle}</strong>
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t gw-divider flex items-center justify-between">
                      <span className="text-xs text-[var(--gw-text-muted)]">สร้างโดย AI • พร้อมทำทันที</span>
                      <button
                        type="button"
                        onClick={() => handleStartQuiz(quiz)}
                        className="gw-button-primary px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5" />
                        Start Quiz
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : quizFinished ? (
              /* Quiz Result Screen */
              <div className="gw-panel gw-reveal rounded-2xl p-8 max-w-xl mx-auto text-center animate-in fade-in duration-200">
                <div className="w-16 h-16 rounded-2xl bg-[var(--gw-accent)] text-white flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Award className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-extrabold text-[var(--gw-text)]">ยอดเยี่ยมมาก!</h2>
                <p className="text-xs text-[var(--gw-text-muted)] mt-1">คุณทำแบบทดสอบเสร็จเรียบร้อยแล้ว</p>

                <div
                  className="my-6 p-6 rounded-2xl border gw-divider"
                  style={{ background: 'rgba(var(--gw-surface-rgb), 0.45)' }}
                >
                  <p className="text-xs text-[var(--gw-text-muted)] font-semibold uppercase">คะแนนของคุณ</p>
                  <p className="text-4xl font-extrabold text-[var(--gw-accent)] mt-2">
                    {calculateScore()} / {activeQuiz.questions.length}
                  </p>
                  <p className="text-xs text-[var(--gw-positive)] font-semibold mt-1">
                    ความแม่นยำ {((calculateScore() / activeQuiz.questions.length) * 100).toFixed(0)}%
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleStartQuiz(activeQuiz)}
                    className="gw-button px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    ทำใหม่อีกครั้ง
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveQuiz(null)}
                    className="gw-button-primary px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    กลับไปรายการแบบทดสอบ
                  </button>
                </div>
              </div>
            ) : (
              /* Active Quiz Question Player */
              <div className="gw-panel gw-reveal rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto">
                {/* Progress bar */}
                <div className="flex items-center justify-between text-xs text-[var(--gw-text-muted)] mb-3">
                  <span className="font-semibold text-[var(--gw-text)]">
                    คำถามข้อที่ {currentQuestionIndex + 1} จาก {activeQuiz.questions.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveQuiz(null)}
                    className="hover:text-[var(--gw-danger)] underline cursor-pointer"
                  >
                    ออกจากการทำแบบทดสอบ
                  </button>
                </div>
                <div
                  className="w-full h-2 rounded-full overflow-hidden mb-6"
                  style={{ background: 'rgba(var(--gw-surface-rgb), 0.5)' }}
                >
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100}%`,
                      background: 'var(--gw-accent)'
                    }}
                  />
                </div>

                {/* Question */}
                <h3 className="text-base sm:text-lg font-bold text-[var(--gw-text)] leading-snug">
                  {activeQuiz.questions[currentQuestionIndex].question}
                </h3>

                {/* Options */}
                <div className="mt-6 space-y-3">
                  {activeQuiz.questions[currentQuestionIndex].options.map((option, idx) => {
                    const isSelected = selectedAnswers[currentQuestionIndex] === idx;
                    const isCorrect = idx === activeQuiz.questions[currentQuestionIndex].correctAnswer;

                    let btnClass =
                      'border-[var(--gw-border)] hover:border-[var(--gw-accent)] text-[var(--gw-text)]';

                    if (showExplanation) {
                      if (isCorrect) {
                        btnClass =
                          'border-[var(--gw-positive)] bg-[var(--gw-positive-bg)] text-[var(--gw-positive)] font-semibold ring-1 ring-[var(--gw-positive)]';
                      } else if (isSelected && !isCorrect) {
                        btnClass =
                          'border-rose-500 bg-rose-500/15 text-rose-500 ring-1 ring-rose-500';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectOption(idx)}
                        disabled={showExplanation}
                        style={
                          !showExplanation
                            ? { background: 'rgba(var(--gw-surface-rgb), 0.45)' }
                            : undefined
                        }
                        className={`w-full p-4 rounded-xl border text-xs sm:text-sm text-left transition-all flex items-center justify-between gap-3 cursor-pointer disabled:cursor-default ${btnClass}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg gw-glass flex items-center justify-center text-xs font-bold shrink-0 text-[var(--gw-text)]">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{option}</span>
                        </div>

                        {showExplanation && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-[var(--gw-positive)] shrink-0" />
                        )}
                        {showExplanation && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Box */}
                {showExplanation && (
                  <div className="mt-5 p-4 rounded-xl bg-[var(--gw-accent-soft)] border border-[var(--gw-accent)]/25 animate-in fade-in duration-200">
                    <p className="font-bold text-xs text-[var(--gw-accent)] flex items-center gap-1.5 mb-1">
                      <HelpCircle className="w-3.5 h-3.5" />
                      คำอธิบายเฉลย:
                    </p>
                    <p className="text-xs text-[var(--gw-text)] leading-relaxed">
                      {activeQuiz.questions[currentQuestionIndex].explanation}
                    </p>
                  </div>
                )}

                {/* Next button */}
                {showExplanation && (
                  <div className="mt-6 pt-4 border-t gw-divider flex justify-end">
                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      className="gw-button-primary px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      {currentQuestionIndex < activeQuiz.questions.length - 1 ? (
                        <>
                          ข้อถัดไป
                          <ChevronRight className="w-4 h-4" />
                        </>
                      ) : (
                        'ดูผลคะแนน'
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= FLASHCARDS SECTION ================= */}
        {activeTab === 'flashcards' && (
          <div>
            {!activeDeck ? (
              /* Deck Cards List */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {mockFlashcardDecks.map((deck) => (
                  <div
                    key={deck.id}
                    className="gw-panel gw-reveal rounded-2xl p-6 hover:border-[var(--gw-accent)] transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="gw-badge inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold">
                          <Layers className="w-3.5 h-3.5" />
                          {deck.cardCount} บัตรคำ
                        </span>
                        <span className="text-[11px] text-[var(--gw-text-muted)]">AI Smart Deck</span>
                      </div>

                      <h3 className="font-bold text-base text-[var(--gw-text)] mt-2">
                        {deck.title}
                      </h3>
                      <p className="text-xs text-[var(--gw-text-muted)] mt-1">
                        จากเอกสาร: <strong className="text-[var(--gw-text)]">{deck.documentTitle}</strong>
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t gw-divider flex items-center justify-between">
                      <span className="text-xs text-[var(--gw-text-muted)]">จำลองแบบ 3D Flip Card</span>
                      <button
                        type="button"
                        onClick={() => handleStartFlashcards(deck)}
                        className="gw-button-primary px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        Start Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : deckFinished ? (
              /* Flashcard Deck Completion Screen */
              <div className="gw-panel gw-reveal rounded-2xl p-8 max-w-xl mx-auto text-center animate-in fade-in duration-200">
                <div className="w-16 h-16 rounded-2xl bg-[var(--gw-accent)] text-white flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Award className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-extrabold text-[var(--gw-text)]">ทบทวนครบทุกใบแล้ว!</h2>
                <p className="text-xs text-[var(--gw-text-muted)] mt-1">{activeDeck.title}</p>

                <div
                  className="my-6 p-6 rounded-2xl border gw-divider"
                  style={{ background: 'rgba(var(--gw-surface-rgb), 0.45)' }}
                >
                  <p className="text-xs text-[var(--gw-text-muted)] font-semibold uppercase">บัตรคำที่จำได้</p>
                  <p className="text-4xl font-extrabold text-[var(--gw-accent)] mt-2">
                    {masteredCount} / {activeDeck.cards.length}
                  </p>
                  <p className="text-xs text-[var(--gw-positive)] font-semibold mt-1">
                    ความเข้าใจ {activeDeck.cards.length > 0 ? ((masteredCount / activeDeck.cards.length) * 100).toFixed(0) : 0}%
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleStartFlashcards(activeDeck)}
                    className="gw-button px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    ทบทวนอีกครั้ง
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveDeck(null);
                      setDeckFinished(false);
                    }}
                    className="gw-button-primary px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    กลับไปหน้ารวมสำรับ
                  </button>
                </div>
              </div>
            ) : (
              /* Active Flashcard Viewer */
              <div className="max-w-xl mx-auto space-y-5">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveDeck(null)}
                    className="text-xs text-[var(--gw-text-muted)] hover:text-[var(--gw-text)] flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    กลับไปหน้ารวมสำรับ
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="gw-positive text-xs font-semibold px-2.5 py-1 rounded-full">
                      จำได้แล้ว {masteredCount}
                    </span>
                    <span className="gw-badge text-xs font-semibold px-3 py-1 rounded-full">
                      บัตรที่ {cardIndex + 1} / {activeDeck.cards.length}
                    </span>
                  </div>
                </div>

                {/* 3D Flip Card */}
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="gw-panel w-full h-80 rounded-2xl p-8 hover:border-[var(--gw-accent)] cursor-pointer transition-all duration-300 flex flex-col justify-between text-center select-none group relative overflow-hidden"
                >
                  <div className="flex items-center justify-between text-xs text-[var(--gw-text-muted)]">
                    <span className="gw-badge px-2.5 py-0.5 rounded-md font-semibold text-[11px]">
                      #{activeDeck.cards[cardIndex].tag}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-[var(--gw-accent)] group-hover:underline">
                      <RotateCw className="w-3.5 h-3.5" />
                      คลิกเพื่อพลิกดู{isFlipped ? 'ด้านหน้า' : 'คำอธิบาย'}
                    </span>
                  </div>

                  <div className="my-auto px-4">
                    {!isFlipped ? (
                      <div className="space-y-2 animate-in fade-in">
                        <span className="text-xs text-[var(--gw-text-muted)] uppercase tracking-wider font-semibold">
                          คำศัพท์ / หัวข้อ
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-[var(--gw-text)]">
                          {activeDeck.cards[cardIndex].front}
                        </h3>
                      </div>
                    ) : (
                      <div className="space-y-2 animate-in fade-in">
                        <span className="text-xs text-[var(--gw-positive)] uppercase tracking-wider font-semibold">
                          ความหมายและคำอธิบาย
                        </span>
                        <p className="text-sm sm:text-base text-[var(--gw-text)] leading-relaxed">
                          {activeDeck.cards[cardIndex].back}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="text-[11px] text-[var(--gw-text-muted)]">
                    {isFlipped ? 'ด้านหลัง (คำเฉลย)' : 'ด้านหน้า (โจทย์)'}
                  </div>
                </div>

                {/* Bottom Navigation Buttons */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleNextCard(false)}
                    className="gw-button flex-1 py-3 rounded-xl hover:border-amber-400 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 text-[var(--gw-warning)]" />
                    ต้องทบทวนอีกครั้ง
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNextCard(true)}
                    className="gw-button-primary flex-1 py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    จำได้แล้ว (ถัดไป)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default function StudyCenterPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[var(--gw-text-muted)]">กำลังโหลด Study Center...</div>}>
      <StudyContent />
    </Suspense>
  );
}
