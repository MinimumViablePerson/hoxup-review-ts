export type User = {
  firstName: string
  lastName: string
  phoneNumber: string
  avatar: string
  id: number
}

export type MessageType = {
  userId: number
  messageText: string
  conversationId: number
  id: number
}

export type ConversationType = {
  userId: number
  participantId: number
  id: number
}

export type CurrentConversation = ConversationType & {
  messages: MessageType[]
}
