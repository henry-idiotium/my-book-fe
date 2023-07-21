import { DotsThree, Heart } from '@phosphor-icons/react';
import { useMemo } from 'react';

import { MessageEntity } from '@/types';
import { classnames, formatTimeReadable } from '@/utils';

import styles from './conversation-message.module.scss';

export type ConversationMessageProps = {
  message: MessageEntity;
  isFromSessionUser?: boolean;
  hasSharpCorner?: boolean;
  displayMeta?: boolean;
  seen?: boolean;
};

/*
todo:
- animation on init
- loading and error state
- add emoji
- extra options
*/

export function ConversationMessage(props: ConversationMessageProps) {
  const { message, isFromSessionUser, hasSharpCorner, displayMeta, seen } = props;

  const meta = useMemo(() => {
    const time = formatTimeReadable(message.at, { disableYesterdayAnnotation: true });
    const state = seen ? 'Seen' : 'Sent';
    return `${time} · ${state}`;
  }, [message.at]);

  return (
    <div className={styles.container}>
      <div
        className={classnames(
          'flex items-center justify-end gap-3',
          isFromSessionUser ? 'ml-4' : 'mr-4 flex-row-reverse',
        )}
      >
        {/* --- Actions --- */}
        <div className={styles.options}>
          <div
            className={classnames(
              'flex gap-4 text-color-accent',
              isFromSessionUser ? '' : 'flex-row-reverse',
            )}
          >
            {/* ------ emojis ------ */}
            <button className="">
              <Heart size={18} weight="bold" />
            </button>

            {/* ------ actions ------ */}
            <button className="">
              <DotsThree size={24} weight="bold" />
            </button>
          </div>
        </div>

        {/* --- Content & Meta --- */}
        <div className={classnames('flex flex-col', isFromSessionUser ? 'items-end' : '')}>
          {/* --- Content --- */}
          <div
            className={classnames(
              'flex w-fit max-w-[400px] items-center break-all rounded-3xl px-4 py-3',
              isFromSessionUser ? 'bg-accent' : 'bg-base-hover',
              hasSharpCorner ? (isFromSessionUser ? 'rounded-br-md' : 'rounded-bl-md') : '',
            )}
          >
            <div
              className={classnames(
                'font-sans leading-5',
                isFromSessionUser ? 'text-white' : 'text-color',
              )}
            >
              <span>{message.content}</span>
            </div>
          </div>

          {/* --- Meta --- */}
          {displayMeta ? (
            <div className="pt-1">
              <div className="text-xs leading-4 text-color-accent">
                <span>{meta}</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
