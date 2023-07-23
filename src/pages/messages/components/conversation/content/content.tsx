import { ArrowDown } from '@phosphor-icons/react';
import { Fragment, useContext, useEffect, useMemo, useRef } from 'react';

import { Button } from '@/components';
import {
  useDeepCompareMemoize as deepCompareMemo,
  useBoolean,
  useDispatch,
  usePersistScrollView,
  useScrollAlt,
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

/*
todo:
- seen logic: trigger when content focus
- new message indication when shouldGoBack=true
*/

export function Content() {
  const dispatch = useDispatch();

  const containerRef = useRef<HTMLDivElement>(null);
  const { afterPrepend, beforePrepend } = usePersistScrollView(containerRef, { index: 1 });
  const [{ shouldGoBack, isAtOppositeEnds: isAtTop, isAtEnds: isAtBottom }, scrollToBottom] =
    useScrollAlt(containerRef, {
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
    return messages.reduce<DecorativeMessage[]>((acc, message) => {
      const isFromSessionUser = message.from === sessionUser.id;
      const ownerShortName = participants[message.from]?.firstName;
      const seen = messageSeenLog[message.from] === message.id;

      // evaluate previous messages
      const previous = acc.at(-1);
      if (previous) {
        const isSameSource = message.from === previous.message.from;

        const timeDiff = new Date(message.at).getTime() - new Date(previous.message.at).getTime();
        const shouldEndOfChain = timeDiff / 1000 / 60 <= 1 && !!message.content;

        const prevIndex = acc.length - 1;

        if (isSameSource) {
          acc[prevIndex].displaySeenStatus = seen;
        }

        // Remove end of chain indication of prev message
        // if the current one is in same time duration.
        if (isSameSource && shouldEndOfChain) {
          acc[prevIndex].hasSharpCorner = false;
          acc[prevIndex].displayMeta = false;
        }
      }

      const decorativeMessage: DecorativeMessage = {
        hasSharpCorner: true,
        displaySeenStatus: true,
        displayMeta: !!message.content,
        isFromSessionUser,
        conversationId,
        ownerShortName,
        message,
        seen,
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
          <div className="flex h-14 w-full shrink-0 items-center justify-center bg-teal-700">
            {loadingPreviousMessages.value ? (
              <span className="text-lg font-semibold text-color">loading...</span>
            ) : null}
          </div>
        ) : null}

        {/* --- Messages --- */}
        {decorativeMessages.map((metaMessage, index) => (
          <ConversationMessage key={index} {...metaMessage} />
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
