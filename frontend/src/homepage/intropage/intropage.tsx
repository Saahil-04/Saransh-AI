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
  Avatar,
} from "@mui/material";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import LinkIcon from "@mui/icons-material/Link";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ForumIcon from '@mui/icons-material/Forum';
import { FaRobot } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const FeatureCard = ({ icon: Icon, title, text }: { icon: React.ElementType; title: string; text: string }) => (
  <Paper
    elevation={3}
    sx={{
      backgroundColor: "#343541",
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
        backgroundColor: "#212121",
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
          backgroundColor: "#212121",
          boxShadow: "none",

        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" sx={{ display: "flex", alignItems: "center", color: "white" }}>
            SaranshAI
            <AutoAwesomeIcon sx={{ marginLeft: 1, color: "#A855F7" }} />
          </Typography>
          <Box>
            <Button
              variant="contained"
              sx={{
                marginRight: 2,
                backgroundColor: "#A855F7",
                "&:hover": { backgroundColor: "#8c4dd5" },
              }}
              onClick={() => navigate("/register")}
            >
              Sign Up
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#A855F7",
                "&:hover": { backgroundColor: "#8c4dd5" },
              }}
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ flex: 1, padding: 4 }}>
        <Box textAlign="center" sx={{ marginBottom: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              background:
                "linear-gradient(90deg, rgba(168,85,247,1) 0%, rgba(255,255,255,1) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: 2,
            }}
          >
            Welcome to SaranshAI
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: "rgba(255,255,255,0.7)", maxWidth: "600px", margin: "0 auto" }}
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
            gap: 4,
            marginTop: 4,
          }}
        >
          {/* Feature Cards */}
          {[
            { icon: <TextSnippetIcon fontSize="large" />, title: "Text Summarization", description: "Summarize long text into concise, meaningful insights." },
            { icon: <PictureAsPdfIcon fontSize="large" />, title: "PDF Summarization", description: "Extract key points from complex PDF documents." },
            { icon: <ImageIcon fontSize="large" />, title: "Image Analysis", description: "Analyze and summarize text from images with ease." },
            { icon: <LinkIcon fontSize="large" />, title: "Website Links", description: "Fetch and summarize content from website URLs." },
          ].map((feature, index) => (
            <Box
              key={index}
              sx={{
                backgroundColor: "#292929",
                padding: "20px",
                borderRadius: "16px",
                textAlign: "center",
                width: "250px",
                color: "rgba(255,255,255,0.9)",
                boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                "&:hover": {
                  boxShadow: "0 12px 24px rgba(0,0,0,0.3)",
                  transform: "translateY(-5px)",
                  transition: "all 0.3s ease",
                },
              }}
            >
              <Box sx={{ marginBottom: 2, color: "#a855f7" }}>{feature.icon}</Box>
              <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
                {feature.title}
              </Typography>
              <Typography variant="body2">{feature.description}</Typography>
            </Box>
          ))}
        </Box>
        <section id="features">
          <Typography
            variant="h5"
            sx={{
              marginTop:4,
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
          backgroundColor: "#212121",

        }}
      >
        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
          © 2024 SaranshAI. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default IntroPage;
