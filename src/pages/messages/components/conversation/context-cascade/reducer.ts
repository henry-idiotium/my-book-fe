import { ConversationCascadeState } from './context';

export function cascadeContextReducer(
  state: ConversationCascadeState,
  action: CascadeReducerAction,
): ConversationCascadeState {
  const [type, payload] = action;

  switch (type) {
    case 'set-scroll-to-end': {
      return {
        ...state,
        scrollContentToEnd: payload,
      };
    }
    default: {
      return state;
    }
  }
}

export type CascadeReducerAction = [type: 'set-scroll-to-end', payload: () => void];
