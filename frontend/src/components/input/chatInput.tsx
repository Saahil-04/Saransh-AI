"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { Box, TextField, InputAdornment, IconButton } from "@mui/material"
import SendIcon from "@mui/icons-material/Send"
import AttachFileIcon from "@mui/icons-material/AttachFile"

interface ChatInputProps {
  input: string
  setInput: (input: string) => void
  handleSend: (text?: string) => void
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleKeyDown: (event: React.KeyboardEvent) => void
}

const ChatInput: React.FC<ChatInputProps> = ({ input, setInput, handleSend, handleFileChange, handleKeyDown }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Clear file input after upload
  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [fileInputRef])

  return (
    <Box
      display="flex"
      justifyContent="center"
      style={{
        margin: "0 auto",
        width: "70%",
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
              <IconButton color="secondary" component="label">
                <AttachFileIcon />
                <input type="file" hidden ref={fileInputRef} accept="*" onChange={handleFileChange} />
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => handleSend(input)} color="secondary" disabled={!input.trim()}>
                <SendIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        style={{ backgroundColor: "rgb(45, 46, 97)", borderRadius: "25px" }}
      />
    </Box>
  )
}

export default ChatInput;

