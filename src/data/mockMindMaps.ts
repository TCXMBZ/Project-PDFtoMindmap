import { MindMapItem } from '@/types';
import { Node, Edge } from '@xyflow/react';

export interface MindMapGraphData {
  id: string;
  title: string;
  documentId: string;
  nodes: Node[];
  edges: Edge[];
}

export const mockMindMapsList: MindMapItem[] = [
  {
    id: 'mm-1',
    title: 'Database Architecture & SQL',
    documentId: 'doc-1',
    documentName: 'Database System.pdf',
    nodeCount: 15,
    lastModified: 'วันนี้, 10:30 น.',
    coverColor: '#6558E8',
    previewNodes: ['Database System', 'DBMS', 'SQL', 'Database Design']
  },
  {
    id: 'mm-2',
    title: 'Computer Networks & OSI 7 Layers',
    documentId: 'doc-2',
    documentName: 'Network Fundamentals.pdf',
    nodeCount: 22,
    lastModified: 'เมื่อวาน, 16:45 น.',
    coverColor: '#18A979',
    previewNodes: ['Network Models', 'OSI 7 Layers', 'TCP/IP', 'Routing']
  },
  {
    id: 'mm-3',
    title: 'Software Development Life Cycle (SDLC)',
    documentId: 'doc-3',
    documentName: 'Software Engineering.docx',
    nodeCount: 18,
    lastModified: '18 ต.ค. 2026',
    coverColor: '#8B7CF6',
    previewNodes: ['SDLC Phases', 'Agile & Scrum', 'Testing', 'CI/CD']
  },
  {
    id: 'mm-4',
    title: 'Artificial Intelligence & Neural Nets',
    documentId: 'doc-4',
    documentName: 'Artificial Intelligence.pdf',
    nodeCount: 26,
    lastModified: '15 ต.ค. 2026',
    coverColor: '#F4AD43',
    previewNodes: ['AI Foundations', 'Machine Learning', 'Deep Learning', 'LLMs']
  }
];

