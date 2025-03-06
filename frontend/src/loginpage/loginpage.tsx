import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  AppBar,
  Toolbar,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import LoginIcon from "@mui/icons-material/Login";
import { useNavigate, useLocation } from "react-router-dom";

function LoginPage() {
  const [identifier, setIdentifier] = useState(""); // Can be email or username
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  // const location = useLocation();

  // Helper function to parse cookies
  // const getCookieValue = (name: string): string | null => {
  //   const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  //   return match ? decodeURIComponent(match[2]) : null;
  // };

  // // Helper function to clear cookies
  // const clearCookies = () => {
  //   document.cookie.split(";").forEach((cookie) => {
  //     const eqPos = cookie.indexOf("=");
  //     const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
  //     document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  //   });
  // };

  // Handle Google OAuth login or cookie sync
  // useEffect(() => {
  //   const params = new URLSearchParams(location.search);
  //   const token = params.get("token");
  //   const sessionId = params.get("sessionId");
  //   const username = params.get("username");

  //   if (token && sessionId && username) {
  //     // Save token and session details to localStorage
  //     localStorage.setItem("token", token);
  //     localStorage.setItem("sessionId", sessionId);
  //     localStorage.setItem("username", username);

  //     // Clear query params and cookies after login
  //     window.history.replaceState({}, document.title, location.pathname);
  //     clearCookies();

  //     // Redirect to the home page
  //     navigate("/home");
  //   } else {
  //     // Check cookies and sync to localStorage
  //     const cookieToken = getCookieValue("token");
  //     const cookieUsername = getCookieValue("username");
  //     const cookieSessionId = getCookieValue("sessionId");

  //     if (cookieToken && cookieUsername && cookieSessionId) {
  //       localStorage.setItem("token", cookieToken);
  //       localStorage.setItem("username", cookieUsername);
  //       localStorage.setItem("sessionId", cookieSessionId);
  //       console.log("this is the token",localStorage);
  //       clearCookies();
  //       navigate("/home");
  //     }
  //   }
  // }, [location.search, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        identifier, // Passes either username or email
        password,
      });

      const { access_token, sessionId, username } = response.data;
      localStorage.setItem("token", access_token);
      localStorage.setItem("sessionId", sessionId);
      localStorage.setItem("username", username);
      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid email/username or password");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  return (
    <>
      <AppBar
        position="static"
        style={{
          backgroundColor: "#212121",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Toolbar>
          <Typography variant="h5" sx={{ paddingTop: "20px" }}>
            SaranshAI
            <AutoAwesomeIcon sx={{ paddingLeft: "5px" }} />
          </Typography>
        </Toolbar>
      </AppBar>
      <Container
        style={{
          backgroundColor: "#212121",
          height: "calc(100vh - 64px)",
          maxWidth: "100%",
          padding: "0px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          style={{
            padding: "40px",
            width: "100%",
            maxWidth: "400px",
            backgroundColor: "#343541",
            borderRadius: "15px",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              color: "white",
              marginBottom: "30px",
              background:
                "linear-gradient(90deg, rgba(168,85,247,1) 0%, rgba(255,255,255,1) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Login to SaranshAI
          </Typography>
          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              variant="outlined"
              margin="normal"
              label="Email or Username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              InputProps={{
                style: { color: "white" },
              }}
              InputLabelProps={{
                style: { color: "rgba(255, 255, 255, 0.7)" },
              }}
              sx={{
                backgroundColor: "#444654",
                borderRadius: "5px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.23)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },
                },
              }}
            />
            <TextField
              fullWidth
              variant="outlined"
              margin="normal"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                style: { color: "white" },
              }}
              InputLabelProps={{
                style: { color: "rgba(255, 255, 255, 0.7)" },
              }}
              sx={{
                backgroundColor: "#444654",
                borderRadius: "5px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.23)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: "rgba(168,85,247,1)",
                "&:hover": {
                  backgroundColor: "rgba(168,85,247,0.8)",
                },
              }}
              endIcon={<LoginIcon />}
            >
              Login
            </Button>
            <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 1,
                mb: 2,
                backgroundColor: "#DB4437",
                color: "white",
                "&:hover": {
                  backgroundColor: "#C33C2C",
                },
              }}
              onClick={handleGoogleLogin}
            >
              Login with Google
            </Button>
            <Button
              onClick={() => {
                navigate("/register");
              }}
              fullWidth
              variant="outlined"
              color="info"
              style={{
                textDecoration: "underline",
                fontSize: "0.9rem",
                textTransform: "none",
              }}
              sx={{
                borderColor: "gray",
                color: "white",
                "&:hover": {
                  borderColor: "transparent",
                  backgroundColor: "rgba(168,85,247,0.2)",
                },
              }}
            >
              Create an account
            </Button>
          </form>
          {error && (
            <Typography
              variant="body2"
              align="center"
              sx={{ color: "red", mt: 2 }}
            >
              {error}
            </Typography>
          )}
        </Paper>
      </Container>
    </>
  );
}

export default LoginPage;
