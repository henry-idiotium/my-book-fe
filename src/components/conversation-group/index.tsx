import { ConversationGroupHelper } from './helper';

import SocketContextProvider from '@/pages/messages/socket-context-provider/socket-context-provider';

export interface ConversationGroupProps {
  id: string;
}

export default function ConversationGroup(props: ConversationGroupProps) {
  return (
    <SocketContextProvider isGroup={true} id={props.id}>
      <ConversationGroupHelper />
    </SocketContextProvider>
  );
}
