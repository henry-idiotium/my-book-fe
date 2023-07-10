import { useParams } from 'react-router-dom';

import { conversationEntityZod } from '@/types';
import { contextWithZod } from '@/utils';

import Content from './content/content';
import styles from './conversation.module.scss';
import DirectMessages from './direct-messages/direct-messages';
import Header from './header/header';
import { useChatSocketConnection } from './hooks';

export const ConversationCascadeStateContext = contextWithZod({
  activeConversation: conversationEntityZod,
});

export function Conversation() {
  const { id = '' } = useParams();

  const { loading, connectFailed, activeConversation } =
    useChatSocketConnection(id);

  // todo: provide better status render handling
  if (connectFailed) return <div className="text-red-600">connect failed</div>;
  if (loading) return <div>loading...</div>;

  return (
    <ConversationCascadeStateContext.Provider value={{ activeConversation }}>
      <div className={styles.container}>
        <Header />
        <Content />
        <DirectMessages />
      </div>
    </ConversationCascadeStateContext.Provider>
  );
}

export default Conversation;
