import type { CompanySetting, Role, Holiday, Shift, NotificationSetting } from '../types';

export const companySettings: CompanySetting = {
  companyName: 'Hunt Digital Media Pvt. Ltd.',
  address: '42 MG Road, Sector 14',
  city: 'Gurgaon, Haryana 122001',
  country: 'India',
  phone: '+91 124 456 7890',
  email: 'hr@huntdigital.in',
  website: 'www.huntdigital.in',
  fiscalYearStart: 'April',
  timezone: 'Asia/Kolkata (IST)',
  currency: 'INR (₹)',
};

export const roles: Role[] = [
  { id: 'ROLE-001', name: 'Super Admin', description: 'Full system access with all administrative capabilities', usersCount: 2, permissions: [
    { module: 'Dashboard', canView: true, canCreate: true, canEdit: true, canDelete: true },
    { module: 'Employees', canView: true, canCreate: true, canEdit: true, canDelete: true },
    { module: 'Attendance', canView: true, canCreate: true, canEdit: true, canDelete: true },
    { module: 'Leave', canView: true, canCreate: true, canEdit: true, canDelete: true },
    { module: 'Payroll', canView: true, canCreate: true, canEdit: true, canDelete: true },
    { module: 'Recruitment', canView: true, canCreate: true, canEdit: true, canDelete: true },
    { module: 'Reports', canView: true, canCreate: true, canEdit: true, canDelete: true },
    { module: 'Documents', canView: true, canCreate: true, canEdit: true, canDelete: true },
    { module: 'Settings', canView: true, canCreate: true, canEdit: true, canDelete: true },
  ]},
  { id: 'ROLE-002', name: 'HR Manager', description: 'Access to HR operations, recruitment, and employee management', usersCount: 3, permissions: [
    { module: 'Dashboard', canView: true, canCreate: false, canEdit: false, canDelete: false },
    { module: 'Employees', canView: true, canCreate: true, canEdit: true, canDelete: false },
    { module: 'Attendance', canView: true, canCreate: true, canEdit: true, canDelete: false },
    { module: 'Leave', canView: true, canCreate: true, canEdit: true, canDelete: false },
    { module: 'Payroll', canView: true, canCreate: false, canEdit: false, canDelete: false },
    { module: 'Recruitment', canView: true, canCreate: true, canEdit: true, canDelete: true },
    { module: 'Reports', canView: true, canCreate: true, canEdit: false, canDelete: false },
    { module: 'Documents', canView: true, canCreate: true, canEdit: true, canDelete: false },
    { module: 'Settings', canView: true, canCreate: false, canEdit: false, canDelete: false },
  ]},
  { id: 'ROLE-003', name: 'Recruiter', description: 'Manage job postings, candidates, and interviews', usersCount: 2, permissions: [
    { module: 'Dashboard', canView: true, canCreate: false, canEdit: false, canDelete: false },
    { module: 'Employees', canView: true, canCreate: false, canEdit: false, canDelete: false },
    { module: 'Attendance', canView: false, canCreate: false, canEdit: false, canDelete: false },
    { module: 'Leave', canView: false, canCreate: false, canEdit: false, canDelete: false },
    { module: 'Payroll', canView: false, canCreate: false, canEdit: false, canDelete: false },
    { module: 'Recruitment', canView: true, canCreate: true, canEdit: true, canDelete: false },
    { module: 'Reports', canView: true, canCreate: false, canEdit: false, canDelete: false },
    { module: 'Documents', canView: true, canCreate: true, canEdit: false, canDelete: false },
    { module: 'Settings', canView: false, canCreate: false, canEdit: false, canDelete: false },
  ]},
  { id: 'ROLE-004', name: 'Employee', description: 'Basic access to self-service features', usersCount: 248, permissions: [
    { module: 'Dashboard', canView: true, canCreate: false, canEdit: false, canDelete: false },
    { module: 'Employees', canView: true, canCreate: false, canEdit: false, canDelete: false },
    { module: 'Attendance', canView: true, canCreate: false, canEdit: false, canDelete: false },
    { module: 'Leave', canView: true, canCreate: true, canEdit: false, canDelete: false },
    { module: 'Payroll', canView: true, canCreate: false, canEdit: false, canDelete: false },
    { module: 'Recruitment', canView: false, canCreate: false, canEdit: false, canDelete: false },
    { module: 'Reports', canView: false, canCreate: false, canEdit: false, canDelete: false },
    { module: 'Documents', canView: true, canCreate: true, canEdit: false, canDelete: false },
    { module: 'Settings', canView: false, canCreate: false, canEdit: false, canDelete: false },
  ]},
];

