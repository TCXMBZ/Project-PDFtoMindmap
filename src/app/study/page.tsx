'use client';

import React, { useState, useEffect, Suspense } from 'react';
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
  Flame,
  Clock,
  ArrowRight,
  Play,
  RotateCw,
  HelpCircle,
  Layers,
  ThumbsUp,
  RefreshCw
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { mockQuizzes, mockFlashcardDecks } from '@/data/mockStudy';
import { QuizItem, FlashcardDeck } from '@/types';
import confetti from 'canvas-confetti';

function StudyContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState<'quizzes' | 'flashcards'>(
    tabParam === 'flashcards' ? 'flashcards' : 'quizzes'
  );

  // Sync tab with URL search parameter if present
  useEffect(() => {
    if (tabParam === 'flashcards') {
      setActiveTab('flashcards');
    } else if (tabParam === 'quizzes') {
      setActiveTab('quizzes');
    }
  }, [tabParam]);

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
  const [masteredCount, setMasteredCount] = useState(0);

  // Trigger confetti on good quiz completion
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
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
    setMasteredCount(0);
  };

  const handleNextCard = (known: boolean) => {
    if (known) setMasteredCount((c) => c + 1);
    setIsFlipped(false);
    if (!activeDeck) return;
    if (cardIndex < activeDeck.cards.length - 1) {
      setCardIndex((c) => c + 1);
    } else {
      triggerConfetti();
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E9E9F1] shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F0EFFF] text-[#6558E8]">
                🎓 Study Center
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#202033] mt-1 tracking-tight">
              ศูนย์การเรียนรู้และทบทวนบทเรียน
            </h1>
            <p className="text-sm text-[#85859A] mt-1">
              ฝึกทำแบบทดสอบและทบทวนคำศัพท์ผ่านบัตรคำที่ AI สรุปจากเอกสารของคุณ
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center bg-[#F7F8FC] p-1.5 rounded-xl border border-[#E9E9F1] self-start sm:self-auto">
            <button
              onClick={() => {
                setActiveTab('quizzes');
                setActiveQuiz(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'quizzes'
                  ? 'bg-white text-[#6558E8] shadow-xs'
                  : 'text-[#85859A] hover:text-[#202033]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              แบบทดสอบ (Quizzes)
            </button>
            <button
              onClick={() => {
                setActiveTab('flashcards');
                setActiveDeck(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'flashcards'
                  ? 'bg-white text-[#6558E8] shadow-xs'
                  : 'text-[#85859A] hover:text-[#202033]'
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
                    className="bg-white rounded-2xl p-6 border border-[#E9E9F1] shadow-xs hover:shadow-md hover:border-[#6558E8]/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#F0EFFF] text-[#6558E8]">
                          <Sparkles className="w-3.5 h-3.5" />
                          {quiz.questionCount} ข้อคำถาม
                        </span>
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                            quiz.difficulty === 'ง่าย'
                              ? 'bg-emerald-50 text-emerald-600'
                              : quiz.difficulty === 'ปานกลาง'
                              ? 'bg-amber-50 text-amber-600'
                              : 'bg-red-50 text-red-600'
                          }`}
                        >
                          ระดับ: {quiz.difficulty}
                        </span>
                      </div>

                      <h3 className="font-bold text-base text-[#202033] mt-2">
                        {quiz.title}
                      </h3>
                      <p className="text-xs text-[#85859A] mt-1">
                        อ้างอิงจากเอกสาร: <strong>{quiz.documentTitle}</strong>
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#E9E9F1] flex items-center justify-between">
                      <span className="text-xs text-[#85859A]">สร้างโดย AI • พร้อมทำทันที</span>
                      <button
                        onClick={() => handleStartQuiz(quiz)}
                        className="px-5 py-2 rounded-xl bg-[#6558E8] text-white text-xs font-semibold hover:bg-[#5548D8] transition-all flex items-center gap-1.5 shadow-xs"
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
              <div className="bg-white rounded-2xl border border-[#E9E9F1] p-8 max-w-xl mx-auto text-center shadow-md animate-in fade-in duration-200">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#6558E8] to-[#8B7CF6] text-white flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Award className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-extrabold text-[#202033]">ยอดเยี่ยมมาก!</h2>
                <p className="text-xs text-[#85859A] mt-1">คุณทำแบบทดสอบเสร็จเรียบร้อยแล้ว</p>

                <div className="my-6 p-6 rounded-2xl bg-[#F7F8FC] border border-[#E9E9F1]">
                  <p className="text-xs text-[#85859A] font-semibold uppercase">คะแนนของคุณ</p>
                  <p className="text-4xl font-extrabold text-[#6558E8] mt-2">
                    {calculateScore()} / {activeQuiz.questions.length}
                  </p>
                  <p className="text-xs text-[#18A979] font-medium mt-1">
                    ความแม่นยำ {(calculateScore() / activeQuiz.questions.length * 100).toFixed(0)}%
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => handleStartQuiz(activeQuiz)}
                    className="px-5 py-2.5 rounded-xl border border-[#E9E9F1] hover:bg-[#F7F8FC] text-xs font-semibold text-[#4A4A68] flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    ทำใหม่อีกครั้ง
                  </button>
                  <button
                    onClick={() => setActiveQuiz(null)}
                    className="px-6 py-2.5 rounded-xl bg-[#6558E8] hover:bg-[#5548D8] text-white text-xs font-semibold flex items-center gap-1.5"
                  >
                    กลับไปรายการแบบทดสอบ
                  </button>
                </div>
              </div>
            ) : (
              /* Active Quiz Question Player */
              <div className="bg-white rounded-2xl border border-[#E9E9F1] p-6 sm:p-8 max-w-2xl mx-auto shadow-xs">
                {/* Progress bar */}
                <div className="flex items-center justify-between text-xs text-[#85859A] mb-3">
                  <span className="font-semibold text-[#202033]">
                    คำถามข้อที่ {currentQuestionIndex + 1} จาก {activeQuiz.questions.length}
                  </span>
                  <button
                    onClick={() => setActiveQuiz(null)}
                    className="hover:text-red-500 underline"
                  >
                    ออกจากการทำแบบทดสอบ
                  </button>
                </div>
                <div className="w-full bg-[#E9E9F1] h-2 rounded-full overflow-hidden mb-6">
                  <div
                    className="bg-[#6558E8] h-full transition-all duration-300"
                    style={{
                      width: `${((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100}%`
                    }}
                  />
                </div>

                {/* Question */}
                <h3 className="text-base sm:text-lg font-bold text-[#202033] leading-snug">
                  {activeQuiz.questions[currentQuestionIndex].question}
                </h3>

                {/* Options */}
                <div className="mt-6 space-y-3">
                  {activeQuiz.questions[currentQuestionIndex].options.map((option, idx) => {
                    const isSelected = selectedAnswers[currentQuestionIndex] === idx;
                    const isCorrect = idx === activeQuiz.questions[currentQuestionIndex].correctAnswer;

                    let btnClass = 'border-[#E9E9F1] bg-[#F7F8FC] hover:border-[#6558E8] text-[#202033]';

                    if (showExplanation) {
                      if (isCorrect) {
                        btnClass = 'border-[#18A979] bg-emerald-50 text-emerald-800 font-semibold ring-1 ring-[#18A979]';
                      } else if (isSelected && !isCorrect) {
                        btnClass = 'border-red-400 bg-red-50 text-red-800 ring-1 ring-red-400';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={showExplanation}
                        className={`w-full p-4 rounded-xl border text-xs sm:text-sm text-left transition-all flex items-center justify-between gap-3 ${btnClass}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-white border border-[#E9E9F1] flex items-center justify-center text-xs font-bold shrink-0">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{option}</span>
                        </div>

                        {showExplanation && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-[#18A979] shrink-0" />
                        )}
                        {showExplanation && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Box */}
                {showExplanation && (
                  <div className="mt-5 p-4 rounded-xl bg-[#F0EFFF] border border-[#6558E8]/20 animate-in fade-in duration-200">
                    <p className="font-bold text-xs text-[#6558E8] flex items-center gap-1.5 mb-1">
                      <HelpCircle className="w-3.5 h-3.5" />
                      คำอธิบายเฉลย:
                    </p>
                    <p className="text-xs text-[#383852] leading-relaxed">
                      {activeQuiz.questions[currentQuestionIndex].explanation}
                    </p>
                  </div>
                )}

                {/* Next button */}
                {showExplanation && (
                  <div className="mt-6 pt-4 border-t border-[#E9E9F1] flex justify-end">
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-2.5 rounded-xl bg-[#6558E8] hover:bg-[#5548D8] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
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
                    className="bg-white rounded-2xl p-6 border border-[#E9E9F1] shadow-xs hover:shadow-md hover:border-[#6558E8]/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#F0EFFF] text-[#6558E8]">
                          <Layers className="w-3.5 h-3.5" />
                          {deck.cardCount} บัตรคำ
                        </span>
                        <span className="text-[11px] text-[#85859A]">AI Smart Deck</span>
                      </div>

                      <h3 className="font-bold text-base text-[#202033] mt-2">
                        {deck.title}
                      </h3>
                      <p className="text-xs text-[#85859A] mt-1">
                        จากเอกสาร: <strong>{deck.documentTitle}</strong>
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#E9E9F1] flex items-center justify-between">
                      <span className="text-xs text-[#85859A]">จำลองแบบ 3D Flip Card</span>
                      <button
                        onClick={() => handleStartFlashcards(deck)}
                        className="px-5 py-2 rounded-xl bg-[#6558E8] text-white text-xs font-semibold hover:bg-[#5548D8] transition-all flex items-center gap-1.5 shadow-xs"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        Start Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Active Flashcard Viewer */
              <div className="max-w-xl mx-auto space-y-5">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setActiveDeck(null)}
                    className="text-xs text-[#85859A] hover:text-[#202033] flex items-center gap-1 font-semibold"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    กลับไปหน้ารวมสำรับ
                  </button>
                  <span className="text-xs font-semibold text-[#6558E8] bg-[#F0EFFF] px-3 py-1 rounded-full">
                    บัตรที่ {cardIndex + 1} / {activeDeck.cards.length}
                  </span>
                </div>

                {/* 3D Flip Card */}
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="w-full h-80 rounded-2xl p-8 bg-white border border-[#E9E9F1] shadow-md hover:shadow-xl cursor-pointer transition-all duration-300 flex flex-col justify-between text-center select-none group relative overflow-hidden"
                >
                  <div className="flex items-center justify-between text-xs text-[#85859A]">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#F7F8FC] border border-[#E9E9F1] font-semibold text-[11px] text-[#6558E8]">
                      #{activeDeck.cards[cardIndex].tag}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-[#6558E8] group-hover:underline">
                      <RotateCw className="w-3.5 h-3.5" />
                      คลิกเพื่อพลิกดู{isFlipped ? 'ด้านหน้า' : 'คำอธิบาย'}
                    </span>
                  </div>

                  <div className="my-auto px-4">
                    {!isFlipped ? (
                      <div className="space-y-2 animate-in fade-in">
                        <span className="text-xs text-[#85859A] uppercase tracking-wider font-semibold">
                          คำศัพท์ / หัวข้อ
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#202033]">
                          {activeDeck.cards[cardIndex].front}
                        </h3>
                      </div>
                    ) : (
                      <div className="space-y-2 animate-in fade-in">
                        <span className="text-xs text-[#18A979] uppercase tracking-wider font-semibold">
                          ความหมายและคำอธิบาย
                        </span>
                        <p className="text-sm sm:text-base text-[#383852] leading-relaxed">
                          {activeDeck.cards[cardIndex].back}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="text-[11px] text-[#85859A]">
                    {isFlipped ? 'ด้านหลัง (คำเฉลย)' : 'ด้านหน้า (โจทย์)'}
                  </div>
                </div>

                {/* Bottom Navigation Buttons */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    onClick={() => handleNextCard(false)}
                    className="flex-1 py-3 rounded-xl border border-[#E9E9F1] bg-white hover:bg-amber-50 hover:border-amber-300 text-xs font-semibold text-[#4A4A68] transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4 text-[#F4AD43]" />
                    ต้องทบทวนอีกครั้ง
                  </button>

                  <button
                    onClick={() => handleNextCard(true)}
                    className="flex-1 py-3 rounded-xl bg-[#6558E8] hover:bg-[#5548D8] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
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
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#85859A]">กำลังโหลด Study Center...</div>}>
      <StudyContent />
    </Suspense>
  );
}
