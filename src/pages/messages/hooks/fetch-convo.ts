import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';

import { ChatboxEntry } from '../components';

import { useAltAxios } from '@/hooks/use-alt-axios';
import { ConversationEntity, ConversationGroupEntity } from '@/types';

type Both<T> = { convo: T; group: T };
type ResponseState = {
  data: ChatboxEntry;
  loadings: Both<boolean>;
  errors: Partial<Both<AxiosError>>;
};

export function useFetchConversations() {
  const [data, setData] = useState<ChatboxEntry[]>([]);
  const [errors, setErrors] = useState<AxiosError[]>([]);
  const [loadings, setLoadings] = useState<boolean>(true);

  // chats between two
  const [pairs, fetchConvos] =
    useAltAxios<ConversationEntity[]>(`/conversations`);

  // chats between multiple, or group
  const [groups, fetchConvoGroups] =
    useAltAxios<ConversationGroupEntity[]>(`/chatboxes`);

  // data
  useEffect(() => {
    // setData([...pairs.data, ...groups.data]);
  }, [[pairs.data, groups.data]]);
  // error
  useEffect(() => {
    if (pairs.error) {
      setErrors((prev) => [...prev, pairs.error]);
    }
    // setErrors([pairs.error, groups.error]);
  }, [[pairs.error, groups.error]]);
  // loading
  useEffect(() => {}, [[pairs.loading, groups.loading]]);

  function refetch() {
    fetchConvos();
    fetchConvoGroups();
  }

  return [response, refetch] as const;
}