export const initialMindMapData: Record<string, MindMapGraphData> = {
  'mm-1': {
    id: 'mm-1',
    title: 'Database Architecture & SQL',
    documentId: 'doc-1',
    nodes: [
      {
        id: 'root',
        type: 'custom',
        position: { x: 380, y: 220 },
        data: {
          label: 'Database System',
          description: 'โครงสร้างหลักของระบบจัดการข้อมูลเชิงสัมพันธ์และการประมวลผลคำสั่ง',
          level: 'root',
          color: '#6558E8',
          fontSize: '18px'
        }
      },
      // Branch 1: Database
      {
        id: 'branch-1',
        type: 'custom',
        position: { x: 80, y: 80 },
        data: {
          label: '1. Database',
          description: 'แหล่งรวบรวมข้อมูลที่มีความสัมพันธ์กันอย่างเป็นระเบียบ',
          level: 'branch',
          color: '#8B7CF6',
          fontSize: '15px'
        }
      },
      {
        id: 'sub-1-1',
        type: 'custom',
        position: { x: -140, y: 40 },
        data: {
          label: 'Data Integrity',
          description: 'ความถูกต้องและสมบูรณ์ของข้อมูลตามข้อกำหนด',
          level: 'subtopic',
          color: '#FFFFFF',
          fontSize: '13px'
        }
      },
      {
        id: 'sub-1-2',
        type: 'custom',
        position: { x: -140, y: 130 },
        data: {
          label: 'Redundancy Reduction',
          description: 'การลดการจัดเก็บข้อมูลซ้ำซ้อนในตาราง',
          level: 'subtopic',
          color: '#FFFFFF',
          fontSize: '13px'
        }
      },
      // Branch 2: DBMS
      {
        id: 'branch-2',
        type: 'custom',
        position: { x: 80, y: 360 },
        data: {
          label: '2. DBMS',
          description: 'ซอฟต์แวร์จัดการฐานข้อมูล เช่น PostgreSQL, MySQL, Oracle',
          level: 'branch',
          color: '#8B7CF6',
          fontSize: '15px'
        }
      },
      {
        id: 'sub-2-1',
        type: 'custom',
        position: { x: -140, y: 320 },
        data: {
          label: 'ACID Properties',
          description: 'Atomicity, Consistency, Isolation, Durability',
          level: 'subtopic',
          color: '#FFFFFF',
          fontSize: '13px'
        }
      },
      {
        id: 'sub-2-2',
        type: 'custom',
        position: { x: -140, y: 410 },
        data: {
          label: 'Concurrency Control',
          description: 'การจัดการการเข้าถึงข้อมูลพร้อมกันของผู้ใช้หลายคน',
          level: 'subtopic',
          color: '#FFFFFF',
          fontSize: '13px'
        }
      },
      // Branch 3: SQL
      {
        id: 'branch-3',
        type: 'custom',
        position: { x: 680, y: 100 },
        data: {
          label: '3. SQL',
          description: 'Structured Query Language ภาษามาตรฐานจัดการฐานข้อมูล',
          level: 'branch',
          color: '#8B7CF6',
          fontSize: '15px'
        }
      },
      {
        id: 'sub-3-1',
        type: 'custom',
        position: { x: 920, y: 20 },
        data: {
          label: 'SELECT',
          description: 'คำสั่งดึงและค้นหาแถวข้อมูลจาก Table พร้อมเงื่อนไข WHERE / JOIN',
          level: 'subtopic',
          color: '#FFFFFF',
          fontSize: '13px'
        }
      },
      {
        id: 'sub-3-2',
        type: 'custom',
        position: { x: 920, y: 90 },
        data: {
          label: 'INSERT',
          description: 'คำสั่งเพิ่มแถวระเบียนข้อมูลใหม่เข้าไปในตาราง',
          level: 'subtopic',
          color: '#FFFFFF',
          fontSize: '13px'
        }
      },
      {
        id: 'sub-3-3',
        type: 'custom',
        position: { x: 920, y: 160 },
        data: {
          label: 'UPDATE',
          description: 'คำสั่งแก้ไขค่าข้อมูลในคอลัมน์ที่มีอยู่แล้ว',
          level: 'subtopic',
          color: '#FFFFFF',
          fontSize: '13px'
        }
      },
      {
        id: 'sub-3-4',
        type: 'custom',
        position: { x: 920, y: 230 },
        data: {
          label: 'DELETE',
          description: 'คำสั่งลบแถวข้อมูลออกจากตารางตามเงื่อนไขที่ระบุ',
          level: 'subtopic',
          color: '#FFFFFF',
          fontSize: '13px'
        }
      },
      // Branch 4: Database Design
      {
        id: 'branch-4',
        type: 'custom',
        position: { x: 680, y: 350 },
        data: {
          label: '4. Database Design',
          description: 'ระเบียบแบบแผนการออกแบบ Schema และความสัมพันธ์ระหว่าง Entity',
          level: 'branch',
          color: '#8B7CF6',
          fontSize: '15px'
        }
      },
      {
        id: 'sub-4-1',
        type: 'custom',
        position: { x: 920, y: 320 },
        data: {
          label: 'Primary Key',
          description: 'คีย์หลักที่เป็นค่าเฉพาะ (Unique) ระบุตัวตนของแต่ละแถวข้อมูล',
          level: 'subtopic',
          color: '#FFFFFF',
          fontSize: '13px'
        }
      },
      {
        id: 'sub-4-2',
        type: 'custom',
        position: { x: 920, y: 400 },
        data: {
          label: 'Foreign Key',
          description: 'คีย์นอกที่ใช้อ้างอิงเชื่อมโยงกับ Primary Key ของอีกตารางหนึ่ง',
          level: 'subtopic',
          color: '#FFFFFF',
          fontSize: '13px'
        }
      }
    ],
    edges: [
      { id: 'e-root-b1', source: 'root', target: 'branch-1', animated: true, style: { stroke: '#85859A', strokeWidth: 2 } },
      { id: 'e-root-b2', source: 'root', target: 'branch-2', animated: true, style: { stroke: '#85859A', strokeWidth: 2 } },
      { id: 'e-root-b3', source: 'root', target: 'branch-3', animated: true, style: { stroke: '#85859A', strokeWidth: 2 } },
      { id: 'e-root-b4', source: 'root', target: 'branch-4', animated: true, style: { stroke: '#85859A', strokeWidth: 2 } },
      
      { id: 'e-b1-s1', source: 'branch-1', target: 'sub-1-1', style: { stroke: '#D1D3DF', strokeWidth: 1.5 } },
      { id: 'e-b1-s2', source: 'branch-1', target: 'sub-1-2', style: { stroke: '#D1D3DF', strokeWidth: 1.5 } },
      
      { id: 'e-b2-s1', source: 'branch-2', target: 'sub-2-1', style: { stroke: '#D1D3DF', strokeWidth: 1.5 } },
      { id: 'e-b2-s2', source: 'branch-2', target: 'sub-2-2', style: { stroke: '#D1D3DF', strokeWidth: 1.5 } },
      
      { id: 'e-b3-s1', source: 'branch-3', target: 'sub-3-1', style: { stroke: '#D1D3DF', strokeWidth: 1.5 } },
      { id: 'e-b3-s2', source: 'branch-3', target: 'sub-3-2', style: { stroke: '#D1D3DF', strokeWidth: 1.5 } },
      { id: 'e-b3-s3', source: 'branch-3', target: 'sub-3-3', style: { stroke: '#D1D3DF', strokeWidth: 1.5 } },
      { id: 'e-b3-s4', source: 'branch-3', target: 'sub-3-4', style: { stroke: '#D1D3DF', strokeWidth: 1.5 } },
      
      { id: 'e-b4-s1', source: 'branch-4', target: 'sub-4-1', style: { stroke: '#D1D3DF', strokeWidth: 1.5 } },
      { id: 'e-b4-s2', source: 'branch-4', target: 'sub-4-2', style: { stroke: '#D1D3DF', strokeWidth: 1.5 } }
    ]
  }
};

