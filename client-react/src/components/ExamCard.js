import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";

const ExamCard = ({ exam }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{exam.title}</Typography>
        <Typography variant="body2">נוצר ב: {new Date(exam.createdAt).toLocaleDateString()}</Typography>
        <Button variant="contained" color="primary">הצג מבחן</Button>
      </CardContent>
    </Card>
  );
};

export default ExamCard;
