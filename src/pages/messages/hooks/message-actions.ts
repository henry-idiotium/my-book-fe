import loadingMessages from '@/components/loading-screen/loading-messages';
import { useDispatch } from '@/hooks';
import { chatSocketActions as actions, ChatSocketMap } from '@/stores';
import { ChatSocketEmitter as Emitter, messageZod } from '@/types';
import { getZodDefault } from '@/utils';

const initialMessage = getZodDefault(messageZod);

export function useMessageActions(id: string) {
  const dispatch = useDispatch();

  return {
    sendMessage() {
      const socket = ChatSocketMap.store.get(id);
      if (!socket?.connected) return;

      const index = Math.floor(Math.random() * loadingMessages.length);
      const content = loadingMessages[index];

      const createAt = new Date(); // identifier for pending state

      socket.emit(Emitter.Message.Events.SEND, { content, at: createAt });

      dispatch(
        actions.pendMessage({ conversationId: id, content, at: createAt })
      );
    },

    updateMessage(messageId: string, content: string) {
      const socket = ChatSocketMap.store.get(id);
      if (!socket?.connected) return;

      socket.emit(Emitter.Message.Events.UPDATE, { id, content });
      dispatch(
        actions.updateMessage({
          ...initialMessage,
          conversationId: id,
          id: messageId,
          content,
          isEdited: true,
        })
      );
    },

    deleteMessage(messageId: string) {
      const socket = ChatSocketMap.store.get(id);
      if (!socket?.connected) return;

      socket.emit(Emitter.Message.Events.DELETE, { id: messageId });
    },
  };
}
