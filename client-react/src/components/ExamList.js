
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, CircularProgress } from "@mui/material";

const ExamList = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/Exam`);
        setExams(res.data);
      } catch (error) {
        console.error("Error fetching exams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <div>
      <h2>המבחנים שלך</h2>
      {exams.map((exam) => (
        <Card key={exam.id} style={{ marginBottom: "10px" }}>
          <CardContent>
            <Typography variant="h5">{exam.subject}</Typography>
            <Typography>סוג: {exam.examType}</Typography>
            <Typography>רמת קושי: {exam.difficulty}</Typography>
            <Typography>משך זמן: {exam.duration} דקות</Typography>
            <Typography>מספר שאלות: {exam.questionCount}</Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ExamList;