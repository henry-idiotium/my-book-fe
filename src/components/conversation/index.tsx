import ChatboxContextWrapper from '../chat-box-context-wrapper';
import { ConversationActions } from '../chat-box-context-wrapper/actions';

import ConversationHelper from './helper';

export interface ConversationProps {
  id: string;
}

export default function Conversation(props: ConversationProps) {
  return (
    <ChatboxContextWrapper
      dispatchType={ConversationActions.CONVERSATION_RECEIVED}
      id={props.id}
    >
      <ConversationHelper />
    </ChatboxContextWrapper>
  );
}
