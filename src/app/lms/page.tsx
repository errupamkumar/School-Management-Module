'use client';
import { useState } from 'react';
import {
  Library, Plus, Search, Filter, Download, FileText, Video,
  BookOpen, Eye, Clock, CheckCircle2, Share2, UploadCloud, X
} from 'lucide-react';

interface StudyResource {
  id: string;
  title: string;
  subject: string;
  className: string;
  type: 'PDF' | 'VIDEO' | 'DOC' | 'SLIDES';
  fileSize: string;
  downloadCount: number;
  uploadedBy: string;
  uploadedDate: string;
  description: string;
  fileUrl: string;
}

const initialResources: StudyResource[] = [
  {
    id: '1',
    title: 'NCERT Chapter 01: Chemical Reactions & Equations (Comprehensive Notes)',
    subject: 'Science',
    className: 'Class 10',
    type: 'PDF',
    fileSize: '4.8 MB',
    downloadCount: 142,
    uploadedBy: 'Dr. Rajesh Khanna',
    uploadedDate: '2026-09-18',
    description: 'Detailed balancing reactions, oxidation-reduction mechanisms, and CBSE past 10-year board questions.',
    fileUrl: '#',
  },
  {
    id: '2',
    title: 'Trigonometry Identities & Heights & Distances Formula Handbook',
    subject: 'Mathematics',
    className: 'Class 10',
    type: 'PDF',
    fileSize: '2.1 MB',
    downloadCount: 198,
    uploadedBy: 'Sunita Sharma',
    uploadedDate: '2026-09-15',
    description: 'Quick reference sheet with proofs of standard trigonometric ratios and solved examples.',
    fileUrl: '#',
  },
  {
    id: '3',
    title: 'Video Lecture: The French Revolution - Causes & Outbreak (Part 1)',
    subject: 'Social Science',
    className: 'Class 9',
    type: 'VIDEO',
    fileSize: '1080p Stream (38 mins)',
    downloadCount: 89,
    uploadedBy: 'Rameshwar Lal',
    uploadedDate: '2026-09-12',
    description: 'High-definition historical timeline visual breakdown of the Estates General and Bastille storming.',
    fileUrl: '#',
  },
  {
    id: '4',
    title: 'Class 12 Physics: Electrostatics & Coulomb’s Law Lecture Slides',
    subject: 'Physics',
    className: 'Class 12',
    type: 'SLIDES',
    fileSize: '12.4 MB (48 Slides)',
    downloadCount: 115,
    uploadedBy: 'Dr. Rajesh Khanna',
    uploadedDate: '2026-09-10',
    description: 'Animated PowerPoint deck with vector diagrams and solved numerical problems.',
    fileUrl: '#',
  },
  {
    id: '5',
    title: 'CBSE Sample Question Paper 2026-27 with Marking Scheme',
    subject: 'English Core',
    className: 'Class 12',
    type: 'PDF',
    fileSize: '3.5 MB',
    downloadCount: 230,
    uploadedBy: 'Anil Deshmukh',
    uploadedDate: '2026-09-08',
    description: 'Official blueprint, letter writing formats, and reading comprehension passage samples.',
    fileUrl: '#',
  },
];

