import type React from "react"
import { useState } from "react"
import axios from "axios"
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  InputAdornment,
  Fade,
} from "@mui/material"
import { styled } from "@mui/system"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"
import PersonAddIcon from "@mui/icons-material/PersonAdd"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiOutlinedInput-root": {
    color: "white",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: "10px",
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    "&.Mui-focused": {
      backgroundColor: "rgba(255, 255, 255, 0.15)",
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.7)",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255, 255, 255, 0.23)",
  },
}))

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  borderRadius: "10px",
  padding: theme.spacing(1.5),
  transition: "all 0.3s ease-in-out",
  background: "linear-gradient(45deg, #6b46c1 30%, #805ad5 90%)",
  "&:hover": {
    background: "linear-gradient(45deg, #805ad5 30%, #6b46c1 90%)",
    transform: "translateY(-2px)",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
  },
}))

function RegisterPage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    try {
      const response = await axios.post("http://localhost:3000/auth/register", {
        username,
        email,
        password,
      })

      console.log("Registration response:", response.data)
      setSuccess("Registration successful! You can now log in.")
      setUsername("")
      setEmail("")
      setPassword("")
      setConfirmPassword("")
      setTimeout(() => {
        navigate("/login")
      }, 2000)
    } catch (error) {
      console.error("Registration error:", error)
      setError("Registration failed. Username or email may already exist.")
    }
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
            sx={{ "&:hover": { cursor: "pointer" } }}
          >
            SaranshAI
            <AutoAwesomeIcon sx={{ ml: 1 }} />
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => navigate("/login")}
            sx={{
              borderColor: "rgba(255, 255, 255, 0.5)",
              "&:hover": {
                borderColor: "rgba(255, 255, 255, 0.8)",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            Login
          </Button>
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
              Join SaranshAI
            </Typography>
            <form onSubmit={handleRegister}>
              <StyledTextField
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                variant="outlined"
              />
              <StyledTextField
                fullWidth
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              <StyledTextField
                fullWidth
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                variant="outlined"
              />
              <StyledButton type="submit" fullWidth variant="contained" endIcon={<PersonAddIcon />}>
                Register
              </StyledButton>
            </form>
            {error && (
              <Typography variant="body2" align="center" sx={{ color: "#ff6b6b", mt: 2 }}>
                {error}
              </Typography>
            )}
            {success && (
              <Typography variant="body2" align="center" sx={{ color: "#4ecdc4", mt: 2 }}>
                {success}
              </Typography>
            )}
          </Paper>
        </Fade>
      </Container>
    </Box>
  )
}

export default RegisterPage

