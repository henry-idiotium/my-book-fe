import { useContext } from 'react';

import SocketContext from './chat-box.context';
import styles from './chat-box.module.css';

export function ChatBoxMain() {
  const { userCount } = useContext(SocketContext).SocketState;

  return (
    <div className={styles['container']}>
      <h1>Total user: {userCount}</h1>
    </div>
  );
}

export default ChatBoxMain;
