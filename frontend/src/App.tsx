import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import Chat from './homepage/homepage';
import theme from './theme';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Intropage from './homepage/intropage/intropage';
import LoginPage from './loginpage/loginpage';
import RegisterPage from './registerpage/registerpage';
import ChatContainer from './components/chatcontainer';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
      <Routes>
        <Route path="/" element={<Intropage />} />
        <Route path="/home" element={<ChatContainer />} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/register" element={<RegisterPage/>} />

      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;