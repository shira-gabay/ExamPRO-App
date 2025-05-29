import React, { useState } from "react";
import { Button, Select, MenuItem, TextField } from "@mui/material";
import axios from "axios";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [examType, setExamType] = useState("multiple-choice");
  const [difficulty, setDifficulty] = useState("medium");
  const [questionCount, setQuestionCount] = useState(10);
  const [duration, setDuration] = useState(60);
  const [subject, setSubject] = useState("");

  const handleUpload = async () => {
    if (!file) {
      alert("אנא בחר קובץ להעלאה");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const uploadResponse = await axios.post(`${process.env.REACT_APP_API_URL}/api/StudyMaterial/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const fileUrl = uploadResponse.data.FileUrl;

      const examData = {
        examType,
        difficulty,
        questionCount,
        duration,
        subject,
        fileUrl,
      };

      const examResponse = await axios.post(`${process.env.REACT_APP_API_URL}/api/Exam/generate`, examData);

      alert("המבחן נוצר בהצלחה: " + JSON.stringify(examResponse.data));
    } catch (err) {
      console.error("Error generating exam:", err);
      alert("שגיאה ביצירת המבחן");
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <Select value={examType} onChange={(e) => setExamType(e.target.value)}>
        <MenuItem value="multiple-choice">אמריקאי</MenuItem>
        <MenuItem value="true-false">נכון/לא נכון</MenuItem>
        <MenuItem value="question">שאלות פתוחות</MenuItem>
      </Select>
      <Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
        <MenuItem value="easy">קל</MenuItem>
        <MenuItem value="medium">בינוני</MenuItem>
        <MenuItem value="hard">קשה</MenuItem>
      </Select>
      <TextField type="number" label="מספר שאלות" value={questionCount} onChange={(e) => setQuestionCount(e.target.value)} />
      <TextField type="number" label="משך זמן (דקות)" value={duration} onChange={(e) => setDuration(e.target.value)} />
      <TextField label="נושא" value={subject} onChange={(e) => setSubject(e.target.value)} />
      <Button variant="contained" color="primary" onClick={handleUpload}>צור מבחן</Button>
    </div>
  );
};

export default UploadForm;
