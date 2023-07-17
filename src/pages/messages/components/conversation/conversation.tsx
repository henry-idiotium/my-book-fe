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
import { useChatSocketConnection } from './hooks';

export function Conversation() {
  const conversationId = useParams().id ?? '';

  const socketState = useChatSocketConnection(conversationId);
  const [initialContextState, dispatch] = useReducer(
    cascadeContextReducer,
    initialCascadeState,
  );

  const contextState = useMemo(() => {
    if (socketState.loading || socketState.connectFailed) return;

    const { loading, connectFailed, ...chatSocketState } = socketState;
    const cascadeState: ConversationCascadeState = {
      ...initialContextState,
      chatSocketState,
    };

    return cascadeState;
  }, deepCompareMemo(socketState));

  // todo: provide better status render handling
  if (socketState.connectFailed) return <div>connect failed</div>;
  if (!contextState || socketState.loading) return <div>loading...</div>;

  return (
    <ConversationCascadeStateContext.Provider value={[contextState, dispatch]}>
      <div className={styles.container}>
        <Header />
        <Content />
        <DirectMessages />
      </div>
    </ConversationCascadeStateContext.Provider>
  );
}

export default Conversation;
