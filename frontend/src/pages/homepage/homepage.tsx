import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"

import axios from "axios"
import {
  Box,
  Container,
  Paper,
} from "@mui/material"

import ChatInput from "../../components/input/chatInput";
import "./homepage.css"
import Cookies from "js-cookie"

import { fetchChatHistory, sendMessage, uploadFile } from "../../services/chatService"
import { handleLogout as logoutUtil, checkLoginStatus, loadUserDataFromCookies } from '../../utils/authUtils'
import { useNavigate, useLocation } from "react-router-dom"
import AppHeader from "../../components/header/appHeader";
import MessageList from "../../components/messages/messageList";
import WelcomeMessage from "../../components/welcome/welcomeMessage";

interface Message {
  sender: "user" | "bot"
  text: string
  imageUrl?: string
}

interface ChatProps {
  currentSession: number | null
  onLogOut: () => void
}

const suggestionData = [
  { title: "Give me ways to add certain foods to my diet" },
  { title: "Suggest the best parks to visit in a city" },
  { title: "Write a product description for a toothbrush" },
  { title: "Suggest beautiful places to see on a road trip" },
]

const Chat: React.FC<ChatProps> = ({ currentSession, onLogOut }) => {
  const [messageCount, setMessageCount] = useState(0)
  const [showLoginWarning, setShowLoginWarning] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const listRef = useRef<HTMLUListElement>(null)
  const messageEndRef = useRef<HTMLLIElement>(null)
  const [showInitialMessage, setShowInitialMessage] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
 
  const navigate = useNavigate()
  const location = useLocation()
  const username = localStorage.getItem("username") || ""

  const handleLogout = useCallback(() => {
    logoutUtil()
    setIsLoggedIn(false)
    setMessages([])
    setShowInitialMessage(true)
    onLogOut()
    navigate("/home")
  }, [navigate, onLogOut])

  const handleTokenExpiration = useCallback(() => {
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    setIsLoggedIn(false)
    setShowInitialMessage(true)
    setMessages([])
    setError("Your session has expired, Please Log in again.")
  }, [])


  //to fetch user history
  const loadChatHistory = useCallback(
    async (sessionId: number) => {
      try {
        const token = localStorage.getItem("token")
        const chatHistory = await fetchChatHistory(sessionId, token)

        chatHistory.length <= 0 ? setShowInitialMessage(true) : setShowInitialMessage(false)
        setMessages(chatHistory)
      } catch (error: any) {
        console.error("Error fetching chat history:", error)
        if (error.response && error.response.status === 401) {
          handleTokenExpiration()
        } else {
          setError("Failed to load chat history. Please try again.")
        }
      }
    },
    [handleTokenExpiration],
  ) // Added handleTokenExpiration as a dependency

  const handleSend = async (text = input) => {
    if (text.trim()) {
      setMessages((prevMessages) => [...prevMessages, { sender: "user", text }])
      setInput("")
      setLoading(true)
      setError(null)
      setShowInitialMessage(false)

      try {
        const token = localStorage.getItem("token")
        const botResponse = await sendMessage(text, currentSession, isLoggedIn, token)

        if (!isLoggedIn) {
          setMessageCount((prevCount) => {
            const newCount = prevCount + 1
            if (newCount >= 5) {
              setShowLoginWarning(true)
              setLoading(false)
            }
            return newCount
          })
          if (messageCount >= 4) {
            // Check after incrementing
            return
          }
        }

        setMessages((prevMessages) => [...prevMessages, { sender: "bot", text: botResponse }])
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          handleTokenExpiration()
        } else {
          setError("Error occurred while sending message. Please try again.")
        }
      } finally {
        setLoading(false)
      }
    }
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError(null)
    setShowInitialMessage(false)

    try {
      if (currentSession === null) {
        console.log("No session selected. Please select a session.")
        setLoading(false)
        return
      }

      // Create a local URL for the image
      const imageUrl = URL.createObjectURL(file)

      // Add user message with the file name and image URL to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "user",
          text: file.name,
          imageUrl: file.type.startsWith("image/") ? imageUrl : undefined,
        },
      ])

      const token = localStorage.getItem("token")
      const botResponse = await uploadFile(file, currentSession, isLoggedIn, token)

      setMessages((prevMessages) => [...prevMessages, { sender: "bot", text: botResponse }])
    } catch (error) {
      console.error("Error uploading file:", error)
      setError("Failed to upload file. Please ensure it's a valid image or PDF.")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault() // Prevents the default action (new line) if Enter is pressed without Shift
      handleSend()
    }
  }


  useEffect(() => {
    console.log("messages array", messages)
  }, [messages])

 
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [messageEndRef,messages,loading]) // Removed messages and loading as dependencies

  // Handle initial login state
  useEffect(() => {
    const isUserLoggedIn = checkLoginStatus()
    setIsLoggedIn(isUserLoggedIn)
    setShowInitialMessage(!isUserLoggedIn)

    if (isUserLoggedIn) {
      const userData = loadUserDataFromCookies()
      if (userData?.sessionId) {
        loadChatHistory(Number(userData.sessionId))
      }
    }
  }, []) // Run only once on mount

  useEffect(() => {
    if (currentSession !== null && isLoggedIn) {
      loadChatHistory(currentSession)
    }
  }, [currentSession, isLoggedIn, loadChatHistory]) // Added loadChatHistory as dependency


  useEffect(() => {
    const userData = loadUserDataFromCookies()
    if (userData) {
      setIsLoggedIn(true)
      loadChatHistory(Number(userData.sessionId))
    } else {
      console.log("Required data not found in cookies.")
    }
  }, [loadChatHistory])



  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        // flexGrow: 1,
        height: "100vh",
        overflow: "auto",
      }}
    //  className="custom-scrollbar"
    >
      <AppHeader isLoggedIn={isLoggedIn} username={username} onLogout={handleLogout} />

      <Container
        style={{
          backgroundColor: "#1a1a2e",
          height: "calc(100vh - 64px)", // Adjust height to account for AppBar
          maxWidth: "100%",
          padding: "0px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Box
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%", // Ensure Box takes full width
            overflow: "hidden",
          }}
        // className="custom-scrollbar"
        >
          <Paper
            style={{
              width: "100%", // Ensure Paper takes full width
              // padding: "0px",
              height: "calc(100% - 40px)", // Adjust height to account for padding
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#1a1a2e",
              // margin: "0 300px",
              boxShadow: "none",
              overflow: "hidden",
            }}
          // className="custom-scrollbar"
          >

            {showInitialMessage && <WelcomeMessage suggestions={suggestionData} onSuggestionClick={handleSend} />}

            <MessageList
              messages={messages}
              loading={loading}
              error={error}
              showLoginWarning={showLoginWarning}
              setShowLoginWarning={setShowLoginWarning}
              messageEndRef={messageEndRef}
              listRef={listRef}
            />

            <ChatInput
              input={input}
              setInput={setInput}
              handleSend={handleSend}
              handleFileChange={handleFileChange}
              handleKeyDown={handleKeyDown}
            />
          </Paper>
        </Box>
      </Container>
    </Box>
  )
}

export default Chat

