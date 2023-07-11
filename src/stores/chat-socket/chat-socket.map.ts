import { io } from 'socket.io-client';

import { ChatSocket, ChatSocketListener as Listener } from '@/types';
import { Convo, getZodDefault } from '@/utils';

import { ChatSocketEntity, chatSocketEntityZod } from './types';
import { handshakeQueryZod } from './types/handshake-query';

const UserListener = Listener.User.Events;

// todo: handle socket re-request when connect failed, and navigated

const URL = `${import.meta.env.VITE_SERVER_CONVERSATION_URL}/conversations`;

export const store = new Map<string, ChatSocket>();

/** Connect socket to the backend then immediately add to the Map. */
export async function connect(conversationId: string, token: string) {
  return await new Promise<ConnectionResult>((resolve, reject) => {
    const socket: ChatSocket = io(URL, {
      query: handshakeQueryZod.parse({ conversationId: conversationId }),
      extraHeaders: { Authorization: token },
      timeout: 5000,
    });

    socket.on('connect', () => {
      socket.on(UserListener.CONNECT, ({ activeUserIds, conversation }) => {
        // avoid loop in `connect` event
        socket.off(UserListener.CONNECT);

        // add to socket Map
        store.set(conversationId, socket);

        resolve({
          ...getZodDefault(chatSocketEntityZod),
          ...conversation,
          activeUserIds,
          isGroup: Convo.isGroup(conversation),
          socket,
        });
      });
    });

    socket.on('connect_error', (err) => reject(err));
  });
}

/** Get current chat socket. Connect new if not found. */
export async function ensureGet(conversationId: string, token: string) {
  const existingSocket = store.get(conversationId);
  if (existingSocket) return existingSocket;

  const newSocket = await connect(conversationId, token);
  return newSocket.socket;
}

type ConnectionResult = ChatSocketEntity & { socket: ChatSocket };
