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
    setIsLoggedIn(!!token);
    console.log("loginstate", isLoggedIn);
    console.log("token ", localStorage.getItem("token"));
    console.log("username ", localStorage.getItem("username"));
  }, []);

  const handleSessionSelect = (sessionId: number) => {
    setCurrentSession(sessionId);
    // You can add logic here to fetch messages for the selected session
  };

  const handleSidebarToggle = (isOpen: boolean) => {
    setSidebarWidth(isOpen ? '50%' : '5%');
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {isLoggedIn && (
        <Box sx={{ width: sidebarWidth, transition: 'width 0.3s' }}>
          <Sidebar onSessionSelect={handleSessionSelect} onToggle={handleSidebarToggle} />
        </Box>
      )}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Chat currentSession={currentSession} />
      </Box>
    </Box>
  );
};

export default ChatContainer;