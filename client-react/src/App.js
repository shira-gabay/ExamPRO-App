import React from "react";
import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom";

import Auth from "./pages/Auth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Exams from "./pages/Exams";
import SavedExams from "./components/SavedExams";
import SubjectsPage from "./pages/SubjectsPage";
import UploadStudyMaterial from "./pages/UploadStudyMaterial";
import { AppSessionProvider } from "./contexts/AppSessionContext";
import SubjectsFoldersPage from "./pages/SubjectsFoldersPage";
function App() {
  return (
    <AppSessionProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/exams" element={<Exams />} />
          <Route path="/saved-exams" element={<SavedExams />} />
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/upload-study-material/:examId" element={<UploadStudyMaterialWrapper />} />
          <Route path="/folders" element={<SubjectsFoldersPage/>} />
        </Routes>
      </Router>
    </AppSessionProvider>
  );
}

function UploadStudyMaterialWrapper() {
  const { examId } = useParams();
  return <UploadStudyMaterial examId={examId} />;
}

export default App;
