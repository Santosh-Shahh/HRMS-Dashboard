import type { LeaveRequest, LeaveBalance } from '../types';

export const leaveRequests: LeaveRequest[] = [
  { id: 'LV-001', employeeId: 'EMP-1026', employeeName: 'Madhu Kumari', department: 'Call Center', leaveType: 'Unpaid Leave', startDate: '2026-07-15', endDate: '2026-07-15', days: 1, reason: 'Out of station for personal work', status: 'Pending', appliedOn: '2026-07-12', initials: 'MK' },
  { id: 'LV-002', employeeId: 'EMP-1027', employeeName: 'Aayush Semwal', department: 'Hunt Ads', leaveType: 'Casual Leave', startDate: '2026-07-15', endDate: '2026-07-15', days: 1, reason: 'Some work at home', status: 'Pending', appliedOn: '2026-07-13', initials: 'AS' },
  { id: 'LV-003', employeeId: 'EMP-1028', employeeName: 'Ansh Jangral', department: 'Support', leaveType: 'Casual Leave', startDate: '2026-07-11', endDate: '2026-07-13', days: 3, reason: 'Going on a short trip', status: 'Pending', appliedOn: '2026-07-09', initials: 'AJ' },
  { id: 'LV-004', employeeId: 'EMP-1001', employeeName: 'Aarav Sharma', department: 'Engineering', leaveType: 'Sick Leave', startDate: '2026-07-21', endDate: '2026-07-22', days: 2, reason: 'Not feeling well, doctor visit', status: 'Pending', appliedOn: '2026-07-18', initials: 'AS' },
  { id: 'LV-005', employeeId: 'EMP-1014', employeeName: 'Kavya Menon', department: 'Marketing', leaveType: 'Earned Leave', startDate: '2026-07-25', endDate: '2026-07-30', days: 4, reason: 'Family vacation planned', status: 'Pending', appliedOn: '2026-07-15', initials: 'KM' },
  { id: 'LV-006', employeeId: 'EMP-1008', employeeName: 'Divya Nair', department: 'Support', leaveType: 'Casual Leave', startDate: '2026-07-10', endDate: '2026-07-10', days: 1, reason: 'Personal errand', status: 'Approved', appliedOn: '2026-07-08', approvedBy: 'Priya Patel', initials: 'DN' },
  { id: 'LV-007', employeeId: 'EMP-1011', employeeName: 'Rohan Desai', department: 'Call Center', leaveType: 'Sick Leave', startDate: '2026-07-07', endDate: '2026-07-08', days: 2, reason: 'Fever and headache', status: 'Approved', appliedOn: '2026-07-06', approvedBy: 'Priya Patel', initials: 'RD' },
  { id: 'LV-008', employeeId: 'EMP-1017', employeeName: 'Siddharth Chatterjee', department: 'Engineering', leaveType: 'Earned Leave', startDate: '2026-08-01', endDate: '2026-08-05', days: 5, reason: 'Travel to hometown', status: 'Pending', appliedOn: '2026-07-16', initials: 'SC' },
  { id: 'LV-009', employeeId: 'EMP-1007', employeeName: 'Karan Singh', department: 'Hunt Ads', leaveType: 'Casual Leave', startDate: '2026-07-04', endDate: '2026-07-04', days: 1, reason: 'Had to visit bank', status: 'Approved', appliedOn: '2026-07-03', approvedBy: 'Priya Patel', initials: 'KS' },
  { id: 'LV-010', employeeId: 'EMP-1024', employeeName: 'Shruti Pandey', department: 'Hunt Ads', leaveType: 'Unpaid Leave', startDate: '2026-07-14', endDate: '2026-07-14', days: 1, reason: 'Personal emergency', status: 'Rejected', appliedOn: '2026-07-13', initials: 'SP' },
  { id: 'LV-011', employeeId: 'EMP-1018', employeeName: 'Ritu Saxena', department: 'Call Center', leaveType: 'Sick Leave', startDate: '2026-07-16', endDate: '2026-07-17', days: 2, reason: 'Dental surgery recovery', status: 'Pending', appliedOn: '2026-07-14', initials: 'RS' },
  { id: 'LV-012', employeeId: 'EMP-1009', employeeName: 'Arjun Kapoor', department: 'Engineering', leaveType: 'Casual Leave', startDate: '2026-07-20', endDate: '2026-07-20', days: 1, reason: 'Moving to new apartment', status: 'Approved', appliedOn: '2026-07-17', approvedBy: 'Priya Patel', initials: 'AK' },
  { id: 'LV-013', employeeId: 'EMP-1016', employeeName: 'Pooja Iyer', department: 'Support', leaveType: 'Earned Leave', startDate: '2026-08-10', endDate: '2026-08-15', days: 4, reason: 'Sister wedding celebration', status: 'Approved', appliedOn: '2026-07-10', approvedBy: 'Priya Patel', initials: 'PI' },
  { id: 'LV-014', employeeId: 'EMP-1025', employeeName: 'Harsh Vardhan', department: 'Support', leaveType: 'Unpaid Leave', startDate: '2026-07-18', endDate: '2026-07-19', days: 2, reason: 'Job interview elsewhere', status: 'Rejected', appliedOn: '2026-07-16', initials: 'HV' },
  { id: 'LV-015', employeeId: 'EMP-1013', employeeName: 'Deepak Joshi', department: 'Finance', leaveType: 'Casual Leave', startDate: '2026-07-22', endDate: '2026-07-22', days: 1, reason: 'Parent-teacher meeting', status: 'Pending', appliedOn: '2026-07-18', initials: 'DJ' },
];

export const leaveBalances: LeaveBalance[] = [
  { employeeId: 'EMP-1001', casual: { total: 12, used: 4, remaining: 8 }, sick: { total: 8, used: 2, remaining: 6 }, earned: { total: 15, used: 3, remaining: 12 }, unpaid: { total: 0, used: 0, remaining: 0 } },
  { employeeId: 'EMP-1002', casual: { total: 12, used: 6, remaining: 6 }, sick: { total: 8, used: 1, remaining: 7 }, earned: { total: 15, used: 5, remaining: 10 }, unpaid: { total: 0, used: 2, remaining: 0 } },
  { employeeId: 'EMP-1003', casual: { total: 12, used: 3, remaining: 9 }, sick: { total: 8, used: 0, remaining: 8 }, earned: { total: 15, used: 7, remaining: 8 }, unpaid: { total: 0, used: 0, remaining: 0 } },
  { employeeId: 'EMP-1004', casual: { total: 12, used: 5, remaining: 7 }, sick: { total: 8, used: 3, remaining: 5 }, earned: { total: 15, used: 2, remaining: 13 }, unpaid: { total: 0, used: 1, remaining: 0 } },
  { employeeId: 'EMP-1005', casual: { total: 12, used: 2, remaining: 10 }, sick: { total: 8, used: 0, remaining: 8 }, earned: { total: 15, used: 8, remaining: 7 }, unpaid: { total: 0, used: 0, remaining: 0 } },
];

export const leaveSummary = {
  pending: 8,
  approved: 5,
  rejected: 2,
  totalOnLeave: 24,
};
