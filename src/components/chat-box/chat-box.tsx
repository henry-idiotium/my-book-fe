import { useContext } from 'react';

import SocketContext from './chat-box.context';
import styles from './chat-box.module.css';

/* eslint-disable-next-line */
export interface ChatBoxProps {}

export function ChatBox(props: ChatBoxProps) {
  const { userCount } = useContext(SocketContext).SocketState;

  return (
    <div className={styles['container']}>
      <h1>Total user: {userCount}</h1>
    </div>
  );
}

export default ChatBox;
