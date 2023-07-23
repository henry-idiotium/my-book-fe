import { useEffect, useRef } from 'react';

import { useBoolean, useDispatch, useOnClickOutside, useSelector } from '@/hooks';
import { chatSocketActions as actions, chatSocketSelectors, selectAuth } from '@/stores';

type UseSeenConversationReturned = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export function useSeenConversation(conversationId: string): UseSeenConversationReturned {
  const dispatch = useDispatch();

  const { user: sessionUser } = useSelector(selectAuth);

  const socketState = useSelector(chatSocketSelectors.getById(conversationId));

  const isFocused = useBoolean(true);
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, isFocused.setFalse);

  useEffect(() => {
    window.addEventListener('blur', isFocused.setFalse);
    return () => window.removeEventListener('blur', isFocused.setFalse);
  }, []);

  useEffect(() => {
    if (isFocused.value && socketState) {
      dispatch(actions.socket.seenMessage({ conversationId, userId: sessionUser.id }));
    }
  }, [isFocused.value, !!socketState]);

  return {
    ref,
    onClick: isFocused.setTrue,
  };
}
