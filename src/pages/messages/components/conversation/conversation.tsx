import { useMemo, useReducer } from 'react';
import { useParams } from 'react-router-dom';

import { useDeepCompareMemoize as deepCompareMemo } from '@/hooks';

import Content from './content/content';
import {
  ConversationCascadeState,
  ConversationCascadeStateContext,
  cascadeContextReducer,
  initialCascadeState,
} from './context-cascade';
import styles from './conversation.module.scss';
import DirectMessages from './direct-messages/direct-messages';
import Header from './header/header';
import { useChatSocketConnection, useSeenConversation } from './hooks';

export function Conversation() {
  const conversationId = useParams().id ?? '';

  const seenRegister = useSeenConversation(conversationId);

  const socketState = useChatSocketConnection(conversationId);
  const [initialContextState, dispatch] = useReducer(cascadeContextReducer, initialCascadeState);

  const contextState = useMemo(() => {
    if (socketState.loading || socketState.connectFailed) return;

    const cascadeState: ConversationCascadeState = {
      ...initialContextState,
      chatSocketState: socketState.state,
    };

    return cascadeState;
  }, deepCompareMemo(socketState));

  // todo: provide better status render handling
  if (socketState.connectFailed) return <div>connect failed</div>;
  if (!contextState || socketState.loading) return <div>loading...</div>;

  return (
    <ConversationCascadeStateContext.Provider value={[contextState, dispatch]}>
      <div autoFocus className={styles.container} {...seenRegister}>
        <Header />
        <Content />
        <DirectMessages />
      </div>
    </ConversationCascadeStateContext.Provider>
  );
}

export default Conversation;
