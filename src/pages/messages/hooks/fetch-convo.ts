import { useAxios } from '@/hooks/axios/axios';
import { GroupConversation, PairedConversation } from '@/types';
import { nonNullable } from '@/utils';

export function useFetchChats() {
  const [
    { data: chats = [], loading: chatLoading, error: chatError },
    fetchChats,
  ] = useAxios<PairedConversation[]>(`/paired-conversations`);

  const [
    { data: groupChats = [], loading: groupChatLoading, error: groupChatError },
    fetchGroupChats,
  ] = useAxios<GroupConversation[]>(`/group-conversations`);

  const response = {
    chatEntries: [...chats, ...groupChats],
    chatEntriesLoading: chatLoading || groupChatLoading,
    chatEntriesErrors: [chatError, groupChatError].filter(nonNullable),
  };

  async function refetch() {
    await fetchGroupChats();
    await fetchChats();
  }

  return [response, refetch] as const;
}

export default useFetchChats;
