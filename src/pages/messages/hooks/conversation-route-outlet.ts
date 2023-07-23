import { useRoutes } from 'react-router-dom';

import { Compose, Conversation, ConversationPlaceholder } from '../components';

export function useConversationRouteOutlet() {
  return useRoutes([
    { path: '', Component: ConversationPlaceholder },
    { path: 'compose', Component: Compose },
    { path: ':id', Component: Conversation },
  ]);
}

export default useConversationRouteOutlet;
