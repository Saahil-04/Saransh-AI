import type React from "react"
import { useState } from "react"
import axios from "axios"
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  InputAdornment,
  Fade,
} from "@mui/material"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"
import LoginIcon from "@mui/icons-material/Login"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import GoogleLogo from "../../components/googlelogo"
import { StyledTextField, StyledButton, StyledGoogleButton } from "../../components/styled_components"

function LoginPage() {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        identifier,
        password,
      })

      const { access_token, sessionId, username } = response.data
      localStorage.setItem("token", access_token)
      localStorage.setItem("sessionId", sessionId)
      localStorage.setItem("username", username)
      navigate("/home")
    } catch (error) {
      console.error("Login error:", error)
      setError("Invalid email/username or password")
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google"
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#1a1a2e" }}>
      <AppBar position="static" sx={{ backgroundColor: "transparent", boxShadow: "none" }}>
        <Toolbar>
          <Typography
            variant="h5"
            onClick={() => { navigate("/") }}
            component={motion.div}
            whileHover={{ scale: 1.05 }}
            sx={{"&:hover": { cursor: "pointer" }}}
          >
            SaranshAI
            <AutoAwesomeIcon sx={{ ml: 1 }} />
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm">
        <Fade in={true} timeout={1000}>
          <Paper
            elevation={6}
            sx={{
              mt: 8,
              p: 4,
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              borderRadius: "20px",
            }}
          >
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{
                mb: 4,
                fontWeight: "bold",
                background: "linear-gradient(45deg, #6b46c1, #805ad5)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Login to SaranshAI
            </Typography>
            <form onSubmit={handleLogin}>
              <StyledTextField
                fullWidth
                label="Email or Username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                variant="outlined"
              />
              <StyledTextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end" sx={{ color: "white" }}>
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <StyledButton type="submit" fullWidth variant="contained" endIcon={<LoginIcon />}>
                Login
              </StyledButton>
            </form>
            <StyledGoogleButton
              fullWidth
              variant="outlined"
              sx={{
                mt: 2,
                mb: 2,

                // borderColor: "rgba(255, 255, 255, 0.5)",
                color: "black",
                "&:hover": {
                  // borderColor: "rgba(255, 255, 255, 0.8)",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
              onClick={handleGoogleLogin}
            >
              <GoogleLogo style={{ marginRight: "10px" }} />
              Login with Google
            </StyledGoogleButton>
            <Button
              onClick={() => navigate("/register")}
              fullWidth
              variant="text"
              sx={{
                mt: 1,
                color: "rgba(255, 255, 255, 0.7)",
                textTransform: "none",
                "&:hover": {
                  color: "white",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              Don't have an account? Sign up
            </Button>
            {error && (
              <Typography variant="body2" align="center" sx={{ color: "#ff6b6b", mt: 2 }}>
                {error}
              </Typography>
            )}
          </Paper>
        </Fade>
      </Container>
    </Box>
  )
}

export default LoginPage

