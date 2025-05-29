import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Box, Typography, Paper, Card, CardContent } from "@mui/material";
import { School, Login, PersonAdd, Phone, Help } from "@mui/icons-material";

const Auth = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(null);

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
          padding: { xs: 4, sm: 6 },
          width: { xs: "90%", sm: 500 },
          maxWidth: 500,
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
        <Box sx={{ mb: 5 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 100,
              height: 100,
              borderRadius: 4,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              mb: 3,
              boxShadow: "0 15px 35px rgba(102, 126, 234, 0.3)",
              animation: "pulse 2s ease-in-out infinite",
            }}
          >
            <School sx={{ fontSize: 50, color: "white" }} />
          </Box>
          
          <Typography
            variant="h3"
            fontWeight="700"
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2,
              fontSize: { xs: "2rem", sm: "2.5rem" }
            }}
          >
            מערכת ניהול מבחנים
          </Typography>
          
          <Typography
            variant="h6"
            sx={{
              color: "#666",
              fontWeight: 500,
              fontSize: "1.2rem",
              mb: 1,
            }}
          >
            יצירה וניהול חכם של חומרי לימוד
          </Typography>
          
          <Typography
            variant="body1"
            sx={{
              color: "#888",
              fontSize: "0.95rem",
            }}
          >
            פשוט • יעיל • מתקדם
          </Typography>
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ mb: 4 }}>
          {/* Login Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate("/login")}
            onMouseEnter={() => setIsHovered("login")}
            onMouseLeave={() => setIsHovered(null)}
            startIcon={<Login />}
            sx={{
              mb: 2,
              height: 64,
              borderRadius: 3,
              fontSize: "1.2rem",
              fontWeight: 600,
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)",
              transition: "all 0.3s ease",
              "&:hover": {
                background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
                boxShadow: "0 15px 35px rgba(59, 130, 246, 0.4)",
                transform: "translateY(-2px)",
              },
              "&:active": {
                transform: "translateY(0px)",
              },
              ...(isHovered === "login" && {
                transform: "translateY(-2px)",
                boxShadow: "0 15px 35px rgba(59, 130, 246, 0.4)",
              }),
            }}
          >
            התחבר למערכת
          </Button>

          {/* Register Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate("/register")}
            onMouseEnter={() => setIsHovered("register")}
            onMouseLeave={() => setIsHovered(null)}
            startIcon={<PersonAdd />}
            sx={{
              height: 64,
              borderRadius: 3,
              fontSize: "1.2rem",
              fontWeight: 600,
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)",
              transition: "all 0.3s ease",
              "&:hover": {
                background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                boxShadow: "0 15px 35px rgba(16, 185, 129, 0.4)",
                transform: "translateY(-2px)",
              },
              "&:active": {
                transform: "translateY(0px)",
              },
              ...(isHovered === "register" && {
                transform: "translateY(-2px)",
                boxShadow: "0 15px 35px rgba(16, 185, 129, 0.4)",
              }),
            }}
          >
            הרשמה חדשה
          </Button>

          {/* Divider */}
          <Box 
            sx={{ 
              display: "flex", 
              alignItems: "center", 
              my: 4,
            }}
          >
            <Box sx={{ 
              flex: 1, 
              height: "1px", 
              background: "linear-gradient(to right, transparent, #cbd5e1, transparent)" 
            }} />
            <Typography 
              variant="body2" 
              sx={{ 
                px: 3, 
                color: "#94a3b8", 
                background: "rgba(255, 255, 255, 0.7)",
                borderRadius: 2,
                py: 0.5,
                fontSize: "0.85rem"
              }}
            >
              או
            </Typography>
            <Box sx={{ 
              flex: 1, 
              height: "1px", 
              background: "linear-gradient(to right, transparent, #cbd5e1, transparent)" 
            }} />
          </Box>
        </Box>

        {/* Help Section */}
        <Card
          sx={{
            background: "rgba(59, 130, 246, 0.05)",
            border: "1px solid rgba(59, 130, 246, 0.15)",
            borderRadius: 3,
            boxShadow: "none",
          }}
        >
          <CardContent sx={{ py: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 1 }}>
              <Help sx={{ color: "#3b82f6", fontSize: 20 }} />
              <Typography
                variant="body1"
                sx={{
                  color: "#64748b",
                  fontWeight: 500,
                  fontSize: "0.95rem"
                }}
              >
                זקוק לעזרה?
              </Typography>
            </Box>
            
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                fontSize: "0.8rem",
                mb: 1.5,
              }}
            >
              צור קשר עם התמיכה הטכנית
            </Typography>
            
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
              <Phone sx={{ color: "#3b82f6", fontSize: 18 }} />
              <Typography
                variant="body1"
                sx={{
                  color: "#3b82f6",
                  fontWeight: 600,
                  fontSize: "1rem"
                }}
              >
                0556797080
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Footer */}
        <Typography
          variant="body2"
          sx={{
            color: "#888",
            fontSize: "0.9rem",
            mt: 3,
          }}
        >
          מערכת מאובטחת לבניית מבחנים דיגיטליים
        </Typography>

        <style>
          {`
            @keyframes pulse {
              0% { box-shadow: 0 15px 35px rgba(102, 126, 234, 0.3); }
              50% { box-shadow: 0 15px 45px rgba(102, 126, 234, 0.5); }
              100% { box-shadow: 0 15px 35px rgba(102, 126, 234, 0.3); }
            }
          `}
        </style>
      </Paper>
    </Box>
  );
};

export default Auth;