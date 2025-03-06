import React from "react";
import {
  Container,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Grid,
  Paper,
} from "@mui/material";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import LinkIcon from "@mui/icons-material/Link";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import ForumIcon from "@mui/icons-material/Forum";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/system";

// Styled Components
const StyledButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #6b46c1 30%, #805ad5 90%)",
  color: "white",
  borderRadius: "10px",
  padding: theme.spacing(1.5),
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    background: "linear-gradient(45deg, #805ad5 30%, #6b46c1 90%)",
    transform: "translateY(-2px)",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
  },
}));

const FeatureCard = ({ icon: Icon, title, text }: { icon: React.ElementType; title: string; text: string }) => (
  <Paper
    elevation={3}
    sx={{
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      padding: "20px",
      borderRadius: "12px",
      textAlign: "center",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      "&:hover": {
        transform: "scale(1.05)",
        boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
      },
    }}
  >
    <Icon style={{ fontSize: "3rem", color: "#A855F7" }} />
    <Typography variant="h6" sx={{ marginTop: 2, color: "white" }}>
      {title}
    </Typography>
    <Typography variant="body2" sx={{ marginTop: 1, color: "rgba(255, 255, 255, 0.8)" }}>
      {text}
    </Typography>
  </Paper>
);

const IntroPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "auto",
        backgroundColor: "#1a1a2e",
        "&::-webkit-scrollbar": {
          width: "10px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "#2f2f2f",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#444654",
          borderRadius: "10px",
        },
        scrollbarWidth: "thin",
        scrollbarColor: "#444654 #2f2f2f",
      }}
    >
      <AppBar
        position="static"
        sx={{
          backgroundColor: "transparent",
          boxShadow: "none",
        }}
      >
        <Toolbar>
          <Typography
            variant="h5"
            sx={{
              // display: "flex",
              // alignItems: "center",
              // color: "white",
              "&:hover": { cursor: "pointer" },
            }}
            onClick={() => navigate("/")}
          >
            SaranshAI
            <AutoAwesomeIcon sx={{ ml: 1 }} />
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <StyledButton
            variant="contained"
            sx={{ mr: 2 }}
            onClick={() => navigate("/register")}
          >
            Sign Up
          </StyledButton>
          <StyledButton variant="contained" onClick={() => navigate("/login")}>
            Login
          </StyledButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ flex: 1, padding: 4 }}>
        <Box textAlign="center" sx={{ marginBottom: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              background: "linear-gradient(45deg, #6b46c1, #805ad5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: 2,
            }}
          >
            Welcome to SaranshAI
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: "rgba(255, 255, 255, 0.7)", maxWidth: "600px", margin: "0 auto" }}
          >
            Experience the future of AI-driven conversations.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/home")}
            sx={{
              marginTop: 4,
              padding: "12px 36px",
              background: "linear-gradient(90deg, rgba(168,85,247,1) 0%, rgba(255,255,255,1) 100%)",
              backgroundSize: "200% 200%", // Extend gradient for movement
              color: "white",
              fontSize: "1.2rem",
              borderRadius: "30px",
              textTransform: "none",
              transition: "background 0.5s ease-in-out, color 0.3s ease",
              "&:hover": {
                animation: "gradientShift 1s ease-in-out", // Apply keyframes animation
                background: "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(168,85,247,1) 100%)",
                backgroundSize: "100% 150%", // Keeps the gradient in motion
                color: "#a855f7",
              },
              "@keyframes gradientShift": {
                "0%": { backgroundPosition: "0% 50%" },
                "100%": { backgroundPosition: "100% 50%" },
              },
            }}
          >
            Try SaranshAI
            <ArrowOutwardIcon sx={{ marginLeft: 1 }} />
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 2,
            marginTop: 4,
          }}
        >
          {[
            { icon: TextSnippetIcon, title: "Text Summarization", text: "Summarize long text into concise, meaningful insights." },
            { icon: PictureAsPdfIcon, title: "PDF Summarization", text: "Extract key points from complex PDF documents." },
            { icon: ImageIcon, title: "Image Analysis", text: "Analyze and summarize text from images with ease." },
            { icon: LinkIcon, title: "Website Links", text: "Fetch and summarize content from website URLs." },
          ].map((feature, index) => (
            <FeatureCard key={index} icon={feature.icon} title={feature.title} text={feature.text} />
          ))}
        </Box>

        <section id="features">
          <Typography
            variant="h5"
            sx={{
              marginTop: 4,
              textAlign: "center",
              marginBottom: 4,
              fontWeight: "bold",
              color: "white",
            }}
          >
            Features
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <FeatureCard
                icon={TipsAndUpdatesIcon}
                title="Smart AI"
                text="Engage in intelligent conversations with AI that learns from every interaction."
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FeatureCard
                icon={RocketLaunchIcon}
                title="Fast Response"
                text="Get real-time answers and assistance, tailored to your needs."
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FeatureCard
                icon={ForumIcon}
                title="Conversational"
                text="Enjoy natural, human-like conversations with an AI that understands context."
              />
            </Grid>
          </Grid>
        </section>
      </Container>

      <Box
        sx={{
          padding: 3,
          textAlign: "center",
          backgroundColor: "#1a1a2e",
        }}
      >
        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
          © 2024 SaranshAI. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default IntroPage; 