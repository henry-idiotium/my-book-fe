export const SocketActions = {
  SOCKET_MESSAGE_RECEIVED: 'socket_message_received' as const,
  SOCKET_MESSAGE_SENT: 'socket_message_sent' as const,
  SOCKET_USER_JOINED: 'socket_user_joined' as const,
  SOCKET_USER_CONNECTED: 'socket_user_connected' as const,
  SOCKET_USER_DISCONNECTED: 'socket_user_disconnected' as const,
};

export const CommonActions = {
  MESSAGE_RECEIVED: 'message_received' as const,
  MESSAGE_PENDING: 'message_pending' as const,
};

export const ConversationActions = {};

export const ConversationGroupActions = {};
