import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  List,
  ListItem,
  AppBar,
  Toolbar,
  InputAdornment,
  IconButton,
  Avatar,
  LinearProgress,
  Stack,
  ListItemText,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Menu,
  MenuItem,
  Alert,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { blue } from "@mui/material/colors";
import "./homepage.css";
import { text } from "stream/consumers";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";

interface Message {
  sender: "user" | "bot";
  text: string;
}

interface ChatProps {
  currentSession: number | null;
}

const suggestionData = [
  { title: "Give me ways to add certain foods to my diet" },
  { title: "Suggest the best parks to visit in a city" },
  { title: "Write a product description for a toothbrush" },
  { title: "Suggest beautiful places to see on a road trip" },
];


const Chat: React.FC<ChatProps> = ({ currentSession }) => {
  const [messageCount, setMessageCount] = useState(0);
  const [showLoginWarning, setShowLoginWarning] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const messageEndRef = useRef<HTMLLIElement>(null);
  const [showInitialMessage, setShowInitialMessage] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [currentSession, setCurrentSession] = useState<number | null>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null);

  // const handleSessionSelect = (sessionId: number) => {
  //   setCurrentSession(sessionId);
  //   console.log(`Selected session: ${sessionId}`);
  //   // In the future, you can add logic here to fetch messages for the selected session
  // };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setMessages([]);
    setShowInitialMessage(true);
    navigate('/home');
    console.log("Logout clicked");
    handleClose();
  };

  const getInitials = (name: string) => {
    const names = name.split(" ");
    let initials = names[0].charAt(0).toUpperCase();
    if (names.length > 1) {
      initials += names[1].charAt(0).toUpperCase();
    }
    return initials;
  };

  const handleSend = async (text = input) => {
    if (text.trim()) {
      setMessages((prevMessages) => [...prevMessages, { sender: "user", text }]);
      setInput("");
      setLoading(true);
      setError(null);
      setShowInitialMessage(false);

      try {
        let response;
        if (isLoggedIn) {
          const token = localStorage.getItem('token');
          response = await axios.post("http://localhost:3000/chat",
            { text },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        } else if (messageCount < 5) {
          response = await axios.post("http://127.0.0.1:8000/chat", { text });
          setMessageCount(prevCount => prevCount + 1);
        } else {
          setShowLoginWarning(true);
          setLoading(false);
          return;
        }

        const botResponse = response.data.botResponse || response.data.response;
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: botResponse },
        ]);
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          handleTokenExpiration();
        } else {
          setError("Error occurred while sending message. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }
  };


  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setLoading(true);
      setError(null);
      setShowInitialMessage(false);

      // Add user message with the file name to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: `📄${file.name}` }
      ]);

      const formData = new FormData();
      formData.append("file", file);

      try {
        let response;
        if (isLoggedIn) {
        const token = localStorage.getItem('token');
        // Send the file to your backend
         response = await axios.post("http://localhost:3000/upload/pdf", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }else if(messageCount < 5){
        response = await axios.post("http://127.0.0.1:8000/upload_pdf",formData,{ 
          headers: {
            "Content-Type": "multipart/form-data",
          },
         });
        setMessageCount(prevCount => prevCount + 1);
      }else {
        setShowLoginWarning(true);
        setLoading(false);
        return;
      }

        const botResponse = response.data.botResponse || response.data.response;
        // Add bot response to the chat
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: botResponse },
        ]);
      } catch (error) {
        console.error("Error uploading PDF:", error);
        setError("Failed to upload PDF. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      setError("Please upload a valid PDF file.");
    }
  };



  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevents the default action (new line) if Enter is pressed without Shift
      handleSend();
    }
  };

  const handleTokenExpiration = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setShowInitialMessage(true);
    setMessages([]);
    setError("Your session has expired, Please Log in again.");
  };

  useEffect(() => {
    const fetchChatHistory = async () => {

      const token = localStorage.getItem("token");

      if (!token) {
        // If no token, skip fetching chat history
        console.log("No user is logged in.");
        return;
      }
      messages.length == 0 ? setShowInitialMessage(true):setShowInitialMessage(false);
      try {
        const token = localStorage.getItem('token');
        console.log(token);
        const response = await axios.get("http://localhost:3000/chat/history", { // Update this URL to your NestJS server
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("data fetched", response.data);

        const formattedMessages = response.data.map((message: any) => ({
          sender: message.sender,
          text: message.content,
        }));

        setShowInitialMessage(false);
        setMessages(formattedMessages);


      } catch (error: any) {
        console.error("Error fetching chat history:", error);
        if (error.response && error.response.status === 401) {
          handleTokenExpiration()
        } else {
          setError("Failed to load chat history. Please try again.");
        }
      }
    };

    fetchChatHistory();
  }, []);

  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [messages]);

  useEffect(() => {
    console.log("messages array", messages);
  }, [messages])

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [messages, loading]);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    setIsLoggedIn(!!storedUsername);
  }, []);

  const username = localStorage.getItem("username") || "";
  const initials = isLoggedIn ? getInitials(username) : "";

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'auto' }}>

      <AppBar
        position="static"

        style={{
          backgroundColor: "#212121",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >

        <Toolbar>
          <Typography variant="h5"
            onClick={() => { navigate('/') }}
            sx={{ '&:hover': { cursor: 'pointer' } }}
          >
            SaranshAI
            <AutoAwesomeIcon sx={{ paddingLeft: "5px" }} />
          </Typography>
          {currentSession !== null && (
            <Typography variant="subtitle1" sx={{ ml: 2 }}>
              Session: {currentSession}
            </Typography>
          )}
        </Toolbar>

        {isLoggedIn ? (
          <>
            <IconButton onClick={handleMenuClick}>
              <Avatar
                sx={{ bgcolor: blue[900], color: "white", marginRight: "25px" }}
              >
                {initials || "AI"}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
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
            onClick={() => navigate('/login')}
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

      <Container
        style={{
          backgroundColor: "#212121",
          height: "calc(100vh - 64px)", // Adjust height to account for AppBar
          maxWidth: "100%",
          padding: "0px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%", // Ensure Box takes full width
            overflow: 'auto'
          }}
        >
          <Paper
            style={{
              width: "100%", // Ensure Paper takes full width
              // padding: "0px",
              height: "calc(100% - 40px)", // Adjust height to account for padding
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#212121",
              // margin: "0 300px",
              boxShadow: "none",
              overflow: "auto",
            }}
            className="custom-scrollbar"
          >



            {/* {showInitialMessage && (
              <Box
                sx={{
                  textAlign: 'left',
                  // backgroundColor: '#343541',
                  color: 'white',
                  padding: '20px',
                  borderRadius: '10px',
                  margin: '0 auto',
                  fontSize: '3rem',
                  width:'46%',
                  
                }}
              >
              <h4 style={{width:'68%'}}>
                Hi I am Saransh,
                 How Can I Help You?
              </h4>
              </Box>
            )} */}
            {showInitialMessage && (
              <div style={{ width: "60%", margin: 'auto' }}>

                <Box
                  sx={{
                    textAlign: 'left',
                    color: 'white',
                    padding: '20px',
                    borderRadius: '10px',
                    margin: '0 auto',
                    fontSize: '3rem',
                    width: '100%',
                    background: 'linear-gradient(90deg, rgba(168,85,247,1) 0%, rgba(255,255,255,1) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    // textShadow: '0 0 10px rgba(168,85,247,0.7), 0 0 20px rgba(168,85,247,0.7)',
                  }}
                >
                  <h4 style={{ width: '70%', padding: '0', margin: '0px' }}>
                    Hi, I am SaranshAI, How Can I Help You?
                  </h4>
                </Box>
                <Grid container spacing={2} style={{ padding: '20px' }}>
                  {suggestionData.map((suggestion, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <Card
                        onClick={() => handleSend(suggestion.title)}
                        sx={{
                          backgroundColor: "#333",
                          color: "#fff",
                          borderRadius: "15px",
                          boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)",
                          cursor: "pointer",
                          minHeight: "150px", // Ensures consistent height
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          width: '100%', // Ensures the card takes full width
                          maxWidth: '300px', // Controls maximum width
                        }}
                      >
                        <CardContent sx={{ textAlign: "center" }}>
                          <Typography variant="h6" sx={{ fontSize: "13px" }} gutterBottom>
                            {suggestion.title}
                          </Typography>
                          <IconButton
                            sx={{ color: "#fff", backgroundColor: "#444654", borderRadius: "50%" }}
                            aria-label="edit"
                          >
                            <EditIcon />
                          </IconButton>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </div>
            )}

            <List
              ref={listRef}
              style={{
                flexGrow: 1,
                overflow: "auto",
                marginBottom: "20px",
                // margin: '0 300px',
                maxWidth: '100%', // Set a max-width for the List component
              }}
            >
              {/* {showInitialMessage && (
                <ListItem  style={{margin: '0 auto',maxWidth: '46%',}}>
                  <ListItemText
                    primary="Hello Saransh here"
                    style={{
                      textAlign: "center",
                      backgroundColor: "#343541",
                      color: "white",
                      borderRadius: "10px",
                      padding: "0 10px",
                      margin: "5px 0",
                      width: "46%",
                    }}
                  />
                </ListItem>
              )} */}
              {messages.map((msg, index) => (
                <ListItem
                  key={index}
                  ref={index === messages.length - 1 ? messageEndRef : null}
                  style={{ margin: '0 auto', maxWidth: '50%', }}
                >
                  <ListItemText
                    primary={
                      msg.text && msg.text.startsWith("📄") ? (
                        <span style={{ display: "flex", justifyContent: 'end', alignItems: 'center' }}>
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.text}
                          </ReactMarkdown>
                          <AttachFileIcon />
                        </span>
                      ) : (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.text || ''}
                        </ReactMarkdown>
                      )
                    }
                    style={{
                      fontFamily: "Ubuntu Mono,monospace",
                      textAlign: msg.sender === "user" ? "right" : "left",
                      background:
                        msg.sender === "user" ? "#343541" : "linear-gradient(145deg, rgba(66, 31, 102,1) 0%, rgba(255,255,255,0.2) 100%)",
                      color: "white",
                      borderRadius: "10px",
                      padding: "0 10px",
                      // margin: "0px 0",
                      width: "auto",
                      overflow: 'auto', boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)"
                    }}
                  />
                </ListItem>
              ))}
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                style={{
                  margin: '0 auto',
                  maxWidth: '800px',
                  width: '100%',
                  color: 'red',
                  padding: '10px',
                  textAlign: 'center',
                }}
              >
                {showLoginWarning && (
                  <Alert
                    severity="warning"
                    onClose={() => setShowLoginWarning(false)}
                    sx={{
                      margin: '10px auto',
                      maxWidth: '700px',
                      width: '100%'
                    }}
                  >
                    You've reached message limit. Please log in to continue using the chat.
                    <Button
                      color="warning"
                      size="small"
                      onClick={() => navigate('/login')}
                      sx={{ marginLeft: 2 }}
                    >
                      Log In
                    </Button>
                  </Alert>
                )}
                {error && (
                  <Typography variant="body1" style={{ color: 'red' }}>
                    {error}
                  </Typography>
                )}
              </Box>
              {loading && (
                <ListItem style={{ margin: '0 auto', maxWidth: '45%', justifyContent: "flex-start" }}>
                  <Stack sx={{ width: "100%", color: "grey.500" }} spacing={2}>
                    <AutoAwesomeOutlinedIcon
                      sx={{ fontSize: 40, color: "rgba(168,85,247,1)" }}
                    />
                    <LinearProgress
                      sx={{
                        height: "10px",
                        background:
                          "linear-gradient(90deg, rgba(168,85,247,1) 0%, rgba(255,255,255,0) 100%)",
                        "& .MuiLinearProgress-bar": {
                          background:
                            "linear-gradient(90deg, rgba(168,85,247,1) 0%, rgba(255,255,255,0.5) 100%)",
                          backdropFilter: "blur(5px)",
                        },
                        borderRadius: "5px",
                        width: "80%",
                      }}
                    />
                    <LinearProgress
                      sx={{
                        height: "10px",
                        background:
                          "linear-gradient(90deg, rgba(168,85,247,1) 0%, rgba(255,255,255,0) 100%)",
                        "& .MuiLinearProgress-bar": {
                          background:
                            "linear-gradient(90deg, rgba(168,85,247,1) 0%, rgba(255,255,255,0) 100%)",
                          backdropFilter: "blur(5px)",
                        },
                        borderRadius: "5px",
                        width: "80%",
                      }}
                    />
                    <LinearProgress
                      sx={{
                        height: "10px",
                        background:
                          "linear-gradient(90deg, rgba(168,85,247,1) 0%, rgba(255,255,255,0) 65%)",
                        "& .MuiLinearProgress-bar": {
                          background:
                            "linear-gradient(90deg, rgba(168,85,247,1) 0%, rgba(255,255,255,0) 65%)",
                          backdropFilter: "blur(5px)",
                        },
                        borderRadius: "5px",
                        width: "65%",
                      }}
                    />
                  </Stack>
                </ListItem>
              )}
            </List>
            <Box
              display="flex"
              justifyContent="center"
              style={{
                margin: '0 auto',
                maxWidth: '800px', // Set a max-width for the TextField container
                width: '100%',
              }}
            >
              <TextField
                fullWidth
                multiline
                minRows={1}
                maxRows={4}
                variant="outlined"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                onKeyDown={handleKeyDown}
                InputProps={{
                  style: { color: "white", borderRadius: "25px" },
                  startAdornment: (
                    <InputAdornment position="start">
                      {/* Attachment Button */}
                      <IconButton color="secondary" component="label">
                        <AttachFileIcon />
                        <input
                          type="file"
                          hidden
                          ref={fileInputRef}
                          accept="application/pdf"
                          onChange={handleFileChange}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      {/* Send Button */}
                      <IconButton
                        onClick={() => handleSend(input)}
                        color="secondary"
                        disabled={!input.trim()}
                      >
                        <SendIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                style={{ backgroundColor: "#444654", borderRadius: "25px" }}
              />
            </Box>
          </Paper>
        </Box>
      </Container>

    </Box>
  );
}

export default Chat;
