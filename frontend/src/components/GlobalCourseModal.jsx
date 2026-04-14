import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCourseModal } from '../context/CourseContext';

const GlobalCourseModal = () => {
  const { selectedCourse, closeCourseModal } = useCourseModal();
  const [demoForm, setDemoForm] = useState({ name: '', email: '', date: '' });
  const [message, setMessage] = useState('');

  // Reset message when opening a different course
  React.useEffect(() => {
    if (selectedCourse) {
      setMessage('');
      setDemoForm({ name: '', email: '', date: '' });
    }
  }, [selectedCourse]);

  const handleEnroll = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Please sign in or register to enroll in courses!');
        return;
      }
      const response = await fetch('http://localhost:5000/api/student/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ 
           course_id: selectedCourse.id,
           course_title: selectedCourse.title
        })
      });
      const data = await response.json();
      if(response.ok) {
        setMessage('Enrolled successfully! Details stored in Database.');
      } else {
        setMessage(data.message || 'Enrollment failed');
      }
    } catch(err) {
      setMessage('Error connecting to database');
    }
  };

  const handleBookDemo = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/public/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: demoForm.name, 
          email: demoForm.email, 
          course_name: selectedCourse.title, 
          preferred_date: demoForm.date 
        })
      });
      if(response.ok) {
        setMessage('Demo session booked successfully! Details stored in Database.');
        setDemoForm({ name: '', email: '', date: '' });
      } else {
        setMessage('Failed to book demo');
      }
    } catch(err) {
      setMessage('Error connecting to Server');
    }
  };

  return (
    <AnimatePresence>
      {selectedCourse && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={styles.modalOverlay}
        >
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            style={styles.modalContent}
          >
            <button 
              style={styles.closeBtn} 
              onClick={closeCourseModal}
            >
              <X size={24} />
            </button>
            
            <h2 style={{color: '#0f265c', marginBottom: '1rem'}}>{selectedCourse.title}</h2>
            <p style={{color: '#666', marginBottom: '1.5rem'}}>
              Join {selectedCourse.title} to elevate your skills. You can enroll directly or book a free demo session to learn more.
            </p>

            {message && (
              <div style={styles.messageBox}>
                {message}
              </div>
            )}

            <div style={styles.modalActions}>
              <div style={styles.demoFormContainer}>
                <h4 style={{marginBottom: '1rem', color: '#333'}}>Book a Demo Session</h4>
                <form onSubmit={handleBookDemo} style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    required 
                    style={styles.input}
                    value={demoForm.name}
                    onChange={e => setDemoForm({...demoForm, name: e.target.value})}
                  />
                  <input 
                    type="email" 
                    placeholder="Your Email" 
                    required 
                    style={styles.input}
                    value={demoForm.email}
                    onChange={e => setDemoForm({...demoForm, email: e.target.value})}
                  />
                  <input 
                    type="date" 
                    required 
                    style={styles.input}
                    value={demoForm.date}
                    onChange={e => setDemoForm({...demoForm, date: e.target.value})}
                  />
                  <button type="submit" style={styles.submitBtn}>Book Demo</button>
                </form>
              </div>

              <div style={styles.divider}></div>

              <div style={styles.enrollContainer}>
                 <h4 style={{marginBottom: '1rem', color: '#333'}}>Ready to Start?</h4>
                 <p style={{fontSize: '0.9rem', color: '#777', marginBottom: '1rem'}}>
                   Gain full access to all course materials and start learning immediately.
                 </p>
                 <button onClick={handleEnroll} style={styles.enrollBtn}>
                   Enroll Now
                 </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '16px',
    width: '90%',
    maxWidth: '600px',
    position: 'relative',
    boxShadow: '0 25px 50px rgba(0,0,0,0.15)'
  },
  closeBtn: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#999'
  },
  modalActions: {
    display: 'flex',
    gap: '2rem',
    marginTop: '1.5rem'
  },
  demoFormContainer: {
    flex: 1
  },
  enrollContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  divider: {
    width: '1px',
    backgroundColor: '#eee'
  },
  input: {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '0.9rem',
    outline: 'none'
  },
  submitBtn: {
    padding: '10px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#0f265c',
    color: 'white',
    fontWeight: 600,
    cursor: 'pointer'
  },
  enrollBtn: {
    padding: '1rem 2rem',
    fontSize: '0.9rem',
    borderRadius: '8px',
    fontWeight: 700,
    backgroundColor: '#3b82f6',
    border: 'none',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    textTransform: 'uppercase'
  },
  messageBox: {
    padding: '10px',
    backgroundColor: '#dcfce7',
    color: '#166534',
    borderRadius: '6px',
    marginBottom: '1rem',
    fontSize: '0.9rem',
    fontWeight: 500
  }
};

export default GlobalCourseModal;
