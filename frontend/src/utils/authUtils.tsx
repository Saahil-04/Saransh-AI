import Cookies from "js-cookie"

export const handleLogout = () => {
  // Clear localStorage
  localStorage.removeItem("token")
  localStorage.removeItem("username")
  localStorage.removeItem("currentSession")

  // Clear cookies
  Cookies.remove("token")
  Cookies.remove("username")
  Cookies.remove("sessionId")
}

export const getCookie = (name: string): string | undefined => {
  return Cookies.get(name)
}

export const checkLoginStatus = () => {
  const storedUsername = localStorage.getItem("username")
  return !!storedUsername
}

export const loadUserDataFromCookies = () => {
  const token = getCookie("token")
  const username = getCookie("username")
  const sessionId = getCookie("sessionId")

  if (token && username && sessionId) {
    // Store them in localStorage
    localStorage.setItem("token", token)
    localStorage.setItem("username", username)
    localStorage.setItem("sessionId", sessionId)

    return {
      token,
      username,
      sessionId: Number(sessionId),
    }
  }

  return null
}

