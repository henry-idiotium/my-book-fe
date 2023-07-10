import {
  Gif as GifIcon,
  Image as ImageIcon,
  PaperPlaneRight as PaperPlaneRightIcon,
  Smiley as SmileyIcon,
} from '@phosphor-icons/react';
import React, { useContext, useState } from 'react';

import { Button } from '@/components';

import { ConversationCascadeStateContext } from '../conversation';

import styles from './direct-messages.module.scss';

const START_MESSAGING_PLACEHOLDER = 'Start a new message';

// eslint-disable-next-line @typescript-eslint/ban-types
type MessagingProps = {};

export function DirectMessages(props: MessagingProps) {
  const { activeConversation: convo } = useContext(
    ConversationCascadeStateContext,
  );

  const [message, setMessage] = useState('');

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.compose}>
        {/* todo: image upload */}
        <Button disableBaseStyles className={styles.composeImageUpload}>
          <ImageIcon />
        </Button>

        {/* todo: gif picker */}
        <Button disableBaseStyles className={styles.composeGifPicker}>
          <GifIcon />
        </Button>

        {/* todo: emoji picker */}
        <Button disableBaseStyles className={styles.composeEmojiPicker}>
          <SmileyIcon />
        </Button>

        <div className={styles.composeEditor}>
          <input
            autoFocus
            type="text"
            placeholder={START_MESSAGING_PLACEHOLDER}
            onChange={handleMessageChange}
          />
        </div>

        <Button
          disableBaseStyles
          disabled={!message}
          className={styles.composeSend}
        >
          <PaperPlaneRightIcon />
        </Button>
      </div>
    </div>
  );
}

export default DirectMessages;
