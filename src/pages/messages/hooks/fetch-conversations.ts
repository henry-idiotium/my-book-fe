import { useCallback } from 'react';

import { useAxios } from '@/hooks/axios/axios';

import { GroupChatEntryResponse, PairedChatEntryResponse } from '../components/chat-entry/types';

export function useFetchConversations() {
  const [{ data: pairedEntries = [], loading: pairedLoading }, fetchPairedEnties] =
    useAxios<PairedChatEntryResponse[]>(`/paired-conversations`);

  const [{ data: groupEntries = [], loading: groupLoading }, fetchGroupEntries] =
    useAxios<GroupChatEntryResponse[]>(`/group-conversations`);

  const refetch = useCallback(async () => {
    await Promise.allSettled([fetchPairedEnties(), fetchGroupEntries()]);
  }, [fetchPairedEnties, fetchGroupEntries]);

  return [
    {
      chatEntries: [...pairedEntries, ...groupEntries],
      chatEntriesLoading: pairedLoading || groupLoading,
    },
    refetch,
  ] as const;
}

export default useFetchConversations;
