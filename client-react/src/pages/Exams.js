import React, { useState, useEffect } from "react";
import {
  Container, Typography, Grid, Button, Box,
  TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress,
  Dialog, DialogActions, DialogContent, DialogTitle
} from "@mui/material";
import UploadIcon from '@mui/icons-material/Upload';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ExamCard from "../components/ExamCard";
import SubjectSelect from "../pages/SubjectSelect";
import { useAppSession } from "../contexts/AppSessionContext"; // ✅ הוספה

const Exams = () => {
  const navigate = useNavigate();
  const { currentUser, currentSubject, setCurrentSubject } = useAppSession(); // ✅ שימוש ב-context

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [difficulty, setDifficulty] = useState("");
  const [examType, setExamType] = useState("");
  const [subject, setSubject] = useState(currentSubject?.name || ""); // שם המקצוע
  const [subjectId, setSubjectId] = useState(currentSubject?._id || ""); // מזהה המקצוע מה-context
  const [examDate, setExamDate] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [generatedExam, setGeneratedExam] = useState(null);
  const [title, setTitle] = useState("");
  const teacherId = currentUser?._id || ""; // ✅ מזהה מורה מה-context

 
  
useEffect(() => {
  console.log("🔄 AppSessionContext currentSubject:", currentSubject);
}, [currentSubject]);



const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // בדיקה אם הקובץ הוא מסוג doc או docx בלבד
  const allowedExtensions = ["doc", "docx"];
  const fileExtension = file.name.split('.').pop().toLowerCase();

  if (!allowedExtensions.includes(fileExtension)) {
    alert("נא להעלות קובץ Word בלבד (סיומות doc או docx).");
    setSelectedFile(null);
    setFileName("");
    event.target.value = null; // איפוס בחירת הקובץ ב-input
    return;
  }

  setSelectedFile(file);
  setFileName(file.name);
};


