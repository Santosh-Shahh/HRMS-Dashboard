import { useState } from 'react';
import { Building2, Shield, Calendar, Clock, Bell, Plus, Check, Save } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import TabBar from '../components/shared/TabBar';
import FormField from '../components/shared/FormField';
import StatusBadge from '../components/shared/StatusBadge';
import Modal from '../components/shared/Modal';
import Toast from '../components/Toast';
import { companySettings as initialCompany, roles as initialRoles, holidays as initialHolidays, shifts as initialShifts, notificationSettings as initialNotifs } from '../data/settings';
import type { CompanySetting, Role, Holiday, Shift, NotificationSetting } from '../types';

const tabs = [
  { id: 'company', label: 'Company Settings' },
  { id: 'roles', label: 'Roles & Permissions' },
  { id: 'holidays', label: 'Holiday Calendar' },
  { id: 'shifts', label: 'Shift Settings' },
  { id: 'notifications', label: 'Email Notifications' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('company');
  const [company, setCompany] = useState<CompanySetting>(initialCompany);
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [holidays, setHolidays] = useState<Holiday[]>(initialHolidays);
  const [shifts, setShifts] = useState<Shift[]>(initialShifts);
  const [notifs, setNotifs] = useState<NotificationSetting[]>(initialNotifs);

  const [addHolidayOpen, setAddHolidayOpen] = useState(false);
  const [addShiftOpen, setAddShiftOpen] = useState(false);

  const [holidayForm, setHolidayForm] = useState({ name: '', date: '', day: 'Monday', type: 'National' as Holiday['type'] });
  const [shiftForm, setShiftForm] = useState({ name: '', startTime: '09:00 AM', endTime: '06:00 PM', breakDuration: '1 hour', workingHours: '8 hours' });
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  const handleSaveCompany = () => {
    setToast({ message: 'Company settings updated successfully.', type: 'success' });
  };

  const handleAddHoliday = () => {
    if (!holidayForm.name || !holidayForm.date) return;
    const newHol: Holiday = {
      id: `HOL-0${holidays.length + 1}`,
      name: holidayForm.name,
      date: holidayForm.date,
      day: holidayForm.day,
      type: holidayForm.type,
    };
    setHolidays([...holidays, newHol]);
    setAddHolidayOpen(false);
    setHolidayForm({ name: '', date: '', day: 'Monday', type: 'National' });
    setToast({ message: `Holiday '${newHol.name}' added to calendar.`, type: 'success' });
  };

  const handleAddShift = () => {
    if (!shiftForm.name) return;
    const newShift: Shift = {
      id: `SHIFT-0${shifts.length + 1}`,
      name: shiftForm.name,
      startTime: shiftForm.startTime,
      endTime: shiftForm.endTime,
      breakDuration: shiftForm.breakDuration,
      workingHours: shiftForm.workingHours,
      employees: 0,
      status: 'Active',
    };
    setShifts([...shifts, newShift]);
    setAddShiftOpen(false);
    setShiftForm({ name: '', startTime: '09:00 AM', endTime: '06:00 PM', breakDuration: '1 hour', workingHours: '8 hours' });
    setToast({ message: `Shift timing '${newShift.name}' created.`, type: 'success' });
  };

  const toggleNotif = (id: string, key: 'email' | 'push' | 'sms') => {
    setNotifs(prev =>
      prev.map(n => (n.id === id ? { ...n, [key]: !n[key] } : n))
    );
    setToast({ message: 'Notification preferences updated.', type: 'success' });
  };

  return (
    <div className="max-w-[1600px] mx-auto">
      <PageHeader
        title="Settings & Governance"
        subtitle="Configure company policies, roles, holiday calendars, and preferences"
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Settings' }]}
      />

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden mb-6">
        <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* Tab Contents */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        {activeTab === 'company' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 border-b pb-3">General Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Company Legal Name" name="companyName" value={company.companyName} onChange={(n, v) => setCompany(c => ({ ...c, [n]: v }))} />
              <FormField label="Official Contact Email" name="email" value={company.email} onChange={(n, v) => setCompany(c => ({ ...c, [n]: v }))} />
              <FormField label="Phone Number" name="phone" value={company.phone} onChange={(n, v) => setCompany(c => ({ ...c, [n]: v }))} />
              <FormField label="Website URL" name="website" value={company.website} onChange={(n, v) => setCompany(c => ({ ...c, [n]: v }))} />
              <FormField label="Registered Street Address" name="address" value={company.address} onChange={(n, v) => setCompany(c => ({ ...c, [n]: v }))} />
              <FormField label="City / Region" name="city" value={company.city} onChange={(n, v) => setCompany(c => ({ ...c, [n]: v }))} />
              <FormField label="Fiscal Year Cycle" name="fiscalYearStart" value={company.fiscalYearStart} onChange={(n, v) => setCompany(c => ({ ...c, [n]: v }))} />
              <FormField label="Default Currency" name="currency" value={company.currency} onChange={(n, v) => setCompany(c => ({ ...c, [n]: v }))} />
            </div>
            <div className="flex justify-end pt-4 border-t">
              <button
                onClick={handleSaveCompany}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm flex items-center gap-2"
              >
                <Save size={16} /> Save Changes
              </button>
            </div>
          </div>
        )}

        {activeTab === 'roles' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Roles & Access Control Matrix</h3>
                <p className="text-xs text-slate-500">Define custom roles and module access privileges</p>
              </div>
            </div>

            <div className="space-y-6">
              {roles.map(role => (
                <div key={role.id} className="border rounded-xl p-5 bg-slate-50/50">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                        <Shield size={18} className="text-blue-600" /> {role.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">{role.description}</p>
                    </div>
                    <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-bold">
                      {role.usersCount} Users Assigned
                    </span>
                  </div>

                  <div className="overflow-x-auto bg-white rounded-lg border">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b bg-slate-100/80 text-slate-600 font-semibold uppercase">
                          <th className="p-3">Module</th>
                          <th className="p-3 text-center">View</th>
                          <th className="p-3 text-center">Create</th>
                          <th className="p-3 text-center">Edit</th>
                          <th className="p-3 text-center">Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {role.permissions.map(perm => (
                          <tr key={perm.module} className="border-b last:border-0">
                            <td className="p-3 font-medium text-slate-900">{perm.module}</td>
                            <td className="p-3 text-center">{perm.canView ? <Check size={16} className="text-emerald-600 mx-auto" /> : <span className="text-slate-300">—</span>}</td>
                            <td className="p-3 text-center">{perm.canCreate ? <Check size={16} className="text-emerald-600 mx-auto" /> : <span className="text-slate-300">—</span>}</td>
                            <td className="p-3 text-center">{perm.canEdit ? <Check size={16} className="text-emerald-600 mx-auto" /> : <span className="text-slate-300">—</span>}</td>
                            <td className="p-3 text-center">{perm.canDelete ? <Check size={16} className="text-emerald-600 mx-auto" /> : <span className="text-slate-300">—</span>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'holidays' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Holiday Calendar 2026</h3>
                <p className="text-xs text-slate-500">Official company holidays and regional observances</p>
              </div>
              <button
                onClick={() => setAddHolidayOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-1.5"
              >
                <Plus size={16} /> Add Holiday
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {holidays.map(h => (
                <div key={h.id} className="p-4 border rounded-xl bg-white hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      h.type === 'National' ? 'bg-red-50 text-red-600' : h.type === 'Company' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {h.type}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{h.day}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 mt-2">{h.name}</h4>
                  <p className="text-sm font-bold text-blue-600 mt-1">{h.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'shifts' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Work Shift Configurations</h3>
                <p className="text-xs text-slate-500">Working hours and break timings</p>
              </div>
              <button
                onClick={() => setAddShiftOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-1.5"
              >
                <Plus size={16} /> Add New Shift
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
                    <th className="p-4">Shift Name</th>
                    <th>Timing</th>
                    <th>Break Duration</th>
                    <th>Work Hours</th>
                    <th>Assigned Employees</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {shifts.map(s => (
                    <tr key={s.id} className="border-b hover:bg-slate-50/50">
                      <td className="p-4 font-bold text-slate-900">{s.name}</td>
                      <td className="font-mono text-xs text-slate-700">{s.startTime} - {s.endTime}</td>
                      <td className="text-xs text-slate-500">{s.breakDuration}</td>
                      <td className="font-medium">{s.workingHours}</td>
                      <td className="font-bold text-blue-600">{s.employees}</td>
                      <td><StatusBadge status={s.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-lg font-bold text-slate-900">Notification Preferences</h3>
              <p className="text-xs text-slate-500">Configure email, web push, and SMS dispatch rules</p>
            </div>

            <div className="space-y-4">
              {notifs.map(n => (
                <div key={n.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-slate-50/50">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{n.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{n.description}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600">
                      <input
                        type="checkbox"
                        checked={n.email}
                        onChange={() => toggleNotif(n.id, 'email')}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      Email
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600">
                      <input
                        type="checkbox"
                        checked={n.push}
                        onChange={() => toggleNotif(n.id, 'push')}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      Push
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600">
                      <input
                        type="checkbox"
                        checked={n.sms}
                        onChange={() => toggleNotif(n.id, 'sms')}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      SMS
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Holiday Modal */}
      <Modal
        isOpen={addHolidayOpen}
        onClose={() => setAddHolidayOpen(false)}
        title="Add New Holiday"
        size="md"
        footer={
          <>
            <button onClick={() => setAddHolidayOpen(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
            <button onClick={handleAddHoliday} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Add Holiday</button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Holiday Name" name="name" value={holidayForm.name} onChange={(n, v) => setHolidayForm(f => ({ ...f, [n]: v }))} placeholder="e.g. Diwali" required />
          <FormField label="Date" name="date" type="date" value={holidayForm.date} onChange={(n, v) => setHolidayForm(f => ({ ...f, [n]: v }))} required />
          <FormField label="Day of Week" name="day" value={holidayForm.day} onChange={(n, v) => setHolidayForm(f => ({ ...f, [n]: v }))} placeholder="e.g. Sunday" />
          <FormField label="Category" name="type" type="select" value={holidayForm.type} onChange={(n, v) => setHolidayForm(f => ({ ...f, [n]: v }))} options={[{ value: 'National', label: 'National' }, { value: 'Regional', label: 'Regional' }, { value: 'Company', label: 'Company' }, { value: 'Optional', label: 'Optional' }]} />
        </div>
      </Modal>

      {/* Add Shift Modal */}
      <Modal
        isOpen={addShiftOpen}
        onClose={() => setAddShiftOpen(false)}
        title="Create Work Shift"
        size="md"
        footer={
          <>
            <button onClick={() => setAddShiftOpen(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
            <button onClick={handleAddShift} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Save Shift</button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Shift Name" name="name" value={shiftForm.name} onChange={(n, v) => setShiftForm(f => ({ ...f, [n]: v }))} placeholder="e.g. Night Shift" required />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Start Time" name="startTime" value={shiftForm.startTime} onChange={(n, v) => setShiftForm(f => ({ ...f, [n]: v }))} placeholder="10:00 PM" />
            <FormField label="End Time" name="endTime" value={shiftForm.endTime} onChange={(n, v) => setShiftForm(f => ({ ...f, [n]: v }))} placeholder="07:00 AM" />
          </div>
          <FormField label="Break Duration" name="breakDuration" value={shiftForm.breakDuration} onChange={(n, v) => setShiftForm(f => ({ ...f, [n]: v }))} placeholder="1 hour" />
        </div>
      </Modal>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
