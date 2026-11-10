import { UserProfile, NotificationItem } from '@/types';

export const mockUser: UserProfile = {
  name: 'ธนพัฒน์ วงศ์สว่าง',
  email: 'thanapat.w@student.ac.th',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
  plan: 'Student Plan',
  storageUsed: '42.5 MB',
  storageLimit: '500 MB',
  documentsCount: 6,
  mindmapsCount: 4
};

export const mockNotifications: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Mind Map สร้างสำเร็จแล้ว',
    message: 'AI ได้ทำการประมวลผล Database System.pdf เป็นแผนผังความคิดเรียบร้อยแล้ว',
    time: '10 นาทีที่แล้ว',
    read: false,
    type: 'success'
  },
  {
    id: 'n-2',
    title: 'เอกสารพร้อมใช้งาน',
    message: 'การแยกหัวข้อและคำสำคัญของ Network Fundamentals.pdf เสร็จสมบูรณ์',
    time: '1 ชั่วโมงที่แล้ว',
    read: false,
    type: 'info'
  },
  {
    id: 'n-3',
    title: 'ยินดีต้อนรับสู่ MindMap AI',
    message: 'อัปโหลดไฟล์แรกของคุณเพื่อเริ่มสรุปเนื้อหาเป็น Mind Map ได้ทันที!',
    time: '1 วันที่แล้ว',
    read: true,
    type: 'system'
  }
];

