import { useState } from 'react';
import { FileText, Upload, Download, Search, Folder, Trash2, Eye } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import StatsCard from '../components/shared/StatsCard';
import FilterBar from '../components/shared/FilterBar';
import Modal from '../components/shared/Modal';
import FormField from '../components/shared/FormField';
import { useToast } from '../contexts/ToastContext';
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
  const { addToast } = useToast();

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
    addToast(`Document '${newDoc.name}' uploaded successfully.`, 'success');
  };

  const handleDownload = (docName: string) => {
    addToast(`Downloading ${docName}...`, 'success');
  };

  const handleDelete = (id: string) => {
    setDocs(prev => prev.filter(d => d.id !== id));
    addToast('Document deleted.', 'success');
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      <PageHeader
        title="Document Vault"
        subtitle="Manage employee records, contracts, policies, and credentials"
        actions={
          <button
            onClick={() => setUploadOpen(true)}
            className="px-4 py-2 bg-blue-600 shadow-sm text-white font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm transition-colors"
          >
            <Upload size={16} /> Upload Document
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
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
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {documentCategories.map(cat => {
          const count = cat === 'All' ? docs.length : docs.filter(d => d.category === cat).length;
          const isActive = categoryFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`p-4 rounded-xl border text-left transition-all ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-[1.02]'
                  : 'bg-white text-slate-700 hover:bg-blue-50 hover:border-blue-200 border-slate-200'
              }`}
            >
              <Folder size={20} className={isActive ? 'text-white' : 'text-blue-500'} />
              <p className="font-bold text-xs mt-3 truncate leading-tight">{cat}</p>
              <p className={`text-[10px] mt-1 ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>{count} files</p>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        {/* Filter Bar */}
        <FilterBar
          search={{
            value: search,
            onChange: setSearch,
            placeholder: 'Search document by file name or employee name...',
          }}
        />

        {/* Documents List / Table */}
        <div className="mt-4 border border-slate-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                  <th className="p-4">Document Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Associated Employee</th>
                  <th className="p-4">Upload Date</th>
                  <th className="p-4">File Size</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDocs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500 font-medium">
                      No documents found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredDocs.map(doc => (
                    <tr key={doc.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center font-bold text-xs shadow-sm border border-red-100">
                            PDF
                          </div>
                          <div>
                            <b className="text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer">{doc.name}</b>
                            <div className="text-xs text-slate-500 mt-0.5">Uploaded by {doc.uploadedBy}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-xs font-medium">
                          {doc.category}
                        </span>
                      </td>
                      <td className="p-4 text-slate-700 font-medium">{doc.employeeName}</td>
                      <td className="p-4 text-xs text-slate-500">{doc.uploadDate}</td>
                      <td className="p-4 text-xs text-slate-500 font-mono">{doc.fileSize}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleDownload(doc.name)}
                            className="p-1.5 hover:bg-blue-50 rounded-md text-slate-400 hover:text-blue-600 transition-colors"
                            title="Download"
                          >
                            <Download size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(doc.id)}
                            className="p-1.5 hover:bg-red-50 rounded-md text-slate-400 hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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
            <button onClick={() => setUploadOpen(false)} className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-sm font-medium transition-colors">
              Cancel
            </button>
            <button onClick={handleUpload} className="px-4 py-2 bg-blue-600 shadow-sm text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors">
              Upload
            </button>
          </>
        }
      >
        <div className="space-y-4 p-1">
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
          <div className="border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/50 transition-colors p-8 rounded-xl text-center cursor-pointer">
            <Upload className="mx-auto text-slate-400 mb-3" size={28} />
            <p className="text-sm font-medium text-slate-700">Drag & drop file here or click to browse</p>
            <p className="text-xs text-slate-500 mt-2">Supports PDF, DOCX, PNG up to 10MB</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
