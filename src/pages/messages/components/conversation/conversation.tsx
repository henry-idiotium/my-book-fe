import { useReducer, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { z } from 'zod';

import { chatSocketEntityZod } from '@/stores/chat-socket/types';
import { InferZodContext, contextWithZod } from '@/utils';

import Content from './content/content';
import styles from './conversation.module.scss';
import DirectMessages from './direct-messages/direct-messages';
import Header from './header/header';
import { useChatSocketConnection } from './hooks';
import {
  ConversationCascadeStateContext,
  cascadeContextReducer,
  initialCascadeState,
} from './context-cascade';

export function Conversation() {
  const { id = '' } = useParams();

  const [state, dispatch] = useReducer(
    cascadeContextReducer,
    initialCascadeState,
  );

  const socketState = useChatSocketConnection(id);

  // todo: provide better status render handling
  if (socketState.connectFailed) return <div>connect failed</div>;
  if (socketState.loading) return <div>loading...</div>;

  const { loading, connectFailed, ...chatSocketState } = socketState;

  const contextState = { state: { ...state, chatSocketState }, dispatch };

  return (
    <ConversationCascadeStateContext.Provider value={contextState}>
      <div className={styles.container}>
        <Header />
        <Content />
        <DirectMessages />
      </div>
    </ConversationCascadeStateContext.Provider>
  );
}

export default Conversation;
