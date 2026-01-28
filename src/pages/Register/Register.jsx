import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';
import { User, Briefcase } from 'lucide-react';
import './Register.css';

export function Register() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('buyer'); // buyer or employee
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
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
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    if (formData.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setLoading(true);

    // Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          user_role: userRole
        }
      }
    });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else if (data.user) {
      // Store user role
      localStorage.setItem('userRole', userRole);
      localStorage.setItem('userId', data.user.id);

      // Check for valid session before inserting into table
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        setMessage({ type: 'error', text: 'Registration succeeded, but you must verify your email and log in before your info can be saved.' });
        setLoading(false);
        return;
      }

      // Insert into the appropriate table
      const table = userRole === 'buyer' ? 'buyers' : 'employees';
      const { error: insertError } = await supabase
        .from(table)
        .insert([
          {
            id: data.user.id,
            name: formData.fullName,
            email: formData.email,
            created_at: new Date().toISOString()
          }
        ]);

      if (insertError) {
        setMessage({ type: 'error', text: `Registration succeeded but failed to save user info: ${insertError.message}` });
        setLoading(false);
        return;
      }

      setMessage({ 
        type: 'success', 
        text: `Registration successful as ${userRole}! Check your email for confirmation link.` 
      });
      setTimeout(() => navigate('/login'), 2000);
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Create Account</h1>
        <p className="auth-subtitle">Join Advenco Global today</p>

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
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

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
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account?</p>
          <Link to="/login" className="auth-link">Login here</Link>
        </div>
      </div>
    </div>
  );
}