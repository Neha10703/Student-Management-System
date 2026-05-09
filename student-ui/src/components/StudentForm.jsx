import { useState } from 'react';
import { User, Mail, Hash, BookOpen, Loader2 } from 'lucide-react';
import './StudentForm.css';

const COURSES = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Engineering', 'Business', 'Arts', 'Law', 'Medicine'];

export default function StudentForm({ initial = {}, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({
    name: initial.name || '',
    email: initial.email || '',
    age: initial.age || '',
    course: initial.course || '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address';
    if (!form.age) e.age = 'Age is required';
    else if (form.age < 1 || form.age > 100) e.age = 'Age must be between 1 and 100';
    if (!form.course) e.course = 'Course is required';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    onSubmit({ ...form, age: Number(form.age) });
  };

  return (
    <form className="student-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className={`form-field ${errors.name ? 'has-error' : ''}`}>
          <label>Full Name</label>
          <div className="input-wrap">
            <User size={15} className="input-icon" />
            <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. John Doe" />
          </div>
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className={`form-field ${errors.email ? 'has-error' : ''}`}>
          <label>Email Address</label>
          <div className="input-wrap">
            <Mail size={15} className="input-icon" />
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="e.g. john@example.com" />
          </div>
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className={`form-field ${errors.age ? 'has-error' : ''}`}>
          <label>Age</label>
          <div className="input-wrap">
            <Hash size={15} className="input-icon" />
            <input name="age" type="number" value={form.age} onChange={handleChange} placeholder="e.g. 20" min="1" max="100" />
          </div>
          {errors.age && <span className="field-error">{errors.age}</span>}
        </div>

        <div className={`form-field ${errors.course ? 'has-error' : ''}`}>
          <label>Course</label>
          <div className="input-wrap">
            <BookOpen size={15} className="input-icon" />
            <select name="course" value={form.course} onChange={handleChange}>
              <option value="">Select a course</option>
              {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {errors.course && <span className="field-error">{errors.course}</span>}
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={loading}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <><Loader2 size={15} className="spin" /> Saving...</> : 'Save Student'}
        </button>
      </div>
    </form>
  );
}
