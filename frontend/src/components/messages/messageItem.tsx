import type React from "react"
import { ListItem, ListItemText } from "@mui/material"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import AttachFileIcon from "@mui/icons-material/AttachFile"
import type { Message } from "../../types"

interface MessageItemProps {
  message: Message
  isLast: boolean
  messageEndRef: React.RefObject<HTMLLIElement>
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isLast, messageEndRef }) => {
  return (
    <ListItem
      ref={isLast ? messageEndRef : null}
      sx={{
        display: "block",
        margin: "10px auto",
        maxWidth: "65%",
        paddingBottom: message.sender === "bot" ? "15px" : "0",
        paddingRight: "0",
        paddingLeft: "0",
        position: "relative",
        "&::after": {
          content: '""',
          position: "absolute",
          width: "0",
          height: "0",
          borderStyle: "solid",
          borderWidth: message.sender === "user" ? "0px 0px 15px 13px" : "0px 15px 20px 0",
          borderColor:
            message.sender === "user"
              ? "transparent transparent transparent transparent"
              : "transparent #421f66 transparent transparent",
          top: "8px",
          right: message.sender === "user" ? "-6px" : "auto",
          left: message.sender === "user" ? "auto" : "-6px",
        },
      }}
      className="custom-scrollbar"
    >
      <ListItemText
        primary={
          message.imageUrl ? (
            <div style={{ display: "flex", justifyContent: message.sender === "user" ? "flex-end" : "flex-start" }}>
              <img
                src={message.imageUrl || "/placeholder.svg"}
                alt={message.text}
                style={{
                  width: "200px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
            </div>
          ) : message.text && message.text.startsWith("📄") ? (
            <span
              style={{
                display: "flex",
                justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
                alignItems: "center",
              }}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
              <AttachFileIcon />
            </span>
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text || ""}</ReactMarkdown>
          )
        }
        sx={{
          fontFamily: "Ubuntu Mono,monospace",
          textAlign: message.sender === "user" ? "right" : "left",
          background:
            message.sender === "user"
              ? "transparent"
              : "linear-gradient(145deg, rgba(66, 31, 102,1) 0%, rgba(255,255,255,0.2) 100%)",
          color: "white",
          borderRadius: "10px",
          padding: "0 10px",
          margin: message.sender === "user" ? "0 0 0 auto" : "0 auto 0 0",
          maxWidth: "fit-content",
          overflow: "auto",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
          "&::-webkit-scrollbar": {
            width: "2px",
            height: "10px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#2f2f2f",
            borderRadius: "25px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#444654",
            borderRadius: "50px",
            border: "1px solid #2F2F2F",
          },
        }}
      />
    </ListItem>
  )
}

export default MessageItem

