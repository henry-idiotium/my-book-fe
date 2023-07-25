import * as Icon from '@phosphor-icons/react';

import { classnames } from '@/utils';

type LoadingProps = {
  className?: string;
};

/** Loading animated icon. */
export function Loading({ className }: LoadingProps) {
  return (
    <Icon.CircleNotch
      className={classnames('animate-spin text-accent', className)}
      weight="bold"
      size={20}
    />
  );
}

export default Loading;
