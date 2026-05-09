import { useEffect, useState, useMemo } from 'react';
import { Plus, Search, Pencil, Trash2, ChevronLeft, ChevronRight, Filter, GraduationCap, Loader2 } from 'lucide-react';
import { studentsApi } from '../api/client';
import Modal from '../components/Modal';
import StudentForm from '../components/StudentForm';
import toast from 'react-hot-toast';
import './Students.css';

const COURSE_COLORS = {
  'Computer Science': '#6366f1', 'Mathematics': '#0ea5e9', 'Physics': '#8b5cf6',
  'Chemistry': '#10b981', 'Biology': '#f59e0b', 'Engineering': '#ef4444',
  'Business': '#ec4899', 'Arts': '#14b8a6', 'Law': '#f97316', 'Medicine': '#06b6d4',
};

const PAGE_SIZE = 8;

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null); // null | 'add' | 'edit' | 'delete'
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchStudents = () => {
    setLoading(true);
    studentsApi.getAll()
      .then(r => setStudents(r.data))
      .catch(() => toast.error('Failed to load students'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStudents(); }, []);

  const courses = useMemo(() => [...new Set(students.map(s => s.course))].sort(), [students]);

  const filtered = useMemo(() => students.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.course.toLowerCase().includes(q);
    const matchCourse = !courseFilter || s.course === courseFilter;
    return matchSearch && matchCourse;
  }), [students, search, courseFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (v) => { setSearch(v); setPage(1); };
  const handleFilter = (v) => { setCourseFilter(v); setPage(1); };

  const openAdd = () => { setSelected(null); setModal('add'); };
  const openEdit = (s) => { setSelected(s); setModal('edit'); };
  const openDelete = (s) => { setSelected(s); setModal('delete'); };
  const closeModal = () => { setModal(null); setSelected(null); };

  const handleAdd = async (data) => {
    setSaving(true);
    try {
      await studentsApi.create(data);
      toast.success('Student added successfully!');
      fetchStudents();
      closeModal();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to add student');
    } finally { setSaving(false); }
  };

  const handleEdit = async (data) => {
    setSaving(true);
    try {
      await studentsApi.update(selected.id, data);
      toast.success('Student updated successfully!');
      fetchStudents();
      closeModal();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update student');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await studentsApi.delete(selected.id);
      toast.success('Student deleted');
      fetchStudents();
      closeModal();
    } catch {
      toast.error('Failed to delete student');
    } finally { setSaving(false); }
  };

  return (
    <div className="students-page fade-in">
      <div className="students-toolbar">
        <div className="toolbar-left">
          <div className="search-box">
            <Search size={15} className="search-box-icon" />
            <input
              placeholder="Search by name, email or course..."
              value={search}
              onChange={e => handleSearch(e.target.value)}
            />
          </div>
          <div className="filter-box">
            <Filter size={14} className="filter-icon" />
            <select value={courseFilter} onChange={e => handleFilter(e.target.value)}>
              <option value="">All Courses</option>
              {courses.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={16} /> Add Student
        </button>
      </div>

      <div className="students-card">
        <div className="table-meta">
          <span className="table-count">
            {loading ? 'Loading...' : `${filtered.length} student${filtered.length !== 1 ? 's' : ''} found`}
          </span>
        </div>

        {loading ? (
          <div className="table-loading">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton-row-full" style={{ animationDelay: `${i * 0.07}s` }} />
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <div className="table-empty">
            <GraduationCap size={48} />
            <h3>{search || courseFilter ? 'No results found' : 'No students yet'}</h3>
            <p>{search || courseFilter ? 'Try adjusting your search or filter.' : 'Click "Add Student" to enroll the first student.'}</p>
            {!search && !courseFilter && (
              <button className="btn btn-primary" onClick={openAdd}><Plus size={15} /> Add Student</button>
            )}
          </div>
        ) : (
          <>
            <div className="table-wrap">
              <table className="students-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Student</th>
                    <th>Course</th>
                    <th>Age</th>
                    <th>Enrolled</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((s, i) => {
                    const color = COURSE_COLORS[s.course] || '#6366f1';
                    return (
                      <tr key={s.id} className="table-row">
                        <td className="row-num">{(page - 1) * PAGE_SIZE + i + 1}</td>
                        <td>
                          <div className="student-info">
                            <div className="s-avatar" style={{ background: color }}>
                              {s.name[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="s-name">{s.name}</p>
                              <p className="s-email">{s.email}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="course-pill" style={{ '--c': color }}>{s.course}</span>
                        </td>
                        <td><span className="age-pill">{s.age} yrs</span></td>
                        <td className="date-col">{new Date(s.createdDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                        <td>
                          <div className="row-actions">
                            <button className="action-btn edit-btn" onClick={() => openEdit(s)} title="Edit">
                              <Pencil size={14} />
                            </button>
                            <button className="action-btn delete-btn" onClick={() => openDelete(s)} title="Delete">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <span className="page-info">Page {page} of {totalPages}</span>
                <div className="page-btns">
                  <button className="page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>
                    <ChevronLeft size={16} />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      className={`page-btn ${page === i + 1 ? 'active' : ''}`}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {modal === 'add' && (
        <Modal title="Add New Student" onClose={closeModal}>
          <StudentForm onSubmit={handleAdd} onCancel={closeModal} loading={saving} />
        </Modal>
      )}

      {modal === 'edit' && selected && (
        <Modal title="Edit Student" onClose={closeModal}>
          <StudentForm initial={selected} onSubmit={handleEdit} onCancel={closeModal} loading={saving} />
        </Modal>
      )}

      {modal === 'delete' && selected && (
        <Modal title="Delete Student" onClose={closeModal}>
          <div className="delete-confirm">
            <div className="delete-icon-wrap">
              <Trash2 size={28} />
            </div>
            <h3>Are you sure?</h3>
            <p>You are about to delete <strong>{selected.name}</strong>. This action cannot be undone.</p>
            <div className="delete-actions">
              <button className="btn btn-ghost" onClick={closeModal} disabled={saving}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={saving}>
                {saving ? <><Loader2 size={14} className="spin" /> Deleting...</> : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
