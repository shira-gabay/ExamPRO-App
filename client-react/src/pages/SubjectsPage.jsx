import React, { useEffect, useState } from 'react';

function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/education/subjects-with-materials`)
      .then(res => res.json())
      .then(data => {
        console.log("Fetched subjects:", data); // נוסיף בדיקה
        setSubjects(data);
      });
  }, []);

  const handleClick = (subjectId) => {
    alert(`נבחר מקצוע עם מזהה: ${subjectId}`);
  };

  return (
    <div style={styles.container}>
      {subjects.map((subject) => (
        <div
          key={subject.id || subject._id} // נוודא שיש key גם אם זה _id
          style={styles.folder}
          onClick={() => handleClick(subject.id || subject._id)}
        >
          📁 {subject.subjectName || "ללא שם"}
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    padding: '20px',
  },
  folder: {
    padding: '20px',
    backgroundColor: '#f1f1f1',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '18px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: '0.2s',
  },
};

export default SubjectsPage;
