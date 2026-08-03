// ===== Employee Types =====
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: Department;
  designation: string;
  joiningDate: string;
  salary: number;
  status: EmployeeStatus;
  initials: string;
  avatar?: string;
  address: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  emergencyContact: string;
  reportingTo: string;
  employmentType: 'Full-Time' | 'Part-Time' | 'Contract' | 'Intern';
}

export type EmployeeStatus = 'Active' | 'Inactive' | 'Probation' | 'On Notice';
export type Department = 'Call Center' | 'Hunt Ads' | 'Support' | 'Engineering' | 'HR' | 'Finance' | 'Marketing' | 'Management';

// ===== Attendance Types =====
export type AttendanceStatus = 'Present' | 'Absent' | 'Half Day' | 'Late' | 'On Leave' | 'Holiday' | 'Weekend';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: Department;
  date: string;
  status: AttendanceStatus;
  checkIn: string;
  checkOut: string;
  workHours: string;
  overtime: string;
}

export interface AttendanceSummary {
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  totalHalfDay: number;
  attendancePercentage: number;
}

// ===== Leave Types =====
export type LeaveType = 'Casual Leave' | 'Sick Leave' | 'Earned Leave' | 'Unpaid Leave';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: Department;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
  approvedBy?: string;
  initials: string;
}

export interface LeaveBalance {
  employeeId: string;
  casual: { total: number; used: number; remaining: number };
  sick: { total: number; used: number; remaining: number };
  earned: { total: number; used: number; remaining: number };
  unpaid: { total: number; used: number; remaining: number };
}

// ===== Payroll Types =====
export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: Department;
  designation: string;
  month: string;
  year: number;
  basicSalary: number;
  hra: number;
  da: number;
  bonus: number;
  incentives: number;
  pf: number;
  tax: number;
  otherDeductions: number;
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  status: 'Pending' | 'Processing' | 'Processed' | 'Paid';
  paidOn?: string;
}

export interface SalaryStructure {
  employeeId: string;
  employeeName: string;
  department: Department;
  designation: string;
  basicSalary: number;
  hra: number;
  da: number;
  totalCTC: number;
}

// ===== Recruitment Types =====
export type RecruitmentStage = 'Applied' | 'Screening' | 'Interview' | 'HR Round' | 'Selected' | 'Rejected';
export type JobStatus = 'Open' | 'Closed' | 'Draft' | 'On Hold';

export interface JobOpening {
  id: string;
  title: string;
  department: Department;
  location: string;
  type: 'Full-Time' | 'Part-Time' | 'Contract' | 'Remote';
  experience: string;
  salary: string;
  postedDate: string;
  closingDate: string;
  status: JobStatus;
  applicants: number;
  description: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobId: string;
  jobTitle: string;
  stage: RecruitmentStage;
  appliedDate: string;
  experience: string;
  skills: string[];
  resume: string;
  notes: string;
  rating: number;
  initials: string;
  interviewDate?: string;
  interviewTime?: string;
}

// ===== Document Types =====
export type DocumentCategory = 'Offer Letter' | 'Joining Letter' | 'Salary Slip' | 'Policy Document' | 'ID Proof' | 'Resume' | 'Contract';

export interface DocumentRecord {
  id: string;
  name: string;
  category: DocumentCategory;
  employeeId: string;
  employeeName: string;
  uploadDate: string;
  fileSize: string;
  fileType: string;
  uploadedBy: string;
}

// ===== Settings Types =====
export interface CompanySetting {
  companyName: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  fiscalYearStart: string;
  timezone: string;
  currency: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  usersCount: number;
}

export interface Permission {
  module: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  day: string;
  type: 'National' | 'Regional' | 'Company' | 'Optional';
}

export interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  breakDuration: string;
  workingHours: string;
  employees: number;
  status: 'Active' | 'Inactive';
}

export interface NotificationSetting {
  id: string;
  name: string;
  description: string;
  email: boolean;
  push: boolean;
  sms: boolean;
}
