import { DotsThree, Heart } from '@phosphor-icons/react';

import { MessageEntity } from '@/types';
import { classnames } from '@/utils';

import styles from './message-bubble.module.scss';

export type MessageBubbleProps = {
  message: MessageEntity;
  fromSessionUser: boolean;
  sharpCorner?: boolean;
};

export function MessageBubble(props: MessageBubbleProps) {
  const { message, fromSessionUser, sharpCorner } = props;

  return (
    <div className={styles.container}>
      <div
        className={classnames(
          'flex items-center justify-end gap-3',
          fromSessionUser ? 'ml-4' : 'mr-4 flex-row-reverse',
        )}
      >
        <div className={styles.options}>
          <div
            className={classnames(
              'flex gap-4 text-color-accent',
              fromSessionUser ? '' : 'flex-row-reverse',
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

        <div
          className={classnames(
            'flex max-w-[400px] items-center break-all rounded-3xl px-4 py-3',
            fromSessionUser ? 'bg-accent' : 'bg-base-hover',
            sharpCorner ? (fromSessionUser ? 'rounded-br-md' : 'rounded-bl-md') : '',
          )}
        >
          <div
            className={classnames(
              'font-sans leading-5',
              fromSessionUser ? 'text-white' : 'text-color',
            )}
          >
            <span className="">{message.content}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