export const holidays: Holiday[] = [
  { id: 'HOL-001', name: 'Republic Day', date: '2026-01-26', day: 'Monday', type: 'National' },
  { id: 'HOL-002', name: 'Holi', date: '2026-03-14', day: 'Saturday', type: 'National' },
  { id: 'HOL-003', name: 'Good Friday', date: '2026-04-03', day: 'Friday', type: 'Optional' },
  { id: 'HOL-004', name: 'Eid ul-Fitr', date: '2026-03-31', day: 'Tuesday', type: 'National' },
  { id: 'HOL-005', name: 'Independence Day', date: '2026-08-15', day: 'Friday', type: 'National' },
  { id: 'HOL-006', name: 'Gandhi Jayanti', date: '2026-10-02', day: 'Friday', type: 'National' },
  { id: 'HOL-007', name: 'Dussehra', date: '2026-10-20', day: 'Tuesday', type: 'National' },
  { id: 'HOL-008', name: 'Diwali', date: '2026-11-08', day: 'Sunday', type: 'National' },
  { id: 'HOL-009', name: 'Christmas', date: '2026-12-25', day: 'Friday', type: 'National' },
  { id: 'HOL-010', name: 'Company Foundation Day', date: '2026-09-15', day: 'Monday', type: 'Company' },
  { id: 'HOL-011', name: 'Summer Bank Holiday', date: '2026-07-24', day: 'Friday', type: 'Company' },
  { id: 'HOL-012', name: 'Makar Sankranti', date: '2026-01-14', day: 'Wednesday', type: 'Regional' },
];

export const shifts: Shift[] = [
  { id: 'SHIFT-001', name: 'Morning Shift', startTime: '09:00 AM', endTime: '06:00 PM', breakDuration: '1 hour', workingHours: '8 hours', employees: 180, status: 'Active' },
  { id: 'SHIFT-002', name: 'Evening Shift', startTime: '02:00 PM', endTime: '11:00 PM', breakDuration: '1 hour', workingHours: '8 hours', employees: 85, status: 'Active' },
  { id: 'SHIFT-003', name: 'Night Shift', startTime: '10:00 PM', endTime: '07:00 AM', breakDuration: '1 hour', workingHours: '8 hours', employees: 32, status: 'Active' },
  { id: 'SHIFT-004', name: 'Flexible Hours', startTime: 'Flexible', endTime: 'Flexible', breakDuration: '1 hour', workingHours: '8 hours', employees: 45, status: 'Active' },
  { id: 'SHIFT-005', name: 'Weekend Shift', startTime: '10:00 AM', endTime: '04:00 PM', breakDuration: '30 min', workingHours: '5.5 hours', employees: 15, status: 'Inactive' },
];

export const notificationSettings: NotificationSetting[] = [
  { id: 'NOTIF-001', name: 'Leave Request Notifications', description: 'Get notified when employees apply for leave', email: true, push: true, sms: false },
  { id: 'NOTIF-002', name: 'Attendance Alerts', description: 'Alerts for late arrivals and absences', email: true, push: true, sms: true },
  { id: 'NOTIF-003', name: 'Payroll Processing', description: 'Notifications when payroll is processed', email: true, push: false, sms: false },
  { id: 'NOTIF-004', name: 'New Employee Onboarding', description: 'Alerts when new employees join', email: true, push: true, sms: false },
  { id: 'NOTIF-005', name: 'Birthday & Anniversary', description: 'Reminders for employee birthdays and work anniversaries', email: true, push: true, sms: false },
  { id: 'NOTIF-006', name: 'Document Upload', description: 'Notifications when documents are uploaded or shared', email: false, push: true, sms: false },
  { id: 'NOTIF-007', name: 'Recruitment Updates', description: 'Status changes in candidate pipeline', email: true, push: true, sms: false },
  { id: 'NOTIF-008', name: 'Policy Updates', description: 'Notifications when company policies are updated', email: true, push: false, sms: false },
];
