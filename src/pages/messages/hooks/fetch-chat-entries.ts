import { useCallback, useMemo } from 'react';

import { useSelector } from '@/hooks';
import { useAxios } from '@/hooks/use-axios';
import { selectAuth } from '@/stores';
import { Convo } from '@/utils';

import {
  ChatEntryResponse,
  GroupChatEntryResponse,
  PairedChatEntryResponse,
} from '../components/chat-entry/types';

export function useFetchChatEntries() {
  const { user: sessionUser } = useSelector(selectAuth);

  const [
    { data: pairedEntries = [], loading: pairedLoading, error: pairedError },
    fetchPairedEnties,
  ] = useAxios<PairedChatEntryResponse[]>(`/paired-conversations`);

  const [{ data: groupEntries = [], loading: groupLoading, error: groupError }, fetchGroupEntries] =
    useAxios<GroupChatEntryResponse[]>(`/group-conversations`);

  const refetch = useCallback(async () => {
    await Promise.allSettled([fetchPairedEnties(), fetchGroupEntries()]);
  }, [fetchPairedEnties, fetchGroupEntries]);

  const loading = useMemo(() => pairedLoading || groupLoading, [pairedLoading, groupLoading]);

  const error = useMemo(
    () => ({ paired: pairedError, group: groupError }),
    [pairedError, groupError],
  );

  const entries = useMemo<ChatEntryResponse[]>(() => {
    const entries = [...pairedEntries, ...groupEntries];

    const filteredEntries = entries.map<ChatEntryResponse>((entry) => {
      const filteredParticipants = entry.participants.filter((pt) => pt.id !== sessionUser.id);
      const name = filteredParticipants.length
        ? Convo.getName({ ...entry, participants: filteredParticipants })
        : '[chat name]';

      return { ...entry, participants: filteredParticipants, name };
    });

    return filteredEntries;
  }, [pairedEntries, groupEntries]);

  return [{ entries, loading, error }, refetch] as const;
}

export default useFetchChatEntries;
