import { zodResolver } from '@hookform/resolvers/zod';
import {
  Gif as GifIcon,
  Image as ImageIcon,
  PaperPlaneRight as PaperPlaneRightIcon,
  Smiley as SmileyIcon,
} from '@phosphor-icons/react';
import { useContext } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { Button } from '@/components';
import { useDispatch, useSelector } from '@/hooks';
import { chatSocketActions, selectAuth } from '@/stores';

import { ConversationCascadeStateContext } from '../context-cascade';

import * as Constants from './constants';
import styles from './direct-messages.module.scss';
import { MessageForm, messageFormZod } from './types';

export function DirectMessages() {
  const dispatch = useDispatch();

  const { user: mainUser } = useSelector(selectAuth);
  const {
    state: { chatSocketState },
  } = useContext(ConversationCascadeStateContext);

  const { register, handleSubmit, watch, reset } = useForm<MessageForm>({
    resolver: zodResolver(messageFormZod),
  });

  const watchMessage = watch('message', '');

  const onSubmit: SubmitHandler<MessageForm> = (data) => {
    const { message } = data;
    if (!message) return;

    dispatch(
      chatSocketActions.socket.sendMessage({
        conversationId: chatSocketState.id,
        content: message,
        userId: mainUser.id,
      }),
    );
    reset({ message: '' });
  };

  const autoGrow = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const element = e.target;
    element.style.height = `12px`;
    element.style.height = `${element.scrollHeight}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Enter') return;
    handleSubmit(onSubmit)();
    e.preventDefault();
    e.stopPropagation();
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
          <form id="message-form" onSubmit={handleSubmit(onSubmit)}>
            <textarea
              autoFocus
              maxLength={Constants.MAX_MESSAGE_LENGTH}
              placeholder={Constants.Contents.MESSAGING_PLACEHOLDER}
              className={styles.composeEditorInput}
              onInput={autoGrow}
              onKeyDown={handleKeyDown}
              {...register('message')}
            />
          </form>
        </div>

        <Button
          disableBaseStyles
          disabled={!watchMessage}
          form="message-form"
          className={styles.composeSend}
        >
          <PaperPlaneRightIcon />
        </Button>
      </div>
    </div>
  );
}

export default DirectMessages;
