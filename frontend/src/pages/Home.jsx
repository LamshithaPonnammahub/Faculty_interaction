import React, { useEffect, useState } from 'react';
import { ArrowRight, Monitor, PenTool, Layout, TrendingUp, X, Users, Briefcase, GraduationCap, Library, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
// import the hero image representing students that user uploaded to assets
import heroImage from '../assets/hero.png';
import { useCourseModal } from '../context/CourseContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [stats, setStats] = useState({ activeStudents: 0, totalCourses: 0 });
  const { openCourseModal } = useCourseModal();
  const navigate = useNavigate();

  useEffect(() => {
    // Mocking stats to decouple the backend
    setStats({ activeStudents: 8520, totalCourses: 194 });
  }, []);

  return (
    <div className="page-wrapper" style={{ paddingTop: '126px', background: '#e0e7ff', minHeight: '100vh', position: 'relative' }}>
      
      {/* Hero Section */}

      <section style={styles.heroSection}>
        <div style={styles.heroWave}>
           <svg viewBox="0 0 1440 900" preserveAspectRatio="none" style={{width: '100%', height: '100%', position: 'absolute', left: 0, top: 0}}>
              <path fill="#0f265c" d="M0,0 L0,900 L600,900 C800,700 800,200 1100,0 Z"></path>
           </svg>
        </div>

        <div className="container" style={styles.heroContainer}>
          <div style={styles.heroContent}>
            <motion.h1 
              className="heroQuote"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              style={styles.heroQuote}
            >
              The experts in Communication -<br/>for over 15 years english faculties has helped numerous individuals achieve their dreams via <span style={{color: '#3b82f6'}}>english.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              style={styles.heroSubQuote}
            >
              English is a magical language, which can take you to a place called wonderland.
            </motion.p>
            <motion.button 
              className="heroButton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={styles.heroButton}
              onClick={() => openCourseModal({ title: 'General English Program' })}
            >
              Take your first step <ArrowRight size={18} style={{marginLeft: '8px'}} />
            </motion.button>
          </div>

          <div style={styles.heroImageWrapper}>
            <motion.div 
               className="heroImageCircle"
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ duration: 0.6 }}
               style={styles.heroImageCircle}
            >
              <img src={heroImage} alt="Graduation students" style={styles.studentsImage} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4 Cards Section */}
      <section style={styles.cardsSection}>
        <div className="container" style={styles.cardsContainerWrapper}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionLabel}>
              <BookOpen size={16} /> COURSES
            </div>
            <h2 className="sectionTitle" style={styles.sectionTitle}>Explore Top Courses</h2>
            <button className="viewAllBtn" style={styles.viewAllBtn} onClick={() => navigate('/courses')}>
              VIEW ALL COURSES <ArrowRight size={16} style={{marginLeft: '8px'}} />
            </button>
          </div>
          
          <div style={styles.cardsGrid}>
            <Card 
              icon={<Users size={32} color="#3b82f6" />} 
              title="For Individuals" 
              courses="15+ Courses"
              onClick={() => navigate('/courses?category=For Individuals')}
            />
            <Card 
              icon={<Briefcase size={32} color="#3b82f6" />} 
              title="For Enterprise" 
              courses="7+ Courses"
              onClick={() => navigate('/courses?category=For Enterprise')}
            />
            <Card 
              icon={<GraduationCap size={32} color="#3b82f6" />} 
              title="For School Students" 
              courses="25+ Courses"
              onClick={() => navigate('/courses?category=For School Students')}
            />
            <Card 
              icon={<Library size={32} color="#3b82f6" />} 
              title="For Colleges" 
              courses="5+ Courses"
              onClick={() => navigate('/courses?category=For colleges and universities')}
            />
          </div>
        </div>
      </section>

    </div>
  );
};

