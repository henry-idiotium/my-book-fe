import ChatboxContextWrapper from '../chat-box-context-wrapper';
import { ConversationGroupActions } from '../chat-box-context-wrapper/actions';

import { ConversationGroupHelper } from './helper';

export interface ConversationGroupProps {
  id: string;
}

export default function ConversationGroup(props: ConversationGroupProps) {
  return (
    <ChatboxContextWrapper
      dispatchType={ConversationGroupActions.CONVERSATION_GROUP_RECEIVED}
      id={props.id}
    >
      <ConversationGroupHelper />
    </ChatboxContextWrapper>
  );
}
