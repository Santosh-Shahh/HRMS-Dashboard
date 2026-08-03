import type { DocumentRecord } from '../types';

export const documents: DocumentRecord[] = [
  { id: 'DOC-001', name: 'Aarav Sharma - Offer Letter.pdf', category: 'Offer Letter', employeeId: 'EMP-1001', employeeName: 'Aarav Sharma', uploadDate: '2023-03-10', fileSize: '245 KB', fileType: 'PDF', uploadedBy: 'HR Admin' },
  { id: 'DOC-002', name: 'Aarav Sharma - Joining Letter.pdf', category: 'Joining Letter', employeeId: 'EMP-1001', employeeName: 'Aarav Sharma', uploadDate: '2023-03-15', fileSize: '180 KB', fileType: 'PDF', uploadedBy: 'HR Admin' },
  { id: 'DOC-003', name: 'Priya Patel - Offer Letter.pdf', category: 'Offer Letter', employeeId: 'EMP-1002', employeeName: 'Priya Patel', uploadDate: '2022-07-25', fileSize: '252 KB', fileType: 'PDF', uploadedBy: 'HR Admin' },
  { id: 'DOC-004', name: 'Company Leave Policy 2026.pdf', category: 'Policy Document', employeeId: '-', employeeName: 'All Employees', uploadDate: '2026-01-05', fileSize: '1.2 MB', fileType: 'PDF', uploadedBy: 'Priya Patel' },
  { id: 'DOC-005', name: 'Rahul Verma - Aadhaar Card.pdf', category: 'ID Proof', employeeId: 'EMP-1003', employeeName: 'Rahul Verma', uploadDate: '2021-01-12', fileSize: '320 KB', fileType: 'PDF', uploadedBy: 'Rahul Verma' },
  { id: 'DOC-006', name: 'Vikram Mehta - Salary Slip Jul 2026.pdf', category: 'Salary Slip', employeeId: 'EMP-1005', employeeName: 'Vikram Mehta', uploadDate: '2026-07-01', fileSize: '156 KB', fileType: 'PDF', uploadedBy: 'System' },
  { id: 'DOC-007', name: 'Employee Handbook v3.1.pdf', category: 'Policy Document', employeeId: '-', employeeName: 'All Employees', uploadDate: '2026-04-15', fileSize: '3.5 MB', fileType: 'PDF', uploadedBy: 'Priya Patel' },
  { id: 'DOC-008', name: 'Sneha Gupta - PAN Card.pdf', category: 'ID Proof', employeeId: 'EMP-1004', employeeName: 'Sneha Gupta', uploadDate: '2023-06-22', fileSize: '290 KB', fileType: 'PDF', uploadedBy: 'Sneha Gupta' },
  { id: 'DOC-009', name: 'Ananya Reddy - Contract.pdf', category: 'Contract', employeeId: 'EMP-1006', employeeName: 'Ananya Reddy', uploadDate: '2024-01-08', fileSize: '410 KB', fileType: 'PDF', uploadedBy: 'HR Admin' },
  { id: 'DOC-010', name: 'IT Security Policy.pdf', category: 'Policy Document', employeeId: '-', employeeName: 'All Employees', uploadDate: '2025-11-20', fileSize: '890 KB', fileType: 'PDF', uploadedBy: 'Manish Tiwari' },
  { id: 'DOC-011', name: 'Karan Singh - Salary Slip Jul 2026.pdf', category: 'Salary Slip', employeeId: 'EMP-1007', employeeName: 'Karan Singh', uploadDate: '2026-07-01', fileSize: '148 KB', fileType: 'PDF', uploadedBy: 'System' },
  { id: 'DOC-012', name: 'Divya Nair - Offer Letter.pdf', category: 'Offer Letter', employeeId: 'EMP-1008', employeeName: 'Divya Nair', uploadDate: '2023-09-20', fileSize: '238 KB', fileType: 'PDF', uploadedBy: 'HR Admin' },
  { id: 'DOC-013', name: 'Arjun Kapoor - Resume.pdf', category: 'Resume', employeeId: 'EMP-1009', employeeName: 'Arjun Kapoor', uploadDate: '2024-02-10', fileSize: '520 KB', fileType: 'PDF', uploadedBy: 'Anjali Mishra' },
  { id: 'DOC-014', name: 'Work From Home Policy.pdf', category: 'Policy Document', employeeId: '-', employeeName: 'All Employees', uploadDate: '2026-03-01', fileSize: '670 KB', fileType: 'PDF', uploadedBy: 'Priya Patel' },
  { id: 'DOC-015', name: 'Meera Joshi - Joining Letter.pdf', category: 'Joining Letter', employeeId: 'EMP-1010', employeeName: 'Meera Joshi', uploadDate: '2023-07-03', fileSize: '195 KB', fileType: 'PDF', uploadedBy: 'HR Admin' },
  { id: 'DOC-016', name: 'Anti-Harassment Policy.pdf', category: 'Policy Document', employeeId: '-', employeeName: 'All Employees', uploadDate: '2025-08-12', fileSize: '780 KB', fileType: 'PDF', uploadedBy: 'Priya Patel' },
  { id: 'DOC-017', name: 'Siddharth Chatterjee - Salary Slip Jul 2026.pdf', category: 'Salary Slip', employeeId: 'EMP-1017', employeeName: 'Siddharth Chatterjee', uploadDate: '2026-07-01', fileSize: '152 KB', fileType: 'PDF', uploadedBy: 'System' },
  { id: 'DOC-018', name: 'Nisha Agarwal - Contract Renewal.pdf', category: 'Contract', employeeId: 'EMP-1012', employeeName: 'Nisha Agarwal', uploadDate: '2026-05-18', fileSize: '385 KB', fileType: 'PDF', uploadedBy: 'HR Admin' },
];

export const documentCategories = ['All', 'Offer Letter', 'Joining Letter', 'Salary Slip', 'Policy Document', 'ID Proof', 'Resume', 'Contract'] as const;

export const documentSummary = {
  totalDocuments: 18,
  recentUploads: 5,
  pendingReview: 2,
  categories: 7,
};
