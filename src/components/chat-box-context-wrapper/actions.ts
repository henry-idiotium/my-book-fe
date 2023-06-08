export const SocketActions = {
  SOCKET_MESSAGE_RECEIVED: 'socket_message_received',
  SOCKET_MESSAGE_SENT: 'socket_message_sent',
  SOCKET_USER_JOINED: 'socket_user_joined',
  SOCKET_USER_CONNECTED: 'socket_user_connected',
  SOCKET_USER_DISCONNECTED: 'socket_user_disconnected',
} as const;

export const CommonActions = {
  MESSAGE_RECEIVED: 'message_received',
  MESSAGE_PENDING: 'message_pending',
} as const;

export const ConversationActions = {
  CONVERSATION_RECEIVED: 'conversation_received',
} as const;

export const ConversationGroupActions = {
  CONVERSATION_GROUP_RECEIVED: 'conversation_group_received',
} as const;
