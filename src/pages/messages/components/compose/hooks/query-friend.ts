import { useEffect, useState } from 'react';
import { z } from 'zod';

import { useBoolean, useDebounce, useEffectOnce, useUpdateEffect, useAxios } from '@/hooks';
import { MinimalUserEntity } from '@/types';
import { getZodDefault } from '@/utils';

const SEARCH_FETCH_DELAY = 400;

const friendRequestParamZod = z.object({
  skip: z.number().default(0),
  take: z.number().default(7),
  search: z.string(),
});
const initialParam = getZodDefault(friendRequestParamZod);

export function useQueryFriend() {
  const nextable = useBoolean(true);

  const [params, setParams] = useState(initialParam);
  const debouncedQuery = useDebounce(params.search, SEARCH_FETCH_DELAY);
  const [prevQuery, setPrevQuery] = useState(initialParam.search);

  const [currentFriends, setCurrentFriends] = useState<MinimalUserEntity[]>([]);

  const [{ data: friendsData = [], loading: friendLoading }, fetchFriends] = useAxios<
    MinimalUserEntity[]
  >({ method: 'get', url: '/friends' }, { manual: true });

  useEffectOnce(() => void fetchFriends({ params }));
  useEffect(() => void fetchFriends({ params }), [debouncedQuery, params.skip, params.take]);

  useUpdateEffect(() => {
    if (friendLoading) return;

    nextable.setValue(friendsData.length >= initialParam.take);

    setCurrentFriends((prev) =>
      prevQuery !== params.search ? friendsData : [...prev, ...friendsData],
    );
  }, [friendsData, friendLoading]);

  function setQuery(value: string) {
    setParams((prev) => {
      setPrevQuery(prev.search);
      return { ...initialParam, search: value };
    });
  }

  function nextRange() {
    if (!nextable.value) return;

    setParams((prev) => {
      setPrevQuery(prev.search);

      const skip = currentFriends.length;
      const take = prev.take + Math.floor(prev.take * 1.6);

      return { ...prev, skip, take };
    });
  }

  return [
    {
      currentFriends,
      loadingCurrentFriends: friendLoading,
      moreFriendsLoadable: nextable.value,
    },
    { nextRange, setQuery },
  ] as const;
}

export default useQueryFriend;
