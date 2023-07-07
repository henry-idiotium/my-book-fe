import { useRef } from 'react';

import { useSelector } from '@/hooks';
import { selectAuth } from '@/stores';
import { ConversationEntity } from '@/types';

import styles from './content.module.scss';

type ContentProps = {
  conversation: ConversationEntity;
};

export function Content(props: ContentProps) {
  const { conversation } = props;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user: mainUser } = useSelector(selectAuth);

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
