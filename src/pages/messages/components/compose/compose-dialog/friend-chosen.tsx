// import { X as XIcon } from '@phosphor-icons/react';
import { VscChromeClose } from 'react-icons/vsc';

import UserImg from '@/assets/account-image.jpg';
import { Button } from '@/components';
import { MinimalUserEntity } from '@/types';

type FriendChosenProps = React.ButtonHTMLAttributes<unknown> & {
  friendInfo: MinimalUserEntity;
};

export function FriendChosen(_props: FriendChosenProps) {
  const { friendInfo: friend, ...props } = _props;

  return (
    <Button
      {...props}
      disableRipple
      disableBaseStyles
      className={`flex shrink-0 items-center
        rounded-full border border-color
        bg-base p-1 hover:bg-base-hover`}
    >
      <div className="shrink-0 wh-6">
        <img
          src={friend.photo ?? UserImg}
          alt={`${friend.alias} profile`}
          className="rounded-full wh-full"
        />
      </div>

      <div className="h-full shrink-0 px-2 font-semibold tracking-wide">
        <span>{friend.firstName + ' ' + friend.lastName}</span>
      </div>

      <div className="flex h-full items-center justify-center pl-1 pr-2">
        <VscChromeClose className="stroke-[.4] text-accent wh-4" />
      </div>
    </Button>
  );
}

export default FriendChosen;
