import type React from "react"
import { Box, Typography } from "@mui/material"
import ChatSuggestions from "../suggestions/chatSuggestions"
import type { SuggestionItem } from "../../types"

interface WelcomeMessageProps {
  suggestions: SuggestionItem[]
  onSuggestionClick: (text: string) => void
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ suggestions, onSuggestionClick }) => {
  return (
    <Box sx={{ width: "70%", margin: "auto", padding: "40px 0" }}>
      <Typography
        variant="h2"
        sx={{
          textAlign: "left",
          color: "white",
          fontFamily: "Poppins, sans-serif",
          fontWeight: 700,
          background: "linear-gradient(90deg, rgb(200, 146, 250) 0%, rgba(99,102,241,1) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "40px",
        }}
      >
        Hi, I am SaranshAI, How Can I Help You?
      </Typography>
      <ChatSuggestions suggestions={suggestions} onSuggestionClick={onSuggestionClick} />
    </Box>
  );
}

export default WelcomeMessage

