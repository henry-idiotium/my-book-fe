import { DotsThreeOutline } from '@phosphor-icons/react';
import { TbHeartPlus } from 'react-icons/tb';

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
          'flex justify-end',
          fromSessionUser ? 'ml-4' : 'mr-4 flex-row-reverse',
        )}
      >
        {/* {renderBubbleChildren()} */}

        <div className={styles.options}>
          <div
            className={classnames(
              'flex gap-1 text-color-accent',
              fromSessionUser ? '' : 'flex-row-reverse',
            )}
          >
            {/* ------ actions ------ */}
            <button className="wh-12">
              <DotsThreeOutline />
            </button>

            {/* ------ emojis ------ */}
            <button className="wh-12">
              <TbHeartPlus />
            </button>
          </div>
        </div>

        <div
          className={classnames(
            'flex max-w-[400px] items-center rounded-3xl px-4 py-3',
            fromSessionUser ? 'bg-accent' : 'bg-base-hover',
            sharpCorner
              ? fromSessionUser
                ? 'rounded-br-md'
                : 'rounded-bl-md'
              : '',
          )}
        >
          <div
            className={classnames(
              'font-sans leading-5',
              fromSessionUser ? 'text-white' : 'text-color',
            )}
          >
            <span>{message.content}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
