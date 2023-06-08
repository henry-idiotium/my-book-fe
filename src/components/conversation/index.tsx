import ConversationHelper from './helper';

import SocketContextProvider from '@/pages/messages/socket-context-provider/socket-context-provider';

export interface ConversationProps {
  id: string;
}

export default function Conversation(props: ConversationProps) {
  return (
    <SocketContextProvider isGroup={false} id={props.id}>
      <ConversationHelper />
    </SocketContextProvider>
  );
}
