import { QuizItem, FlashcardDeck } from '@/types';

export const mockQuizzes: QuizItem[] = [
  {
    id: 'quiz-1',
    title: 'แบบทดสอบ: สถาปัตยกรรมระบบฐานข้อมูล และ SQL',
    documentTitle: 'Database System.pdf',
    questionCount: 4,
    difficulty: 'ปานกลาง',
    questions: [
      {
        id: 'q1',
        question: 'ข้อใดคือคุณสมบัติที่สำคัญที่สุดของ Primary Key ในระบบฐานข้อมูลเชิงสัมพันธ์?',
        options: [
          'ค่าสามารถซ้ำกันได้หากอยู่ในคนละ Table',
          'ต้องเป็นค่าเฉพาะเจาะจง (Unique) และห้ามเป็นค่าว่าง (NOT NULL)',
          'ต้องเป็นชนิดข้อมูลตัวเลขเท่านั้น (Integer Only)',
          'ต้องเชื่อมโยงไปยังตารางอื่นเสมอ'
        ],
        correctAnswer: 1,
        explanation: 'Primary Key ต้องเป็น Unique เพื่อระบุตัวตนของแต่ละแถวข้อมูลได้อย่างแม่นยำ และต้องไม่เป็นค่าว่าง (NOT NULL)'
      },
      {
        id: 'q2',
        question: 'คำสั่ง SQL ใดที่ใช้ในการแก้ไขค่าข้อมูลที่มีอยู่ในตาราง?',
        options: ['MODIFY', 'CHANGE', 'UPDATE', 'ALTER'],
        correctAnswer: 2,
        explanation: 'คำสั่ง UPDATE ใช้สำหรับปรับปรุงข้อมูลในแถว (Data Manipulation) ส่วน ALTER ใช้สำหรับแก้โครงสร้างตาราง (Data Definition)'
      },
      {
        id: 'q3',
        question: 'ตัวอักษร "I" ในคุณสมบัติ ACID ของธุรกรรมฐานข้อมูล ย่อมาจากอะไร?',
        options: ['Integrity', 'Isolation', 'Index', 'Iteration'],
        correctAnswer: 1,
        explanation: 'Isolation หมายถึงแต่ละธุรกรรมจะถูกประมวลผลแยกอิสระจากกัน ไม่รบกวนกันแม้ทำงานพร้อมกัน'
      },
      {
        id: 'q4',
        question: 'การจัดตารางให้อยู่ในรูปแบบ First Normal Form (1NF) ต้องปฏิบัติตามกฎใด?',
        options: [
          'ทุกคอลัมน์ต้องเป็นค่าเดี่ยว (Atomic Values) และไม่มี Repeating Groups',
          'ต้องไม่มี Transitive Dependency',
          'ต้องมีตารางแยกอย่างน้อย 3 ตาราง',
          'ต้องสร้าง Index ให้ครบทุกคอลัมน์'
        ],
        correctAnswer: 0,
        explanation: '1NF กำหนดให้ข้อมูลในแต่ละช่อง (Field) ต้องเป็นค่าเดี่ยวแบ่งแยกย่อยไม่ได้อีก (Atomic) และไม่มีกลุ่มข้อมูลที่ซ้ำกัน'
      }
    ]
  },
  {
    id: 'quiz-2',
    title: 'แบบทดสอบ: OSI 7 Layers และโปรโตคอลเครือข่าย',
    documentTitle: 'Network Fundamentals.pdf',
    questionCount: 3,
    difficulty: 'ง่าย',
    questions: [
      {
        id: 'q2-1',
        question: 'โปรโตคอล HTTP, DNS และ FTP ทำงานอยู่ที่ชั้น (Layer) ใดของแบบจำลอง OSI?',
        options: ['Transport Layer', 'Network Layer', 'Data Link Layer', 'Application Layer'],
        correctAnswer: 3,
        explanation: 'HTTP, DNS, FTP เป็นโปรโตคอลในระดับ Application Layer (Layer 7) ซึ่งติดต่อกับโปรแกรมของผู้ใช้งานโดยตรง'
      },
      {
        id: 'q2-2',
        question: 'ข้อใดคือความแตกต่างสำคัญระหว่าง TCP และ UDP?',
        options: [
          'TCP เป็น Connection-oriented ที่มีการตรวจสอบความถูกต้อง ส่วน UDP เป็น Connectionless เน้นความเร็ว',
          'TCP เร็วกว่า UDP เสมอ',
          'UDP ใช้เฉพาะกับสาย LAN เท่านั้น',
          'TCP ส่งข้อมูลแบบ Broadcast เท่านั้น'
        ],
        correctAnswer: 0,
        explanation: 'TCP ตรวจสอบว่าปลายทางได้รับข้อมูลครบถ้วนผ่าน Handshake เหมาะกับไฟล์และเว็บ ส่วน UDP เน้นส่งเร็วเหมาะกับการสตรีมและเล่นเกม'
      },
      {
        id: 'q2-3',
        question: 'อุปกรณ์ Router ทำงานอยู่ในชั้นใดของ OSI 7 Layers?',
        options: ['Layer 1 (Physical)', 'Layer 2 (Data Link)', 'Layer 3 (Network)', 'Layer 4 (Transport)'],
        correctAnswer: 2,
        explanation: 'Router ทำงานที่ Network Layer (Layer 3) โดยใช้ IP Address ในการค้นหาและส่งต่อเส้นทางข้อมูล'
      }
    ]
  }
];

