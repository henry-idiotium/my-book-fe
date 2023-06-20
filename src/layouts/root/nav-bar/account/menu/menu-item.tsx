import { forwardRef } from 'react';
import { IconType } from 'react-icons';

import { Button } from '@/components';

interface MenuItemProps {
  icon: IconType;
  content: string;
  onClick?: () => void;
}

export const MenuItem = forwardRef<HTMLButtonElement, MenuItemProps>(
  ({ icon: Icon, content, onClick }, ref) => {
    return (
      <Button
        ref={ref}
        disableBaseStyles
        className="w-full rounded-none p-2 text-color outline-2 hover:bg-base-focus"
        onClick={onClick}
      >
        <div className="flex w-fit items-center gap-4 px-3 text-xl">
          <div className="py-1">
            <Icon />
          </div>

          <span className="text-base">{content}</span>
        </div>
      </Button>
    );
  }
);

export default MenuItem;