const handleUploadAndGenerate = async () => {
  console.log("👤 currentUser:", currentUser);

  if (!currentUser || !currentUser.id) {
    alert("עליך להיות מחובר כדי ליצור מבחן.");
    return;
  }

  console.log("📘 subjectId:", subjectId);
  console.log("📘 currentSubject:", subject);

  if (!subject) {
    alert("יש לבחור מקצוע לפני יצירת מבחן.");
    return;
  }

  if (!selectedFile || !title || !examType || !difficulty) {
    alert("נא למלא את כל השדות הנדרשים לפני העלאה");
    return;
  }

  setLoading(true);

  try {
    // === שלב 1: העלאת חומר הלימוד ===
    const uploadFormData = new FormData();
    uploadFormData.append("file", selectedFile);
    uploadFormData.append("title", title);
    uploadFormData.append("teacherId", currentUser.id);
    uploadFormData.append("subjectId", subject);

    const uploadResponse = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/StudyMaterial/upload`,
      uploadFormData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    const materialUrl = uploadResponse?.data?.fileUrl;
    if (!materialUrl) {
      throw new Error("❌ לא התקבלה כתובת קובץ חומר הלימוד מהשרת");
    }
    console.log("✅ חומר לימוד הועלה:", materialUrl);

    // === שלב 2: יצירת מבחן מהקובץ ===
    const generateFormData = new FormData();
    generateFormData.append("file", selectedFile);
    generateFormData.append("examType", examType);
    generateFormData.append("difficulty", difficulty);
    generateFormData.append("questionCount", "10");
    generateFormData.append("duration", "60");
    generateFormData.append("subject", currentSubject);
    generateFormData.append("teacherId", currentUser._id);
    generateFormData.append("title", title);
    if (examDate) {
      generateFormData.append("examDate", examDate);
    }

    const generateResponse = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/Exam/generate`,
      generateFormData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    const { downloadUrl, viewUrl } = generateResponse.data;

    if (!downloadUrl) {
      throw new Error("❌ לא התקבלה כתובת להורדת המבחן מהשרת");
    }
    console.log("✅ קובץ מבחן נוצר:", downloadUrl);
    console.log("👁️ קובץ לצפייה:", viewUrl);

    setGeneratedExam({
      subject: subjectId,
      difficulty,
      examType,
      examDate: examDate || new Date().toISOString(),
      viewUrl,
      downloadUrl,
    });

    // === שלב 3: שמירת המבחן במסד הנתונים ===
    console.log("👤 currentUser:", currentUser.id);
    const requestBody = {
      Id:"",
      Title:title,
      Description: "נוצר אוטומטית ממערכת AI",
      TeacherId: currentUser.id,
      SubjectId: currentSubject.name,
      ExamFileUrls: [downloadUrl],
      StudyMaterialUrls: [materialUrl]
      
    };
    console.log("typeof currentSubject:", typeof currentSubject);
console.log("currentSubject === null:", currentSubject === null);
console.log("currentSubject === undefined:", currentSubject === undefined);
console.log("currentSubject.length:", currentSubject?.length);
console.log("currentSubject:", currentSubject);

 if (!currentSubject) {
  alert("יש לבחור מקצוע לפני שמירת מבחן");
  return;
}
    console.log("📦 נתונים לשליחה לשרת /api/Exam:");
    console.log(JSON.stringify(requestBody, null, 2));

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/Exam`,
        requestBody
      );
      console.log("✅ המבחן נשמר בהצלחה:", response.data);
    } catch (error) {
      console.error("❌ שגיאה בשליחת המבחן לשרת:");
      console.log("Validation errors:", error.response?.data?.errors);

      if (axios.isAxiosError(error)) {
        console.error("שגיאת Axios:", error.response?.data);
        alert("שגיאת ולידציה:\n" + JSON.stringify(error.response?.data.errors, null, 2));
      } else {
        console.error("שגיאה כללית:", error);
        alert("אירעה שגיאה כללית בעת שמירת המבחן.");
      }
      throw error;
    }

    setOpenDialog(true);
    alert("✅ המבחן נוצר ונשמר בהצלחה!");

  } catch (error) {
    console.error("❌ שגיאה בתהליך יצירת המבחן:", error);
    alert("אירעה שגיאה: " + (error?.response?.data?.message || error.message));
  } finally {
    setLoading(false);
  }
};





  const handleViewSavedExams = () => {
    navigate("/folders");
  };

const handleViewSaved = () => {
  window.location.href = "https://exampro-dashboard.onrender.com/";
};
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDownload = () => {
    if (!generatedExam?.downloadUrl) return;
    const link = document.createElement("a");
    link.href = generatedExam.downloadUrl;
    link.download = "exam.docx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container
  maxWidth="md"
  sx={{
    backgroundColor: "#ffffff",
    padding: { xs: 2, sm: 4 },
    borderRadius: "16px",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)",
    mt: 4,
    mb: 6,
  }}
>
  <Typography
    variant="h4"
    gutterBottom
    sx={{
      color: "#1a237e",
      fontWeight: 700,
      textAlign: "center",
      mb: 3,
    }}
  >
    יצירת מבחן חכם
  </Typography>
<Box textAlign="center" mb={1}>
  <Typography variant="body1" color="text.secondary">
   <strong>Word ‏(.docx)</strong> בלבד
  </Typography>
</Box>
  {/* העלאת קובץ */}
  <Box textAlign="center" mb={3}>
    <input
      accept=".doc,.docx"
      id="upload-file"
      type="file"
      onChange={handleFileChange}
      style={{ display: "none" }}
    />
    <label htmlFor="upload-file">
      <Button
        component="span"
        variant="contained"
        color="secondary"
        startIcon={<UploadIcon />}
        sx={{
          px: 4,
          py: 1.5,
          fontSize: "16px",
          borderRadius: "8px",
          boxShadow: 4,
          textTransform: "none",
          transition: "0.3s",
          "&:hover": {
            boxShadow: 6,
            backgroundColor: "#6a1b9a",
          },
        }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "העלה חומר לימוד"
        )}
      </Button>
    </label>
    {fileName && (
      <Typography variant="body2" mt={2} sx={{ color: "#555" }}>
        קובץ שנבחר: <strong>{fileName}</strong>
      </Typography>
    )}
  </Box>

  {/* טופס פרטים */}
  <Box display="grid" gap={2} mb={3}>
    <TextField
      label="כותרת המבחן"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      fullWidth
      sx={{ bgcolor: "#f8f9fa", borderRadius: 2 }}
    />

    <FormControl fullWidth>
      <InputLabel id="difficulty-label">רמת קושי</InputLabel>
      <Select
        labelId="difficulty-label"
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        label="רמת קושי"
        sx={{ bgcolor: "#f8f9fa", borderRadius: 2 }}
      >
        <MenuItem value="easy">קל</MenuItem>
        <MenuItem value="medium">בינוני</MenuItem>
        <MenuItem value="hard">קשה</MenuItem>
      </Select>
    </FormControl>

    <FormControl fullWidth>
      <InputLabel id="exam-type-label">סוג מבחן</InputLabel>
      <Select
        labelId="exam-type-label"
        value={examType}
        onChange={(e) => setExamType(e.target.value)}
        label="סוג מבחן"
        sx={{ bgcolor: "#f8f9fa", borderRadius: 2 }}
      >
        <MenuItem value="multiple">אמריקאי</MenuItem>
        <MenuItem value="open">שאלות פתוחות</MenuItem>
        <MenuItem value="mixed">שילוב</MenuItem>
      </Select>
    </FormControl>

    <SubjectSelect
      subject={subject}
      setSubject={(newSubjectName) => {
        setSubject(newSubjectName);
        setCurrentSubject((prev) => ({ ...prev, name: newSubjectName }));
      }}
      setSubjectId={(newSubjectId) => {
        setSubjectId(newSubjectId);
        setCurrentSubject((prev) => ({ ...prev, _id: newSubjectId }));
      }}
    />

    <TextField
      label="תאריך מבחן"
      type="date"
      value={examDate}
      onChange={(e) => setExamDate(e.target.value)}
      InputLabelProps={{ shrink: true }}
      fullWidth
      sx={{ bgcolor: "#f8f9fa", borderRadius: 2 }}
    />
  </Box>

  {/* כפתור יצירה */}
  <Box textAlign="center" mb={3}>
    <Button
      variant="contained"
      color="primary"
      onClick={handleUploadAndGenerate}
      disabled={loading}
      sx={{
        px: 4,
        py: 1.5,
        fontSize: "16px",
        borderRadius: "8px",
        textTransform: "none",
        boxShadow: 4,
      }}
    >
      {loading ? <CircularProgress size={24} color="inherit" /> : "צור מבחן"}
    </Button>
  </Box>

  {/* כפתור למבחנים שמורים */}
  <Box textAlign="center" mb={3}>
    <Button
      variant="outlined"
      color="success"
      onClick={handleViewSavedExams}
      sx={{
        px: 4,
        py: 1.2,
        fontSize: "15px",
        borderRadius: "8px",
        textTransform: "none",
        boxShadow: 2,
      }}
    >
      הצג מבחנים וחומרי לימוד שמורים
    </Button>
  </Box>
   <Box textAlign="center" mb={3}>
    <Button
      variant="outlined"
      color="success"
      onClick={handleViewSaved}
      sx={{
        px: 4,
        py: 1.2,
        fontSize: "15px",
        borderRadius: "8px",
        textTransform: "none",
        boxShadow: 2,
      }}
    >
  הצג סטטיסטיקה ודוחות
    </Button>
  </Box>

  {/* הצגת כרטיסיות מבחנים */}
  <Grid container spacing={2}>
    {exams.map((exam) => (
      <Grid item xs={12} sm={6} key={exam.id}>
        <ExamCard exam={exam} />
      </Grid>
    ))}
  </Grid>

  {/* דיאלוג הצלחה */}
  <Dialog open={openDialog} onClose={handleCloseDialog}>
    <DialogTitle sx={{ fontWeight: 700, textAlign: "center" }}>
      ✅ המבחן נוצר בהצלחה!
    </DialogTitle>
    <DialogContent>
      {generatedExam && (
        <Box textAlign="center" mt={1}>
          <Typography variant="body1" gutterBottom>
            נושא: <strong>{generatedExam.subject}</strong>
          </Typography>
          <Typography variant="body2">
            רמת קושי: {generatedExam.difficulty || "לא נבחר"}
          </Typography>
          <Typography variant="body2">סוג: {generatedExam.examType}</Typography>
          <Typography variant="body2" mb={2}>
            תאריך: {new Date(generatedExam.examDate).toLocaleDateString()}
          </Typography>

          <Box display="flex" justifyContent="center" gap={2} mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => window.open(generatedExam.viewUrl, "_blank")}
            >
              צפייה בקובץ
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleDownload}
            >
              הורדה
            </Button>
          </Box>
        </Box>
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCloseDialog}>סגור</Button>
    </DialogActions>
  </Dialog>
</Container>

  );
};

export default Exams;
