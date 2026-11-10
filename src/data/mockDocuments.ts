import { DocumentItem } from '@/types';

export const mockDocuments: DocumentItem[] = [
  {
    id: 'doc-1',
    name: 'Database System.pdf',
    fileType: 'pdf',
    fileSize: '3.8 MB',
    uploadDate: '24 ต.ค. 2026',
    status: 'ready',
    pageCount: 42,
    overview: 'เอกสารประกอบการเรียนวิชาระบบฐานข้อมูล ครอบคลุมสถาปัตยกรรม DBMS, โมเดลเชิงสัมพันธ์ (Relational Model), ภาษาสอบถามข้อมูล SQL, และหลักการออกแบบฐานข้อมูล Normalization',
    topics: ['Database Architecture', 'DBMS Fundamentals', 'Relational Model', 'SQL Query Language', 'Database Design & Normalization', 'ACID Transactions'],
    keywords: ['Primary Key', 'Foreign Key', 'SELECT / JOIN', '1NF - 3NF', 'DBMS', 'ACID', 'Indexing'],
    summary: [
      'ระบบฐานข้อมูล (Database System) คือระบบจัดเก็บข้อมูลที่มีโครงสร้างและสามารถเข้าถึง วิเคราะห์ และจัดการได้อย่างมีประสิทธิภาพผ่านระบบจัดการฐานข้อมูล (DBMS)',
      'ภาษาสอบถาม SQL (Structured Query Language) แบ่งออกเป็น DDL (Data Definition), DML (Data Manipulation) และ DCL (Data Control) เป็นภาษามาตรฐานสำหรับการทำงานกับตารางข้อมูล',
      'การออกแบบฐานข้อมูลตามหลัก Normalization มีจุดประสงค์เพื่อลดความซ้ำซ้อนของข้อมูล (Data Redundancy) และป้องกันปัญหาข้อมูลขัดแย้ง (Anomaly)',
      'คุณสมบัติ ACID (Atomicity, Consistency, Isolation, Durability) เป็นหัวใจสำคัญของธุรกรรม (Transactions) ในระบบฐานข้อมูลแบบ Enterprise'
    ]
  },
  {
    id: 'doc-2',
    name: 'Network Fundamentals.pdf',
    fileType: 'pdf',
    fileSize: '5.2 MB',
    uploadDate: '22 ต.ค. 2026',
    status: 'ready',
    pageCount: 68,
    overview: 'ภาพรวมระบบเครือข่ายคอมพิวเตอร์ OSI 7 Layers, TCP/IP Suite, สถาปัตยกรรมเครือข่าย LAN/WAN และความมั่นคงปลอดภัยไซเบอร์เบื้องต้น',
    topics: ['OSI 7 Layers', 'TCP/IP Protocol Suite', 'IP Addressing & Subnetting', 'Routing & Switching', 'Network Security'],
    keywords: ['IPv4 / IPv6', 'Subnet Mask', 'Router / Switch', 'TCP vs UDP', 'Firewall', 'DNS / DHCP'],
    summary: [
      'แบบจำลอง OSI 7 Layers ช่วยแบ่งหน้าที่การสื่อสารในเครือข่ายออกเป็นชั้น ได้แก่ Physical, Data Link, Network, Transport, Session, Presentation, Application',
      'โปรโตคอล TCP เน้นความน่าเชื่อถือและการตรวจสอบความถูกต้องของข้อมูล (Connection-oriented) ในขณะที่ UDP เน้นความเร็ว (Connectionless)',
      'การจัดสรร IP Address และ Subnetting มีความสำคัญอย่างยิ่งต่อการออกแบบโครงข่ายและการประหยัดพื้นที่หมายเลข IP ภายในองค์กร'
    ]
  },
  {
    id: 'doc-3',
    name: 'Software Engineering.docx',
    fileType: 'docx',
    fileSize: '1.9 MB',
    uploadDate: '18 ต.ค. 2026',
    status: 'ready',
    pageCount: 35,
    overview: 'กระบวนการและระเบียบวิธีทางวิศวกรรมซอฟต์แวร์ วงจรการพัฒนาระบบ SDLC, Agile Methodology, Scrum Framework และการทดสอบซอฟต์แวร์',
    topics: ['SDLC Phases', 'Agile & Scrum Framework', 'Requirements Engineering', 'Software Architecture', 'Quality Assurance & Testing'],
    keywords: ['Sprint', 'User Stories', 'CI/CD', 'Unit Testing', 'Waterfall vs Agile', 'Refactoring'],
    summary: [
      'วงจรการพัฒนาซอฟต์แวร์ (SDLC) ประกอบด้วยขั้นตอน วิเคราะห์ความต้องการ ออกแบบระบบ พัฒนาโค้ด ทดสอบ และบำรุงรักษา',
      'Agile Framework เน้นการส่งมอบงานอย่างต่อเนื่อง (Iterative & Incremental) มีการประชุมประจำวัน (Daily Scrum) และการประเมินย้อนหลัง (Retrospective)'
    ]
  },
  {
    id: 'doc-4',
    name: 'Artificial Intelligence.pdf',
    fileType: 'pdf',
    fileSize: '7.4 MB',
    uploadDate: '15 ต.ค. 2026',
    status: 'ready',
    pageCount: 88,
    overview: 'ความรู้พื้นฐานเกี่ยวกับปัญญาประดิษฐ์ การเรียนรู้ของเครื่อง (Machine Learning), โครงข่ายประสาทเทียม (Deep Learning) และ Large Language Models',
    topics: ['Introduction to AI', 'Supervised & Unsupervised Learning', 'Deep Learning & Neural Networks', 'Natural Language Processing', 'AI Ethics'],
    keywords: ['Neural Networks', 'Transformers', 'Gradient Descent', 'Overfitting', 'LLM', 'Inference'],
    summary: [
      'ปัญญาประดิษฐ์แบ่งออกเป็น Narrow AI (ทำงานเฉพาะทาง) และ General AI (คิดวิเคราะห์เทียบเท่ามนุษย์)',
      'การเรียนรู้ของเครื่องจักรแบ่งออกเป็น Supervised Learning (มีเฉลย), Unsupervised Learning (หาแบบแผนเอง), และ Reinforcement Learning (เรียนรู้จากผลรางวัล)',
      'สถาปัตยกรรม Transformer เป็นรากฐานสำคัญของระบบ Large Language Models สมัยใหม่'
    ]
  },
  {
    id: 'doc-5',
    name: 'Operating System Internals.pdf',
    fileType: 'pdf',
    fileSize: '4.1 MB',
    uploadDate: '10 ต.ค. 2026',
    status: 'ready',
    pageCount: 54,
    overview: 'หลักการทำงานภายในระบบปฏิบัติการ Process Scheduling, Memory Management, Virtual Memory และ File Systems',
    topics: ['Process Management', 'CPU Scheduling Algorithms', 'Deadlock & Concurrency', 'Virtual Memory & Paging'],
    keywords: ['Threads', 'Mutex / Semaphore', 'Paging', 'Round Robin', 'Kernel'],
    summary: [
      'ระบบปฏิบัติการทำหน้าที่เป็นตัวกลางระหว่างฮาร์ดแวร์และแอปพลิเคชัน จัดสรรทรัพยากร CPU, หน่วยความจำ และ I/O'
    ]
  },
  {
    id: 'doc-6',
    name: 'Data Structures & Algorithms.txt',
    fileType: 'txt',
    fileSize: '850 KB',
    uploadDate: '05 ต.ค. 2026',
    status: 'ready',
    pageCount: 22,
    overview: 'โครงสร้างข้อมูลพื้นฐาน Array, Linked List, Stack, Queue, Tree, Graph และการวิเคราะห์ความซับซ้อน Big-O Notation',
    topics: ['Big-O Notation', 'Linear Data Structures', 'Trees & Binary Search Tree', 'Sorting & Searching Algorithms'],
    keywords: ['O(n)', 'O(log n)', 'Quick Sort', 'Merge Sort', 'Binary Search', 'Recursion'],
    summary: [
      'การวิเคราะห์ Big-O Notation ช่วยวัดประสิทธิภาพด้านเวลา (Time Complexity) และการใช้พื้นที่ (Space Complexity) ของอัลกอริทึม'
    ]
  }
];

