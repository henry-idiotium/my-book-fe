import SocketContextComponent from './chat-box-context-wrapper';
import ChatBoxMain from './chat-box-main';

/* eslint-disable-next-line */
export interface ChatBoxProps {}

export function ChatBox(props: ChatBoxProps) {
  return (
    <SocketContextComponent>
      <ChatBoxMain />
    </SocketContextComponent>
  );
}

export default ChatBox;