export const mockFlashcardDecks: FlashcardDeck[] = [
  {
    id: 'deck-1',
    title: 'คำศัพท์และคำสั่งสำคัญ Database System',
    documentTitle: 'Database System.pdf',
    cardCount: 6,
    cards: [
      {
        id: 'c1',
        front: 'Primary Key (PK)',
        back: 'คีย์หลักที่กำหนดให้แต่ละระเบียน (Row) มีค่าเฉพาะเจาะจงไม่ซ้ำกัน และห้ามเป็นค่า NULL เพื่อใช้อ้างอิงตัวตน',
        tag: 'Database'
      },
      {
        id: 'c2',
        front: 'Foreign Key (FK)',
        back: 'คีย์นอกที่ใช้เชื่อมโยงความสัมพันธ์ไปยัง Primary Key ของอีกตารางหนึ่ง เพื่อรักษา Referential Integrity',
        tag: 'Database'
      },
      {
        id: 'c3',
        front: 'SELECT Statement',
        back: 'คำสั่งในภาษา SQL ที่ใช้สำหรับดึงข้อมูล (Query) จากตาราง สามารถระบุเงื่อนไขด้วย WHERE, GROUP BY, ORDER BY',
        tag: 'SQL'
      },
      {
        id: 'c4',
        front: 'ACID Properties',
        back: 'คุณสมบัติ 4 ประการของ Transaction: Atomicity (ทำหมดหรือไม่ทำเลย), Consistency (ข้อมูลถูกต้อง), Isolation (แยกอิสระ), Durability (คงทนถาวร)',
        tag: 'DBMS'
      },
      {
        id: 'c5',
        front: 'Normalization',
        back: 'กระบวนการออกแบบโครงสร้างตารางเพื่อลดความซ้ำซ้อนของข้อมูล และป้องกันปัญหา Anomaly ในการแทรก แก้ไข หรือลบข้อมูล',
        tag: 'Design'
      },
      {
        id: 'c6',
        front: 'DBMS',
        back: 'Database Management System ซอฟต์แวร์ที่ทำหน้าที่จัดการและควบคุมการเข้าถึงฐานข้อมูล เช่น MySQL, PostgreSQL, SQLite',
        tag: 'Architecture'
      }
    ]
  },
  {
    id: 'deck-2',
    title: 'OSI 7 Layers & Network Terms',
    documentTitle: 'Network Fundamentals.pdf',
    cardCount: 4,
    cards: [
      {
        id: 'c2-1',
        front: 'Layer 7: Application',
        back: 'ชั้นที่ติดต่อกับแอปพลิเคชันผู้ใช้โดยตรง เช่น HTTP, HTTPS, FTP, SMTP, DNS',
        tag: 'OSI'
      },
      {
        id: 'c2-2',
        front: 'Layer 4: Transport',
        back: 'จัดการการส่งข้อมูลแบบ End-to-End มีการแบ่ง Segment ตรวจจับ Error ได้แก่ TCP (เชื่อถือได้) และ UDP (รวดเร็ว)',
        tag: 'OSI'
      },
      {
        id: 'c2-3',
        front: 'Layer 3: Network',
        back: 'กำหนดเส้นทางการเดินทางของ Packet ผ่าน Router โดยใช้ Logical Addressing (IP Address)',
        tag: 'OSI'
      },
      {
        id: 'c2-4',
        front: 'Subnet Mask',
        back: 'ตัวเลขบิต 32 บิตที่ใช้แบ่ง IP Address ออกเป็นส่วน Network ID และ Host ID',
        tag: 'IP Addressing'
      }
    ]
  }
];

