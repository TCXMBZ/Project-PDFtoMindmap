'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  FileText,
  RefreshCw,
  Copy,
  Check,
  Lightbulb,
  Sparkles
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { initialChatMessages, mockAiResponses } from '@/data/mockChat';
import { mockDocuments } from '@/data/mockDocuments';
import { ChatMessage } from '@/types';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState('doc-1');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const msgCounterRef = useRef(1);

  const currentDoc = mockDocuments.find((d) => d.id === selectedDocId) || mockDocuments[0];

  const suggestedQuestions = [
    'สรุปเนื้อหาทั้งหมดแบบกระชับ',
    'อธิบายความแตกต่างของ Primary Key และ Foreign Key',
    'อธิบายคำสั่ง SQL พื้นฐาน (SELECT, INSERT, UPDATE, DELETE)',
    'ยกตัวอย่างการทำ Normalization 1NF - 3NF'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isTyping) return;

    const msgId = `msg-${msgCounterRef.current++}`;
    const userMsg: ChatMessage = {
      id: msgId,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate smart AI response
    setTimeout(() => {
      let replyText = mockAiResponses[text];
      if (!replyText) {
        if (text.includes('สรุป')) {
          replyText = mockAiResponses['สรุปเนื้อหาทั้งหมดแบบกระชับ'];
        } else if (text.includes('Key') || text.includes('คีย์')) {
          replyText = mockAiResponses['อธิบายความแตกต่างของ Primary Key และ Foreign Key'];
        } else if (text.includes('SQL') || text.includes('คำสั่ง')) {
          replyText = mockAiResponses['อธิบายคำสั่ง SQL พื้นฐาน (SELECT, INSERT, UPDATE, DELETE)'];
        } else {
          replyText = `จากเอกสาร **${currentDoc.name}** ในประเด็นเรื่อง "${text}":\n\nเนื้อหาหลักเน้นย้ำถึงหลักการจัดเก็บข้อมูลอย่างมีประสิทธิภาพ การควบคุมสิทธิ์ของผู้ใช้งาน และการใช้มาตรฐาน SQL ในการเรียกค้นข้อมูลที่มีเงื่อนไขซับซ้อน คุณสามารถสร้าง Mind Map เพื่อเชื่อมโยงเนื้อหานี้ได้ที่หน้า Mind Map Editor ครับ`;
        }
      }

      const aiMsgId = `msg-${msgCounterRef.current++}`;
      const aiMsg: ChatMessage = {
        id: aiMsgId,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.'
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 900);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleClearChat = () => {
    if (confirm('คุณต้องการล้างประวัติการสนทนานี้ใช่หรือไม่?')) {
      setMessages(initialChatMessages);
    }
  };

  return (
    <AppLayout noPadding>
      <div className="flex-1 min-h-0 flex gap-4 p-3 sm:p-5">
        {/* Document Selector Sidebar (Desktop) */}
        <aside className="hidden lg:flex w-72 shrink-0 flex-col gw-panel gw-reveal rounded-2xl overflow-hidden">
          <div className="p-4 border-b gw-divider flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl gw-badge flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-[var(--gw-text)]">เอกสารอ้างอิง</h2>
                <p className="text-[11px] text-[var(--gw-text-muted)]">{mockDocuments.length} ไฟล์พร้อมสนทนา</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {mockDocuments.map((doc) => {
              const isSelected = doc.id === selectedDocId;
              return (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--gw-accent-soft)] border-[var(--gw-accent)] text-[var(--gw-text)]'
                      : 'border-transparent hover:border-[var(--gw-border)] hover:bg-[var(--gw-accent-soft)]/30 text-[var(--gw-text-muted)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-[var(--gw-accent-soft)] text-[var(--gw-accent)]">
                      {doc.fileType}
                    </span>
                    <span className="text-[10px] text-[var(--gw-text-subtle)]">{doc.pageCount} หน้า</span>
                  </div>
                  <p className="text-xs font-semibold text-[var(--gw-text)] line-clamp-1">{doc.name}</p>
                  <p className="text-[11px] text-[var(--gw-text-muted)] line-clamp-2 mt-0.5 leading-relaxed">
                    {doc.overview}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="p-3.5 border-t gw-divider text-[11px] text-[var(--gw-text-muted)] flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[var(--gw-accent)] shrink-0" />
            <span>AI จะตอบคำถามโดยอ้างอิงเนื้อหาจากเอกสารที่เลือก</span>
          </div>
        </aside>

        {/* Main Chat Container */}
        <div className="flex-1 flex flex-col gw-panel gw-reveal rounded-2xl overflow-hidden min-w-0">
          {/* Chat Header */}
          <div
            className="h-[64px] border-b gw-divider px-5 sm:px-6 flex items-center justify-between shrink-0"
            style={{ background: 'rgba(var(--gw-surface-rgb), 0.45)' }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl gw-badge flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[var(--gw-text)]">AI Study Assistant</span>
                  <span className="gw-positive text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--gw-positive)] animate-pulse" />
                    Active
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[var(--gw-text-muted)] truncate">
                  <FileText className="w-3.5 h-3.5 text-[var(--gw-accent)] shrink-0" />
                  <span className="shrink-0">กำลังอ้างอิง:</span>
                  <select
                    value={selectedDocId}
                    onChange={(e) => setSelectedDocId(e.target.value)}
                    aria-label="เลือกเอกสารอ้างอิง"
                    className="max-w-[160px] sm:max-w-xs font-semibold text-[var(--gw-text)] bg-transparent hover:text-[var(--gw-accent)] cursor-pointer focus:outline-none truncate"
                  >
                    {mockDocuments.map((doc) => (
                      <option key={doc.id} value={doc.id} className="bg-[var(--gw-bg)] text-[var(--gw-text)]">
                        {doc.name} ({doc.pageCount} หน้า)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClearChat}
              className="gw-button px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 cursor-pointer shrink-0"
              title="ล้างข้อความ"
              aria-label="ล้างข้อความแชท"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ล้างแชท</span>
            </button>
          </div>

          {/* Message Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 sm:gap-4 ${isAi ? 'items-start' : 'items-start flex-row-reverse'}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white shadow-xs ${
                      isAi ? 'bg-[var(--gw-accent)]' : 'bg-slate-700'
                    }`}
                  >
                    {isAi ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  </div>

                  {/* Bubble Container */}
                  <div className={`max-w-[85%] sm:max-w-[78%] space-y-1.5 ${isAi ? '' : 'text-right'}`}>
                    <div
                      className={`p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line text-left ${
                        isAi
                          ? 'gw-glass text-[var(--gw-text)]'
                          : 'bg-[var(--gw-accent)] text-white shadow-sm'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Timestamp & copy */}
                    <div
                      className={`flex items-center gap-2 text-[10px] text-[var(--gw-text-muted)] px-1 ${
                        isAi ? 'justify-start' : 'justify-end'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {isAi && (
                        <button
                          type="button"
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="hover:text-[var(--gw-accent)] flex items-center gap-1 cursor-pointer"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-[var(--gw-positive)]" />
                              <span>คัดลอกแล้ว</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>คัดลอก</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {/* Suggested action buttons for initial message */}
                    {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="mt-3 pt-2 flex flex-wrap gap-1.5 text-left">
                        {msg.suggestedActions.map((action, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleSend(action)}
                            className="gw-badge px-3 py-1.5 rounded-xl hover:bg-[var(--gw-accent)] hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <Lightbulb className="w-3.5 h-3.5" />
                            {action}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 sm:gap-4 items-start">
                <div className="w-9 h-9 rounded-xl bg-[var(--gw-accent)] flex items-center justify-center shrink-0 text-white shadow-xs">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="gw-glass p-4 rounded-2xl flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--gw-accent)] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[var(--gw-accent)] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-[var(--gw-accent)] animate-bounce [animation-delay:0.4s]" />
                  <span className="text-xs text-[var(--gw-text-muted)] ml-1">AI กำลังวิเคราะห์เอกสาร...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested questions chips above input */}
          <div className="px-4 sm:px-6 pb-2">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-[11px] font-semibold text-[var(--gw-text-muted)] shrink-0">ถามด่วน:</span>
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSend(q)}
                  disabled={isTyping}
                  className="gw-button px-3 py-1 rounded-lg text-xs font-medium shrink-0 cursor-pointer disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <div
            className="p-4 sm:p-5 border-t gw-divider shrink-0"
            style={{ background: 'rgba(var(--gw-surface-rgb), 0.45)' }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <div className="gw-search relative flex-1 rounded-2xl">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="พิมพ์คำถามเกี่ยวกับเอกสารนี้ หรือขอให้ AI สรุปหัวข้อย่อย..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={isTyping}
                  className="w-full h-12 pl-4 pr-4 text-xs sm:text-sm bg-transparent focus:outline-none text-[var(--gw-text)] placeholder-[var(--gw-text-subtle)]"
                />
              </div>

              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className={`h-12 px-5 rounded-2xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
                  inputText.trim() && !isTyping
                    ? 'gw-button-primary shadow-sm cursor-pointer'
                    : 'gw-button opacity-45 cursor-not-allowed'
                }`}
              >
                <span>ส่ง</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
