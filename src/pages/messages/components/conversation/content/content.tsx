import { useCallback, useContext, useMemo, useRef } from 'react';

import {
  useDeepCompareMemoize as deepCompareMemo,
  useScroll,
  useSelector,
} from '@/hooks';
import { selectAuth } from '@/stores';

import { ConversationCascadeStateContext } from '../context-cascade';

import { useUpdateEffect } from 'usehooks-ts';
import styles from './content.module.scss';
import { MessageBubble, MessageBubbleProps } from './message-bubble';
import UserProfileBanner from './user-profile-banner';

export function Content() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { shouldGoBack, scrollBack } = useScroll(containerRef, {
    endsIndication: { startAt: 'bottom' },
  });

  const { user: sessionUser } = useSelector(selectAuth);
  const {
    state: { chatSocketState: state },
  } = useContext(ConversationCascadeStateContext);

  // scroll focus to latest message
  useUpdateEffect(() => {
    if (!containerRef.current || shouldGoBack) return;
    scrollBack();
  }, [state.messages.length]);

  /**
   * Chain messages means multiple messages sent no too far part.
   */
  const messageBubbles = useMemo(() => {
    return state.messages.reduce<MappedMsgBubbleProps[]>((acc, message) => {
      const prev = acc.at(-1);
      if (!prev) return [...acc, { message, sharpCorner: true }];

      const isSameSource = message.from === prev?.message.from;
      const suitableToBeEndOfChain = withinSameDuration(
        prev.message.at,
        message.at,
      );

      // Remove endOfChain indication of prev message if the current one
      // is in same time duration.
      if (suitableToBeEndOfChain && isSameSource) {
        acc[acc.length - 1].sharpCorner = false;
      }

      return [...acc, { message, sharpCorner: suitableToBeEndOfChain }];
    }, []);
  }, deepCompareMemo(state.messages));

  return (
    <div ref={containerRef} className={styles.container}>
      {state.participants.length === 1 ? (
        <UserProfileBanner
          interlocutor={state.participants[0]}
          conversationName={state.name}
        />
      ) : null}

      {messageBubbles.map(({ message, sharpCorner }, index) => (
        <MessageBubble
          key={index}
          message={message}
          fromSessionUser={message.from === sessionUser.id}
          sharpCorner={sharpCorner}
        />
      ))}
    </div>
  );
}
export default Content;

function withinSameDuration(date1: number | string, date2: number | string) {
  const diff = new Date(date1).getTime() - new Date(date2).getTime();
  const minutesDiff = diff / 1000 / 60;

  return minutesDiff <= 1;
}

type MappedMsgBubbleProps = RequiredPick<
  Partial<MessageBubbleProps>,
  'message'
>;
