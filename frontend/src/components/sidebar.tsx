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
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';

interface Session {
  id: number;
  name: string;
}

interface SidebarProps {
  onSessionSelect: (sessionId: number) => void;
  onToggle: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSessionSelect, onToggle }) => {
  const [open, setOpen] = useState(false); // State for dialog
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        setSessions(response.data); // Assuming the backend sends an array of sessions

      } catch (err) {
        console.error('Error fetching sessions:', err);
        setError('Failed to load sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

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
      setSessions((prevSessions) => prevSessions.filter((session) => session.id !== sessionId));
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
      setSessions([...sessions, response.data]); // Append the new session to the list
      console.log("the new Session which is created!!!!!!!!!!1", response);
      onSessionSelect(response.data.id);
    } catch (err) {
      console.error('Error creating session:', err);
    }
  };

  return (
    <Box
      sx={{
        height: '100%',
        backgroundColor: '#212121',
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
        <>
          <Typography variant="h6" sx={{ px: 2, mb: 2 }}>Chat Sessions</Typography>
          <IconButton
            color="primary"
            sx={{ mb: 2, mx: 2, backgroundColor: 'rgba(168,85,247,0.2)' }}
            onClick={handleCreateSession}
          >
            <AddIcon />
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
                maxHeight: '70vh', // Adjust the height as needed
                overflowY: 'auto', // Enables vertical scrolling
                overflowX: 'hidden', // Hides horizontal scrolling
                px: 2, // Adds padding for the scrollbar
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
              <List>
                {sessions.map((session) => (
                  <ListItem
                    key={session.id}
                    button
                    onClick={() => onSessionSelect(session.id)}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents onSessionSelect from being triggered
                          handleOpenDialog(session.id);
                        }}
                      >
                        <DeleteIcon sx={{
                          color: "white",
                        }} />
                      </IconButton>
                    }
                  >
                    <ChatIcon sx={{ mr: 2 }} />
                    <ListItemText primary={session.name}
                      primaryTypographyProps={{
                        sx: {
                          fontSize: '0.8rem',
                        },
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </>
      )}

      <Dialog open={open} onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            backgroundColor: '#212121', // Dark background color
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
          <Button onClick={handleConfirmDelete} color="secondary" variant="contained" sx={{ backgroundColor: '#E34234', borderRadius: 5 }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Sidebar;
