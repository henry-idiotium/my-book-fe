import ChatboxContextWrapper from '../chat-box-context-wrapper';

import { ConversationGroupHelper } from './helper';

export interface ConversationGroupProps {
  id: string;
}

export default function ConversationGroup(props: ConversationGroupProps) {
  return (
    <ChatboxContextWrapper isGroup={true} id={props.id}>
      <ConversationGroupHelper />
    </ChatboxContextWrapper>
  );
}
