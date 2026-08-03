import type { AttendanceRecord, AttendanceStatus, Department } from '../types';
import { employees } from './employees';

const statuses: AttendanceStatus[] = ['Present', 'Present', 'Present', 'Present', 'Present', 'Present', 'Late', 'Late', 'Absent', 'Half Day', 'Present', 'Present'];
const checkInTimes = ['09:00', '09:02', '09:15', '08:55', '09:30', '10:05', '09:45', '08:50', '09:10', '09:22', '09:08', '09:35'];
const checkOutTimes = ['18:00', '18:15', '17:45', '18:30', '17:00', '18:00', '18:20', '19:00', '17:30', '18:10', '18:05', '17:50'];

function generateDailyAttendance(dateStr: string): AttendanceRecord[] {
  return employees.map((emp, idx) => {
    const statusIdx = (idx + dateStr.charCodeAt(dateStr.length - 1)) % statuses.length;
    const status = statuses[statusIdx];
    const checkIn = status === 'Absent' ? '-' : checkInTimes[statusIdx];
    const checkOut = status === 'Absent' ? '-' : checkOutTimes[statusIdx];
    const workHrs = status === 'Absent' ? '0h 0m' : status === 'Half Day' ? '4h 30m' : `${7 + (idx % 3)}h ${(idx * 7) % 60}m`;
    const overtime = status === 'Present' && idx % 5 === 0 ? '1h 30m' : '0h 0m';
    return {
      id: `ATT-${dateStr}-${emp.id}`,
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      department: emp.department,
      date: dateStr,
      status,
      checkIn,
      checkOut,
      workHours: workHrs,
      overtime,
    };
  });
}

// Generate 30 days of attendance
const today = new Date(2026, 6, 18); // Jul 18, 2026
export const attendanceRecords: AttendanceRecord[] = [];
for (let i = 0; i < 30; i++) {
  const d = new Date(today);
  d.setDate(d.getDate() - i);
  const dayOfWeek = d.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) continue; // Skip weekends
  const dateStr = d.toISOString().split('T')[0];
  attendanceRecords.push(...generateDailyAttendance(dateStr));
}

export function getAttendanceByDate(date: string): AttendanceRecord[] {
  return attendanceRecords.filter(r => r.date === date);
}

export function getAttendanceByEmployee(employeeId: string): AttendanceRecord[] {
  return attendanceRecords.filter(r => r.employeeId === employeeId);
}

export const monthlyAttendanceTrend = [
  { month: 'Jan', present: 92, absent: 5, late: 3 },
  { month: 'Feb', present: 90, absent: 6, late: 4 },
  { month: 'Mar', present: 93, absent: 4, late: 3 },
  { month: 'Apr', present: 88, absent: 8, late: 4 },
  { month: 'May', present: 91, absent: 5, late: 4 },
  { month: 'Jun', present: 94, absent: 3, late: 3 },
  { month: 'Jul', present: 89, absent: 7, late: 4 },
];

export const departmentAttendance: { department: string; present: number; absent: number; late: number }[] = [
  { department: 'Engineering', present: 95, absent: 3, late: 2 },
  { department: 'Call Center', present: 88, absent: 8, late: 4 },
  { department: 'Hunt Ads', present: 92, absent: 4, late: 4 },
  { department: 'Support', present: 90, absent: 6, late: 4 },
  { department: 'HR', present: 96, absent: 2, late: 2 },
  { department: 'Finance', present: 94, absent: 4, late: 2 },
  { department: 'Marketing', present: 91, absent: 5, late: 4 },
  { department: 'Management', present: 98, absent: 1, late: 1 },
];

export const todayAttendanceSummary = {
  totalPresent: 985,
  totalAbsent: 45,
  totalLate: 32,
  totalHalfDay: 12,
  attendancePercentage: 91.4,
};
