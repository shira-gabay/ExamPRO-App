import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, CircularProgress } from "@mui/material";
import axios from "axios";
import ExamCard from "./ExamCard";

const SavedExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedExams = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/Exam`);
        setExams(res.data);
      } catch (err) {
        console.error("Error loading saved exams:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedExams();
  }, []);

  return (
    <Container sx={{ paddingTop: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        מבחנים שנשמרו
      </Typography>
      {loading ? (
        <CircularProgress sx={{ display: "block", margin: "2rem auto" }} />
      ) : (
        <Grid container spacing={2}>
          {exams.length > 0 ? exams.map((exam) => (
            <Grid item xs={12} md={6} key={exam._id}>
              <ExamCard exam={exam} />
            </Grid>
          )) : (
            <Typography align="center" sx={{ width: "100%", marginTop: "2rem" }}>
              אין מבחנים שמורים כרגע.
            </Typography>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default SavedExams;
