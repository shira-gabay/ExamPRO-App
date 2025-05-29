import { useEffect, useState } from "react";
import { useAppSession } from "../contexts/AppSessionContext"; // נתיב לפי המיקום האמיתי אצלך
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";

function SubjectSelect({ subject, setSubject }) {
  const [subjects, setSubjects] = useState([]);
  const [showAddField, setShowAddField] = useState(false);
  const [newSubject, setNewSubject] = useState("");
const { setCurrentSubject } = useAppSession();
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/SubjectCategory`);
        setSubjects(res.data);
      } catch (error) {
        console.error("Error fetching subjects", error);
      }
    };
    fetchSubjects();
  }, []);

  const handleSubjectChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "other") {
      setShowAddField(true);
    } else {
      setSubject(selectedValue);
      
      setShowAddField(false);
    }
  };

  const handleAddNewSubject = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/SubjectCategory`,
        {name:newSubject},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  console.log(response)
      const newCreated = response.data;
      console.log("נוצר נושא חדש:", newCreated);

      // הוספת הנושא החדש לרשימה + בחירתו אוטומטית
      setSubjects((prev) => [...prev, newCreated]);
      setSubject(newCreated.id);
      setCurrentSubject({ id: newCreated.id });
      setNewSubject("");
      setShowAddField(false);
    } catch (error) {
      console.error("Error adding new subject", error);
    }
  };

  return (
    <>
      <FormControl fullWidth>
        <InputLabel id="subject-label">בחר נושא</InputLabel>
        <Select
          labelId="subject-label"
          value={subject}
          onChange={handleSubjectChange}
          label="בחר נושא"
          sx={{ backgroundColor: "#ffffff", borderRadius: "8px", boxShadow: 1 }}
        >
          {subjects.map((subj) => (
            <MenuItem key={subj.id} value={subj.id}>
              {subj.name}
            </MenuItem>
          ))}
          <MenuItem value="other">אחר...</MenuItem>
        </Select>
      </FormControl>

      {showAddField && (
        <>
          <TextField
            fullWidth
            label="הוסף נושא חדש"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button
            variant="contained"
            onClick={handleAddNewSubject}
            sx={{ mt: 1 }}
          >
            שמור נושא חדש
          </Button>
        </>
      )}
    </>
  );
}

export default SubjectSelect;
