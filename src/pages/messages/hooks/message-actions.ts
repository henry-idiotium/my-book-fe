import loadingMessages from '@/components/loading-screen/loading-messages';
import { useDispatch } from '@/hooks';
import { chatSocketActions as actions, chatSocketMap } from '@/stores';
import { chatSocketEvents as events } from '@/types';

export function useMessageActions(id: string) {
  const dispatch = useDispatch();

  return {
    sendMessage() {
      const socket = chatSocketMap.get(id);
      if (!socket?.connected) return;

      const index = Math.floor(Math.random() * loadingMessages.length);
      const content = loadingMessages[index];

      socket.emit(events.messageSent.name, {
        chatboxId: id,
        isGroup: false,
        content,
      });

      dispatch(actions.messagePending({ conversationId: id, content }));
    },

    updateMessage(messageId: string, content: string) {
      const socket = chatSocketMap.get(id);
      if (!socket?.connected) return;

      socket.emit(events.messageUpdating.name, {
        content: content + 'edited',
        id,
        chatboxId: id,
        isGroup: false,
      });

      dispatch(
        actions.messageUpdated({
          conversationId: id,
          content: content + 'edited',
          id: messageId,
        })
      );
    },

    deleteMessage(messageId: string) {
      const socket = chatSocketMap.get(id);
      if (!socket?.connected) return;

      socket.emit(events.messageDeleting.name, {
        id: messageId,
        chatboxId: id,
        isGroup: false,
      });
    },
  };
}
