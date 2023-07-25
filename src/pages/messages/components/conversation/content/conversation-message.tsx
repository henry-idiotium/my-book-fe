import {
  CopySimple,
  DotsThree,
  Heart,
  ShareFat,
  Trash,
  type Icon as IconType,
} from '@phosphor-icons/react';
import { useCallback, useMemo } from 'react';

import { AlertDialog, Button, Popover, Toast } from '@/components';
import { useBoolean, useDispatch } from '@/hooks';
import { chatSocketActions as actions } from '@/stores';
import { MessageEntity, MinimalUserEntity } from '@/types';
import { classnames, formatTimeReadable } from '@/utils';

import styles from './conversation-message.module.scss';

export type ConversationMessageProps = {
  message: MessageEntity;
  conversationId: string;
  isFromSessionUser?: boolean;
  owner: MinimalUserEntity;
  isSeen?: boolean;
  showSeenStatus?: boolean;
  active?: boolean;
  isEndOfChain?: boolean;
  isFinalMessageFromSessionUser?: boolean;
};

// todo: add loading message state

export function ConversationMessage(props: ConversationMessageProps) {
  const {
    conversationId,
    message,
    owner,
    isFromSessionUser,
    active,
    isSeen,
    showSeenStatus,
    isEndOfChain,
  } = props;

  const displayContent = useMemo(() => {
    // if content is deleted
    if (!message.content) {
      const personRefer = isFromSessionUser ? 'You' : owner.firstName;
      return `${personRefer} unsent a message`;
    }

    return message.content;
  }, [message.content]);

  const showMeta = useMemo(
    () => !!message.content && (isEndOfChain || active || isSeen),
    [!message.content, active],
  );

  const meta = useMemo(() => {
    let str = formatTimeReadable(message.at);

    if (showSeenStatus || active) {
      str += ' · ' + (isSeen ? 'Seen' : 'Sent');
    }

    return str;
  }, [isSeen, message.at]);

  return (
    <div className={styles.container}>
      <div className={classnames('flex flex-col', isFromSessionUser ? 'items-end' : '')}>
        <div
          className={classnames(
            'flex items-center justify-end gap-3',
            isFromSessionUser ? 'ml-4' : 'mr-4 flex-row-reverse',
          )}
        >
          {/* --- Actions --- */}
          {message.content ? (
            <div className={styles.option}>
              <div
                className={classnames(
                  'flex gap-4 text-color-accent',
                  isFromSessionUser ? '' : 'flex-row-reverse',
                )}
              >
                {/* ------ emojis ------ */}
                <button className={styles.emoji}>
                  <Heart size={18} weight="bold" />
                </button>

                {/* ------ actions ------ */}
                <MessageActionPopover
                  message={message}
                  conversationId={conversationId}
                  isFromSessionUser={!!isFromSessionUser}
                >
                  <button className={styles.action}>
                    <DotsThree size={20} weight="bold" />
                  </button>
                </MessageActionPopover>
              </div>
            </div>
          ) : null}

          {/* --- Content --- */}
          <div
            className={classnames(
              'flex w-fit max-w-[400px] items-center break-all rounded-3xl px-4 py-3',
              { [isFromSessionUser ? 'rounded-br-md' : 'rounded-bl-md']: isEndOfChain },
              message.content
                ? isFromSessionUser
                  ? 'bg-accent'
                  : 'bg-base-hover'
                : 'border border-color-accent bg-base',
            )}
          >
            <div
              className={classnames(
                'font-sans leading-5',
                isFromSessionUser ? 'text-white' : 'text-color',
              )}
            >
              <span
                className={classnames({
                  'text-color-accent': !message.content,
                })}
              >
                {displayContent}
              </span>
            </div>
          </div>
        </div>

        {/* --- Meta --- */}
        {showMeta ? (
          <div className="pt-1">
            <div className="text-xs leading-4 text-color-accent">
              <span>{meta}</span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

type MessageActionPopoverProps = React.PropsWithChildren & {
  message: MessageEntity;
  conversationId: string;
  isFromSessionUser: boolean;
};

function MessageActionPopover(props: MessageActionPopoverProps) {
  const { children, message, conversationId, isFromSessionUser } = props;

  const dispatch = useDispatch();

  const opened = useBoolean(false);
  const deleteConfirmationOpened = useBoolean(false);
  const notifyOpened = useBoolean(false);

  // todo: implement reply
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const reply = () => {};

  const openDeleteConfirmation = () => deleteConfirmationOpened.setTrue();

  const deleteForEveryone = useCallback(() => {
    return dispatch(actions.socket.deleteMessage({ conversationId, id: message.id }));
  }, [message.id]);

  const copyContent = useCallback(() => {
    if (message.content) navigator.clipboard.writeText(message.content);
    opened.setFalse();
  }, [message.content]);

  type MessageAction = [string, IconType, () => void];
  const messageActions = useMemo<MessageAction[]>(() => {
    const schema: MessageAction[] = [
      ['Reply', ShareFat, reply],
      ['Copy Message', CopySimple, copyContent],
    ];

    if (isFromSessionUser) schema.push(['Delete Message', Trash, openDeleteConfirmation]);

    return schema;
  }, [reply, copyContent, openDeleteConfirmation]);

  return (
    <Toast.Provider swipeThreshold={1}>
      <div className="">
        <Popover open={opened.value} onOpenChange={opened.setValue}>
          <Popover.Trigger asChild>{children}</Popover.Trigger>

          <Popover.Content className="flex flex-col overflow-hidden">
            {messageActions.map(([name, Icon, action]) => (
              <Button
                key={name}
                disableBaseStyles
                className="flex h-11 items-center gap-3 px-4 hover:bg-base-hover"
                onClick={action}
              >
                <Icon weight="bold" size={18} />
                <span className="font-semibold">{name}</span>
              </Button>
            ))}
          </Popover.Content>
        </Popover>

        <AlertDialog
          open={deleteConfirmationOpened.value}
          onOpenChange={deleteConfirmationOpened.setValue}
        >
          <AlertDialog.Content className="w-[320px] gap-4">
            <AlertDialog.Title>Delete Message?</AlertDialog.Title>

            <AlertDialog.Description className="pb-4">
              This message will be deleted for everyone.
            </AlertDialog.Description>

            <AlertDialog.Action asChild>
              <Button
                disableBaseStyles
                className="my-[6px] h-11 w-full rounded-full bg-red-600 font-semibold hover:bg-red-600/90"
                onClick={deleteForEveryone}
              >
                Delete
              </Button>
            </AlertDialog.Action>

            <AlertDialog.Cancel asChild>
              <Button
                disableBaseStyles
                className="my-[6px] h-11 w-full rounded-full border border-color font-semibold hover:bg-base-hover"
              >
                Cancel
              </Button>
            </AlertDialog.Cancel>
          </AlertDialog.Content>
        </AlertDialog>

        <Toast open={notifyOpened.value} onOpenChange={notifyOpened.setValue}>
          <span className="text-color">Message copied</span>
        </Toast>
      </div>

      <Toast.Viewport offset={42} />
    </Toast.Provider>
  );
}
