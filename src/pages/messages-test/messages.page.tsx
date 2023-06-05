import { useEffect } from 'react';

import ChatBox from '@/components/chat-box';
import { chatboxEndpoints } from '@/types';

export function MessagesTest() {
  useEffect(() => {
    chatboxEndpoints.getChatboxes({});
  }, []);

  return (
    <div className="">
      <ChatBox />
    </div>
  );
}

export default MessagesTest;
