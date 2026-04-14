import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCourseModal } from '../context/CourseContext';
import { ChevronDown, ChevronRight, BookOpen, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RecursiveNode = ({ nodeName, nodeData, level, openCourseModal, initialOpen }) => {
    // Top-level categories (level 0) are closed by default to avoid overwhelming UI.
    // Sub-levels are open by default so when user clicks a top-level, they see the tree.
    const [isOpen, setIsOpen] = useState(level > 0 || initialOpen); 
    const navigate = useNavigate();
    
    const courses = nodeData['_courses'] || [];
    const subcats = Object.keys(nodeData).filter(k => k !== '_courses');

    return (
        <div style={{ marginTop: level === 0 ? '0' : '0.5rem' }}>
            {nodeName && level === 0 && (
                <div 
                    style={styles.categoryHeader} 
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <h2 style={styles.categoryTitle}>{nodeName}</h2>
                    {isOpen ? <ChevronDown /> : <ChevronRight />}
                </div>
            )}

            {nodeName && level > 0 && (
                <div 
                    style={{ ...styles.subCategoryHeader, cursor: subcats.length > 0 ? 'pointer' : 'default' }}
                    onClick={() => subcats.length > 0 && setIsOpen(!isOpen)}
                >
                    {subcats.length > 0 && (isOpen ? <ChevronDown size={18}/> : <ChevronRight size={18}/>)}
                    <h3 style={{ fontSize: level === 1 ? '1.3rem' : '1.1rem', color: '#1e293b', margin: 0 }}>
                        {nodeName}
                    </h3>
                </div>
            )}
            
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{height:0, opacity:0}} animate={{height:'auto', opacity:1}} exit={{height:0, opacity:0}} style={{overflow:'hidden'}}>
                        <div style={{ padding: level === 0 ? '2rem' : '1rem 0 1rem 1rem', borderLeft: level > 0 ? '2px solid #e2e8f0' : 'none', marginLeft: level > 0 ? '10px' : '0' }}>
                            {courses.length > 0 && (
                                <div style={styles.grid}>
                                    {courses.map(c => (
                                        <motion.div 
                                            key={c.id} 
                                            style={styles.card}
                                            whileHover={{ y: -5, boxShadow: '0 8px 15px rgba(0,0,0,0.1)' }}
                                            onClick={() => {
                                                if (c.leafTitle.toLowerCase() === 'contact us') {
                                                    navigate('/contact');
                                                } else {
                                                    openCourseModal({ title: c.title, id: c.id });
                                                }
                                            }}
                                        >
                                            <div style={styles.iconWrapper}><BookOpen size={24} color="#1a56db"/></div>
                                            <h4 style={styles.cardTitle}>{c.leafTitle}</h4>
                                            <p style={styles.cardDesc}>{c.description}</p>
                                            <button style={styles.bookBtn}>
                                                {c.leafTitle.toLowerCase() === 'contact us' ? 'Contact Us ->' : (
                                                    <>Enroll / Demo <ArrowRight size={14} style={{marginLeft:'5px'}}/></>
                                                )}
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {subcats.map(subcat => (
                                <RecursiveNode 
                                    key={subcat} 
                                    nodeName={subcat} 
                                    nodeData={nodeData[subcat]} 
                                    level={level + 1} 
                                    openCourseModal={openCourseModal} 
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Courses = () => {
    const { openCourseModal } = useCourseModal();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/public/courses');
                const data = await res.json();
                setCourses(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching courses:', err);
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const buildTree = (coursesList) => {
        const tree = {};
        coursesList.forEach(course => {
            const parts = course.title.split('|');
            if (parts.length === 1) {
                if (!tree['_courses']) tree['_courses'] = [];
                tree['_courses'].push({ ...course, leafTitle: parts[0] });
                return;
            }
            let current = tree;
            for(let i=0; i<parts.length - 1; i++) {
                if (!current[parts[i]]) current[parts[i]] = {};
                current = current[parts[i]];
            }
            if (!current['_courses']) current['_courses'] = [];
            current['_courses'].push({ ...course, leafTitle: parts[parts.length-1] });
        });
        return tree;
    };

    if (loading) {
        return <div className="container page-wrapper" style={{ marginTop: '140px', textAlign: 'center' }}><h2>Loading Courses...</h2></div>;
    }

    const coursesTree = buildTree(courses);
    const topCategories = Object.keys(coursesTree).filter(k => k !== '_courses');

    return (
        <div style={{ marginTop: '110px', paddingBottom: '60px' }}>
            <div style={styles.hero}>
                <h1 style={styles.heroTitle}>Our Taxonomy of Courses</h1>
                <p style={styles.heroSub}>Find the perfect program tailored to your needs. Fully interactive - click any course to Enroll or Book a Demo directly.</p>
            </div>
            
            <div className="container" style={styles.container}>
                {topCategories.map(cat => {
                    const params = new URLSearchParams(location.search);
                    const targetCat = params.get('category');
                    return (
                    <div key={cat} style={styles.categorySection}>
                        <RecursiveNode 
                            nodeName={cat} 
                            nodeData={coursesTree[cat]} 
                            level={0} 
                            openCourseModal={openCourseModal} 
                            initialOpen={cat === targetCat}
                        />
                    </div>
                )})}

                {/* If there are any top-level courses without categories */}
                {coursesTree['_courses'] && coursesTree['_courses'].length > 0 && (
                    <div style={styles.categorySection}>
                        <RecursiveNode 
                            nodeName="Other Courses" 
                            nodeData={{ '_courses': coursesTree['_courses'] }} 
                            level={0} 
                            openCourseModal={openCourseModal} 
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    hero: {
        background: 'linear-gradient(135deg, #1a56db 0%, #1e40af 100%)',
        color: 'white',
        padding: '3rem 1rem',
        textAlign: 'center',
        marginBottom: '3rem'
    },
    heroTitle: {
        fontSize: '2.5rem',
        marginBottom: '1rem',
        fontWeight: 'bold'
    },
    heroSub: {
        fontSize: '1.2rem',
        opacity: 0.9,
        maxWidth: '700px',
        margin: '0 auto'
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem'
    },
    categorySection: {
        marginBottom: '1rem',
        border: '1px solid #e1e8f0',
        borderRadius: '12px',
        backgroundColor: '#fff',
        overflow: 'hidden'
    },
    categoryHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 2rem',
        cursor: 'pointer',
        backgroundColor: '#f8fafc',
        transition: 'background-color 0.2s',
    },
    subCategoryHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 0',
        color: '#334155'
    },
    categoryTitle: {
        fontSize: '1.5rem',
        color: '#1e293b',
        margin: 0
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginTop: '1rem',
        marginBottom: '1.5rem'
    },
    card: {
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        cursor: 'pointer',
        backgroundColor: '#fff',
        transition: 'all 0.3s'
    },
    iconWrapper: {
        background: '#eff6ff',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardTitle: {
        fontSize: '1.1rem',
        fontWeight: 'bold',
        color: '#1e293b',
        margin: 0
    },
    cardDesc: {
        fontSize: '0.9rem',
        color: '#64748b',
        margin: 0,
        flexGrow: 1
    },
    bookBtn: {
        background: 'transparent',
        border: '1px solid #1a56db',
        color: '#1a56db',
        padding: '0.5rem 1rem',
        borderRadius: '6px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: 'auto',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
};

export default Courses;
