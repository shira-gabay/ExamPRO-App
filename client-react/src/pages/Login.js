import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Box, Typography, Paper, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff, AccountCircle, Lock, School } from "@mui/icons-material";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useAppSession } from "../contexts/AppSessionContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setCurrentUser } = useAppSession(); // 👈 שימוש בקונטקסט

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/User/login`, {
        email,
        password
      });

      const token = res.data.token;
      localStorage.setItem("token", token);

      // 👇 כאן מפענחים את הטוקן
      const decoded = jwtDecode(token);

      console.log("🔓 decoded token:", decoded);

      // 👇 התאמה לפורמט של הקונטקסט
      setCurrentUser({
        id: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
        role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
      });

      navigate("/exams");
    } catch (err) {
      console.error(err);
      alert("שגיאה בהתחברות, אנא נסה שוב");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='53' cy='53' r='1'/%3E%3Ccircle cx='7' cy='53' r='1'/%3E%3Ccircle cx='53' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.3,
          animation: "float 6s ease-in-out infinite",
        },
        "@keyframes float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      }}
    >
      <Paper
        elevation={20}
        sx={{
          padding: { xs: 3, sm: 5 },
          width: { xs: "90%", sm: 450 },
          maxWidth: 450,
          textAlign: "center",
          borderRadius: 4,
          position: "relative",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 25px 45px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 35px 55px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)",
          },
        }}
      >
        {/* Header with Icon */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              mb: 2,
              boxShadow: "0 10px 25px rgba(102, 126, 234, 0.3)",
              animation: "pulse 2s ease-in-out infinite",
            }}
          >
            <School sx={{ fontSize: 40, color: "white" }} />
          </Box>
          <Typography
            variant="h4"
            fontWeight="700"
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1,
            }}
          >
            ברוכים הבאים
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "#666",
              fontWeight: 400,
              fontSize: "1.1rem",
            }}
          >
            מערכת בניית מבחנים מתקדמת
          </Typography>
        </Box>

        {/* Form Fields */}
        <Box sx={{ mb: 3 }}>
          <TextField
            label="כתובת אימייל"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            fullWidth
            margin="normal"
            variant="outlined"
            dir="ltr"
            InputLabelProps={{
              style: { direction: "rtl", textAlign: "right" }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle sx={{ color: "#667eea" }} />
                </InputAdornment>
              ),
              style: { direction: "ltr", textAlign: "left" }
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 5px 15px rgba(102, 126, 234, 0.1)",
                },
                "&.Mui-focused": {
                  boxShadow: "0 5px 20px rgba(102, 126, 234, 0.2)",
                  "& fieldset": {
                    borderColor: "#667eea",
                    borderWidth: 2,
                  },
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#667eea",
              },
            }}
          />

          <TextField
            label="סיסמה"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            fullWidth
            margin="normal"
            variant="outlined"
            dir="ltr"
            InputLabelProps={{
              style: { direction: "rtl", textAlign: "right" }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: "#667eea" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                    sx={{ color: "#667eea" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
              style: { direction: "ltr", textAlign: "left" }
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 5px 15px rgba(102, 126, 234, 0.1)",
                },
                "&.Mui-focused": {
                  boxShadow: "0 5px 20px rgba(102, 126, 234, 0.2)",
                  "& fieldset": {
                    borderColor: "#667eea",
                    borderWidth: 2,
                  },
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#667eea",
              },
            }}
          />
        </Box>

        {/* Login Button */}
        <Button
          variant="contained"
          fullWidth
          onClick={handleLogin}
          disabled={isLoading}
          sx={{
            marginTop: 3,
            marginBottom: 2,
            height: 56,
            borderRadius: 3,
            fontSize: "1.1rem",
            fontWeight: 600,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            boxShadow: "0 10px 25px rgba(102, 126, 234, 0.3)",
            transition: "all 0.3s ease",
            "&:hover": {
              background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
              boxShadow: "0 15px 35px rgba(102, 126, 234, 0.4)",
              transform: "translateY(-2px)",
            },
            "&:active": {
              transform: "translateY(0px)",
            },
            "&:disabled": {
              background: "linear-gradient(135deg, #ccc 0%, #999 100%)",
              boxShadow: "none",
            },
          }}
        >
          {isLoading ? "מתחבר..." : "התחבר למערכת"}
        </Button>

        {/* Footer */}
        <Typography
          variant="body2"
          sx={{
            color: "#888",
            fontSize: "0.9rem",
            mt: 2,
          }}
        >
          מערכת מאובטחת לבניית מבחנים דיגיטליים
        </Typography>

        <style>
          {`
            @keyframes pulse {
              0% { box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3); }
              50% { box-shadow: 0 10px 35px rgba(102, 126, 234, 0.5); }
              100% { box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3); }
            }
          `}
        </style>
      </Paper>
    </Box>
  );
};

export default Login;