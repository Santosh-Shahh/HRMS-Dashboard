import { useState } from 'react';
import { UsersRound, Briefcase, UserCheck, Calendar, Plus, LayoutGrid, List, FileText, Star, Clock } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import StatsCard from '../components/shared/StatsCard';
import StatusBadge from '../components/shared/StatusBadge';
import TabBar from '../components/shared/TabBar';
import Modal from '../components/shared/Modal';
import FormField from '../components/shared/FormField';
import Toast from '../components/Toast';
import { jobOpenings as initialJobs, candidates as initialCandidates, recruitmentSummary } from '../data/recruitment';
import type { JobOpening, Candidate, RecruitmentStage } from '../types';

const stages: RecruitmentStage[] = ['Applied', 'Screening', 'Interview', 'HR Round', 'Selected', 'Rejected'];

export default function RecruitmentPage() {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [jobs, setJobs] = useState<JobOpening[]>(initialJobs);
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [selectedJob, setSelectedJob] = useState<string>('all');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [addJobOpen, setAddJobOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({ date: '', time: '', notes: '' });
  const [jobForm, setJobForm] = useState({ title: '', department: 'Engineering', location: 'Remote', type: 'Full-Time', experience: '', salary: '', description: '' });
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  const filteredCandidates = selectedJob === 'all'
    ? candidates
    : candidates.filter(c => c.jobId === selectedJob);

  const handleStageChange = (candidateId: string, newStage: RecruitmentStage) => {
    setCandidates(prev =>
      prev.map(c => (c.id === candidateId ? { ...c, stage: newStage } : c))
    );
    setToast({ message: `Candidate moved to ${newStage}`, type: 'success' });
  };

  const handleAddJob = () => {
    if (!jobForm.title) return;
    const newJob: JobOpening = {
      id: `JOB-00${jobs.length + 1}`,
      title: jobForm.title,
      department: jobForm.department as any,
      location: jobForm.location,
      type: jobForm.type as any,
      experience: jobForm.experience || '2-4 years',
      salary: jobForm.salary || 'Competitive',
      postedDate: new Date().toISOString().split('T')[0],
      closingDate: '2026-08-30',
      status: 'Open',
      applicants: 0,
      description: jobForm.description,
    };
    setJobs([newJob, ...jobs]);
    setAddJobOpen(false);
    setToast({ message: `Job opening '${newJob.title}' created.`, type: 'success' });
  };

  const handleScheduleInterview = () => {
    if (!selectedCandidate || !scheduleForm.date) return;
    setCandidates(prev =>
      prev.map(c =>
        c.id === selectedCandidate.id
          ? { ...c, stage: 'Interview', interviewDate: scheduleForm.date, interviewTime: scheduleForm.time }
          : c
      )
    );
    setScheduleOpen(false);
    setSelectedCandidate(null);
    setToast({ message: `Interview scheduled with ${selectedCandidate.name}`, type: 'success' });
  };

  return (
    <div className="max-w-[1600px] mx-auto">
      <PageHeader
        title="Recruitment & ATS"
        subtitle="Manage job requisitions, candidate pipelines, and interviews"
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Recruitment' }]}
        actions={
          <div className="flex gap-3">
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 ${viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
              >
                <LayoutGrid size={14} /> Kanban
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 ${viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
              >
                <List size={14} /> Table View
              </button>
            </div>
            <button
              onClick={() => setAddJobOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm"
            >
              <Plus size={16} /> Post New Job
            </button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
        <StatsCard
          title="Active Job Openings"
          value={jobs.filter(j => j.status === 'Open').length}
          subtitle="Across 5 departments"
          icon={<Briefcase size={20} />}
          color="blue"
        />
        <StatsCard
          title="Total Candidates"
          value={candidates.length}
          subtitle="In pipeline"
          icon={<UsersRound size={20} />}
          color="indigo"
        />
        <StatsCard
          title="Interviews Scheduled"
          value={candidates.filter(c => c.interviewDate).length}
          subtitle="This week"
          icon={<Calendar size={20} />}
          color="amber"
        />
        <StatsCard
          title="Offers Extended"
          value={candidates.filter(c => c.stage === 'Selected').length}
          subtitle="Pending acceptance"
          icon={<UserCheck size={20} />}
          color="green"
        />
      </div>

      {/* Filter by Job Posting */}
      <div className="flex items-center gap-3 mb-6 bg-white p-4 rounded-xl border">
        <span className="text-xs font-bold uppercase text-slate-500">Filter by Job Posting:</span>
        <select
          value={selectedJob}
          onChange={e => setSelectedJob(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border rounded-lg text-sm focus:outline-none"
        >
          <option value="all">All Active Positions ({candidates.length} candidates)</option>
          {jobs.map(j => (
            <option key={j.id} value={j.id}>{j.title} ({j.department})</option>
          ))}
        </select>
      </div>

      {/* Views */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {stages.map(stage => {
            const stageCandidates = filteredCandidates.filter(c => c.stage === stage);
            return (
              <div key={stage} className="bg-slate-100/70 p-3 rounded-xl min-w-[240px] flex flex-col h-full border border-slate-200/60">
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-xs font-bold uppercase text-slate-600">{stage}</span>
                  <span className="bg-slate-200 text-slate-700 text-xs px-2 py-0.5 rounded-full font-bold">
                    {stageCandidates.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
                  {stageCandidates.map(c => (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCandidate(c)}
                      className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                          {c.initials}
                        </div>
                        <div className="flex items-center text-amber-500 text-xs font-bold">
                          <Star size={12} className="fill-amber-400 mr-0.5" /> {c.rating}
                        </div>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{c.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{c.jobTitle}</p>
                      <p className="text-[11px] text-slate-400 mt-2">{c.experience}</p>

                      {c.interviewDate && (
                        <div className="mt-3 text-[11px] bg-amber-50 text-amber-700 p-1.5 rounded flex items-center gap-1 font-medium">
                          <Clock size={12} /> {c.interviewDate} @ {c.interviewTime}
                        </div>
                      )}

                      <div className="mt-3 pt-2 border-t flex justify-between items-center text-[10px]">
                        <span className="text-slate-400">{c.appliedDate}</span>
                        <select
                          value={c.stage}
                          onClick={e => e.stopPropagation()}
                          onChange={e => handleStageChange(c.id, e.target.value as RecruitmentStage)}
                          className="bg-slate-50 border text-[10px] rounded px-1 py-0.5 text-slate-600 focus:outline-none"
                        >
                          {stages.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
                <th className="p-4">Candidate</th>
                <th>Applied Position</th>
                <th>Stage</th>
                <th>Experience</th>
                <th>Applied Date</th>
                <th>Rating</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.map(c => (
                <tr key={c.id} className="border-b hover:bg-slate-50/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                        {c.initials}
                      </div>
                      <div>
                        <b className="text-slate-900">{c.name}</b>
                        <div className="text-xs text-slate-400">{c.email} • {c.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td>{c.jobTitle}</td>
                  <td><StatusBadge status={c.stage} /></td>
                  <td className="text-xs text-slate-600">{c.experience}</td>
                  <td className="text-xs text-slate-500">{c.appliedDate}</td>
                  <td className="text-amber-500 font-bold">★ {c.rating}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedCandidate(c)}
                      className="px-3 py-1 border rounded text-xs hover:bg-slate-50 text-blue-600 font-medium"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Candidate Profile Modal */}
      <Modal
        isOpen={!!selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        title="Candidate Profile"
        size="lg"
        footer={
          <>
            <button onClick={() => setSelectedCandidate(null)} className="px-4 py-2 border rounded-lg text-sm">
              Close
            </button>
            <button
              onClick={() => { setScheduleOpen(true); }}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm flex items-center gap-2"
            >
              <Calendar size={16} /> Schedule Interview
            </button>
          </>
        }
      >
        {selectedCandidate && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 border-b pb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xl flex items-center justify-center">
                {selectedCandidate.initials}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{selectedCandidate.name}</h3>
                <p className="text-sm text-slate-500">{selectedCandidate.jobTitle} Candidate</p>
                <div className="flex gap-4 text-xs text-slate-400 mt-1">
                  <span>{selectedCandidate.email}</span>
                  <span>•</span>
                  <span>{selectedCandidate.phone}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-slate-500 uppercase font-semibold">Current Pipeline Stage</span>
                <div className="mt-1"><StatusBadge status={selectedCandidate.stage} /></div>
              </div>
              <div>
                <span className="text-xs text-slate-500 uppercase font-semibold">Experience</span>
                <p className="font-medium mt-1">{selectedCandidate.experience}</p>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-500 uppercase font-semibold">Key Skills</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedCandidate.skills.map(s => (
                  <span key={s} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-md font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-500 uppercase font-semibold">Interviewer Notes</span>
              <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border mt-1 italic">
                "{selectedCandidate.notes}"
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Post Job Modal */}
      <Modal
        isOpen={addJobOpen}
        onClose={() => setAddJobOpen(false)}
        title="Post New Job Requisition"
        size="lg"
        footer={
          <>
            <button onClick={() => setAddJobOpen(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
            <button onClick={handleAddJob} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Publish Job</button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Job Title" name="title" value={jobForm.title} onChange={(n, v) => setJobForm(f => ({ ...f, [n]: v }))} placeholder="e.g. Senior Frontend Engineer" required />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Department" name="department" type="select" value={jobForm.department} onChange={(n, v) => setJobForm(f => ({ ...f, [n]: v }))} options={['Engineering', 'Call Center', 'Hunt Ads', 'Support', 'HR', 'Finance', 'Marketing'].map(d => ({ value: d, label: d }))} />
            <FormField label="Location" name="location" value={jobForm.location} onChange={(n, v) => setJobForm(f => ({ ...f, [n]: v }))} placeholder="e.g. Gurgaon / Remote" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Employment Type" name="type" type="select" value={jobForm.type} onChange={(n, v) => setJobForm(f => ({ ...f, [n]: v }))} options={[{ value: 'Full-Time', label: 'Full-Time' }, { value: 'Part-Time', label: 'Part-Time' }, { value: 'Contract', label: 'Contract' }]} />
            <FormField label="Experience Required" name="experience" value={jobForm.experience} onChange={(n, v) => setJobForm(f => ({ ...f, [n]: v }))} placeholder="e.g. 3-5 years" />
          </div>
          <FormField label="Salary Range" name="salary" value={jobForm.salary} onChange={(n, v) => setJobForm(f => ({ ...f, [n]: v }))} placeholder="e.g. ₹10L - ₹15L" />
          <FormField label="Description" name="description" type="textarea" value={jobForm.description} onChange={(n, v) => setJobForm(f => ({ ...f, [n]: v }))} placeholder="Key responsibilities and qualifications..." />
        </div>
      </Modal>

      {/* Schedule Interview Modal */}
      <Modal
        isOpen={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        title={`Schedule Interview - ${selectedCandidate?.name}`}
        size="md"
        footer={
          <>
            <button onClick={() => setScheduleOpen(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
            <button onClick={handleScheduleInterview} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Confirm Interview</button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Date" name="date" type="date" value={scheduleForm.date} onChange={(n, v) => setScheduleForm(f => ({ ...f, [n]: v }))} required />
          <FormField label="Time" name="time" type="text" value={scheduleForm.time} onChange={(n, v) => setScheduleForm(f => ({ ...f, [n]: v }))} placeholder="e.g. 11:00 AM" required />
          <FormField label="Notes for Candidate" name="notes" type="textarea" value={scheduleForm.notes} onChange={(n, v) => setScheduleForm(f => ({ ...f, [n]: v }))} placeholder="Google Meet link or location details..." />
        </div>
      </Modal>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