const Card = ({ icon, title, courses, onClick }) => (
  <motion.div 
    whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}
    style={styles.card}
    onClick={onClick}
  >
    <div style={styles.cardIconBox}>
      {icon}
    </div>
    <h3 style={styles.cardTitle}>{title}</h3>
    <p style={styles.cardCourses}>{courses}</p>
    <button style={styles.cardBtn} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      LEARN MORE <ArrowRight size={14} style={{marginLeft: '4px'}} />
    </button>
  </motion.div>
);

const styles = {
  floatingSocials: {
    position: 'fixed',
    right: '20px',
    top: '30%',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    zIndex: 100,
    background: '#fff',
    padding: '10px 8px',
    borderRadius: '30px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    border: '1px solid #eee'
  },
  socialIcon: {
    color: '#555',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '8px',
    borderRadius: '50%',
    transition: '0.3s',
    textDecoration: 'none',
    backgroundColor: '#f5f5f5'
  },
  heroSection: {
    padding: '3rem 0 8rem 0',
    position: 'relative',
    minHeight: '650px',
    overflow: 'hidden'
  },
  heroWave: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    zIndex: 0
  },
  heroContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '3rem',
    flexWrap: 'wrap',
    position: 'relative',
    zIndex: 1,
    height: '100%',
    padding: '0 1rem'
  },
  heroContent: {
    flex: '1 1 300px',
    maxWidth: '650px',
    paddingLeft: '0'
  },
  heroQuote: {
    fontSize: '2.5rem',
    fontWeight: 800,
    lineHeight: 1.3,
    marginBottom: '1.5rem',
    color: '#ffffff'
  },
  heroSubQuote: {
    fontSize: '1.1rem',
    color: '#cbd5e1',
    lineHeight: 1.6,
    marginBottom: '2.5rem',
    maxWidth: '95%'
  },
  heroButton: {
    padding: '1rem 2rem',
    fontSize: '0.9rem',
    borderRadius: '8px',
    fontWeight: 700,
    backgroundColor: '#3b82f6',
    border: 'none',
    color: 'white',
    display: 'inline-flex',
    alignItems: 'center',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  heroImageWrapper: {
    flex: '1 1 400px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  heroImageCircle: {
    width: '450px',
    height: '450px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    border: '15px solid rgba(255,255,255,0.4)',
    overflow: 'hidden' 
  },
  studentsImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  statsBadge: {
    position: 'absolute',
    top: '40px',
    left: '-30px',
    background: '#ffffff',
    padding: '15px 25px',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  cardsSection: {
    backgroundColor: '#ffffff',
    padding: '4rem 0',
    position: 'relative',
    zIndex: 10,
    marginTop: '-2rem',
    borderTopLeftRadius: '30px',
    borderTopRightRadius: '30px',
    boxShadow: '0 -10px 20px rgba(0,0,0,0.02)'
  },
  cardsContainerWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '3rem'
  },
  sectionHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'
  },
  sectionLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#3b82f6',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    marginBottom: '0.5rem'
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: 800,
    color: '#0f265c',
    marginBottom: '1.5rem'
  },
  viewAllBtn: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '0.8rem 2rem',
    borderRadius: '8px',
    border: 'none',
    fontWeight: 'bold',
    fontSize: '0.95rem',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)'
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
    gap: '2rem',
    width: '100%',
    padding: '0 1rem'
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '2.5rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
    cursor: 'pointer',
    border: '1px solid #f1f5f9',
    transition: 'all 0.3s ease'
  },
  cardIconBox: {
    background: '#eff6ff',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '1.5rem',
    boxShadow: '0 4px 10px rgba(59,130,246,0.1)'
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: 800,
    marginBottom: '0.5rem',
    color: '#0f265c'
  },
  cardCourses: {
    color: '#64748b',
    marginBottom: '2rem',
    fontWeight: 500,
    fontSize: '0.9rem'
  },
  cardBtn: {
    width: '100%',
    borderRadius: '8px',
    padding: '0.8rem',
    backgroundColor: '#3b82f6',
    border: 'none',
    color: 'white',
    fontWeight: 700,
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    marginTop: 'auto',
    transition: 'background-color 0.2s',
  },

};

export default Home;
