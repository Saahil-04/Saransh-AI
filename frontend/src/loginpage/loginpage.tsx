import React, { useState } from "react";
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
  Avatar,
  IconButton,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import LoginIcon from "@mui/icons-material/Login";
import { blue } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        username,
        password,
      });

      console.log("Login response:", response.data);
      // Store the username in local storage
      const { access_token } = response.data;
      const {sessionId} = response.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('sessionId',sessionId);
      localStorage.setItem("username", username);
      navigate("/home");
      // Handle successful login here (e.g., store token, redirect to chat page)
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid username or password");
    }
  };

  return (
    <>
      <AppBar
        position="static"
        style={{
          backgroundColor: "#212121",
          display: "flex",
          flexDirection: "row",
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
          flexDirection: "column",
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
              background: "linear-gradient(90deg, rgba(168,85,247,1) 0%, rgba(255,255,255,1) 100%)",
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
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              onClick={()=>{navigate('/register')}}
              fullWidth
              variant="outlined"
              color="info"
              style={{textDecoration:'underline', fontSize:"0.9rem",textTransform: "none" }}
              sx={{
                borderColor: 'gray', // Set your desired border color here
                color: 'white',     // Text color
                '&:hover': {
                  borderColor: 'transparent', // Change border color on hover
                  backgroundColor: 'rgba(168,85,247,0.2)', // Optional hover background color
                },
              }}
            >
              Create an account 
            </Button>
          </form>
          {error && (
            <Typography variant="body2" align="center" sx={{ color: "red", mt: 2 }}>
              {error}
            </Typography>
          )}
        </Paper>
      </Container>
    </>
  );
}

export default LoginPage;