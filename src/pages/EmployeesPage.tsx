import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Download, Edit, Trash2, Eye } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import FilterBar from '../components/shared/FilterBar';
import DataTable from '../components/shared/DataTable';
import StatusBadge from '../components/shared/StatusBadge';
import Modal from '../components/shared/Modal';
import ConfirmDialog from '../components/shared/ConfirmDialog';
import FormField from '../components/shared/FormField';
import { useToast } from '../contexts/ToastContext';
import { employees as initialEmployees, departments } from '../data/employees';
import type { Employee } from '../types';

const emptyForm = {
  firstName: '', lastName: '', email: '', phone: '', department: '', designation: '',
  joiningDate: '', salary: '', status: 'Active', address: '', dateOfBirth: '', gender: 'Male',
  bloodGroup: '', emergencyContact: '', reportingTo: '', employmentType: 'Full-Time',
};

export default function EmployeesPage() {
  const navigate = useNavigate();
  const [data, setData] = useState(initialEmployees);
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Employee | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { addToast } = useToast();

  const filtered = data.filter(e => {
    if (deptFilter && e.department !== deptFilter) return false;
    if (statusFilter && e.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.firstName.trim()) errs.firstName = 'Required';
    if (!form.lastName.trim()) errs.lastName = 'Required';
    if (!form.email.trim()) errs.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.phone.trim()) errs.phone = 'Required';
    if (!form.department) errs.department = 'Required';
    if (!form.designation.trim()) errs.designation = 'Required';
    if (!form.joiningDate) errs.joiningDate = 'Required';
    if (!form.salary || Number(form.salary) <= 0) errs.salary = 'Must be > 0';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (name: string, value: string) => {
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(e => ({ ...e, [name]: '' }));
  };

  const handleAdd = () => {
    if (!validate()) return;
    const newEmp: Employee = {
      id: `EMP-${1100 + data.length}`,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      department: form.department as Employee['department'],
      designation: form.designation,
      joiningDate: form.joiningDate,
      salary: Number(form.salary),
      status: form.status as Employee['status'],
      initials: form.firstName[0] + form.lastName[0],
      address: form.address,
      dateOfBirth: form.dateOfBirth,
      gender: form.gender as Employee['gender'],
      bloodGroup: form.bloodGroup,
      emergencyContact: form.emergencyContact,
      reportingTo: form.reportingTo,
      employmentType: form.employmentType as Employee['employmentType'],
    };
    setData(d => [newEmp, ...d]);
    setAddOpen(false);
    setForm(emptyForm);
    setErrors({});
    addToast(`${newEmp.firstName} ${newEmp.lastName} added successfully.`, 'success');
  };

  const handleEdit = () => {
    if (!validate()) return;
    setData(d =>
      d.map(e =>
        e.id === selected?.id
          ? {
              ...e,
              firstName: form.firstName,
              lastName: form.lastName,
              email: form.email,
              phone: form.phone,
              department: form.department as Employee['department'],
              designation: form.designation,
              joiningDate: form.joiningDate,
              salary: Number(form.salary),
              status: form.status as Employee['status'],
              initials: form.firstName[0] + form.lastName[0],
              address: form.address,
              dateOfBirth: form.dateOfBirth,
              gender: form.gender as Employee['gender'],
              bloodGroup: form.bloodGroup,
              emergencyContact: form.emergencyContact,
              reportingTo: form.reportingTo,
              employmentType: form.employmentType as Employee['employmentType'],
            }
          : e
      )
    );
    setEditOpen(false);
    setSelected(null);
    setForm(emptyForm);
    setErrors({});
    addToast('Employee updated successfully.', 'success');
  };

  const handleDelete = () => {
    if (!selected) return;
    setData(d => d.filter(e => e.id !== selected.id));
    setSelected(null);
    addToast('Employee removed successfully.', 'success');
  };

  const openEdit = (emp: Employee) => {
    setSelected(emp);
    setForm({
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      phone: emp.phone,
      department: emp.department,
      designation: emp.designation,
      joiningDate: emp.joiningDate,
      salary: String(emp.salary),
      status: emp.status,
      address: emp.address,
      dateOfBirth: emp.dateOfBirth,
      gender: emp.gender,
      bloodGroup: emp.bloodGroup,
      emergencyContact: emp.emergencyContact,
      reportingTo: emp.reportingTo,
      employmentType: emp.employmentType,
    });
    setErrors({});
    setEditOpen(true);
  };

  const columns = [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
      render: (e: Employee) => <span className="text-xs text-slate-500 font-mono">{e.id}</span>,
    },
    {
      key: 'firstName',
      label: 'Employee',
      sortable: true,
      render: (e: Employee) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xs font-bold">
            {e.initials}
          </div>
          <div>
            <p className="font-medium text-slate-900">{e.firstName} {e.lastName}</p>
            <p className="text-xs text-slate-400">{e.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'phone', label: 'Phone', render: (e: Employee) => <span className="text-sm">{e.phone}</span> },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'designation', label: 'Designation', sortable: true },
    {
      key: 'joiningDate',
      label: 'Join Date',
      sortable: true,
      render: (e: Employee) => <span className="text-sm">{new Date(e.joiningDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>,
    },
    {
      key: 'salary',
      label: 'Salary',
      sortable: true,
      render: (e: Employee) => <span className="font-medium">₹{e.salary.toLocaleString()}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (e: Employee) => <StatusBadge status={e.status} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      className: 'text-right',
      render: (e: Employee) => (
        <div className="flex justify-end gap-1">
          <button onClick={(ev) => { ev.stopPropagation(); navigate(`/employees/${e.id}`); }} className="p-1.5 hover:bg-slate-100 rounded text-slate-500" title="View"><Eye size={15} /></button>
          <button onClick={(ev) => { ev.stopPropagation(); openEdit(e); }} className="p-1.5 hover:bg-slate-100 rounded text-slate-500" title="Edit"><Edit size={15} /></button>
          <button onClick={(ev) => { ev.stopPropagation(); setSelected(e); setDeleteOpen(true); }} className="p-1.5 hover:bg-red-50 rounded text-red-400" title="Delete"><Trash2 size={15} /></button>
        </div>
      ),
    },
  ];

  const formFields = (
    <div className="grid grid-cols-2 gap-4">
      <FormField label="First Name" name="firstName" value={form.firstName} onChange={handleChange} error={errors.firstName} required placeholder="e.g. Aarav" />
      <FormField label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} error={errors.lastName} required placeholder="e.g. Sharma" />
      <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} required placeholder="e.g. aarav@huntdigital.in" />
      <FormField label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} required placeholder="+91 98765 43210" />
      <FormField label="Department" name="department" type="select" value={form.department} onChange={handleChange} error={errors.department} required options={departments.map(d => ({ value: d, label: d }))} />
      <FormField label="Designation" name="designation" value={form.designation} onChange={handleChange} error={errors.designation} required placeholder="e.g. Senior Developer" />
      <FormField label="Joining Date" name="joiningDate" type="date" value={form.joiningDate} onChange={handleChange} error={errors.joiningDate} required />
      <FormField label="Salary (₹)" name="salary" type="number" value={form.salary} onChange={handleChange} error={errors.salary} required placeholder="e.g. 95000" />
      <FormField label="Status" name="status" type="select" value={form.status} onChange={handleChange} options={[{ value: 'Active', label: 'Active' }, { value: 'Probation', label: 'Probation' }, { value: 'Inactive', label: 'Inactive' }, { value: 'On Notice', label: 'On Notice' }]} />
      <FormField label="Employment Type" name="employmentType" type="select" value={form.employmentType} onChange={handleChange} options={[{ value: 'Full-Time', label: 'Full-Time' }, { value: 'Part-Time', label: 'Part-Time' }, { value: 'Contract', label: 'Contract' }, { value: 'Intern', label: 'Intern' }]} />
      <FormField label="Address" name="address" value={form.address} onChange={handleChange} placeholder="Street, City" />
      <FormField label="Date of Birth" name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} />
      <FormField label="Gender" name="gender" type="select" value={form.gender} onChange={handleChange} options={[{ value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }, { value: 'Other', label: 'Other' }]} />
      <FormField label="Blood Group" name="bloodGroup" value={form.bloodGroup} onChange={handleChange} placeholder="e.g. O+" />
      <FormField label="Emergency Contact" name="emergencyContact" type="tel" value={form.emergencyContact} onChange={handleChange} placeholder="+91 ..." />
      <FormField label="Reporting To" name="reportingTo" value={form.reportingTo} onChange={handleChange} placeholder="Manager name" />
    </div>
  );

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      <PageHeader
        title="Employees"
        subtitle={`${data.length} employees in the organization`}
        actions={
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-slate-200 shadow-sm text-slate-700 font-medium rounded-lg hover:bg-slate-50 flex items-center gap-2 text-sm transition-colors">
              <Download size={16} /> Export
            </button>
            <button onClick={() => { setForm(emptyForm); setErrors({}); setAddOpen(true); }} className="px-4 py-2 bg-blue-600 shadow-sm text-white font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm transition-colors">
              <UserPlus size={16} /> Add Employee
            </button>
          </div>
        }
      />

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <FilterBar
          search={{ value: search, onChange: setSearch, placeholder: 'Search by name, email, or ID...' }}
          filters={[
            { name: 'department', label: 'All Departments', value: deptFilter, options: departments.map(d => ({ value: d, label: d })) },
            { name: 'status', label: 'All Statuses', value: statusFilter, options: [{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }, { value: 'Probation', label: 'Probation' }, { value: 'On Notice', label: 'On Notice' }] },
          ]}
          onFilterChange={(name, val) => {
            if (name === 'department') setDeptFilter(val);
            if (name === 'status') setStatusFilter(val);
          }}
        />

        <div className="mt-4">
          <DataTable
            columns={columns}
            data={filtered}
            pageSize={10}
            onRowClick={(emp) => navigate(`/employees/${emp.id}`)}
            emptyMessage="No employees match your filters"
          />
        </div>
      </div>

      {/* Add Employee Modal */}
      <Modal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add New Employee"
        size="xl"
        footer={
          <>
            <button onClick={() => setAddOpen(false)} className="px-4 py-2 border rounded-lg hover:bg-slate-50 text-sm">Cancel</button>
            <button onClick={handleAdd} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Add Employee</button>
          </>
        }
      >
        {formFields}
      </Modal>

      {/* Edit Employee Modal */}
      <Modal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Employee"
        size="xl"
        footer={
          <>
            <button onClick={() => setEditOpen(false)} className="px-4 py-2 border rounded-lg hover:bg-slate-50 text-sm">Cancel</button>
            <button onClick={handleEdit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Save Changes</button>
          </>
        }
      >
        {formFields}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Employee"
        message={`Are you sure you want to remove ${selected?.firstName} ${selected?.lastName}? This action cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}
