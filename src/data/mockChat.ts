import { ChatMessage } from '@/types';

export const initialChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'ai',
    text: 'สวัสดีครับ! ผมคือผู้ช่วย AI ประจำเอกสาร Database System.pdf คุณสามารถให้ผมสรุปเนื้อหา อธิบายคีย์เวิร์ด หรือช่วยทบทวนข้อสอบเกี่ยวกับฐานข้อมูลได้เลยครับ มีอะไรให้ผมช่วยไหมครับ?',
    timestamp: '10:00 น.',
    suggestedActions: [
      'สรุปเนื้อหาทั้งหมดแบบกระชับ',
      'อธิบายความแตกต่างของ Primary Key และ Foreign Key',
      'อธิบายคำสั่ง SQL พื้นฐาน (SELECT, INSERT, UPDATE, DELETE)',
      'ยกตัวอย่างการทำ Normalization 1NF - 3NF'
    ]
  }
];

export const mockAiResponses: Record<string, string> = {
  'สรุปเนื้อหาทั้งหมดแบบกระชับ': `📊 **สรุปสาระสำคัญของเอกสาร Database System:**

1. **สถาปัตยกรรมระบบฐานข้อมูล (DBMS Architecture):**
   - ฐานข้อมูลช่วยจัดเก็บข้อมูลอย่างเป็นระบบ ลดความซ้ำซ้อน (Data Redundancy)
   - มีระบบความปลอดภัยและการควบคุมสิทธิ์การเข้าถึงแบบหลายผู้ใช้ (Multi-user Concurrency)

2. **ภาษา SQL (Structured Query Language):**
   - **DDL:** สร้างโครงสร้างตาราง (CREATE, ALTER, DROP)
   - **DML:** จัดการข้อมูลในตาราง (SELECT, INSERT, UPDATE, DELETE)

3. **การออกแบบฐานข้อมูล (Normalization):**
   - กระบวนการจัดระเบียบตารางเพื่อลด Data Anomaly (Insert, Update, Delete anomalies)
   - แบ่งเป็นระดับ 1NF, 2NF, 3NF และ BCNF

4. **คุณสมบัติ ACID ของธุรกรรม:**
   - **Atomicity:** ทำทั้งหมดหรือไม่มีการทำเลย (All or Nothing)
   - **Consistency:** ข้อมูลต้องถูกต้องตามกฎเกณฑ์เสมอ
   - **Isolation:** แต่ละ Transaction ทำงานแยกอิสระจากกัน
   - **Durability:** เมื่อ Commit แล้ว ข้อมูลจะคงอยู่อย่างถาวรแม้ระบบดับ`,

  'อธิบายความแตกต่างของ Primary Key และ Foreign Key': `🔑 **ความแตกต่างระหว่าง Primary Key และ Foreign Key:**

| คุณลักษณะ | Primary Key (คีย์หลัก) | Foreign Key (คีย์นอก) |
|---|---|---|
| **วัตถุประสงค์** | ระบุตัวตนเฉพาะเจาะจงของแต่ละแถวในตาราง | สร้างความสัมพันธ์เชื่อมโยงไปยังตารางอื่น |
| **ค่าซ้ำกัน** | **ห้ามซ้ำ** (Unique เสมอ) | **ซ้ำกันได้** (Duplicate อนุญาต) |
| **ค่าว่าง (NULL)** | **ห้ามเป็น NULL** (NOT NULL) | สามารถมีค่า NULL ได้ในบางกรณี |
| **จำนวนใน 1 ตาราง** | มีได้เพียง 1 คีย์ต่อตาราง (อาจเป็น Composite Key ได้) | มีได้หลาย Foreign Key ในตารางเดียวกัน |

💡 **ตัวอย่าง:**
- ตาราง \`Students\`: \`student_id\` เป็น **Primary Key**
- ตาราง \`Enrollments\`: \`student_id\` นำมาใช้อ้างอิงเป็น **Foreign Key** เพื่อบอกว่านักเรียนคนใดลงทะเบียนเรียน`,

  'อธิบายคำสั่ง SQL พื้นฐาน (SELECT, INSERT, UPDATE, DELETE)': `💻 **คำสั่ง SQL สำหรับการจัดการข้อมูล (CRUD Operations):**

1. **SELECT (ดึงข้อมูล):**
\`\`\`sql
SELECT name, email, major 
FROM students 
WHERE gpa >= 3.00 
ORDER BY name ASC;
\`\`\`

2. **INSERT (เพิ่มข้อมูลใหม่):**
\`\`\`sql
INSERT INTO students (student_id, name, email, gpa) 
VALUES ('6701001', 'สมชาย ใจดี', 'somchai@mail.com', 3.45);
\`\`\`

3. **UPDATE (แก้ไขข้อมูล):**
\`\`\`sql
UPDATE students 
SET gpa = 3.60 
WHERE student_id = '6701001';
\`\`\`
*(⚠️ ข้อควรระวัง: ห้ามลืมใส่ WHERE ไม่อย่างนั้นข้อมูลทุกแถวจะถูกเปลี่ยน!)*

4. **DELETE (ลบข้อมูล):**
\`\`\`sql
DELETE FROM students 
WHERE student_id = '6701001';
\`\`\``,

  'ยกตัวอย่างการทำ Normalization 1NF - 3NF': `📐 **ขั้นตอนการทำ Normalization (1NF ถึง 3NF):**

1. **First Normal Form (1NF):**
   - ทุกค่าในคอลัมน์ต้องเป็นค่าเดี่ยว (Atomic Values)
   - ไม่มีกลุ่มข้อมูลที่ซ้ำกัน (Repeating Groups)
   - ต้องกำหนด Primary Key

2. **Second Normal Form (2NF):**
   - ต้องผ่านกฎของ 1NF มาก่อน
   - ไม่มี Partial Functional Dependency (ทุก Non-key attribute ต้องขึ้นตรงกับทั้ง Primary Key ไม่ใช่เพียงบางส่วนของ Composite Key)

3. **Third Normal Form (3NF):**
   - ต้องผ่านกฎของ 2NF มาก่อน
   - ไม่มี Transitive Dependency (แอตทริบิวต์ที่ไม่ใช่คีย์ต้องไม่ขึ้นต่อกันเอง เช่น $A \rightarrow B$ และ $B \rightarrow C$)

✨ **ผลลัพธ์:** ฐานข้อมูลมีระเบียบ ค้นหาง่าย และไม่เกิดข้อผิดพลาดเวลาอัปเดตข้อมูล!`
};

