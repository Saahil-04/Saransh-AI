import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { AppBar, Toolbar, Typography, IconButton, Avatar, Button, Menu, MenuItem } from "@mui/material"
import { blue } from "@mui/material/colors"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"

interface AppHeaderProps {
  isLoggedIn: boolean
  username: string
  onLogout: () => void
}

const AppHeader: React.FC<AppHeaderProps> = ({ isLoggedIn, username, onLogout }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const navigate = useNavigate()

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    onLogout()
    handleClose()
  }

  const getInitials = (name: string) => {
    const names = name.split(" ")
    let initials = names[0].charAt(0).toUpperCase()
    if (names.length > 1) {
      initials += names[1].charAt(0).toUpperCase()
    }
    return initials
  }

  const initials = isLoggedIn ? getInitials(username) : ""

  return (
    <AppBar
      position="static"
      style={{
        backgroundColor: "#1a1a2e",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Toolbar>
        <Typography
          variant="h5"
          onClick={() => {
            navigate("/")
          }}
          sx={{ display: "flex", alignItems: "center", color: "white", "&:hover": { cursor: "pointer" } }}
        >
          SaranshAI
          <AutoAwesomeIcon sx={{ marginLeft: 1, color: "#A855F7" }} />
        </Typography>
      </Toolbar>

      {isLoggedIn ? (
        <>
          <IconButton onClick={handleMenuClick}>
            <Avatar sx={{ bgcolor: blue[900], color: "white", marginRight: "25px" }}>{initials || "AI"}</Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <MenuItem onClick={handleClose}>Username: {username}</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </>
      ) : (
        <Button
          variant="contained"
          color="inherit"
          onClick={() => navigate("/login")}
          sx={{
            marginRight: "25px",
            backgroundColor: "rgba(168,85,247,1)",
            "&:hover": {
              backgroundColor: "rgba(168,85,247,0.8)",
            },
          }}
        >
          Login
        </Button>
      )}
    </AppBar>
  )
}

export default AppHeader

