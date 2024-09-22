import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import AddIcon from '@mui/icons-material/Add';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';

interface Session {
  id: number;
  title: string;
}

interface SidebarProps {
  onSessionSelect: (sessionId: number) => void;
  onToggle: (isOpen: boolean) => void;
}

const mockSessions: Session[] = [
  { id: 1, title: 'General Chat' },
  { id: 2, title: 'Project Discussion' },
  { id: 3, title: 'Brainstorming' },
];

const Sidebar: React.FC<SidebarProps> = ({ onSessionSelect, onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sessions] = useState<Session[]>(mockSessions);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    onToggle(!isOpen);
  }

  return (
    <Box
      sx={{
        height: '100%',
        backgroundColor: '#212121',
        color: 'white',
        overflow: 'hidden',
        // borderRight: '1px solid rgba(255,255,255,0.1)',
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
          >
            <AddIcon />
          </IconButton>
          <List>
            {sessions.map((session) => (
              <ListItem
                button
                key={session.id}
                onClick={() => onSessionSelect(session.id)}
              >
                <ChatIcon sx={{ mr: 2 }} />
                <ListItemText primary={session.title} />
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Box>
  );
};

export default Sidebar;