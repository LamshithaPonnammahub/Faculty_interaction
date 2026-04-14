import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, BookOpen, Layers, Plus, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('structure');
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [newClass, setNewClass] = useState('');
  const [newSubject, setNewSubject] = useState('');
  
  const token = localStorage.getItem('token');

  const fetchStructure = async () => {
      try {
          const [classRes, subRes] = await Promise.all([
              fetch('http://localhost:5000/api/admin/classes', { headers: { 'Authorization': `Bearer ${token}` } }),
              fetch('http://localhost:5000/api/admin/subjects', { headers: { 'Authorization': `Bearer ${token}` } })
          ]);
          if(classRes.ok && subRes.ok) {
              setClasses(await classRes.json());
              setSubjects(await subRes.json());
          }
      } catch (err) {
          console.error("Failed to load structure", err);
      }
  };

  useEffect(() => {
      if(activeTab === 'structure') fetchStructure();
  }, [activeTab]);

  const addClass = async () => {
      if(!newClass.trim()) return;
      try {
          await fetch('http://localhost:5000/api/admin/classes', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({ name: newClass })
          });
          setNewClass('');
          fetchStructure();
      } catch (err) {}
  };

  const removeClass = async (id) => {
      try {
          await fetch(`http://localhost:5000/api/admin/classes/${id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
          });
          fetchStructure();
      } catch(err) {}
  };

  const addSubject = async () => {
      if(!newSubject.trim()) return;
      try {
          await fetch('http://localhost:5000/api/admin/subjects', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({ name: newSubject })
          });
          setNewSubject('');
          fetchStructure();
      } catch (err) {}
  };

  const removeSubject = async (id) => {
      try {
          await fetch(`http://localhost:5000/api/admin/subjects/${id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
          });
          fetchStructure();
      } catch(err) {}
  };

  return (
    <div className="page-wrapper container" style={{ marginTop: '120px' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Admin <span className="text-gradient">Dashboard</span></h1>
        
        {/* Tabs */}
        <div style={styles.tabsContainer}>
            <button 
                style={activeTab === 'users' ? styles.activeTab : styles.tab} 
                onClick={() => setActiveTab('users')}
            >
                <Users size={18} /> Manage Users
            </button>
            <button 
                style={activeTab === 'courses' ? styles.activeTab : styles.tab}
                onClick={() => setActiveTab('courses')}
            >
                <BookOpen size={18} /> Manage Courses
            </button>
            <button 
                style={activeTab === 'structure' ? styles.activeTab : styles.tab}
                onClick={() => setActiveTab('structure')}
            >
                <Layers size={18} /> Course Structure
            </button>
        </div>

        <AnimatePresence mode="wait">
            {activeTab === 'structure' && (
                <motion.div 
                    key="structure"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={styles.panelsWrapper}
                >
                    {/* Class Panel */}
                    <div className="glass" style={styles.panel}>
                        <h2 style={styles.panelTitle}>Manage Classes</h2>
                        <div style={styles.inputGroup}>
                            <input 
                                type="text"
                                style={styles.input}
                                placeholder="E.g. Class 13"
                                value={newClass}
                                onChange={(e) => setNewClass(e.target.value)}
                            />
                            <button className="btn btn-primary" onClick={addClass} style={{ padding: '0.6rem 1rem' }}>
                                <Plus size={18} /> Add
                            </button>
                        </div>
                        <div style={styles.listContainer}>
                            {classes.map(c => (
                                <div key={c.id} style={styles.listItem}>
                                    <span>{c.name}</span>
                                    <button style={styles.iconBtn} onClick={() => removeClass(c.id)}>
                                        <Trash2 size={16} color="#ef4444" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Subject Panel */}
                    <div className="glass" style={styles.panel}>
                        <h2 style={styles.panelTitle}>Manage Subjects</h2>
                        <div style={styles.inputGroup}>
                            <input 
                                type="text"
                                style={styles.input}
                                placeholder="E.g. Computer Science"
                                value={newSubject}
                                onChange={(e) => setNewSubject(e.target.value)}
                            />
                            <button className="btn btn-primary" onClick={addSubject} style={{ padding: '0.6rem 1rem' }}>
                                <Plus size={18} /> Add
                            </button>
                        </div>
                        <div style={styles.listContainer}>
                            {subjects.map(s => (
                                <div key={s.id} style={styles.listItem}>
                                    <span>{s.name}</span>
                                    <button style={styles.iconBtn} onClick={() => removeSubject(s.id)}>
                                        <Trash2 size={16} color="#ef4444" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            {activeTab !== 'structure' && (
                <motion.div key="other" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="glass" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                        <h3>This section is currently under construction.</h3>
                        <p>Use the "Course Structure" tab to Add/Remove Classes and Subjects dynamically.</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const styles = {
    tabsContainer: {
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '1rem'
    },
    tab: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.75rem 1.5rem',
        background: 'transparent',
        border: 'none',
        color: '#64748b',
        fontWeight: '600',
        cursor: 'pointer',
        borderRadius: '8px',
        transition: '0.2s'
    },
    activeTab: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.75rem 1.5rem',
        background: 'var(--primary-color)',
        color: 'white',
        border: 'none',
        fontWeight: '600',
        cursor: 'pointer',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(26, 86, 219, 0.3)'
    },
    panelsWrapper: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem'
    },
    panel: {
        padding: '2rem',
        borderRadius: '16px',
        background: 'rgba(255, 255, 255, 0.7)'
    },
    panelTitle: {
        fontSize: '1.5rem',
        color: '#1e293b',
        marginBottom: '1.5rem'
    },
    inputGroup: {
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.5rem'
    },
    input: {
        flex: 1,
        padding: '0.6rem 1rem',
        borderRadius: '8px',
        border: '1px solid #cbd5e1',
        outline: 'none'
    },
    listContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        maxHeight: '350px',
        overflowY: 'auto',
        paddingRight: '0.5rem'
    },
    listItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.8rem 1rem',
        background: 'white',
        borderRadius: '8px',
        border: '1px solid #f1f5f9',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
    },
    iconBtn: {
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        padding: '5px',
        borderRadius: '5px',
        transition: '0.2s',
        ':hover': {
            background: '#fee2e2'
        }
    }
};

export default AdminDashboard;
