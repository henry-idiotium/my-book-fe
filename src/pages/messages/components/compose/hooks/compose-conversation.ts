import { useCallback, useEffect, useState } from 'react';

import { useAxios } from '@/hooks';

import { CreateConversationDto as Dto } from '../types';

export function useComposeConversation() {
  const [createConversationId, setCreateConversationId] = useState<string>();

  const [paredRes, createPair] = useAxios<Dto.Paired.Response>('/paired-conversations', {
    manual: true,
  });

  const [groupRes, createGroup] = useAxios<Dto.Group.Response, Dto.Group.Request>(
    '/group-conversations',
    { manual: true },
  );

  // Redirect to the newly created conversation when the
  // API request completes successfully.
  useEffect(() => {
    const { id: pairedId } = paredRes.data ?? {};
    const { id: groupId } = groupRes.data ?? {};
    const convoId = pairedId ?? groupId;
    setCreateConversationId(convoId);
  }, [paredRes.data, groupRes.data]);

  /** Create a conversation, either a group or pair chat. */
  const composeConversation = useCallback(({ type, payload }: CreateConvoArgs) => {
    const createConversation = type === 'pair' ? createPair : createGroup;
    return createConversation(
      type === 'pair'
        ? { method: 'get', url: `/to/${payload.interlocutorId}` }
        : { method: 'post', data: payload },
    );
  }, []);

  return [createConversationId, composeConversation] as const;
}

export default useComposeConversation;

// Define the arguments for the composeConversation function.
type CreateConvoArgs =
  | { type: 'group'; payload: Dto.Group.Request }
  | { type: 'pair'; payload: { interlocutorId: number } };
