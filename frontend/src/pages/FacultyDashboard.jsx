import React from 'react';
import { motion } from 'framer-motion';
import { Video, PlusCircle } from 'lucide-react';

const FacultyDashboard = () => {
  return (
    <div className="page-wrapper container">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Faculty <span className="text-gradient">Dashboard</span></h1>
        
        <div style={styles.grid}>
          <div className="glass" style={styles.card}>
            <div style={styles.cardHeader}>
              <Video size={32} color="var(--primary-color)" />
              <h3 style={{ fontSize: '1.5rem', marginLeft: '1rem' }}>My Courses</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>Manage your assigned courses and student enrollments.</p>
            <button className="btn btn-primary" style={{ marginTop: '1.5rem' }}>View Roster</button>
          </div>
          
          <div className="glass" style={styles.card}>
            <div style={styles.cardHeader}>
              <PlusCircle size={32} color="var(--accent-color)" />
              <h3 style={{ fontSize: '1.5rem', marginLeft: '1rem' }}>Add Content</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>Upload new video lessons and structured materials.</p>
            <button className="btn btn-glass" style={{ marginTop: '1.5rem' }}>Create Lesson</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem'
  },
  card: {
    padding: '2rem',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem'
  }
};

export default FacultyDashboard;
