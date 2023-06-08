import ChatboxContextWrapper from '../chat-box-context-wrapper';

import ConversationHelper from './helper';

export interface ConversationProps {
  id: string;
}

export default function Conversation(props: ConversationProps) {
  return (
    <ChatboxContextWrapper isGroup={false} id={props.id}>
      <ConversationHelper />
    </ChatboxContextWrapper>
  );
}
