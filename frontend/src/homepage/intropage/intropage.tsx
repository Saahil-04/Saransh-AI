import React from "react";
import {
  Container,
  Box,
  Paper,
  Button,
  Typography,
  AppBar,
  Toolbar,
  Avatar,
} from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { Link } from "react-router-dom";
import { FaRobot } from "react-icons/fa";
import { blue } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";

const styles = {
  section: {
    padding: "60px 20px",
    backgroundColor: "#212121",
    color: "white",
    textAlign: "center" as const,
  },
  features: {
    padding: "40px 20px",
    backgroundColor: "#444654",
    color: "white",
    borderRadius: "25px",
  },
  sectionTitle: {
    display: "flex",
    fontSize: "2.5rem",
    marginBottom: "40px",
    fontWeight: "bold",
    justifyContent: "center",
    // textAlign:'center'
  },
  introsec: {
    // display:'flex',
    // justifyContent:"center",
    // textAlign:'center',
    maxWidth: "50vw",
    margin: "0px auto",
    paddingTop: "50px",
  },
  featureCards: {
    display: "flex",
    justifyContent: "space-around",
    flexWrap: "wrap" as const,
  },
  card: {
    backgroundColor: "#343541",
    padding: "20px",
    borderRadius: "10px",
    width: "300px",
    marginBottom: "20px",
    textAlign: "center" as const,
  },
  cardTitle: {
    fontSize: "1.5rem",
    marginTop: "10px",
  },
  cardText: {
    fontSize: "1rem",
    marginTop: "10px",
  },
  icon: {
    fontSize: "3rem",
    color: "#A855F7",
  },
  footer: {
    padding: "20px",
    backgroundColor: "#212121",
    color: "white",
    textAlign: "center" as const,
  },
  footerText: {
    fontSize: "1rem",
  },
};

const IntroPage = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/home");
  };
  return (
    <>
      <AppBar position="static"
        style={{
          backgroundColor: "#212121",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <Toolbar>
          <Typography variant="h5">
            SaranshAI
            <AutoAwesomeIcon sx={{ paddingLeft: "5px" }} />
          </Typography>
        </Toolbar>
        <Toolbar>
        <Button
         variant="contained"
          color="inherit"
          onClick={() => navigate('/register')}
          sx={{
            marginRight: "10px" ,
            backgroundColor: "rgba(168,85,247,1)",
            "&:hover": {
              backgroundColor: "rgba(168,85,247,0.8)",
            },
          }}
        >
          Sign up!
        </Button>
        <Button
         variant="contained"
          color="inherit"
          onClick={() => navigate('/login')}
          sx={{
            marginRight: "10px" ,
            backgroundColor: "rgba(168,85,247,1)",
            "&:hover": {
              backgroundColor: "rgba(168,85,247,0.8)",
            },
          }}
        >
          Login
        </Button>
        </Toolbar>
      </AppBar>
      <Container
        style={{
          backgroundColor: "#212121",
          paddingTop: "20px",
          maxWidth: "100vw",
        }}
      >
        <Box style={styles.section}>
          <Box
            sx={{
              textAlign: "center",
              color: "white",
              padding: "20px",
              borderRadius: "10px",
              margin: "0 auto",
              fontSize: "1rem",
              // width: '%',
              background:
                "linear-gradient(90deg, rgba(168,85,247,1) 0%, rgba(255,255,255,1) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            <Typography variant="h1" style={styles.sectionTitle}>
              Welcome to SaranshAI
            </Typography>
          </Box>
          <Typography
            variant="h5"
            style={{ margin: "20px 0", color: "rgba(255, 255, 255, 0.7)" }}
          >
            Experience the future of AI-driven conversations.
          </Typography>

          <Button
            variant="contained"
            color="secondary"
            onClick={handleClick}
            sx={{
              textAlign: "center",
              color: "white",
              padding: "20px",
              borderRadius: "10px",
              margin: "0 auto",
              fontSize: "1rem",
              // width: '%',
              background:
                "linear-gradient(90deg, rgba(168,85,247,1) 0%, rgba(255,255,255,1) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            style={{
              borderRadius: "25px",
              padding: "10px 20px",
              textTransform: "none",
            }}
          >
            Try SaranshAI
            <ArrowOutwardIcon
              sx={{ fontSize: "18px", paddingLeft: "5px" }}
            ></ArrowOutwardIcon>
          </Button>
          <div style={styles.introsec}>
            <Typography
              variant="body1"
              paragraph
              sx={{ fontSize: "20px", textAlign: "left" }}
            >
              We’ve developed an advanced AI called SaranshAI, designed to
              provide precise summaries of entire web pages at the click of a
              link. SaranshAI interacts in a conversational way, making it easy
              for you to extract key information from any webpage. Whether
              you're browsing through articles, research papers, or lengthy
              reports, SaranshAI helps you save time by providing concise,
              accurate summaries.
            </Typography>
            <Typography
              variant="body1"
              paragraph
              sx={{ fontSize: "20px", textAlign: "left" }}
            >
              SaranshAI isn't just about summarization; it engages in
              intelligent dialogue, answering follow-up questions and refining
              its responses based on context. During this research preview,
              SaranshAI is available for free to gather user feedback and
              understand its strengths and areas for improvement.
            </Typography>
          </div>
        </Box>

        <section style={styles.features} id="features">
          <h2 style={styles.sectionTitle}>Features</h2>
          <div style={styles.featureCards}>
            <div style={styles.card}>
              <FaRobot style={styles.icon} />
              <h3 style={styles.cardTitle}>Smart AI</h3>
              <p style={styles.cardText}>
                Engage in intelligent conversations with AI that learns from
                every interaction.
              </p>
            </div>
            <div style={styles.card}>
              <FaRobot style={styles.icon} />
              <h3 style={styles.cardTitle}>Fast Response</h3>
              <p style={styles.cardText}>
                Get real-time answers and assistance, tailored to your needs.
              </p>
            </div>
            <div style={styles.card}>
              <FaRobot style={styles.icon} />
              <h3 style={styles.cardTitle}>Conversational</h3>
              <p style={styles.cardText}>
                Enjoy natural, human-like conversations with an AI that
                understands context.
              </p>
            </div>
          </div>
        </section>
      </Container>
      <footer style={styles.footer}>
        <p style={styles.footerText}>© 2024 SaranshAI. All rights reserved.</p>
      </footer>
    </>
  );
};

export default IntroPage;
