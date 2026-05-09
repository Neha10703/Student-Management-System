import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Eye, EyeOff, Loader2, Lock, User, Mail, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Login.css';

export default function Login() {
  const [tab, setTab]           = useState('login');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const { login, register }     = useAuth();
  const navigate                = useNavigate();

  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [regForm,   setRegForm]   = useState({ fullName: '', username: '', email: '', password: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginForm.username || !loginForm.password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(loginForm.username, loginForm.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regForm.fullName || !regForm.username || !regForm.email || !regForm.password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (regForm.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(regForm.fullName, regForm.username, regForm.email, regForm.password);
      toast.success('Account created! Welcome!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-left-content">
          <div className="login-brand">
            <div className="login-brand-icon"><GraduationCap size={28} /></div>
            <span>EduManage</span>
          </div>
          <h1 className="login-hero-title">
            Manage Students<br />
            <span className="gradient-text">Effortlessly.</span>
          </h1>
          <p className="login-hero-sub">
            A modern student management platform with secure access,
            real-time data, and a clean interface built for everyone.
          </p>
          <div className="login-stats">
            {[['500+', 'Students'], ['10+', 'Courses'], ['99.9%', 'Uptime']].map(([val, label]) => (
              <div key={label} className="stat-item">
                <span className="stat-val">{val}</span>
                <span className="stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="login-bg-circles">
          <div className="circle c1" />
          <div className="circle c2" />
          <div className="circle c3" />
        </div>
      </div>

      <div className="login-right">
        <div className="login-card fade-in">

          <div className="auth-tabs">
            <button className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>
              Sign In
            </button>
            <button className={`auth-tab ${tab === 'register' ? 'active' : ''}`} onClick={() => setTab('register')}>
              Create Account
            </button>
          </div>

          {tab === 'login' && (
            <>
              <div className="login-card-header">
                <h2>Welcome back</h2>
                <p>Sign in to your account to continue</p>
              </div>
              <form className="login-form" onSubmit={handleLogin}>
                <div className="login-field">
                  <label>Username</label>
                  <div className="login-input-wrap">
                    <User size={16} className="login-input-icon" />
                    <input
                      type="text"
                      placeholder="Enter your username"
                      value={loginForm.username}
                      onChange={e => setLoginForm(f => ({ ...f, username: e.target.value }))}
                      autoFocus
                    />
                  </div>
                </div>
                <div className="login-field">
                  <label>Password</label>
                  <div className="login-input-wrap">
                    <Lock size={16} className="login-input-icon" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={loginForm.password}
                      onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                    />
                    <button type="button" className="pass-toggle" onClick={() => setShowPass(s => !s)}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <button type="submit" className="login-btn" disabled={loading}>
                  {loading ? <><Loader2 size={16} className="spin" /> Signing in...</> : 'Sign In'}
                </button>
              </form>
              <p className="switch-text">
                Don't have an account?{' '}
                <button className="switch-link" onClick={() => setTab('register')}>Create one</button>
              </p>
            </>
          )}

          {tab === 'register' && (
            <>
              <div className="login-card-header">
                <h2>Create account</h2>
                <p>Fill in your details to get started</p>
              </div>
              <form className="login-form" onSubmit={handleRegister}>
                <div className="login-field">
                  <label>Full Name</label>
                  <div className="login-input-wrap">
                    <UserPlus size={16} className="login-input-icon" />
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={regForm.fullName}
                      onChange={e => setRegForm(f => ({ ...f, fullName: e.target.value }))}
                      autoFocus
                    />
                  </div>
                </div>
                <div className="login-field">
                  <label>Username</label>
                  <div className="login-input-wrap">
                    <User size={16} className="login-input-icon" />
                    <input
                      type="text"
                      placeholder="Choose a username"
                      value={regForm.username}
                      onChange={e => setRegForm(f => ({ ...f, username: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="login-field">
                  <label>Email Address</label>
                  <div className="login-input-wrap">
                    <Mail size={16} className="login-input-icon" />
                    <input
                      type="email"
                      placeholder="e.g. john@example.com"
                      value={regForm.email}
                      onChange={e => setRegForm(f => ({ ...f, email: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="login-field">
                  <label>Password</label>
                  <div className="login-input-wrap">
                    <Lock size={16} className="login-input-icon" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      placeholder="At least 6 characters"
                      value={regForm.password}
                      onChange={e => setRegForm(f => ({ ...f, password: e.target.value }))}
                    />
                    <button type="button" className="pass-toggle" onClick={() => setShowPass(s => !s)}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <button type="submit" className="login-btn" disabled={loading}>
                  {loading ? <><Loader2 size={16} className="spin" /> Creating account...</> : 'Create Account'}
                </button>
              </form>
              <p className="switch-text">
                Already have an account?{' '}
                <button className="switch-link" onClick={() => setTab('login')}>Sign in</button>
              </p>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
