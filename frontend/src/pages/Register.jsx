import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const navigate = useNavigate();

  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if(response.ok) {
        setMessage('Registration successful! Please login.');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setMessage(data.message || 'Registration failed');
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
        <h2 style={styles.title}>Create Account</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Join the FaculTee platform.
        </p>

        {message && (
          <div style={{ padding: '10px', background: message.includes('success') ? '#dcfce7' : '#fee2e2', color: message.includes('success') ? '#166534' : '#991b1b', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="John Doe"
            />
          </div>
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
          <div style={styles.inputGroup}>
            <label style={styles.label}>Role</label>
            <select
              value={formData.role}
              onChange={e => setFormData({...formData, role: e.target.value})}
              style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.75rem', borderRadius: '8px', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
            </select>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Register
          </button>
        </form>
        
        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)' }}>Login</Link>
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
    minHeight: '80vh',
    paddingTop: '2rem'
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
    gap: '1.2rem'
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

export default Register;
