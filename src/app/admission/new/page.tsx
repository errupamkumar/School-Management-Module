'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { PageHeader } from '@/components/ui';
import { Save, Upload, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { INDIAN_STATES, CLASS_NAMES, SECTION_NAMES } from '@/utils/helpers';

export default function NewAdmissionPage() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'student' | 'parent' | 'academic' | 'address'>('student');

  const [form, setForm] = useState({
    // Student Info
    firstName: '', lastName: '', gender: '', dob: '', bloodGroup: '', religion: '',
    caste: '', category: '', nationality: 'Indian', aadhaarNo: '', photo: null as File | null,
    signatureHindi: null as File | null, signatureEnglish: null as File | null,
    // Parent Info
    fatherName: '', fatherIdCard: '', fatherEmail: '', fatherPhone: '',
    motherName: '', motherPhone: '', religion_parent: '', fatherOccupation: '', motherOccupation: '', annualIncome: '',
    // Academic Info
    campusId: '', classId: '', sectionId: '', previousSchool: '', tcNumber: '',
    // Address
    streetAddress: '', village: '', post: '', policeStation: '', city: '', district: '', state: 'Uttar Pradesh', pincode: '',
  });

  const [campuses, setCampuses] = useState<Array<{ id: string; name: string }>>([]);
  const [classes, setClasses] = useState<Array<{ id: string; name: string; sections: Array<{ id: string; name: string; capacity?: number }> }>>([]);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [capacityStatus, setCapacityStatus] = useState<{ availableSeats: number; maxCapacity: number } | null>(null);
  const [admittedStudent, setAdmittedStudent] = useState<any>(null);

  useEffect(() => {
    fetch('/api/campus')
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data && d.data.length > 0) {
          setCampuses(d.data);
          update('campusId', d.data[0].id);
        }
      })
      .catch(() => {});

    fetch('/api/classes')
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data && d.data.length > 0) {
          setClasses(d.data);
          update('classId', d.data[0].id);
          if (d.data[0].sections && d.data[0].sections.length > 0) {
            update('sectionId', d.data[0].sections[0].id);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Check section capacity whenever class or section changes
  useEffect(() => {
    if (!form.classId) return;
    const q = new URLSearchParams({
      action: 'check-capacity',
      classId: form.classId,
      ...(form.sectionId ? { sectionId: form.sectionId } : {}),
    });
    fetch(`/api/admission?${q.toString()}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          setCapacityStatus(res.data);
        }
      })
      .catch(() => {});
  }, [form.classId, form.sectionId]);

  // Duplicate identity check helper
  const checkDuplicates = async () => {
    if ((form.aadhaarNo && form.aadhaarNo.length === 12) || (form.fatherPhone && form.fatherPhone.length === 10)) {
      try {
        const q = new URLSearchParams({
          action: 'check-duplicate',
          aadhaarNo: form.aadhaarNo || '',
          phone: form.fatherPhone || '',
          firstName: form.firstName || '',
          lastName: form.lastName || '',
        });
        const res = await fetch(`/api/admission?${q.toString()}`);
        const data = await res.json();
        if (data.success && data.isDuplicate && data.matches?.length > 0) {
          setDuplicateWarning(`Warning: ${data.matches[0].description}`);
        } else {
          setDuplicateWarning(null);
        }
      } catch {}
    }
  };

  const update = (key: string, value: any) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/students', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) {
        toast.success(`Student admitted! Admission No: ${data.data.admissionNo}`);
        setAdmittedStudent(data.data);
      } else {
        toast.error(data.error || 'Failed to admit student');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { key: 'student', label: 'Student Information', labelHi: 'छात्र जानकारी' },
    { key: 'parent', label: 'Parent Information', labelHi: 'अभिभावक जानकारी' },
    { key: 'academic', label: 'Academic Information', labelHi: 'शैक्षणिक जानकारी' },
    { key: 'address', label: 'Student Address', labelHi: 'छात्र का पता' },
  ];

  return (
    <DashboardLayout>
      <PageHeader title="New Admission" subtitle="Register a new student in the system" actions={<button className="btn-primary" form="admission-form"><UserPlus size={16} /> Submit Details</button>} />

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key as any)} className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {duplicateWarning && (
        <div className="mb-4 p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold flex items-center justify-between">
          <span>{duplicateWarning}</span>
          <button type="button" onClick={() => setDuplicateWarning(null)} className="text-amber-700 underline font-bold">Dismiss</button>
        </div>
      )}

      {admittedStudent && (
        <div className="mb-6 p-5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="font-bold text-sm">Student Successfully Admitted!</h4>
            <p className="text-xs text-emerald-700 mt-0.5">
              Admission No: <span className="font-mono font-bold">{admittedStudent.admissionNo}</span>
            </p>
          </div>
          <a
            href={`/fees/collect?admissionNo=${admittedStudent.admissionNo}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            <span>Proceed to Collect First Fee</span>
            <span className="font-mono">→</span>
          </a>
        </div>
      )}

      <form id="admission-form" onSubmit={handleSubmit}>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          {/* Student Information Tab */}
          {activeTab === 'student' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className="form-label">First Name *</label>
                <input type="text" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} className="form-input" required />
              </div>
              <div>
                <label className="form-label">Last Name *</label>
                <input type="text" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} className="form-input" required />
              </div>
              <div>
                <label className="form-label">Gender *</label>
                <select value={form.gender} onChange={(e) => update('gender', e.target.value)} className="form-select" required>
                  <option value="">Select Gender</option>
                  <option value="MALE">Male / पुरुष</option>
                  <option value="FEMALE">Female / महिला</option>
                  <option value="OTHER">Other / अन्य</option>
                </select>
              </div>
              <div>
                <label className="form-label">Date of Birth *</label>
                <input type="date" value={form.dob} onChange={(e) => update('dob', e.target.value)} className="form-input" required />
              </div>
              <div>
                <label className="form-label">Blood Group</label>
                <select value={form.bloodGroup} onChange={(e) => update('bloodGroup', e.target.value)} className="form-select">
                  <option value="">Select</option>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => <option key={bg} value={bg}>{bg}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Religion</label>
                <select value={form.religion} onChange={(e) => update('religion', e.target.value)} className="form-select">
                  <option value="">Select</option>
                  {['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other'].map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Caste</label>
                <input type="text" value={form.caste} onChange={(e) => update('caste', e.target.value)} className="form-input" />
              </div>
              <div>
                <label className="form-label">Category</label>
                <select value={form.category} onChange={(e) => update('category', e.target.value)} className="form-select">
                  <option value="">Select</option>
                  {['General', 'OBC', 'SC', 'ST', 'EWS'].map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Aadhaar Number</label>
                <input type="text" value={form.aadhaarNo} onChange={(e) => update('aadhaarNo', e.target.value)} onBlur={checkDuplicates} className="form-input" maxLength={12} placeholder="12-digit Aadhaar" />
              </div>
              <div>
                <label className="form-label">Photo Upload</label>
                <input type="file" accept="image/*" onChange={(e) => update('photo', e.target.files?.[0])} className="form-input" />
              </div>
              <div>
                <label className="form-label">Signature (Hindi)</label>
                <input type="file" accept="image/*" onChange={(e) => update('signatureHindi', e.target.files?.[0])} className="form-input" />
              </div>
              <div>
                <label className="form-label">Signature (English)</label>
                <input type="file" accept="image/*" onChange={(e) => update('signatureEnglish', e.target.files?.[0])} className="form-input" />
              </div>
            </div>
          )}

          {/* Parent Information Tab */}
          {activeTab === 'parent' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className="form-label">Father Name *</label>
                <input type="text" value={form.fatherName} onChange={(e) => update('fatherName', e.target.value)} className="form-input" required />
              </div>
              <div>
                <label className="form-label">Father ID Card (Aadhaar)</label>
                <input type="text" value={form.fatherIdCard} onChange={(e) => update('fatherIdCard', e.target.value)} className="form-input" />
              </div>
              <div>
                <label className="form-label">Father Email</label>
                <input type="email" value={form.fatherEmail} onChange={(e) => update('fatherEmail', e.target.value)} className="form-input" />
              </div>
              <div>
                <label className="form-label">Father Phone No *</label>
                <input type="tel" value={form.fatherPhone} onChange={(e) => update('fatherPhone', e.target.value)} onBlur={checkDuplicates} className="form-input" maxLength={10} required />
              </div>
              <div>
                <label className="form-label">Mother Name</label>
                <input type="text" value={form.motherName} onChange={(e) => update('motherName', e.target.value)} className="form-input" />
              </div>
              <div>
                <label className="form-label">Mother Phone No</label>
                <input type="tel" value={form.motherPhone} onChange={(e) => update('motherPhone', e.target.value)} className="form-input" maxLength={10} />
              </div>
              <div>
                <label className="form-label">Father Occupation</label>
                <input type="text" value={form.fatherOccupation} onChange={(e) => update('fatherOccupation', e.target.value)} className="form-input" />
              </div>
              <div>
                <label className="form-label">Mother Occupation</label>
                <input type="text" value={form.motherOccupation} onChange={(e) => update('motherOccupation', e.target.value)} className="form-input" />
              </div>
              <div>
                <label className="form-label">Annual Income (₹)</label>
                <input type="number" value={form.annualIncome} onChange={(e) => update('annualIncome', e.target.value)} className="form-input" />
              </div>
            </div>
          )}

          {/* Academic Information Tab */}
          {activeTab === 'academic' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className="form-label">Campus *</label>
                <select value={form.campusId} onChange={(e) => update('campusId', e.target.value)} className="form-select" required>
                  <option value="">Select Campus</option>
                  {campuses.map((camp) => (
                    <option key={camp.id} value={camp.id}>{camp.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Class *</label>
                <select
                  value={form.classId}
                  onChange={(e) => {
                    const newClassId = e.target.value;
                    update('classId', newClassId);
                    const selected = classes.find((c) => c.id === newClassId);
                    if (selected && selected.sections?.length > 0) {
                      update('sectionId', selected.sections[0].id);
                    } else {
                      update('sectionId', '');
                    }
                  }}
                  className="form-select"
                  required
                >
                  <option value="">Select Class</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>Class {c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="form-label !mb-0">Section *</label>
                  {capacityStatus && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {capacityStatus.availableSeats} / {capacityStatus.maxCapacity} Seats Available
                    </span>
                  )}
                </div>
                <select value={form.sectionId} onChange={(e) => update('sectionId', e.target.value)} className="form-select" required>
                  <option value="">Select Section</option>
                  {(classes.find((c) => c.id === form.classId)?.sections || []).map((s) => (
                    <option key={s.id} value={s.id}>Section {s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Previous School</label>
                <input type="text" value={form.previousSchool} onChange={(e) => update('previousSchool', e.target.value)} className="form-input" />
              </div>
              <div>
                <label className="form-label">TC & Other Documents</label>
                <input type="file" multiple className="form-input" />
              </div>
            </div>
          )}

          {/* Address Tab */}
          {activeTab === 'address' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-3">
                <label className="form-label">Street Address</label>
                <input type="text" value={form.streetAddress} onChange={(e) => update('streetAddress', e.target.value)} className="form-input" />
              </div>
              <div>
                <label className="form-label">Village / Mohalla</label>
                <input type="text" value={form.village} onChange={(e) => update('village', e.target.value)} className="form-input" />
              </div>
              <div>
                <label className="form-label">Post</label>
                <input type="text" value={form.post} onChange={(e) => update('post', e.target.value)} className="form-input" />
              </div>
              <div>
                <label className="form-label">Police Station / थाना</label>
                <input type="text" value={form.policeStation} onChange={(e) => update('policeStation', e.target.value)} className="form-input" />
              </div>
              <div>
                <label className="form-label">City</label>
                <input type="text" value={form.city} onChange={(e) => update('city', e.target.value)} className="form-input" />
              </div>
              <div>
                <label className="form-label">District / जिला</label>
                <input type="text" value={form.district} onChange={(e) => update('district', e.target.value)} className="form-input" />
              </div>
              <div>
                <label className="form-label">State</label>
                <select value={form.state} onChange={(e) => update('state', e.target.value)} className="form-select">
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Pin Code</label>
                <input type="text" value={form.pincode} onChange={(e) => update('pincode', e.target.value)} className="form-input" maxLength={6} />
              </div>
            </div>
          )}

          {/* Navigation + Submit */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            <button type="button" onClick={() => {
              const order = ['student', 'parent', 'academic', 'address'];
              const idx = order.indexOf(activeTab);
              if (idx > 0) setActiveTab(order[idx - 1] as any);
            }} className="btn-secondary" disabled={activeTab === 'student'}>Previous</button>

            {activeTab !== 'address' ? (
              <button type="button" onClick={() => {
                const order = ['student', 'parent', 'academic', 'address'];
                const idx = order.indexOf(activeTab);
                if (idx < order.length - 1) setActiveTab(order[idx + 1] as any);
              }} className="btn-primary">Next</button>
            ) : (
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Submitting...' : <><Save size={16} /> Submit Details</>}
              </button>
            )}
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
}
