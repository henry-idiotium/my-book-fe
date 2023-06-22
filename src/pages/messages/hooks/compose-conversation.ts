import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { CreateChat } from '../types';

import { useAxios } from '@/hooks';

export function useComposeConversation() {
  const navigate = useNavigate();

  const [chatRes, chatQuery] = useAxios<CreateChat.Pair.Response>(
    '/conversations',
    { manual: true }
  );

  const [groupChatRes, groupChatQuery] = useAxios<
    CreateChat.Group.Response,
    CreateChat.Group.Request
  >('/chatboxes', { manual: true });

  // Redirect to the newly created conversation when the
  // API request completes successfully.
  useEffect(() => {
    const { id: chatId } = chatRes.data ?? {};
    const { id: groupChatId } = groupChatRes.data ?? {};
    const convoId = chatId ?? groupChatId;

    if (convoId) navigate(`/messages/${convoId}`);
  }, [chatRes.data, groupChatRes.data]);

  /** Create a conversation, either a group or pair chat. */
  async function composeConversation({ type, payload }: CreateConvoArgs) {
    switch (type) {
      case 'group': {
        await groupChatQuery({
          method: 'post',
          data: payload,
        });
        break;
      }
      case 'pair': {
        await chatQuery({
          method: 'get',
          url: `/to/${payload.interlocutorId}`,
        });
        break;
      }
      default:
        break;
    }
  }

  return composeConversation;
}

export default useComposeConversation;

// Define the arguments for the composeConversation function.
export type CreateConvoArgs =
  | { type: 'group'; payload: CreateChat.Group.Request }
  | { type: 'pair'; payload: { interlocutorId: number } };
