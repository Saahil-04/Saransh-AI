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
              background: 'linear-gradient(45deg,rgba(137, 85, 185, 0.53) 30%,rgba(99, 101, 241, 0.64) 100%)',
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
                background: 'linear-gradient(45deg,rgba(137, 85, 185,0.77) 30%,rgba(99, 101, 241,0.77) 100%)',
                boxShadow: "0px 5px 20px rgba(216, 135, 248, 0.79)",
                transition: "all 0.5s ease",

              },
            }}
          >
            <CardContent sx={{
              textAlign: "center",
              padding: '16px !important',
            }}>
              <Typography variant="h6" sx={{ 
                  fontSize: "1rem",
                  fontWeight: 500,
                  mb: 1.5,
                  lineHeight: 1.3,
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)'

               }} gutterBottom>
                {suggestion.title}
              </Typography>
              <IconButton sx={{ 
                color: "#fff", backgroundColor: "#202020", borderRadius: "50%" 
                }} aria-label="edit">
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

