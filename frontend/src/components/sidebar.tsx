import React, { useEffect, useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import Cookies from "js-cookie"
import axios from 'axios';

interface Session {
  id: number;
  name: string;
}

interface SidebarProps {
  onSessionSelect: (sessionId: number | null) => void;
  onToggle: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSessionSelect, onToggle }) => {
  const [open, setOpen] = useState(false); // State for dialog
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch sessions from the backend
  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token'); // Get token from localStorage or cookie
        const response = await axios.get('http://localhost:3000/session', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSessions(response.data); // the backend sends an array of sessions

        const sessionId = localStorage.getItem('sessionId');
        if (sessionId) {
          const sessionExists = response.data.some((session: Session) => session.id === parseInt(sessionId, 10));
          if (!sessionExists) {
            localStorage.removeItem('sessionId');
            onSessionSelect(null); // Notify parent component
          }
        }

      } catch (err) {
        console.error('Error fetching sessions:', err);
        setError('Failed to load sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const filteredSessions = sessions.filter(session =>
    session.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggle = () => {
    setIsOpen(!isOpen);
    onToggle(!isOpen);
  };
  const handleOpenDialog = (sessionId: number) => {
    setSelectedSessionId(sessionId);
    setOpen(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedSessionId(null);
  };

  // Confirm deletion
  const handleConfirmDelete = () => {
    if (selectedSessionId !== null) {
      onDeleteSession(selectedSessionId);
      handleCloseDialog();
    }
  };

  const onDeleteSession = async (sessionId: number) => {
    try {
      const token = localStorage.getItem('token'); // Get token
      // Make DELETE request to delete the session with the given sessionId
      await axios.delete(`http://localhost:3000/session/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update the sessions state by removing the deleted session
      setSessions((prevSessions) => {
        const updatedSessions = prevSessions.filter((session) => session.id !== sessionId);

        // Check if the deleted session is the one currently stored in localStorage
        const storedSessionId = localStorage.getItem('sessionId');
        if (storedSessionId && parseInt(storedSessionId, 10) === sessionId) {
          // Clear or update sessionId in localStorage
          if (updatedSessions.length > 0) {
            // Set the sessionId to the first session in the updated list
            localStorage.setItem('sessionId', updatedSessions[0].id.toString());

            Cookies.set("sessionId", updatedSessions[0].id.toString());
            console.log("sessionId after deleting in cookies");
            onSessionSelect(updatedSessions[0].id); // Notify parent component
          } else {
            // No sessions left, clear the sessionId
            localStorage.removeItem('sessionId');
            Cookies.remove("sessionId");
            onSessionSelect(null); // Notify parent component
            handleCreateSession();

          }
        }

        return updatedSessions;
      });



    } catch (err) {
      console.error('Error deleting session:', err);
    }
  };

  // Handle session creation
  const handleCreateSession = async () => {
    try {
      const token = localStorage.getItem('token'); // Get token
      const response = await axios.post('http://localhost:3000/session', { name: 'New Chat' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSessions((prevSessions) => [...prevSessions, response.data]); // Append the new session to the list
      console.log("the new Session which is created!!!!!!!!!!1", response);

      // Update sessionId in localStorage
      localStorage.setItem('sessionId', response.data.id);
      Cookies.set("sessionId", response.data.id);
      console.log("sessionId stored in localStorage", localStorage.getItem("sessionId"));

      onSessionSelect(response.data.id);
    } catch (err) {
      console.error('Error creating session:', err);
    }
  };

  return (
    <Box
      sx={{
        height: '100%',
        backgroundColor: '#1a1a2e',
        color: 'white',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton
          color="inherit"
          onClick={handleToggle}
        >
          {isOpen ? <MenuOpenIcon /> : <MenuIcon />}
        </IconButton>
      </Box>
      {isOpen && (
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                color: 'white',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: '#a855f7',
                },
                '&.Mui-focused': {
                  borderColor: '#a855f7',
                  boxShadow: '0 0 0 2px rgba(168,85,247,0.2)'
                }
              },
              '& .MuiInputBase-input': {
                py: 1.5,
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'rgba(255,255,255,0.5)', mr: 1 }} />
                </InputAdornment>
              ),
            }}
          />
          <IconButton
            color="primary"
            sx={{
              mb: 3,
              width: '100%',
              py: 1.5,
              background: 'linear-gradient(45deg, #a855f7 30%, #6366f1 100%)',
              '&:hover': {
                transform: 'scale(1.01)',
                boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)',
              },
              transition: 'all 0.3s ease',
              borderRadius: '10px'
            }}
            onClick={handleCreateSession}
          >
            <AddIcon sx={{ fontSize: '1.5rem' }} />
            <Typography variant="button" sx={{ ml: 1, fontWeight: 600 }}>
              New Session
            </Typography>
          </IconButton>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress color="inherit" />
            </Box>
          ) : error ? (
            <Typography sx={{ px: 2, color: 'red' }}>{error}</Typography>
          ) : (
            <Box
              sx={{
                maxHeight: '75vh', // Adjust the height as needed
                overflowY: 'auto', // Enables vertical scrolling
                overflowX: 'hidden', // Hides horizontal scrolling
                px: 1, // Adds padding for the scrollbar
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#6c757d",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  backgroundColor: "#495057",
                },
              }}
            >
              <List disablePadding>

                {filteredSessions.length === 0 ? (
                  <Box sx={{
                    textAlign: 'center',
                    py: 3,
                    color: 'rgba(255,255,255,0.5)'
                  }}>
                    No matching sessions found
                  </Box>
                ) : (
                  filteredSessions.map((session) => (
                    // ... existing ListItem component
                    <ListItem
                      key={session.id}
                      button
                      onClick={() => onSessionSelect(session.id)}
                      sx={{
                        mb: 1,
                        borderRadius: '8px',
                        transition: 'all 0.2s ease',
                        background: 'rgba(255, 255, 255, 0.03)',
                        scale: '1.05',
                        '&:hover': {
                          background: 'rgba(168, 85, 247, 0.1)',
                          // background: 'rgba(255, 255, 255, 0.03)',
                          // transform: 'translateX(5px)'
                        },
                        '& .MuiListItemSecondaryAction-root': {
                          right: '-20px',
                          transition: 'all 0.2s ease',
                          opacity: 0
                        },
                        '&:hover .MuiListItemSecondaryAction-root': {
                          right: '8px',
                          opacity: 1
                        }
                      }}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevents onSessionSelect from being triggered
                            handleOpenDialog(session.id);
                          }}
                          sx={{
                            '&:hover': {
                              color: '#a855f7',
                              background: 'rgba(168, 85, 247, 0.1)'
                            }
                          }}
                        >
                          <DeleteIcon sx={{
                            fontSize: '1.2rem',
                            color: "white",
                          }} />
                        </IconButton>
                      }
                    >
                      <ChatIcon sx={{
                        mr: 2,
                        color: '#a855f7',
                        fontSize: '1.2rem'
                      }} />
                      <ListItemText primary={session.name}
                        primaryTypographyProps={{
                          sx: {
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            letterSpacing: '0.2px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          },
                        }}
                      />
                    </ListItem>
                  ))
                )}
                {/* {sessions.map((session) => (
                  <ListItem
                    key={session.id}
                    button
                    onClick={() => onSessionSelect(session.id)}
                    sx={{
                      mb: 1,
                      borderRadius: '8px',
                      transition: 'all 0.2s ease',
                      background: 'rgba(255, 255, 255, 0.03)',
                      '&:hover': {
                        background: 'rgba(168, 85, 247, 0.1)',
                        // background: 'rgba(255, 255, 255, 0.03)',
                        // transform: 'translateX(5px)'
                        scale: '1.05',
                      },
                      '& .MuiListItemSecondaryAction-root': {
                        right: '-20px',
                        transition: 'all 0.2s ease',
                        opacity: 0
                      },
                      '&:hover .MuiListItemSecondaryAction-root': {
                        right: '8px',
                        opacity: 1
                      }
                    }}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents onSessionSelect from being triggered
                          handleOpenDialog(session.id);
                        }}
                        sx={{
                          '&:hover': {
                            color: '#a855f7',
                            background: 'rgba(168, 85, 247, 0.1)'
                          }
                        }}
                      >
                        <DeleteIcon sx={{
                          fontSize: '1.2rem',
                          color: "white",
                        }} />
                      </IconButton>
                    }
                  >
                    <ChatIcon sx={{
                      mr: 2,
                      color: '#a855f7',
                      fontSize: '1.2rem'
                    }} />
                    <ListItemText primary={session.name}
                      primaryTypographyProps={{
                        sx: {
                          fontSize: '0.8rem',
                          fontWeight: 500,
                          letterSpacing: '0.2px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        },
                      }}
                    />
                  </ListItem>
                ))} */}
              </List>
            </Box>
          )}
        </Box>
      )}

      <Dialog open={open} onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            backgroundColor: '#1a1a2e', // Dark background color
            color: '#fff', // White text color
            borderRadius: 2, // Slightly rounded corners
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)' // Soft shadow for a modern look
          },
        }}>
        <DialogTitle>Delete Session</DialogTitle>
        <DialogContent>Are you sure you want to delete this session?</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary" variant="outlined" sx={{ color: '#fff', borderColor: '#555', borderRadius: 5 }}>
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary" variant="contained"
            sx={{
              backgroundColor: 'tomato',
              borderRadius: 5
            }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Sidebar;
