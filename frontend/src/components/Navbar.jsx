import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gift, MessageCircle, ChevronDown, Phone, Clock, Globe, MessageSquare, Navigation, Video, User, ChevronRight, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import coursesData from '../coursesData.json';

const RecursiveMenu = ({ nodeData, closeMenu, path }) => {
  const navigate = useNavigate();
  const subCategories = Object.keys(nodeData).filter(k => k !== '_courses');

  return (
    <div className="glass-menu" style={menuStyles.glassPanel}>
      {subCategories.map((subCat) => (
        <MenuItem 
          key={subCat} 
          name={subCat} 
          nodeData={nodeData[subCat]} 
          closeMenu={closeMenu} 
          path={`${path}|${subCat}`}
        />
      ))}
      {nodeData['_courses'] && nodeData['_courses'].map(course => (
        <div 
          key={course.id} 
          style={menuStyles.menuItem}
          onClick={() => {
            closeMenu();
            navigate(`/courses?category=${encodeURIComponent(path.split('|')[1] || path)}`);
          }}
        >
          <span style={menuStyles.itemText}>{course.leafTitle}</span>
        </div>
      ))}
    </div>
  );
};

const MenuItem = ({ name, nodeData, closeMenu, path }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const hasSubItems = Object.keys(nodeData).length > 0 && !(Object.keys(nodeData).length === 1 && nodeData['_courses']);

  return (
    <div 
      style={menuStyles.menuItemWrapper}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        style={{...menuStyles.menuItem, ...(isHovered ? menuStyles.menuItemHover : {})}}
        onClick={() => {
            closeMenu();
            let topCat = path.split('|')[1];
            if (!topCat) topCat = name;
            navigate(`/courses?category=${encodeURIComponent(topCat)}`);
        }}
      >
        <span style={menuStyles.itemText}>{name}</span>
        {hasSubItems && <ChevronRight size={14} style={{ color: '#64748b' }} />}
      </div>
      
      {/* Render sub-menu safely positioned to the right */}
      <AnimatePresence>
        {isHovered && hasSubItems && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            style={menuStyles.subMenuContainer}
          >
            <RecursiveMenu nodeData={nodeData} closeMenu={closeMenu} path={path} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MobileRecursiveMenu = ({ nodeData, closeFullMenu, path }) => {
  const navigate = useNavigate();
  const subCategories = Object.keys(nodeData).filter(k => k !== '_courses');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', paddingLeft: '1rem', marginTop: '0.5rem', borderLeft: '1px solid #e2e8f0', marginLeft: '0.5rem' }}>
      {subCategories.map(subCat => (
        <MobileMenuItem key={subCat} name={subCat} nodeData={nodeData[subCat]} closeFullMenu={closeFullMenu} path={`${path}|${subCat}`} />
      ))}
      {nodeData['_courses'] && nodeData['_courses'].map(course => (
        <div 
          key={course.id} 
          onClick={() => {
             closeFullMenu();
             navigate(`/courses?category=${encodeURIComponent(path.split('|')[1] || path)}`);
          }} 
          style={{ padding: '0.2rem 0', color: '#64748b', fontSize: '0.85rem' }}
        >
          {course.leafTitle}
        </div>
      ))}
    </div>
  );
};

const MobileMenuItem = ({ name, nodeData, closeFullMenu, path }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const hasSubItems = Object.keys(nodeData).length > 0 && !(Object.keys(nodeData).length === 1 && nodeData['_courses']);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
      <div 
        onClick={() => {
            if (hasSubItems) {
                setIsOpen(!isOpen);
             } else {
                let topCat = path.split('|')[1];
                if (!topCat) topCat = name;
                navigate(`/courses?category=${encodeURIComponent(topCat)}`);
                closeFullMenu();
             }
        }}
        style={{ fontWeight: 600, color: '#475569', display: 'flex', justifyContent: 'space-between', padding: '0.2rem 0', cursor: 'pointer', fontSize: '0.9rem' }}
      >
        <span>{name}</span> {hasSubItems && <ChevronDown size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />}
      </div>
      <AnimatePresence>
          {isOpen && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                  <MobileRecursiveMenu nodeData={nodeData} closeFullMenu={closeFullMenu} path={path} />
              </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
};

const Navbar = () => {
    const navigate = useNavigate();
    const [coursesTree, setCoursesTree] = useState({});
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileCoursesOpen, setIsMobileCoursesOpen] = useState(false);

    useEffect(() => {
        const tree = {};
        coursesData.forEach(course => {
            const parts = course.title.split('|');
            if(parts.length === 1) {
                 if(!tree['_courses']) tree['_courses'] = [];
                 tree['_courses'].push({...course, leafTitle: parts[0]});
                 return;
            }
            let current = tree;
            for(let i=0; i<parts.length - 1; i++) {
                if (!current[parts[i]]) current[parts[i]] = {};
                current = current[parts[i]];
            }
            if(!current['_courses']) current['_courses'] = [];
            current['_courses'].push({...course, leafTitle: parts[parts.length-1]});
        });
        setCoursesTree(tree);
    }, []);

  return (
    <>
      <div style={styles.topBar}>
        <div className="container" style={styles.topBarContainer}>
          <div className="topBarLeft" style={styles.topBarLeft}>
            <span style={styles.topBarItem}><Phone size={14} /> +91 6783654256</span>
            <span style={styles.topBarItem}><Clock size={14} /> Mon - Sat: 8:00 - 15:00</span>
          </div>
          <div className="topBarRight" style={styles.topBarRight}>
            <div style={styles.followUs}>
              <span>Follow Us:</span>
              <Globe size={14} />
              <MessageSquare size={14} />
              <Navigation size={14} />
              <Video size={14} />
            </div>
            <Link to="/login" style={styles.loginRegister}>
              <User size={14} /> Login / Register
            </Link>
          </div>
        </div>
      </div>
      
      <nav style={styles.nav}>
        <div className="container" style={styles.container}>
          <div className="navbarLeftSection" style={styles.leftSection}>
            <Link to="/" style={styles.logoContainer}>
              <div className="treePlaceholder" style={styles.treePlaceholder}>🌳</div>
              <div style={styles.logoText}>
                <span className="logoTitle" style={{fontWeight: 800, fontSize: '1.3rem', color: '#1e3a8a'}}>English Faculties</span>
                <span className="logoSubtitle" style={{fontSize: '0.75rem', color: '#64748b', fontWeight: 600}}>Rooted in Excellence</span>
              </div>
            </Link>
            
            <div className="joinDebate" style={styles.joinDebate}>
              <span style={{fontWeight: 700, color: '#334155'}}>Join debate club</span>
            </div>
            
            <div className="giftTab" style={styles.giftTab}>
               <Gift size={24} color="#2563eb" />
               <span style={{fontSize: '0.8rem', fontWeight: 700, color: '#2563eb', lineHeight: 1.1}}>Gift a<br/>Course</span>
            </div>
          </div>

          <div className="desktop-menu" style={styles.rightSection}>
            <div style={styles.links}>
              <Link to="/" style={styles.link}>HOME</Link>
              
              {/* Dynamic Courses Dropdown wrapper */}
              <div 
                 style={styles.dropdownContainer}
                 onMouseEnter={() => setIsMenuOpen(true)}
                 onMouseLeave={() => setIsMenuOpen(false)}
              >
                 <span style={{...styles.link, cursor: 'pointer', color: isMenuOpen ? '#2563eb' : '#334155'}}>
                     COURSES <ChevronDown size={14} style={{ transform: isMenuOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }}/>
                 </span>
                 
                 {/* Glassmorphism Main Panel */}
                 <AnimatePresence>
                     {isMenuOpen && (
                         <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            style={menuStyles.mainMenuContainer}
                         >
                            <RecursiveMenu nodeData={coursesTree} closeMenu={() => setIsMenuOpen(false)} path="" />
                         </motion.div>
                     )}
                 </AnimatePresence>
              </div>

              <Link to="/about" style={styles.link}>ABOUT US</Link>
              
              <div style={styles.dropdownContainer}>
                 <span style={styles.link}>BLOG <ChevronDown size={14}/></span>
              </div>

              <Link to="/contact" style={styles.link}>CONTACT</Link>
            </div>
            
            <div style={styles.whatsappIcon}>
               <MessageCircle size={28} color="#22c55e" />
            </div>
          </div>
          
          <div className="mobile-menu-icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ display: 'none', cursor: 'pointer', paddingRight: '1rem' }}>
             <Menu size={28} color="#1e3a8a" />
          </div>
        </div>
        
        <AnimatePresence>
            {isMobileMenuOpen && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden', width: '100%', background: 'white', position: 'absolute', top: '90px', left: 0, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                 >
                     <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                         <Link to="/" onClick={() => setIsMobileMenuOpen(false)} style={styles.link}>HOME</Link>
                         
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div 
                                style={{ ...styles.link, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                                onClick={() => setIsMobileCoursesOpen(!isMobileCoursesOpen)}
                            >
                                <span>COURSES</span> <ChevronDown size={18} style={{ transform: isMobileCoursesOpen ? 'rotate(180deg)' : 'none', transition: '0.2s', color: '#3b82f6' }} />
                            </div>
                            <AnimatePresence>
                                {isMobileCoursesOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem' }}
                                    >
                                        <Link to="/courses" onClick={() => setIsMobileMenuOpen(false)} style={{...styles.link, color: '#3b82f6', fontWeight: 600, paddingLeft: '1rem'}}>All Courses Showcase</Link>
                                        <MobileRecursiveMenu nodeData={coursesTree} closeFullMenu={() => setIsMobileMenuOpen(false)} path="" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                         </div>

                         <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} style={styles.link}>ABOUT US</Link>
                         <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} style={styles.link}>CONTACT</Link>
                         <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} style={{...styles.loginRegister, color: '#1e3a8a', border: 'none', padding: 0, textDecoration: 'none'}}>
                            <User size={18}/> Login / Register
                         </Link>
                         <div style={{ padding: '0.5rem 0', borderTop: '1px solid #e2e8f0', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center'}}>Join debate club</div>
                            <div style={{fontWeight: 700, color: '#2563eb', display: 'flex', alignItems: 'center', gap: '8px'}}><Gift size={18} color="#2563eb" /> Gift a Course</div>
                         </div>
                     </div>
                </motion.div>
            )}
        </AnimatePresence>
      </nav>
    </>
  );
};

const menuStyles = {
    mainMenuContainer: {
        position: 'absolute',
        top: '90%', 
        left: 0,
        zIndex: 2000,
        paddingTop: '20px'
    },
    subMenuContainer: {
        position: 'absolute',
        top: '-10px',
        left: '100%',
        paddingLeft: '10px',
        zIndex: 2000
    },
    glassPanel: {
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        borderRadius: '12px',
        minWidth: '260px',
        padding: '0.5rem',
        display: 'flex',
        flexDirection: 'column',
    },
    menuItemWrapper: {
        position: 'relative'
    },
    menuItem: {
        padding: '0.8rem 1.2rem',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'background 0.2s',
    },
    menuItemHover: {
        background: 'rgba(59, 130, 246, 0.1)',
    },
    itemText: {
        fontSize: '0.95rem',
        fontWeight: 600,
        color: '#1e293b',
        fontFamily: "'Inter', sans-serif"
    }
};

const styles = {
  topBar: {
    background: 'linear-gradient(90deg, #1e3a8a 0%, #2563eb 100%)',
    color: 'white',
    width: '100%',
    padding: '8px 0',
    fontSize: '0.85rem',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 1001,
    fontFamily: "'Inter', sans-serif",
  },
  topBarContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  topBarLeft: {
    display: 'flex',
    gap: '20px'
  },
  topBarItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  topBarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '25px'
  },
  followUs: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  loginRegister: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: 'white',
    textDecoration: 'none',
    fontWeight: 600,
    borderLeft: '1px solid rgba(255,255,255,0.3)',
    paddingLeft: '25px'
  },
  nav: {
    position: 'fixed',
    top: '36px',
    left: '0',
    width: '100%',
    height: '90px',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    fontFamily: "'Inter', sans-serif",
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
  },
  logoContainer: {
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  treePlaceholder: {
    fontSize: '40px'
  },
  logoText: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: '1.1'
  },
  joinDebate: {
    marginLeft: '1rem',
    borderLeft: '1px solid #e2e8f0',
    paddingLeft: '1rem',
    display: 'flex',
    alignItems: 'center'
  },
  giftTab: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    marginLeft: '10px'
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem'
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem'
  },
  link: {
    color: '#334155',
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'color 0.3s',
    letterSpacing: '0.5px'
  },
  dropdownContainer: {
    position: 'relative',
    height: '90px', 
    display: 'flex',
    alignItems: 'center'
  },
  whatsappIcon: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '10px',
    background: '#dcfce7',
    padding: '10px',
    borderRadius: '50%',
    transition: '0.3s'
  }
};

export default Navbar;
