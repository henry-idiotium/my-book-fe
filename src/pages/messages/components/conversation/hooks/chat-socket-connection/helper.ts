import { AppDispatch, chatSocketActions as actions } from '@/stores';
import { chatSocketEntityZod } from '@/stores/chat-socket/types';
import { ChatSocket, ChatSocketListener as Listener } from '@/types';
import { Convo, getZodDefault } from '@/utils';

import UserEvents = Listener.User.Events;
import MessageEvents = Listener.Message.Events;

const initialChatSocketState = getZodDefault(chatSocketEntityZod);

type InitListenersArgs = [
  conversationId: string,
  socket: ChatSocket,
  dispatch: AppDispatch,
];

export function initChatSocketListeners(...args: InitListenersArgs) {
  const [conversationId, socket, dispatch] = args;

  const withConvo = <T>(p: T) => Object.assign({}, { conversationId, ...p });

  /** Init conversation socket state. */
  socket.on(UserEvents.CONNECT, ({ activeUserIds, conversation }) => {
    const isGroup = Convo.isGroup(conversation);
    const chatSocketState = Object.assign(
      { isGroup, activeUserIds },
      initialChatSocketState,
      conversation,
    );

    dispatch(actions.set(chatSocketState));
  });

  if (import.meta.env.DEV) {
    socket.on('connect_error', console.error);
    socket.on(Listener.Server.Events.EXCEPTION, console.error);
  }

  /** Active user changes listeners. */
  socket.on(UserEvents.JOIN_CHAT, (payload) => {
    dispatch(actions.addActiveUser(withConvo(payload)));
  });
  socket.on(UserEvents.LEAVE_CHAT, (payload) => {
    dispatch(actions.removeActiveUser(withConvo(payload)));
  });

  /** Message changes listeners. */
  socket.on(MessageEvents.READ_RECEIPT, (payload) => {
    dispatch(actions.updateMessageSeenLog(withConvo(payload)));
  });
  socket.on(MessageEvents.RECEIVE, (payload) => {
    dispatch(actions.addMessage(withConvo(payload)));
  });
  socket.on(MessageEvents.SEND_SUCCESS, (payload) => {
    dispatch(actions.resolvePendingMessage(withConvo(payload)));
  });
  socket.on(MessageEvents.DELETE_NOTIFY, (payload) => {
    dispatch(actions.deleteMessage(withConvo(payload)));
  });
  socket.on(MessageEvents.UPDATE_NOTIFY, (payload) => {
    dispatch(actions.updateMessage(withConvo(payload)));
  });

  /** Message failures listeners. */
  socket.on(MessageEvents.SEND_FAILURE, (payload) => {
    dispatch(actions.upsertMessageError(withConvo(payload)));
  });
  socket.on(MessageEvents.UPDATE_FAILURE, (payload) => {
    dispatch(actions.upsertMessageError(withConvo(payload)));
  });
  socket.on(MessageEvents.DELETE_FAILURE, (payload) => {
    dispatch(actions.upsertMessageError(withConvo(payload)));
  });
}
