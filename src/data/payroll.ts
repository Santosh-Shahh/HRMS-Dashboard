import type { PayrollRecord, SalaryStructure } from '../types';
import { employees } from './employees';

export const salaryStructures: SalaryStructure[] = employees.map(emp => ({
  employeeId: emp.id,
  employeeName: `${emp.firstName} ${emp.lastName}`,
  department: emp.department,
  designation: emp.designation,
  basicSalary: Math.round(emp.salary * 0.5),
  hra: Math.round(emp.salary * 0.2),
  da: Math.round(emp.salary * 0.1),
  totalCTC: emp.salary,
}));

export const payrollRecords: PayrollRecord[] = employees.slice(0, 20).map((emp, idx) => {
  const basic = Math.round(emp.salary * 0.5);
  const hra = Math.round(emp.salary * 0.2);
  const da = Math.round(emp.salary * 0.1);
  const bonus = idx % 4 === 0 ? 5000 : 0;
  const incentives = idx % 3 === 0 ? 3000 : 0;
  const gross = basic + hra + da + bonus + incentives;
  const pf = Math.round(basic * 0.12);
  const tax = Math.round(gross * 0.1);
  const otherDed = 500;
  const totalDed = pf + tax + otherDed;
  const net = gross - totalDed;
  const statusList: PayrollRecord['status'][] = ['Paid', 'Paid', 'Processing', 'Pending'];
  return {
    id: `PAY-JUL-${emp.id}`,
    employeeId: emp.id,
    employeeName: `${emp.firstName} ${emp.lastName}`,
    department: emp.department,
    designation: emp.designation,
    month: 'July',
    year: 2026,
    basicSalary: basic,
    hra,
    da,
    bonus,
    incentives,
    pf,
    tax,
    otherDeductions: otherDed,
    grossSalary: gross,
    totalDeductions: totalDed,
    netSalary: net,
    status: statusList[idx % 4],
    paidOn: idx % 4 === 0 ? '2026-07-01' : undefined,
  };
});

export const payrollSummary = {
  totalMonthlyCost: 2850000,
  pendingPayroll: 12,
  processedPayroll: 16,
  paidCount: 0,
};

export const payrollMonthlyTrend = [
  { month: 'Jan', cost: 2650 },
  { month: 'Feb', cost: 2700 },
  { month: 'Mar', cost: 2720 },
  { month: 'Apr', cost: 2680 },
  { month: 'May', cost: 2750 },
  { month: 'Jun', cost: 2800 },
  { month: 'Jul', cost: 2850 },
];
