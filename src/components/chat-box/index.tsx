import SocketContextComponent from './chat-box-context-wrapper';
import ChatBoxMain from './chat-box-main';

/* eslint-disable-next-line */
export interface ChatBoxProps {
  id: string;
}

export function ChatBox(props: ChatBoxProps) {
  return (
    <SocketContextComponent id={props.id}>
      <ChatBoxMain />
    </SocketContextComponent>
  );
}

export default ChatBox;
