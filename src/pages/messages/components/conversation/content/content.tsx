import { useRef } from 'react';

import styles from './content.module.scss';

import { useSelector, useScrollToEnds } from '@/hooks';
import { selectAuth } from '@/stores';
import { ConversationEntity, MinimalUserEntity } from '@/types';
import { Convo } from '@/utils';

type ContentProps = {
  conversation: ConversationEntity;
};

export function Content(props: ContentProps) {
  const { conversation } = props;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user: mainUser } = useSelector(selectAuth);

  const ref = useRef<HTMLDivElement>(null);
  const [shouldScrollBack, scrollBack] = useScrollToEnds(ref, {
    start: 'bottom',
    passPerc: 0.2,
  });

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
