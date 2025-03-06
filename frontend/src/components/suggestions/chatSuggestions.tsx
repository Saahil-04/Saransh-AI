import type React from "react"
import { Grid, Card, CardContent, Typography, IconButton } from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import type { SuggestionItem } from "../../types"

interface ChatSuggestionsProps {
  suggestions: SuggestionItem[]
  onSuggestionClick: (text: string) => void
}

const ChatSuggestions: React.FC<ChatSuggestionsProps> = ({ suggestions, onSuggestionClick }) => {
  return (
    <Grid container spacing={2} style={{ padding: "20px" }}>
      {suggestions.map((suggestion, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card
            onClick={() => onSuggestionClick(suggestion.title)}
            sx={{
              backgroundColor: "#333",
              color: "#fff",
              borderRadius: "15px",
              boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)",
              cursor: "pointer",
              minHeight: "150px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              width: "100%",
              maxWidth: "300px",
              "&:hover": {
                scale: "1.10",
                transition: "all 0.5s ease",
                border: "1px solid white"

              },
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h6" sx={{ fontSize: "13px" }} gutterBottom>
                {suggestion.title}
              </Typography>
              <IconButton sx={{ color: "#fff", backgroundColor: "#444654", borderRadius: "50%" }} aria-label="edit">
                <EditIcon />
              </IconButton>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default ChatSuggestions

