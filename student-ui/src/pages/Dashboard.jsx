import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, TrendingUp, Award, ArrowRight, GraduationCap } from 'lucide-react';
import { studentsApi } from '../api/client';
import './Dashboard.css';

const COURSE_COLORS = {
  'Computer Science': '#6366f1', 'Mathematics': '#0ea5e9', 'Physics': '#8b5cf6',
  'Chemistry': '#10b981', 'Biology': '#f59e0b', 'Engineering': '#ef4444',
  'Business': '#ec4899', 'Arts': '#14b8a6', 'Law': '#f97316', 'Medicine': '#06b6d4',
};

function StatCard({ icon: Icon, label, value, sub, color, loading }) {
  return (
    <div className="stat-card">
      <div className="stat-card-icon" style={{ background: `${color}18`, color }}>
        <Icon size={22} />
      </div>
      <div className="stat-card-body">
        <p className="stat-card-label">{label}</p>
        {loading
          ? <div className="skeleton skeleton-h2" />
          : <h2 className="stat-card-value">{value}</h2>}
        <p className="stat-card-sub">{sub}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentsApi.getAll()
      .then(r => setStudents(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const courses = [...new Set(students.map(s => s.course))].length;
  const avgAge = students.length
    ? Math.round(students.reduce((a, s) => a + s.age, 0) / students.length)
    : 0;

  const courseBreakdown = students.reduce((acc, s) => {
    acc[s.course] = (acc[s.course] || 0) + 1;
    return acc;
  }, {});

  const recent = [...students].sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)).slice(0, 5);

  return (
    <div className="dashboard fade-in">
      <div className="stats-grid">
        <StatCard icon={Users} label="Total Students" value={students.length} sub="Enrolled students" color="#6366f1" loading={loading} />
        <StatCard icon={BookOpen} label="Courses" value={courses} sub="Active programs" color="#0ea5e9" loading={loading} />
        <StatCard icon={TrendingUp} label="Average Age" value={avgAge || '—'} sub="Across all students" color="#10b981" loading={loading} />
        <StatCard icon={Award} label="Top Course" value={Object.entries(courseBreakdown).sort((a,b)=>b[1]-a[1])[0]?.[0] || '—'} sub="Most enrolled" color="#f59e0b" loading={loading} />
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h3>Recent Students</h3>
            <Link to="/students" className="card-link">View all <ArrowRight size={14} /></Link>
          </div>
          {loading ? (
            <div className="skeleton-list">
              {[...Array(5)].map((_, i) => <div key={i} className="skeleton skeleton-row" />)}
            </div>
          ) : recent.length === 0 ? (
            <div className="empty-state">
              <GraduationCap size={40} />
              <p>No students yet</p>
              <Link to="/students" className="btn btn-primary" style={{marginTop:8}}>Add First Student</Link>
            </div>
          ) : (
            <div className="recent-table-wrap">
              <table className="recent-table">
                <thead>
                  <tr><th>Student</th><th>Course</th><th>Age</th><th>Joined</th></tr>
                </thead>
                <tbody>
                  {recent.map(s => (
                    <tr key={s.id}>
                      <td>
                        <div className="student-cell">
                          <div className="student-mini-avatar" style={{ background: COURSE_COLORS[s.course] || '#6366f1' }}>
                            {s.name[0].toUpperCase()}
                          </div>
                          <div>
                            <span className="student-cell-name">{s.name}</span>
                            <span className="student-cell-email">{s.email}</span>
                          </div>
                        </div>
                      </td>
                      <td><span className="course-badge" style={{ '--c': COURSE_COLORS[s.course] || '#6366f1' }}>{s.course}</span></td>
                      <td><span className="age-badge">{s.age}</span></td>
                      <td className="date-cell">{new Date(s.createdDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Course Distribution</h3>
          </div>
          {loading ? (
            <div className="skeleton-list">
              {[...Array(5)].map((_, i) => <div key={i} className="skeleton skeleton-row" />)}
            </div>
          ) : Object.keys(courseBreakdown).length === 0 ? (
            <div className="empty-state"><BookOpen size={36} /><p>No data yet</p></div>
          ) : (
            <div className="course-list">
              {Object.entries(courseBreakdown).sort((a,b)=>b[1]-a[1]).map(([course, count]) => {
                const pct = Math.round((count / students.length) * 100);
                const color = COURSE_COLORS[course] || '#6366f1';
                return (
                  <div key={course} className="course-row">
                    <div className="course-row-info">
                      <span className="course-dot" style={{ background: color }} />
                      <span className="course-name">{course}</span>
                      <span className="course-count">{count}</span>
                    </div>
                    <div className="course-bar-bg">
                      <div className="course-bar-fill" style={{ width: `${pct}%`, background: color }} />
                    </div>
                    <span className="course-pct">{pct}%</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
