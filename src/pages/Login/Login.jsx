import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';
import { User, Briefcase, ShoppingCart, Package } from 'lucide-react';
import './Login.css';

const ADMIN_EMAIL = 'kamundia2020@gmail.com';

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

    // Check if trying to log in as employee without being admin
    if (userRole === 'employee' && formData.email !== ADMIN_EMAIL) {
      setMessage({ 
        type: 'error', 
        text: '❌ Only the admin can log in as an employee. Employees must be created by the admin.' 
      });
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      setMessage({ type: 'error', text: '❌ ' + error.message });
    } else if (data.user) {
      // Store user role
      localStorage.setItem('userRole', userRole);
      localStorage.setItem('userId', data.user.id);
      
      if (userRole === 'employee') {
        localStorage.setItem('admin_auth', 'true');
        setMessage({ type: 'success', text: '✅ Admin login successful!' });
        setTimeout(() => navigate('/admin/add-product'), 1000);
      } else {
        setMessage({ type: 'success', text: '✅ Login successful!' });
        setTimeout(() => navigate('/'), 1000);
      }
    }

    setLoading(false);
  };

  return (
    <div className="login-page">
      {/* Left Section - Info */}
      <div className="login-left">
        <div className="login-info">
          <h1>🛒 Advenco Global</h1>
          <p>Premium Cookware & Kitchen Essentials</p>
          
          <div className="login-features">
            <div className="feature">
              <ShoppingCart size={32} />
              <h3>Shop</h3>
              <p>Browse our premium collection</p>
            </div>
            <div className="feature">
              <Package size={32} />
              <h3>Track</h3>
              <p>Monitor your orders in real-time</p>
            </div>
            <div className="feature">
              <User size={32} />
              <h3>Earn</h3>
              <p>Get loyalty points on purchases</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Login */}
      <div className="login-right">
        <div className="login-box">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Choose how you want to log in</p>
          </div>

          {/* Role Selection - Side by Side */}
          <div className="role-selector-horizontal">
            <button
              type="button"
              className={`role-card ${userRole === 'buyer' ? 'active' : ''}`}
              onClick={() => { setUserRole('buyer'); setMessage({ type: '', text: '' }); }}
            >
              <div className="role-icon buyer">
                <ShoppingCart size={28} />
              </div>
              <div className="role-info">
                <span className="role-title">Buyer</span>
                <span className="role-desc">Shop & purchase</span>
              </div>
              <div className="role-check">{userRole === 'buyer' && '✓'}</div>
            </button>

            <button
              type="button"
              className={`role-card ${userRole === 'employee' ? 'active' : ''}`}
              onClick={() => { setUserRole('employee'); setMessage({ type: '', text: '' }); }}
            >
              <div className="role-icon employee">
                <Briefcase size={28} />
              </div>
              <div className="role-info">
                <span className="role-title">Employee</span>
                <span className="role-desc">Manage products</span>
              </div>
              <div className="role-check">{userRole === 'employee' && '✓'}</div>
            </button>
          </div>

          {/* Info Message */}
          {userRole === 'employee' && (
            <div className="info-banner">
              <Briefcase size={18} />
              <span>Only admin (kamundia2020@gmail.com) can login here. Employees are created by admin.</span>
            </div>
          )}

          {/* Error/Success Message */}
          {message.text && (
            <div className={`login-message ${message.type}`}>
              {message.text}
            </div>
          )}

          {/* Login Form */}
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
                disabled={loading}
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
                disabled={loading}
              />
            </div>

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Logging in...
                </>
              ) : (
                `Login as ${userRole === 'buyer' ? 'Buyer' : 'Admin'}`
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider">or</div>

          {/* Register Link */}
          <div className="login-footer">
            {userRole === 'buyer' ? (
              <>
                <p>Don't have an account?</p>
                <Link to="/register" className="register-link">Create one now</Link>
              </>
            ) : (
              <p className="info-text">👤 Contact admin to create an employee account</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="login-footer-text">
          <Link to="/" className="back-link">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}