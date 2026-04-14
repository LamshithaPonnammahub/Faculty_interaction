import React, { createContext, useState, useContext } from 'react';

const CourseContext = createContext();

export const useCourseModal = () => useContext(CourseContext);

export const CourseProvider = ({ children }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);

  const openCourseModal = (courseInfo) => {
    // Info should at least have { title: 'Course Name', id?: 1 }
    setSelectedCourse(courseInfo);
  };
  
  const closeCourseModal = () => {
    setSelectedCourse(null);
  };

  return (
    <CourseContext.Provider value={{ selectedCourse, openCourseModal, closeCourseModal }}>
      {children}
    </CourseContext.Provider>
  );
};
