import { io } from 'socket.io-client';

import { ChatSocket, ChatSocketListener as Listener } from '@/types';
import { Convo } from '@/utils';

import { ChatSocketEntity } from './types';
import { handshakeQueryZod } from './types/handshake-query';

const UserListener = Listener.User.Events;

// todo: handle socket re-request when connect failed, and navigated

const socketAddress = `${
  import.meta.env.VITE_SERVER_CONVERSATION_URL
}/conversations`;

export const store = new Map<string, ChatSocket>();

/** Connect socket to the backend then immediately add to the Map. */
export async function connect(id: string, token: string) {
  const connectResult = await new Promise<
    ChatSocketEntity & { socket: ChatSocket }
  >((resolve, rejects) => {
    const socket: ChatSocket = io(socketAddress, {
      query: handshakeQueryZod.parse({ conversationId: id }),
      extraHeaders: { Authorization: token },
      timeout: 5000,
    });

    socket.on('connect', () => {
      socket.on(UserListener.CONNECT, ({ activeUserIds, conversation }) => {
        socket.off(UserListener.CONNECT);
        resolve({
          ...conversation,
          activeUserIds,
          isGroup: Convo.isGroup(conversation),
          socket,
        });
      });
    });

    socket.on('connect_error', function (err) {
      rejects(err);
    });
  });

  const { socket } = connectResult;

  console.log('🚀 ~ file: chat-socket.map.ts:22 ~ socket:\n', socket);

  store.set(id, socket);
  return connectResult;
}

/** Get current chat socket. Create new if not found. */
export async function getOrConnect(id: string, token: string) {
  const existsSocket = store.get(id);
  return existsSocket ? undefined : await connect(id, token);
}

export function getSocket(id: string) {
  return store.get(id);
}
