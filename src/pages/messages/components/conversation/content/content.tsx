import { ArrowDown } from '@phosphor-icons/react';
import { Fragment, useContext, useEffect, useMemo, useRef } from 'react';

import { Button, Loading } from '@/components';
import {
  useDeepCompareMemoize as deepCompareMemo,
  useBoolean,
  useDispatch,
  usePersistScrollView,
  useScroll,
  useSelector,
  useUpdateEffect,
} from '@/hooks';
import { chatSocketActions as actions, selectAuth } from '@/stores';
import { classnames } from '@/utils';

import { ConversationCascadeStateContext } from '../context-cascade';
import { LATEST_MESSAGES_COUNT } from '../hooks/chat-socket-connection/constants';

import * as Constants from './constants';
import styles from './content.module.scss';
import { ConversationMessage, ConversationMessageProps } from './conversation-message';
import UserProfileBanner from './user-profile-banner';

// note: not implement group case yet

export function Content() {
  const dispatch = useDispatch();

  const containerRef = useRef<HTMLDivElement>(null);
  const { afterPrepend, beforePrepend } = usePersistScrollView(containerRef, { index: 1 });
  const [shouldGoBack, isAtTop, isAtBottom, scrollToBottom] = useScroll(containerRef, {
    viewHeightPerc: 2,
    behavior: 'smooth',
    startAt: 'bottom',
  });

  const { user: sessionUser } = useSelector(selectAuth);
  const [{ chatSocketState }, contextDispatch] = useContext(ConversationCascadeStateContext);

  const {
    id: conversationId,
    participants,
    messages,
    messageSeenLog,
    isGroup,
    meta: {
      message: { prevFetch },
    },
  } = chatSocketState;

  const canLoadMoreMessages = useMemo(
    () => prevFetch.count >= LATEST_MESSAGES_COUNT,
    [prevFetch.count],
  );
  const shouldShowProfileBanner = useMemo(
    () => Object.keys(participants).length === 1 && !canLoadMoreMessages,
    [canLoadMoreMessages],
  );

  const loadingPreviousMessages = useBoolean(false);

  /**
   * Chaining messages into loosely group of closure messages
   * (ie, messages that sent not far apart).
   */
  const decorativeMessages = useMemo(() => {
    const sessionUserFinalMessage = messages.filter((m) => m.from === sessionUser.id).at(-1);
    const seenMessageIds = new Set(Object.values(messageSeenLog));

    return messages.reduce<DecorativeMessage[]>((acc, message) => {
      // evaluate previous messages
      const previous = acc.at(-1);
      if (previous) {
        const isSameSource = message.from === previous.message.from;

        const timeDiff = new Date(message.at).getTime() - new Date(previous.message.at).getTime();
        const shouldEndOfChain = timeDiff / 1000 / 60 <= 1 && !!message.content;

        const prevIndex = acc.length - 1;

        // Remove end of chain indication of prev message
        // if the current one is in same time duration.
        if (isSameSource && shouldEndOfChain) {
          acc[prevIndex].isEndOfChain = false;
        }
      }

      const isFromSessionUser = message.from === sessionUser.id;
      const owner = participants[message.from];
      const isSeen = seenMessageIds.has(message.id);
      const showSeenStatus = sessionUserFinalMessage?.id === message.id || isGroup;

      const decorativeMessage: DecorativeMessage = {
        conversationId,
        message,
        owner,
        isEndOfChain: true,
        showSeenStatus,
        isFromSessionUser,
        isSeen,
      };

      return [...acc, decorativeMessage];
    }, []);
  }, deepCompareMemo(messages));

  // Load previous messages
  useEffect(() => {
    if (!canLoadMoreMessages || !isAtTop) return;

    loadingPreviousMessages.setTrue();
    beforePrepend();

    // "await" min amount of time to avoid focus "glitching"
    setTimeout(() => {
      dispatch(
        actions.socket.loadHistoryMessages({
          conversationId,
          nthFromEnd: prevFetch.nthFromEnd + LATEST_MESSAGES_COUNT,
          count: LATEST_MESSAGES_COUNT,
        }),
      );
    }, Constants.LOAD_HISTORY_MIN_WAIT_DURATION);
  }, [isAtTop]);

  // handle messages size change
  useUpdateEffect(() => {
    // Persist scroll view when load previous messages.
    if (loadingPreviousMessages.value) {
      afterPrepend();
      loadingPreviousMessages.setFalse();
    }

    // Scroll focus to NEWLY CREATED message, when the view is relatively bottom.
    if (containerRef.current && isAtBottom) scrollToBottom('instant');
  }, [messages.length]);

  // Expose scrollback
  useEffect(() => contextDispatch(['set-scroll-to-end', scrollToBottom]), [scrollToBottom]);

  // todo: add loading UI

  return (
    <Fragment>
      <div ref={containerRef} className={styles.container}>
        {/* --- Banner --- */}
        {shouldShowProfileBanner ? <UserProfileBanner interlocutor={participants[0]} /> : null}

        {/* --- Loading --- */}
        {canLoadMoreMessages ? (
          <div className="flex h-11 w-full shrink-0 items-center justify-center">
            <Loading />
          </div>
        ) : null}

        {/* --- Messages --- */}
        {decorativeMessages.map((decorators, index) => (
          <ConversationMessage key={index} {...decorators} />
        ))}
      </div>

      {shouldGoBack ? (
        <div
          className={classnames('sticky bottom-32 left-[80%] box-content wh-0', {
            [styles.goBackPopUpAnimation]: shouldGoBack,
          })}
        >
          <Button
            disableBaseStyles
            className="flex justify-center rounded-full bg-base-hover-lt px-4 py-2 text-accent"
            onClick={() => scrollToBottom()}
          >
            <ArrowDown weight="bold" size={20} className="" />
          </Button>
        </div>
      ) : null}
    </Fragment>
  );
}

export default Content;

type DecorativeMessage = ConversationMessageProps;
