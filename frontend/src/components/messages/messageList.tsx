import type React from "react"
import { List, Box, Alert, Typography, Button, Stack, Skeleton, ListItem } from "@mui/material"
import { useNavigate } from "react-router-dom"
import MessageItem from "./messageItem"
import type { Message } from "../../types"
import { keyframes } from "@mui/system"; // Import keyframes from MUI

const waveEffect = keyframes`
    0% { left: -200%;opacity: 1; }
    15% { opacity: 1; } 
    100% { left: 200%; opacity:1; }
`;

interface MessageListProps {
    messages: Message[]
    loading: boolean
    error: string | null
    showLoginWarning: boolean
    setShowLoginWarning: (show: boolean) => void
    messageEndRef: React.RefObject<HTMLLIElement>
    listRef: React.RefObject<HTMLUListElement>
}

const LoadingSkeleton: React.FC = () => (
    <ListItem
        style={{
            margin: "0 auto",
            maxWidth: "65%",
            justifyContent: "flex-start",
        }}
    >
        <Stack sx={{ width: "100%", color: "grey.500" }} spacing={2}>
            <Skeleton variant="circular" width={40} height={40} animation = "wave" sx={{ bgcolor: "rgba(168,85,247,0.5)" }} />
            <Skeleton
                variant="rectangular"
                width="80%"
                height={15}
                animation={false} // Disable default animation
                sx={{
                    borderRadius: "5px",
                    bgcolor: "#9b80ff",
                    opacity: "0.5",
                    position: "relative",
                    overflow: "hidden",
                    "&::after": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: "-100%",
                        width: "200%",
                        height: "100%",
                        background:
                            "linear-gradient(90deg, rgba(155,128,255,0) 0%, rgba(255,255,255,0.55) 40%, rgba(155,128,255,0) 100%)",
                        animation: `${waveEffect} 2.5s ease-in-out infinite`,
                    },
                }}
            />
            <Skeleton
                variant="rectangular"
                width="80%"
                height={15}
                animation={false}
                sx={{
                    borderRadius: "5px",
                    bgcolor: "#8766ff",
                    opacity: "0.4",
                    position: "relative",
                    overflow: "hidden",
                    "&::after": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: "-100%",
                        width: "200%",
                        height: "100%",
                        background:
                            "linear-gradient(90deg, rgba(107,114,128,0) 0%, rgba(255,255,255,0.55) 40%, rgba(107,114,128,0) 100%)",
                        animation: `${waveEffect} 2.5s ease-in-out infinite`,
                    },
                }}
            />
            <Skeleton
                variant="rectangular"
                width="65%"
                height={15}
                animation={false}
                sx={{
                    borderRadius: "5px",
                    bgcolor: "#8766ff",
                    opacity: "0.3",
                    position: "relative",
                    overflow: "hidden",
                    "&::after": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: "-100%",
                        width: "200%",
                        height: "100%",
                        background:
                            "linear-gradient(90deg, rgba(107,114,128,0) 0%, rgba(255, 255, 255, 0.55) 40%, rgba(107,114,128,0) 100%)",
                        animation: `${waveEffect} 2.5s ease-in-out infinite`,
                    },
                }}
            />
        </Stack>
    </ListItem>
)

const MessageList: React.FC<MessageListProps> = ({
    messages,
    loading,
    error,
    showLoginWarning,
    setShowLoginWarning,
    messageEndRef,
    listRef,
}) => {
    const navigate = useNavigate()

    return (
        <List
            ref={listRef}
            sx={{
                flexGrow: 1,
                overflowY: "auto",
                marginBottom: "20px",
                maxWidth: "100%",
                "&::-webkit-scrollbar": {
                    width: "10px",
                },
                "&::-webkit-scrollbar-track": {
                    backgroundColor: "#2f2f2f00",
                    borderRadius: "25px",
                },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#444654",
                    borderRadius: "50px",
                    border: "1px solid #2F2F2F",
                },
            }}
        >
            {messages.map((message, index) => (
                <MessageItem
                    key={index}
                    message={message}
                    isLast={index === messages.length - 1}
                    messageEndRef={messageEndRef}
                />
            ))}

            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                style={{
                    margin: "0 auto",
                    maxWidth: "800px",
                    width: "100%",
                    color: "red",
                    padding: "10px",
                    textAlign: "center",
                }}
            >
                {showLoginWarning && (
                    <Alert
                        severity="warning"
                        onClose={() => setShowLoginWarning(false)}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            margin: "10px auto",
                            maxWidth: "700px",
                            width: "100%",
                        }}
                    >
                        You've reached message limit. Please log in to continue using the chat.
                        <Button color="warning" size="small" onClick={() => navigate("/login")} sx={{ marginLeft: 2 }}>
                            Log In
                        </Button>
                    </Alert>
                )}
                {error && (
                    <Typography variant="body1" style={{ color: "red" }}>
                        {error}
                    </Typography>
                )}
            </Box>

            {loading && <LoadingSkeleton />}
        </List>
    )
}

export default MessageList

