/* eslint-disable @typescript-eslint/no-namespace */
import { io } from 'socket.io-client';

import { ChatSocket } from '@/types';

export const chatSocketMap = new Map<string, ChatSocket>();
export default chatSocketMap;

/**
 * Connect socket to the backend then immediately add to the Map.
 */
export function connectChatSocket(id: string, token: string) {
  const socket = io(`${import.meta.env.VITE_SERVER_URL}/chatbox`, {
    query: { chatboxId: id },
    extraHeaders: { Authorization: token },
  });
  chatSocketMap.set(id, socket);
  return socket;
}

/**
 * Get current chat socket. Create new if not found.
 */
export function getOrConnectChatSocket(id: string, token: string) {
  const existsSocket = chatSocketMap.get(id);
  const socket = existsSocket ?? connectChatSocket(id, token);
  if (!existsSocket) chatSocketMap.set(id, socket);
  return socket;
}
