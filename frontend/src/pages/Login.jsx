import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if(response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.user.role);
        
        // Route to dashboard based on role or home
        if (data.user.role === 'admin') navigate('/dashboard/admin');
        else if (data.user.role === 'faculty') navigate('/dashboard/faculty');
        else navigate('/');
      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch (err) {
      setMessage('Network error - could not connect to backend server');
    }
  };

  return (
    <div className="page-wrapper" style={styles.wrapper}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass" 
        style={styles.card}
      >
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Please login to your account.
        </p>

        {message && (
          <div style={{ padding: '10px', background: '#fee2e2', color: '#991b1b', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              placeholder="you@example.com"
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input 
              type="password" 
              required
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              placeholder="••••••••"
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Login
          </button>
        </form>
        
        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary-color)' }}>Register</Link>
        </p>
      </motion.div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh'
  },
  card: {
    padding: '3rem',
    width: '100%',
    maxWidth: '450px',
    borderRadius: '24px'
  },
  title: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
    fontWeight: 600
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    textAlign: 'left'
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: 500,
    color: 'var(--text-primary)'
  }
};

export default Login;
