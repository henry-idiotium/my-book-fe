// import { PayloadAction, createSlice } from '@reduxjs/toolkit';
// import { Socket } from 'socket.io-client';

// import { RootState } from '..';

// import {
//   ChatboxSocket,
//   initialChatboxSocket,
//   initialChatboxSocketState,
// } from '@/types';

// export const CHATBOX_SOCKET_FEATURE_KEY = 'chatbox-socket';

// const initialState = new Map<string, ChatboxSocket>();

// export const chatboxSocketSlice = createSlice({
//   name: CHATBOX_SOCKET_FEATURE_KEY,
//   initialState,
//   reducers: {
//     add: (state, action: PayloadAction<{ id: string; socket: Socket }>) => {
//       const { id, socket } = action.payload;

//       state.set(id, { ...initialChatboxSocket, socket });
//     },
//   },
// });

import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Socket } from 'socket.io-client';

export const socketMap = new Map<string, Socket>();

type WebSocketType = {
  id: number;
  user: string[];
  name: string;
  socketId: string;
};

const initialState = new Map<string, WebSocketType>();

const webSocketSlice = createSlice({
  name: 'webSockets',
  initialState,
  reducers: {
    addWebSocket: (
      state,
      action: PayloadAction<{ id: string; socket: Socket }>
    ) => {
      socketMap.set(action.payload.socket.id, action.payload.socket);
      state.set(action.payload.id, {
        ...{ id: 1, user: [], name: '' },
        socketId: action.payload.socket.id,
      });
    },
    removeWebSocket: (state, action) => {
      socketMap.delete(action.payload.socket.id);
      state.delete(action.payload.id);
    },
  },
});

export const chatboxSocketReducer = webSocketSlice.reducer;
export const { addWebSocket, removeWebSocket } = webSocketSlice.actions;
