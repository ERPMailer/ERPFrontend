// Login.jsx
import React, { useState } from "react";
import {
  Container,
  Paper,
  Box,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Link,
  Alert,
  Divider,
  Button,
  useTheme,
  useMediaQuery,
  Fade,
  Avatar,
  Collapse,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Mail,
  Google,
  Microsoft,
  LightMode,
  DarkMode,
  Close,
} from "@mui/icons-material";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../config/firebaseConfig";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
const Home = ({ toggleTheme, isDarkMode = false }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Validation
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }

    // Clear alert when user starts typing
    if (alert) {
      setAlert(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // if (!formData.password.trim()) {
    //   newErrors.password = "Password is required";
    // } else if (formData.password.length < 6) {
    //   newErrors.password = "Password must be at least 6 characters";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      // Simulate API call
      const response = await axiosInstance.post(`/login`, formData);

      setAlert({
        type: "success",
        message: "Login successful! Redirecting to dashboard...",
      });

      // Simulate redirect after success
      setTimeout(() => {
        navigate(`/create-template`);
        // window.location.href = '/dashboard';
      }, 1500);
    } catch (error) {
      setAlert({
        type: "error",
        message: "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    setAlert({
      type: "info",
      message: `${provider} login integration coming soon!`,
    });
  };

  const handleForgotPassword = () => {
    setAlert({
      type: "info",
      message: "Password reset functionality will be implemented",
    });
  };

  const handleGoogleLogin = async () => {
    try {
      debugger;

      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const createUser = await axiosInstance.post(
        `/users/create-user`,
        {},
        {
          headers: {
            token: user.accessToken,
          },
          withCredentials: true,
        }
      );
      console.log("Logged in as:", user);
      navigate("/create-template");
    } catch (err) {
      console.error("Google sign-in error:", err.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 3,
        px: 2,
        background: isDarkMode
          ? "linear-gradient(135deg, #0a1929 0%, #001e3c 100%)"
          : "linear-gradient(135deg, #f5f5f5 0%, #e3f2fd 100%)",
      }}
    >
      <Container maxWidth="sm">
        <Fade in={true} timeout={800}>
          <Paper
            elevation={isDarkMode ? 12 : 8}
            sx={{
              position: "relative",
              p: { xs: 3, sm: 5 },
              borderRadius: 3,
              background: isDarkMode
                ? "linear-gradient(135deg, #001e3c 0%, #0a1929 100%)"
                : "linear-gradient(135deg, #ffffff 0%, #fafafa 100%)",
              backdropFilter: "blur(20px)",
              border: isDarkMode
                ? "1px solid rgba(255,255,255,0.1)"
                : "1px solid rgba(0,0,0,0.08)",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                background: "linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)",
                borderRadius: "12px 12px 0 0",
              },
            }}
          >
            {/* Header with Theme Toggle */}
            <Box sx={{ position: "relative", textAlign: "center", mb: 2 }}>
              {toggleTheme && (
                <IconButton
                  onClick={toggleTheme}
                  sx={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    color: "text.secondary",
                    "&:hover": {
                      color: "primary.main",
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  {isDarkMode ? <LightMode /> : <DarkMode />}
                </IconButton>
              )}

              <Avatar
                sx={{
                  width: 72,
                  height: 72,
                  mx: "auto",
                  mb: 2,
                  background:
                    "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                  boxShadow: 3,
                }}
              >
                <Mail sx={{ fontSize: 36 }} />
              </Avatar>

              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  background: isDarkMode
                    ? "linear-gradient(45deg, #ffffff 0%, #b0b0b0 100%)"
                    : "linear-gradient(45deg, #1976d2 0%, #42a5f5 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textAlign: "center",
                }}
              >
                Welcome to ERPMailer
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Sign in to your account to continue
              </Typography>
            </Box>

            {/* Alert Messages */}
            <Collapse in={!!alert}>
              {alert && (
                <Alert
                  severity={alert.type}
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => setAlert(null)}
                    >
                      <Close fontSize="inherit" />
                    </IconButton>
                  }
                  sx={{
                    mb: 3,
                    borderRadius: 2,
                    "& .MuiAlert-message": {
                      fontSize: "0.95rem",
                    },
                  }}
                >
                  {alert.message}
                </Alert>
              )}
            </Collapse>

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleInputChange("email")}
                error={!!errors.email}
                helperText={errors.email}
                margin="normal"
                required
                autoComplete="email"
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange("password")}
                error={!!errors.password}
                helperText={errors.password}
                margin="normal"
                required
                autoComplete="current-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 1,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                }}
              />

              <Box sx={{ textAlign: "right", mb: 3 }}>
                <Link
                  component="button"
                  variant="body2"
                  type="button"
                  onClick={handleForgotPassword}
                  sx={{
                    color: "primary.main",
                    textDecoration: "none",
                    fontWeight: 500,
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Forgot Password?
                </Link>
              </Box>

              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={loading}
                loadingPosition="start"
                startIcon={<Mail />}
                sx={{
                  py: 1.8,
                  mb: 3,
                  borderRadius: 2,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  textTransform: "none",
                  background:
                    "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                  boxShadow: "0 4px 15px rgba(25, 118, 210, 0.4)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #1565c0 0%, #1976d2 100%)",
                    boxShadow: "0 6px 20px rgba(25, 118, 210, 0.6)",
                    transform: "translateY(-2px)",
                  },
                  "&:disabled": {
                    background:
                      "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                    opacity: 0.7,
                  },
                  transition: "all 0.3s ease",
                }}
              >
                {loading ? "Signing In..." : "Sign In"}
              </LoadingButton>

              <Divider sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ px: 2 }}
                >
                  Or continue with
                </Typography>
              </Divider>

              {/* Social Login Buttons */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mb: 3,
                  flexDirection: isMobile ? "column" : "row",
                }}
              >
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Google />}
                  onClick={() => handleGoogleLogin("Google")}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 500,
                    borderColor: "divider",
                    color: "text.primary",
                    "&:hover": {
                      borderColor: "primary.main",
                      backgroundColor: "action.hover",
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  Google
                </Button>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Home;
