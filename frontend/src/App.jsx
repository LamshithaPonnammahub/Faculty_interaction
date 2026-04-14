import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import StudentDashboard from './pages/StudentDashboard';
import { CourseProvider } from './context/CourseContext';
import GlobalCourseModal from './components/GlobalCourseModal';

// Placeholder pages to ensure routing works
import Courses from './pages/Courses';
const About = () => <div className="container page-wrapper"><h1>About Us</h1></div>;
const Contact = () => <div className="container page-wrapper"><h1>Contact</h1></div>;

function App() {
  return (
    <CourseProvider>
      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
            <Route path="/dashboard/faculty" element={<FacultyDashboard />} />
            <Route path="/dashboard/student" element={<StudentDashboard />} />
          </Routes>
        </main>
        <GlobalCourseModal />
      </Router>
    </CourseProvider>
  );
}

export default App;
