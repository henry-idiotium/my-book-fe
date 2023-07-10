import { useAxios } from '@/hooks/axios/axios';

import {
  GroupConversationResponse,
  PairedConversationResponse,
} from '../types';

export function useFetchConversations() {
  const [{ data: pairedConvo = [], loading: pairedLoading }, fetchPairedConvo] =
    useAxios<PairedConversationResponse[]>(`/paired-conversations`);

  const [{ data: groupConvo = [], loading: groupLoading }, fetchGroupConvo] =
    useAxios<GroupConversationResponse[]>(`/group-conversations`);

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
