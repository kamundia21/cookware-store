import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';
import { User, Briefcase } from 'lucide-react';
import './Login.css';

export function Login() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('buyer'); // buyer or employee
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else if (data.user) {
      // Store user role
      localStorage.setItem('userRole', userRole);
      localStorage.setItem('userId', data.user.id);
      
      if (userRole === 'employee') {
        localStorage.setItem('admin_auth', 'true');
        setMessage({ type: 'success', text: 'Employee login successful!' });
        setTimeout(() => navigate('/admin/add-product'), 1000);
      } else {
        setMessage({ type: 'success', text: 'Login successful!' });
        setTimeout(() => navigate('/'), 1000);
      }
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Welcome Back</h1>
        <p className="auth-subtitle">Login to your account</p>

        {/* Role Selection */}
        <div className="role-selector">
          <button
            type="button"
            className={`role-btn ${userRole === 'buyer' ? 'active' : ''}`}
            onClick={() => { setUserRole('buyer'); setMessage({ type: '', text: '' }); }}
          >
            <User size={24} />
            <span>Buyer</span>
            <small>Shop and purchase</small>
          </button>
          <button
            type="button"
            className={`role-btn ${userRole === 'employee' ? 'active' : ''}`}
            onClick={() => { setUserRole('employee'); setMessage({ type: '', text: '' }); }}
          >
            <Briefcase size={24} />
            <span>Employee</span>
            <small>Manage products</small>
          </button>
        </div>

        {message.text && (
          <div className={`auth-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Logging in...' : `Login as ${userRole === 'buyer' ? 'Buyer' : 'Employee'}`}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account?</p>
          <Link to="/register" className="auth-link">Register here</Link>
        </div>
      </div>
    </div>
  );
}