import { PropsWithChildren } from 'react';

import { useSelector } from '@/hooks';
import { selectAuth } from '@/stores';

export interface WrapperComponentProps extends PropsWithChildren {
  render: 'public-only' | 'private-only';
}

// Todo: refac to use hook instead, maybe the same as the RouteGuard
export function WrapperComponent(props: WrapperComponentProps) {
  const { token } = useSelector(selectAuth);
  if (props.render === 'public-only') {
    if (token) return null;
  } else {
    if (!token) return null;
  }

  return props.children;
}

export default WrapperComponent;
