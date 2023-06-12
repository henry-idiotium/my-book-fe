import { AxiosError } from 'axios';

import { ChatboxEntry } from '../components';

import { useAltAxios } from '@/hooks/use-alt-axios';
import { ConversationEntity, ConversationGroupEntity } from '@/types';

type Result = [
  { data: ChatboxEntry[]; loadings: boolean; errors: AxiosError[] },
  () => Promise<void>
];

export function useFetchConversations(): Result {
  // chats between two
  const [
    { data: convoData = [], loading: convoLoading, error: convoError },
    fetchConvos,
  ] = useAltAxios<ConversationEntity[]>(`/conversations`);

  // chats between multiple, or group
  const [
    { data: groupData = [], loading: groupLoading, error: groupError },
    fetchConvoGroups,
  ] = useAltAxios<ConversationGroupEntity[]>(`/chatboxes`);

  const response: Result['0'] = {
    data: [...convoData, ...groupData],
    loadings: convoLoading || groupLoading,
    errors: [convoError, groupError].filter(
      (e): e is AxiosError => e !== undefined
    ),
  };

  async function refetch() {
    await fetchConvos();
    await fetchConvoGroups();
  }

  return [response, refetch];
}
