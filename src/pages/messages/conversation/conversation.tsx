import styles from './conversation.module.scss';

import { ConversationEntity } from '@/types';

export interface ConversationProps {
  convoId: ConversationEntity['id'];
}

export function Conversation(props: ConversationProps) {
  return (
    <div className={styles.container}>
      <div className=""></div>
    </div>
  );
}
export default Conversation;
