export type FileType = 'pdf' | 'docx' | 'txt';
export type ProcessingStatus = 'ready' | 'processing' | 'error';

export interface DocumentItem {
  id: string;
  name: string;
  fileType: FileType;
  fileSize: string;
  uploadDate: string;
  status: ProcessingStatus;
  pageCount: number;
  overview?: string;
  topics?: string[];
  keywords?: string[];
  summary?: string[];
}

export interface MindMapItem {
  id: string;
  title: string;
  documentId: string;
  documentName: string;
  nodeCount: number;
  lastModified: string;
  coverColor: string;
  previewNodes: string[];
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  plan: string;
  storageUsed: string;
  storageLimit: string;
  documentsCount: number;
  mindmapsCount: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizItem {
  id: string;
  title: string;
  documentTitle: string;
  questionCount: number;
  difficulty: 'ง่าย' | 'ปานกลาง' | 'ยาก';
  questions: QuizQuestion[];
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  tag: string;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  documentTitle: string;
  cardCount: number;
  cards: Flashcard[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'success' | 'info' | 'system';
}

