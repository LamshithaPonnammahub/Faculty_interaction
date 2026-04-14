import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, Award } from 'lucide-react';

const StudentDashboard = () => {
  return (
    <div className="page-wrapper container">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>My <span className="text-gradient">Learning</span></h1>
        
        <div style={styles.grid}>
          <div className="glass" style={styles.card}>
            <div style={styles.cardHeader}>
              <PlayCircle size={32} color="var(--primary-color)" />
              <h3 style={{ fontSize: '1.5rem', marginLeft: '1rem' }}>Continue Learning</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>Resume your recently enrolled English courses.</p>
            <button className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Resume Activity</button>
          </div>
          
          <div className="glass" style={styles.card}>
            <div style={styles.cardHeader}>
              <Award size={32} color="var(--accent-color)" />
              <h3 style={{ fontSize: '1.5rem', marginLeft: '1rem' }}>Achievements</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>View certificates and course completions.</p>
            <button className="btn btn-glass" style={{ marginTop: '1.5rem' }}>View Awards</button>
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

export default StudentDashboard;
