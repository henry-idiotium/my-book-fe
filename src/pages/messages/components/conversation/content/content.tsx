import { ArrowDown } from '@phosphor-icons/react';
import { useContext, useEffect, useMemo, useRef } from 'react';
import { useUpdateEffect } from 'usehooks-ts';

import { Button } from '@/components';
import {
  useDeepCompareMemoize as deepCompareMemo,
  useScroll,
  useSelector,
} from '@/hooks';
import { selectAuth } from '@/stores';

import { ConversationCascadeStateContext } from '../context-cascade';

import styles from './content.module.scss';
import { MessageBubble, MessageBubbleProps } from './message-bubble';
import UserProfileBanner from './user-profile-banner';

/*
todo:
- seen logic: trigger when content focus
- new message indication when shouldGoBack=true
*/

export function Content() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { shouldGoBack, scrollBack: scrollToBottom } = useScroll(containerRef, {
    shouldScrollBackPerc: 0.5,
    behavior: 'smooth',
    startAt: 'bottom',
  });

  const { user: sessionUser } = useSelector(selectAuth);
  const [{ chatSocketState: state }, dispatch] = useContext(
    ConversationCascadeStateContext,
  );

  useEffect(() => dispatch(['set-scroll-to-end', scrollToBottom]), [scrollToBottom]);

  // scroll focus to latest message, when the view is relatively bottom.
  useUpdateEffect(() => {
    if (containerRef.current && !shouldGoBack) scrollToBottom('instant');
  }, [state.messages.length]);

  /** @remarks Chain messages means group of messages sent not far part. */
  const messageBubbles = useMemo(() => {
    return state.messages.reduce<MappedMessageBubble[]>((acc, message) => {
      const prev = acc.at(-1);
      if (!prev) return [...acc, { message, sharpCorner: true }];

      const isSameSource = message.from === prev?.message.from;
      const shouldEndOfChain = withinSameDuration(prev.message.at, message.at);

      // Remove endOfChain indication of prev message
      // if the current one is in same time duration.
      if (shouldEndOfChain && isSameSource) {
        acc[acc.length - 1].sharpCorner = false;
      }

      return [...acc, { message, sharpCorner: shouldEndOfChain }];
    }, []);
  }, deepCompareMemo(state.messages));

  return (
    <>
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

      {shouldGoBack ? (
        <div className="sticky bottom-32 left-[calc(50%-14px)] box-content wh-0">
          <Button
            disableBaseStyles
            className="flex justify-center rounded-full bg-base-hover-lt p-2 text-accent"
            onClick={() => scrollToBottom()}
          >
            <ArrowDown weight="bold" size={20} className="" />
          </Button>
        </div>
      ) : null}
    </>
  );
}

export default Content;

function withinSameDuration(date1: number | string, date2: number | string) {
  const diff = new Date(date1).getTime() - new Date(date2).getTime();
  const minutesDiff = diff / 1000 / 60;

  return minutesDiff <= 1;
}

type MappedMessageBubble = RequiredPick<Partial<MessageBubbleProps>, 'message'>;
