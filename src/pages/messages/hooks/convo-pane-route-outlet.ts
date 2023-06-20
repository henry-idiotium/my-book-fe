import { useRoutes } from 'react-router-dom';

import { Conversation, ConversationStartup } from '../components';

export function useConvoPaneRouteOutlet() {
  return useRoutes([
    { path: '', Component: ConversationStartup },
    { path: '/:convoId', Component: Conversation },
  ]);
}

export default useConvoPaneRouteOutlet;
