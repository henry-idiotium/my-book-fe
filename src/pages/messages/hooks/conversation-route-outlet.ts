import { useRoutes } from 'react-router-dom';

import { Compose, Conversation, ConversationPlaceholder } from '../components';

export function useConversationRouteOutlet() {
  return useRoutes([
    { path: '', Component: ConversationPlaceholder },
    { path: '/:id', Component: Conversation },
    { path: '/compose', Component: Compose },
  ]);
}

export default useConversationRouteOutlet;