export default function LmsPage() {
  const [resources, setResources] = useState<StudyResource[]>(initialResources);
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    subject: 'Science',
    className: 'Class 10',
    type: 'PDF' as StudyResource['type'],
    description: '',
    uploadedBy: 'Faculty Member',
    fileUrl: '',
  });

  const filteredResources = resources.filter(res => {
    if (selectedClass !== 'ALL' && res.className !== selectedClass) return false;
    if (selectedType !== 'ALL' && res.type !== selectedType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        res.title.toLowerCase().includes(q) ||
        res.subject.toLowerCase().includes(q) ||
        res.uploadedBy.toLowerCase().includes(q) ||
        res.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.subject) return;

    const newRes: StudyResource = {
      id: String(Date.now()),
      title: formData.title,
      subject: formData.subject,
      className: formData.className,
      type: formData.type,
      fileSize: '3.2 MB',
      downloadCount: 0,
      uploadedBy: formData.uploadedBy,
      uploadedDate: new Date().toISOString().split('T')[0],
      description: formData.description || 'Uploaded educational reference resource',
      fileUrl: formData.fileUrl || '#',
    };

    setResources([newRes, ...resources]);
    setShowUploadModal(false);
    setFormData({
      title: '',
      subject: 'Science',
      className: 'Class 10',
      type: 'PDF',
      description: '',
      uploadedBy: 'Faculty Member',
      fileUrl: '',
    });
  };

  const handleDownloadClick = (id: string) => {
    setResources(resources.map(r => r.id === id ? { ...r, downloadCount: r.downloadCount + 1 } : r));
    alert('Resource download started. File will save to your downloads.');
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-purple-200 text-xs font-semibold uppercase tracking-wider mb-2">
              <Library size={16} />
              <span>Learning Management System • अध्ययन सामग्री</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Study Materials & E-Learning Hub
            </h1>
            <p className="text-purple-100/90 text-sm mt-1 max-w-xl">
              Centralized repository for NCERT revision notes, syllabus breakdowns, solved previous-year papers, and high-definition recorded lectures.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-2xl text-xs sm:text-sm shadow-md transition-all transform hover:-translate-y-0.5"
            >
              <UploadCloud size={16} />
              <span>Upload Study Material</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-purple-100/80 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Documents</span>
          <p className="text-2xl font-black text-gray-900 mt-2">{resources.length}</p>
          <p className="text-xs text-purple-600 font-semibold mt-1">Syllabus & notes repository</p>
        </div>
        <div className="bg-white rounded-3xl p-5 border border-purple-100/80 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Downloads</span>
          <p className="text-2xl font-black text-emerald-600 mt-2">
            {resources.reduce((sum, r) => sum + r.downloadCount, 0)}
          </p>
          <p className="text-xs text-gray-400 mt-1">Student access count</p>
        </div>
        <div className="bg-white rounded-3xl p-5 border border-purple-100/80 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Video Lectures</span>
          <p className="text-2xl font-black text-blue-600 mt-2">
            {resources.filter(r => r.type === 'VIDEO').length}
          </p>
          <p className="text-xs text-gray-400 mt-1">Recorded classroom streams</p>
        </div>
        <div className="bg-white rounded-3xl p-5 border border-purple-100/80 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Covered Classes</span>
          <p className="text-2xl font-black text-purple-700 mt-2">Class 1 to 12</p>
          <p className="text-xs text-gray-400 mt-1">CBSE Board curriculum</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Class Filter */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none"
          >
            <option value="ALL">All Classes</option>
            <option value="Class 10">Class 10</option>
            <option value="Class 9">Class 9</option>
            <option value="Class 12">Class 12</option>
          </select>

          {/* Type Filter */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {['ALL', 'PDF', 'VIDEO', 'SLIDES'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedType === type
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-full lg:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes, chapters, topics..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 outline-none transition-all"
          />
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredResources.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-1 bg-purple-50 text-purple-700 font-bold text-xs rounded-xl">
                  {item.subject} • {item.className}
                </span>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                  item.type === 'PDF' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                  item.type === 'VIDEO' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                  'bg-amber-50 text-amber-700 border border-amber-100'
                }`}>
                  {item.type}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-extrabold text-gray-900 text-base leading-snug line-clamp-2">
                {item.title}
              </h3>
              <p className="text-xs text-gray-500 mt-2 line-clamp-2">{item.description}</p>

              {/* Meta */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                <span>By: <strong className="text-gray-700">{item.uploadedBy}</strong></span>
                <span>{item.fileSize}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                <Download size={13} /> {item.downloadCount} downloads
              </span>

              <button
                onClick={() => handleDownloadClick(item.id)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition-all transform hover:-translate-y-0.5"
              >
                <Download size={14} />
                <span>Get File</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <UploadCloud size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Upload Study Resource</h3>
                  <p className="text-xs text-gray-400">Add documents to student e-learning portal</p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Document / Resource Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chapter 4: Carbon and Its Compounds Handwritten Notes"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Subject *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Science"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Target Class *</label>
                  <select
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 outline-none"
                  >
                    <option value="Class 10">Class 10</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Resource Format *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 outline-none"
                  >
                    <option value="PDF">PDF Document / Notes</option>
                    <option value="VIDEO">Video Lecture Link</option>
                    <option value="SLIDES">PowerPoint / Presentation</option>
                    <option value="DOC">Word / Worksheet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Author / Faculty</label>
                  <input
                    type="text"
                    value={formData.uploadedBy}
                    onChange={(e) => setFormData({ ...formData, uploadedBy: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description / Key Topics</label>
                <textarea
                  rows={2}
                  placeholder="Outline key concepts, formulas or questions included..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md transition-all"
                >
                  Publish Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
