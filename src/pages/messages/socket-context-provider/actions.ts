const common = {
  MESSAGE_RECEIVED: 'message_received',
  MESSAGE_PENDING: 'message_pending',
} as const;

const socket = {
  SOCKET_MESSAGE_RECEIVED: 'socket_message_received',
  SOCKET_MESSAGE_SENT: 'socket_message_sent',
  SOCKET_USER_JOINED: 'socket_user_joined',
  SOCKET_USER_CONNECTED: 'socket_user_connected',
  SOCKET_USER_DISCONNECTED: 'socket_user_disconnected',
} as const;

const conversation = {} as const;

const conversationGroup = {} as const;

export const actions = {
  ...common,
  ...socket,
  ...conversation,
  ...conversationGroup,
} as const;
export default actions;
