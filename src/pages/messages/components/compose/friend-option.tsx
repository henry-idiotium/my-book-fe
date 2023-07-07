import { Check as CheckIcon } from '@phosphor-icons/react';

import UserImg from '@/assets/account-image.jpg';
import { Button } from '@/components';
import { MinimalUserEntity } from '@/types';
import { User } from '@/utils';

type FriendOptionProps = React.ButtonHTMLAttributes<unknown> & {
  friend: MinimalUserEntity;
  chosen?: boolean;
};

export function FriendOption(_props: FriendOptionProps) {
  const { friend, chosen, ...props } = _props;
  return (
    <Button
      {...props}
      disableRipple
      disableBaseStyles
      className="flex w-full px-4 py-3 duration-300 hover:bg-base-hover"
    >
      <div className="shrink-0 overflow-hidden rounded-full wh-11">
        <img
          src={friend.photo ?? UserImg}
          alt={`${friend.alias} profile`}
          className="wh-full"
        />
      </div>

      <div className="flex w-full flex-col items-start px-3">
        <div className="text-base font-semibold leading-5">
          <span>{User.getFullName(friend)}</span>
        </div>

        <div className="text-sm tracking-wide text-color-accent">
          <span>{User.getAlias(friend)}</span>
        </div>
      </div>

      {chosen ? (
        <div className="w-auto max-w-8 px-3 pt-1 text-accent">
          <CheckIcon />
        </div>
      ) : null}
    </Button>
  );
}

export default FriendOption;
