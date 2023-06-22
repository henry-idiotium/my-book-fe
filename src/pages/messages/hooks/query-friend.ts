import { useEffect, useState } from 'react';
import { useBoolean, useDebounce, useUpdateEffect } from 'usehooks-ts';
import { z } from 'zod';

import { useAxios } from '@/hooks';
import { MinimalUserEntity } from '@/types';
import { getZodDefault } from '@/utils';

const SEARCH_FETCH_DELAY = 400;
const INIT_SKIP = 0;
const TAKE = 2;

const friendRequestParamZod = z.object({
  skip: z.number().default(INIT_SKIP),
  take: z.number().default(TAKE),
  search: z.string(),
});
const initialParam = getZodDefault(friendRequestParamZod);

export function useQueryFriend() {
  const nextable = useBoolean(false);
  const [params, setParams] = useState(initialParam);
  const debouncedQuery = useDebounce(params.search, SEARCH_FETCH_DELAY);

  const loadingCurrentFriends = useBoolean(true);
  const [currentFriends, setCurrentFriends] = useState<MinimalUserEntity[]>([]);

  const [{ data: friendsData = [] }, friendRequest] = useAxios<
    MinimalUserEntity[]
  >({ method: 'get', url: '/friends', params });

  useEffect(() => {
    friendRequest({ params });
  }, [debouncedQuery, params.skip, params.take]);

  useUpdateEffect(() => {
    nextable.setValue(friendsData.length >= TAKE);

    setCurrentFriends(
      params.skip !== INIT_SKIP
        ? [...currentFriends, ...friendsData]
        : friendsData
    );
  }, [friendsData]);

  useUpdateEffect(() => {
    loadingCurrentFriends.setValue(!currentFriends.length);
  }, [currentFriends]);

  function setQuery(value: string) {
    setParams({
      skip: INIT_SKIP,
      take: TAKE,
      search: value,
    });
  }

  function nextRange() {
    if (!nextable.value) return;
    const skip = params.skip + params.take;
    setParams({ ...params, skip });
  }

  const state = {
    currentFriends,
    loadingCurrentFriends: loadingCurrentFriends.value,
    moreFriendsLoadable: nextable.value,
  };
  const actions = {
    nextRange,
    setQuery,
  };

  return [state, actions] as const;
}

export default useQueryFriend;
