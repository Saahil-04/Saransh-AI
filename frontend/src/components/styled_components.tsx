import { styled } from "@mui/system"
import { TextField, Button } from "@mui/material"

export const StyledTextField = styled(TextField)(({ theme }) => ({
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

export const StyledButton = styled(Button)(({ theme }) => ({
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

export const StyledGoogleButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    borderRadius: "10px",
    padding: theme.spacing(1.5),
    transition: "all 0.3s ease-in-out",
    background: "linear-gradient(45deg,rgb(236, 236, 236) 30%,rgb(157, 128, 221) 90%)",
    "&:hover": {
        background: "linear-gradient(45deg,rgb(171, 149, 219) 30%,rgb(226, 226, 226) 90%)",
        transform: "translateY(-2px)",
        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
    },
}))

export const GoogleButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    borderRadius: "10px",
    padding: theme.spacing(1.5),
    transition: "all 0.3s ease-in-out",
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.87)",
    "&:hover": {
        backgroundColor: "#f5f5f5",
        transform: "translateY(-2px)",
        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
    },
}))


