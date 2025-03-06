import axios from "axios"

export const fetchChatHistory = async (sessionId: number, token: string | null) => {
  if (!token || sessionId === null) {
    console.log("No user is logged in.")
    return []
  }

  try {
    const response = await axios.get("http://localhost:3000/chat/history", {
      headers: { Authorization: `Bearer ${token}` },
      params: { sessionId },
    })

    return response.data.map((message: any) => ({
      sender: message.sender,
      text: message.content,
    }))
  } catch (error: any) {
    console.error("Error fetching chat history:", error)
    // Rethrow with additional context
    if (error.response && error.response.status === 401) {
      throw { ...error, authError: true }
    }
    throw error
  }
}

export const sendMessage = async (
  text: string,
  sessionId: number | null,
  isLoggedIn: boolean,
  token: string | null,
) => {
  if (!text.trim()) {
    throw new Error("Message text cannot be empty")
  }

  try {
    let response
    if (isLoggedIn && token) {
      response = await axios.post(
        "http://localhost:3000/chat",
        { text, sessionId },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
    } else {
      response = await axios.post("http://127.0.0.1:8000/chat", { text })
    }

    return response.data.botResponse || response.data.response
  } catch (error: any) {
    console.error("Error sending message:", error)
    // Rethrow with additional context
    if (error.response && error.response.status === 401) {
      throw { ...error, authError: true }
    }
    throw error
  }
}

export const uploadFile = async (file: File, sessionId: number | null, isLoggedIn: boolean, token: string | null) => {
  if (!file) {
    throw new Error("No file provided")
  }

  if (sessionId === null) {
    throw new Error("No session ID provided")
  }

  const formData = new FormData()
  formData.append("file", file)
  formData.append("sessionId", sessionId.toString())

  const headers = {
    "Content-Type": "multipart/form-data",
    ...(token && { Authorization: `Bearer ${token}` }),
  }

  try {
    let response

    if (file.type.startsWith("image/")) {
      response = await axios.post(
        isLoggedIn ? "http://localhost:3000/upload/image" : "http://127.0.0.1:8000/upload_image",
        formData,
        { headers },
      )
    } else if (file.type === "application/pdf") {
      response = await axios.post(
        isLoggedIn ? "http://localhost:3000/upload/pdf" : "http://127.0.0.1:8000/upload_pdf",
        formData,
        { headers },
      )
    } else {
      throw new Error("Invalid file type. Only images and PDFs are supported.")
    }

    return response.data.response || response.data.botResponse
  } catch (error: any) {
    console.error("Error uploading file:", error)
    // Rethrow with additional context
    if (error.response && error.response.status === 401) {
      throw { ...error, authError: true }
    }
    throw error
  }
}

