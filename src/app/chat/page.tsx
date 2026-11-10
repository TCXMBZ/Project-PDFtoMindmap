'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  FileText,
  ChevronDown,
  RefreshCw,
  Copy,
  Check,
  Lightbulb,
  CornerDownLeft
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

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
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
        // Dynamic smart response based on text keywords
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

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
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
      <div className="h-[calc(100vh-68px)] flex flex-col bg-[#F7F8FC]">
        {/* Chat Header */}
        <div className="h-[64px] bg-white border-b border-[#E9E9F1] px-5 sm:px-7 flex items-center justify-between shrink-0 shadow-xs z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#6558E8] flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#202033]">AI Study Assistant</span>
                <span className="text-[10px] font-semibold text-[#18A979] bg-[#18A979]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#18A979] animate-pulse" />
                  Active
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#85859A]">
                <FileText className="w-3.5 h-3.5 text-[#6558E8]" />
                <span>กำลังอ้างอิง:</span>
                <select
                  value={selectedDocId}
                  onChange={(e) => setSelectedDocId(e.target.value)}
                  className="font-semibold text-[#202033] bg-transparent hover:text-[#6558E8] cursor-pointer focus:outline-none"
                >
                  {mockDocuments.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} ({doc.pageCount} หน้า)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={handleClearChat}
            className="p-2 rounded-xl text-[#85859A] hover:text-[#202033] hover:bg-[#F7F8FC] border border-[#E9E9F1] text-xs flex items-center gap-1.5"
            title="ล้างข้อความ"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ล้างแชท</span>
          </button>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-6 max-w-4xl mx-auto w-full">
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
                    isAi
                      ? 'bg-gradient-to-tr from-[#6558E8] to-[#8B7CF6]'
                      : 'bg-[#202033]'
                  }`}
                >
                  {isAi ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>

                {/* Bubble Container */}
                <div className={`max-w-[85%] sm:max-w-[78%] space-y-1.5 ${isAi ? '' : 'text-right'}`}>
                  <div
                    className={`p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line text-left ${
                      isAi
                        ? 'bg-white border border-[#E9E9F1] text-[#202033] shadow-xs'
                        : 'bg-[#6558E8] text-white shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Timestamp & copy */}
                  <div
                    className={`flex items-center gap-2 text-[10px] text-[#85859A] px-1 ${
                      isAi ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {isAi && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="hover:text-[#6558E8] flex items-center gap-1"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-[#18A979]" />
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
                          onClick={() => handleSend(action)}
                          className="px-3 py-1.5 rounded-xl bg-[#F0EFFF] hover:bg-[#E7E4FE] text-[#6558E8] text-xs font-medium border border-[#6558E8]/20 transition-colors flex items-center gap-1.5"
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
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6558E8] to-[#8B7CF6] flex items-center justify-center shrink-0 text-white shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#E9E9F1] shadow-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#6558E8] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[#6558E8] animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-[#6558E8] animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs text-[#85859A] ml-1">AI กำลังวิเคราะห์เอกสาร...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested questions chips above input */}
        <div className="px-4 sm:px-6 max-w-4xl mx-auto w-full pb-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-semibold text-[#85859A] shrink-0">ถามด่วน:</span>
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                disabled={isTyping}
                className="px-3 py-1 rounded-lg bg-white border border-[#E9E9F1] hover:border-[#6558E8] hover:text-[#6558E8] text-[#4A4A68] text-xs font-medium shrink-0 transition-colors shadow-2xs"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#E9E9F1] shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="max-w-4xl mx-auto flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                placeholder="พิมพ์คำถามเกี่ยวกับเอกสารนี้ หรือขอให้ AI สรุปหัวข้อย่อย..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isTyping}
                className="w-full h-12 pl-4 pr-10 text-xs sm:text-sm bg-[#F7F8FC] border border-[#E9E9F1] rounded-2xl focus:outline-none focus:border-[#6558E8] focus:bg-white text-[#202033] placeholder-[#85859A]"
              />
            </div>

            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className={`h-12 px-5 rounded-2xl text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
                inputText.trim() && !isTyping
                  ? 'bg-[#6558E8] hover:bg-[#5548D8] shadow-sm'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              <span>ส่ง</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}

