import { createContext } from 'react';
import { Socket } from 'socket.io-client';

export interface SocketContextState {
  userCount: number;
}

export const SocketActions = {
  USER_CONNECTED: 'user_connected' as const,
  USER_DISCONNECTED: 'user_disconnected' as const,
};

export type SocketContextPayload = string | string[] | Socket;

export interface SocketContextActionPayload {
  type: (typeof SocketActions)[keyof typeof SocketActions];
  payload: unknown;
}

export interface ISocketContextProps {
  SocketState: SocketContextState;
  SocketDispatch: React.Dispatch<SocketContextActionPayload>;
}

export const initialSocketState: SocketContextState = {
  userCount: 0,
};

export const SocketReducer = (
  state: SocketContextState,
  action: SocketContextActionPayload
): SocketContextState => {
  console.log(
    'Message received - Action: ' + action.type + ' - Payload: ',
    action.payload
  );

  switch (action.type) {
    case SocketActions.USER_CONNECTED: {
      const payload = action.payload as { userCount: number };
      return { ...state, userCount: payload.userCount };
    }
    case SocketActions.USER_DISCONNECTED: {
      const payload = action.payload as { userCount: number };
      return { ...state, userCount: payload.userCount };
    }
    default: {
      return state;
    }
  }
};

const SocketContext = createContext<ISocketContextProps>({
  SocketState: initialSocketState,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  SocketDispatch: () => {},
});

export const SocketContextConsumer = SocketContext.Consumer;
export const SocketContextProvider = SocketContext.Provider;

export default SocketContext;
