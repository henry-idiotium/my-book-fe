import { zodResolver } from '@hookform/resolvers/zod';
import {
  Gif as GifIcon,
  Image as ImageIcon,
  PaperPlaneRight as PaperPlaneRightIcon,
  Smiley as SmileyIcon,
} from '@phosphor-icons/react';
import { useContext, useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useBoolean, useUpdateEffect } from 'usehooks-ts';

import { Button } from '@/components';
import { useDispatch, useSelector } from '@/hooks';
import { chatSocketActions, selectAuth } from '@/stores';

import { ConversationCascadeStateContext } from '../context-cascade';

import * as Constants from './constants';
import styles from './direct-messages.module.scss';
import { MessageForm, messageFormZod } from './types';

export function DirectMessages() {
  const dispatch = useDispatch();

  const triggerScrollToBottom = useBoolean(false);

  const { user: mainUser } = useSelector(selectAuth);
  const [{ chatSocketState, scrollContentToEnd }] = useContext(
    ConversationCascadeStateContext,
  );

  const { register, handleSubmit, watch, setValue } = useForm<MessageForm>({
    resolver: zodResolver(messageFormZod),
  });

  const messageInputRef = useRef<HTMLTextAreaElement | null>(null);
  const { ref: setFormRef, ...formRegister } = register('message');
  const watchMessage = watch('message', '');

  const handleUpdateRef = (element: HTMLTextAreaElement) => {
    setFormRef(element);
    messageInputRef.current = element;
  };

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

    triggerScrollToBottom.setTrue();
    setValue('message', '');
    if (messageInputRef.current) grow(messageInputRef.current);
  };

  useUpdateEffect(() => {
    if (!triggerScrollToBottom.value) return;
    scrollContentToEnd?.();
    triggerScrollToBottom.setFalse();
  }, [triggerScrollToBottom.value]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    grow(e.target);
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
              ref={handleUpdateRef}
              autoFocus
              id="messaging-compose"
              maxLength={Constants.MAX_MESSAGE_LENGTH}
              placeholder={Constants.Contents.MESSAGING_PLACEHOLDER}
              className={styles.composeEditorInput}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              {...formRegister}
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

function grow(element: HTMLTextAreaElement) {
  element.style.height = `12px`;
  element.style.height = `${element.scrollHeight}px`;
}
