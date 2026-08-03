import { useState } from 'react';
import { FileText, Upload, Download, Search, Folder, Trash2, Eye } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import StatsCard from '../components/shared/StatsCard';
import FilterBar from '../components/shared/FilterBar';
import Modal from '../components/shared/Modal';
import FormField from '../components/shared/FormField';
import Toast from '../components/Toast';
import { documents as initialDocs, documentCategories, documentSummary } from '../data/documents';
import type { DocumentRecord, DocumentCategory } from '../types';

export default function DocumentsPage() {
  const [docs, setDocs] = useState<DocumentRecord[]>(initialDocs);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    category: 'Offer Letter' as DocumentCategory,
    employeeName: '',
    employeeId: '',
  });
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  const filteredDocs = docs.filter(d => {
    if (categoryFilter !== 'All' && d.category !== categoryFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        d.name.toLowerCase().includes(q) ||
        d.employeeName.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleUpload = () => {
    if (!form.name) return;
    const newDoc: DocumentRecord = {
      id: `DOC-0${docs.length + 1}`,
      name: form.name.endsWith('.pdf') ? form.name : `${form.name}.pdf`,
      category: form.category,
      employeeId: form.employeeId || 'EMP-1001',
      employeeName: form.employeeName || 'Aarav Sharma',
      uploadDate: new Date().toISOString().split('T')[0],
      fileSize: '350 KB',
      fileType: 'PDF',
      uploadedBy: 'Admin User',
    };
    setDocs([newDoc, ...docs]);
    setUploadOpen(false);
    setForm({ name: '', category: 'Offer Letter', employeeName: '', employeeId: '' });
    setToast({ message: `Document '${newDoc.name}' uploaded successfully.`, type: 'success' });
  };

  const handleDownload = (docName: string) => {
    setToast({ message: `Downloading ${docName}...`, type: 'success' });
  };

  const handleDelete = (id: string) => {
    setDocs(prev => prev.filter(d => d.id !== id));
    setToast({ message: 'Document deleted.', type: 'success' });
  };

  return (
    <div className="max-w-[1600px] mx-auto">
      <PageHeader
        title="Document Vault"
        subtitle="Manage employee records, contracts, policies, and credentials"
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Documents' }]}
        actions={
          <button
            onClick={() => setUploadOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm font-medium"
          >
            <Upload size={16} /> Upload Document
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
        <StatsCard
          title="Total Documents"
          value={docs.length}
          subtitle="In secure vault"
          icon={<FileText size={20} />}
          color="blue"
        />
        <StatsCard
          title="Policy Documents"
          value={docs.filter(d => d.category === 'Policy Document').length}
          subtitle="Company wide"
          icon={<Folder size={20} />}
          color="purple"
        />
        <StatsCard
          title="Salary Slips"
          value={docs.filter(d => d.category === 'Salary Slip').length}
          subtitle="Archived"
          icon={<FileText size={20} />}
          color="green"
        />
        <StatsCard
          title="Contracts & Offer Letters"
          value={docs.filter(d => d.category === 'Contract' || d.category === 'Offer Letter').length}
          subtitle="Active agreements"
          icon={<FileText size={20} />}
          color="indigo"
        />
      </div>

      {/* Category Folders Quick View */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
        {documentCategories.map(cat => {
          const count = cat === 'All' ? docs.length : docs.filter(d => d.category === cat).length;
          const isActive = categoryFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
              }`}
            >
              <Folder size={18} className={isActive ? 'text-white' : 'text-blue-500'} />
              <p className="font-bold text-xs mt-2 truncate">{cat}</p>
              <p className={`text-[10px] ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>{count} files</p>
            </button>
          );
        })}
      </div>

      {/* Filter Bar */}
      <FilterBar
        search={{
          value: search,
          onChange: setSearch,
          placeholder: 'Search document by file name or employee name...',
        }}
      />

      {/* Documents List / Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
                <th className="p-4">Document Name</th>
                <th>Category</th>
                <th>Associated Employee</th>
                <th>Upload Date</th>
                <th>File Size</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map(doc => (
                <tr key={doc.id} className="border-b hover:bg-slate-50/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-red-50 text-red-600 rounded-lg flex items-center justify-center font-bold text-xs">
                        PDF
                      </div>
                      <div>
                        <b className="text-slate-900">{doc.name}</b>
                        <div className="text-xs text-slate-400">Uploaded by {doc.uploadedBy}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
                      {doc.category}
                    </span>
                  </td>
                  <td className="text-slate-700">{doc.employeeName}</td>
                  <td className="text-xs text-slate-500">{doc.uploadDate}</td>
                  <td className="text-xs text-slate-500 font-mono">{doc.fileSize}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => handleDownload(doc.name)}
                        className="p-1.5 hover:bg-slate-100 rounded text-blue-600"
                        title="Download"
                      >
                        <Download size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="p-1.5 hover:bg-red-50 rounded text-red-400"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        title="Upload Document"
        size="md"
        footer={
          <>
            <button onClick={() => setUploadOpen(false)} className="px-4 py-2 border rounded-lg text-sm">
              Cancel
            </button>
            <button onClick={handleUpload} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
              Upload
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField
            label="Document Name"
            name="name"
            value={form.name}
            onChange={(n, v) => setForm(f => ({ ...f, [n]: v }))}
            placeholder="e.g. Aarav_Sharma_Aadhaar.pdf"
            required
          />
          <FormField
            label="Category"
            name="category"
            type="select"
            value={form.category}
            onChange={(n, v) => setForm(f => ({ ...f, [n]: v }))}
            options={[
              { value: 'Offer Letter', label: 'Offer Letter' },
              { value: 'Joining Letter', label: 'Joining Letter' },
              { value: 'Salary Slip', label: 'Salary Slip' },
              { value: 'Policy Document', label: 'Policy Document' },
              { value: 'ID Proof', label: 'ID Proof' },
              { value: 'Resume', label: 'Resume' },
              { value: 'Contract', label: 'Contract' },
            ]}
          />
          <FormField
            label="Employee Name"
            name="employeeName"
            value={form.employeeName}
            onChange={(n, v) => setForm(f => ({ ...f, [n]: v }))}
            placeholder="e.g. Aarav Sharma (or 'All Employees')"
          />
          <div className="border-2 border-dashed border-slate-200 p-6 rounded-xl text-center">
            <Upload className="mx-auto text-slate-400 mb-2" size={24} />
            <p className="text-sm font-medium text-slate-700">Drag & drop file here or browse</p>
            <p className="text-xs text-slate-400 mt-1">Supports PDF, DOCX, PNG up to 10MB</p>
          </div>
        </div>
      </Modal>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
