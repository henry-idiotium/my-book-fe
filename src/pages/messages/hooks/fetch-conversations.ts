import { useAxios } from '@/hooks/axios/axios';
import { GroupConversation, PairedConversation } from '@/types';

export function useFetchConversations() {
  const [{ data: pairedConvo = [], loading: pairedLoading }, fetchPairedConvo] =
    useAxios<PairedConversation[]>(`/paired-conversations`);

  const [{ data: groupConvo = [], loading: groupLoading }, fetchGroupConvo] =
    useAxios<GroupConversation[]>(`/group-conversations`);

  async function refetch() {
    await fetchPairedConvo();
    await fetchGroupConvo();
  }

  return [
    {
      chatEntries: [...pairedConvo, ...groupConvo],
      chatEntriesLoading: pairedLoading || groupLoading,
    },
    refetch,
  ] as const;
}

export default useFetchConversations;
