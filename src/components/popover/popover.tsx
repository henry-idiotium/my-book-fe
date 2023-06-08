import {
  Popover as MTPopover,
  PopoverHandler as MTPopoverHandler,
  PopoverContent as MTPopoverContent,
  PopoverProps as MTPopoverProps,
} from '@material-tailwind/react';

import { classes } from '@/utils';

export interface PopoverProps extends Omit<MTPopoverProps, 'children'> {
  children: React.ReactNode;
  trigger: React.ReactNode;
  className?: string;
}

export function Popover({
  children,
  trigger,
  className,
  ...rest
}: PopoverProps) {
  return (
    <MTPopover {...rest}>
      <MTPopoverHandler>{trigger}</MTPopoverHandler>
      <MTPopoverContent
        className={classes(
          'shadow-color-base p-0 shadow-[0_0_5px_rgba(0,0,0,.3)]',
          className
        )}
      >
        {children}
      </MTPopoverContent>
    </MTPopover>
  );
}

export default Popover;
