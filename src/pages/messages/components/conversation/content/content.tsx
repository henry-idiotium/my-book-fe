import { ArrowDown } from '@phosphor-icons/react';
import { Fragment, useContext, useEffect, useMemo, useRef } from 'react';
import { useBoolean, useUpdateEffect } from 'usehooks-ts';

import { Button } from '@/components';
import {
  useDeepCompareMemoize as deepCompareMemo,
  useDispatch,
  useInitialMemo,
  usePersistScrollView,
  useScroll,
  useSelector,
} from '@/hooks';
import { chatSocketActions as actions, selectAuth } from '@/stores';
import { classnames } from '@/utils';

import { ConversationCascadeStateContext } from '../context-cascade';

import * as Constants from './constants';
import styles from './content.module.scss';
import { ConversationMessage, ConversationMessageProps } from './conversation-message';
import UserProfileBanner from './user-profile-banner';

/*
todo:
- seen logic: trigger when content focus
- new message indication when shouldGoBack=true
*/

const MESSAGE_FETCH_AMOUNT = 20;

export function Content() {
  const dispatch = useDispatch();

  const _foo = '';

  const containerRef = useRef<HTMLDivElement>(null);
  const { afterPrepend, beforePrepend } = usePersistScrollView(containerRef, {
    index: 1,
  });
  const [{ shouldGoBack, isAtOppositeEnds: isAtTop }, , scrollToBottom] = useScroll(containerRef, {
    viewHeightPerc: 0.8,
    behavior: 'smooth',
    startAt: 'bottom',
  });

  const { user: sessionUser } = useSelector(selectAuth);
  const [{ chatSocketState }, contextDispatch] = useContext(ConversationCascadeStateContext);

  const {
    id: conversationId,
    participants,
    messages,
    meta: {
      message: { prevFetch },
    },
  } = chatSocketState;

  const canLoadMoreMessages = useInitialMemo(() => prevFetch.count >= MESSAGE_FETCH_AMOUNT, true, [
    prevFetch.count,
  ]);
  const shouldShowProfileBanner = useMemo(
    () => participants.length === 1 && !canLoadMoreMessages,
    [canLoadMoreMessages],
  );

  const loadingPreviousMessages = useBoolean(false);

  /** Chain messages into loosely group of closure messages (ie, sent not far apart). */
  const decorativeMessages = useMemo(() => {
    return messages.reduce<DecorativeMessage[]>((acc, message) => {
      // evaluate previous messages
      const previous = acc.at(-1);
      if (previous) {
        const isSameSource = message.from === previous.message.from;

        const timeDiff = new Date(message.at).getTime() - new Date(previous.message.at).getTime();
        const shouldEndOfChain = timeDiff / 1000 / 60 <= 1;

        // Remove end of chain indication of prev message
        // if the current one is in same time duration.
        if (isSameSource && shouldEndOfChain) {
          const prevIndex = acc.length - 1;
          acc[prevIndex].hasSharpCorner = false;
          acc[prevIndex].displayMeta = false;
        }
      }

      const decorativeMessage: DecorativeMessage = {
        isFromSessionUser: message.from === sessionUser.id,
        hasSharpCorner: true,
        displayMeta: true,
        message,
      };

      return [...acc, decorativeMessage];
    }, []);
  }, deepCompareMemo(messages));

  // Load previous messages
  useEffect(() => {
    if (!canLoadMoreMessages || !isAtTop) return;

    loadingPreviousMessages.setTrue();
    beforePrepend();

    setTimeout(() => {
      dispatch(
        actions.socket.loadHistoryMessages({
          conversationId,
          nthFromEnd: prevFetch.nthFromEnd + MESSAGE_FETCH_AMOUNT,
          count: MESSAGE_FETCH_AMOUNT,
        }),
      );
    }, Constants.LOAD_HISTORY_MIN_WAIT_DURATION);
  }, [isAtTop]);

  // Scroll focus to latest message, when the view is relatively bottom
  useUpdateEffect(() => {
    if (loadingPreviousMessages.value) {
      afterPrepend();
      loadingPreviousMessages.setFalse();
    }
    if (containerRef.current && !shouldGoBack) scrollToBottom('instant');
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
