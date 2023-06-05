// import ChatBox from '@/components/chat-box';
import { axiosClient, useAxiosWithAuth } from '@/hooks/use-axios';
import { ChatboxEntity } from '@/types';

export function MessagesTest() {
  const [isLoading, { response, error }] = useAxiosWithAuth<ChatboxEntity[]>(
    axiosClient.get,
    '/chatboxes'
  );

  return (
    <div className="">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {response?.data[0].name}
          {error?.response?.status}
        </>
      )}
    </div>
  );
}

export default MessagesTest;
