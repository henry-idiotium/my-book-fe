import { useAxios } from '@/hooks';

export function useCreatePairOrGroupConvo(userIds: number[]) {
  const [{ loading: convoLoading, error: convoError }, createConvos] =
    useAxios(`/conversations/to/`);
}
