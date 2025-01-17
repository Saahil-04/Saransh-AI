import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Sidebar from './sidebar';
import Chat from '../homepage/homepage';

const ChatContainer: React.FC = () => {
  const [currentSession, setCurrentSession] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [sidebarWidth, setSidebarWidth] = useState<string>('5%');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const sessionId = localStorage.getItem("sessionId");
    setIsLoggedIn(!!token);

    if (sessionId) {
      setCurrentSession(parseInt(sessionId, 10))
    }

    console.log("loginstate", isLoggedIn);
    console.log("token ", localStorage.getItem("token"));
    console.log("username ", localStorage.getItem("username"));
  }, []);

  const handleSessionSelect = (sessionId: number) => {
    setCurrentSession(sessionId);
    // You can add logic here to fetch messages for the selected session
  };

  const handleSidebarToggle = (isOpen: boolean) => {
    setSidebarWidth(isOpen ? '20%' : '5%');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow:"auto"}}>
      {isLoggedIn && (
        <Box sx={{
          width: sidebarWidth, // Dynamically adjust width
          minWidth: sidebarWidth, // Ensure it doesn’t shrink below this width
          maxWidth: sidebarWidth, // Prevent it from exceeding this width
          transition: '0.5s',
          overflowY: 'auto', // Add vertical scrollbar if content overflows
        }}
        >
          < Sidebar onSessionSelect={handleSessionSelect} onToggle={handleSidebarToggle} />
        </Box>
      )
      }
      <Box sx={{ flexGrow: 1, /*overflow: 'auto' */ }}>
        <Chat currentSession={currentSession} onLogOut={handleLogout} />
      </Box>
    </Box >
  );
};

export default ChatContainer;

