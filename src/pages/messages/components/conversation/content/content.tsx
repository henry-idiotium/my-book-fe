import { useContext, useRef } from 'react';

import { ConversationCascadeStateContext } from '../conversation';

import styles from './content.module.scss';

// eslint-disable-next-line @typescript-eslint/ban-types
type ContentProps = {};

export function Content(props: ContentProps) {
  const { activeConversation: convo } = useContext(
    ConversationCascadeStateContext,
  );

  const ref = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref} className={styles.container}>
      {/* content: the big one
        - RENDER startup if not past limit of 15 messages
        - but scroll up to the first message will prompt it to RENDER
      */}
    </div>
  );
}
export default Content;
