import { Check as CheckIcon } from '@phosphor-icons/react';

import UserImg from '@/assets/account-image.jpg';
import { Button } from '@/components';
import { MinimalUserEntity } from '@/types';

type FriendOptionProps = React.ButtonHTMLAttributes<unknown> & {
  friendInfo: MinimalUserEntity;
  chosen?: boolean;
};

export function FriendOption(_props: FriendOptionProps) {
  const { friendInfo: friend, chosen, ...props } = _props;
  return (
    <Button
      {...props}
      disableRipple
      disableBaseStyles
      className="flex w-full px-4 py-3 duration-300 hover:bg-base-hover"
    >
      <div className="shrink-0 overflow-hidden rounded-full wh-10">
        <img
          src={friend.photo ?? UserImg}
          alt={`${friend.alias} profile`}
          className="wh-full"
        />
      </div>

      <div className="flex w-full flex-col items-start px-3">
        <div className="text-base font-semibold leading-4">
          <span>{friend.firstName + ' ' + friend.lastName}</span>
        </div>

        <div className="text-color-accent">
          <span>@{friend.alias}</span>
        </div>
      </div>

      <div className="w-auto max-w-8 px-3 pt-1 text-accent">
        {chosen ? <CheckIcon /> : undefined}
      </div>
    </Button>
  );
}

export default FriendOption;
