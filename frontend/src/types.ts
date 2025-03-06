export interface Message {
    sender: "user" | "bot"
    text: string
    imageUrl?: string
}

export interface ChatProps {
    currentSession: number | null
    onLogOut: () => void
}

export interface SuggestionItem {
    title: string
}

