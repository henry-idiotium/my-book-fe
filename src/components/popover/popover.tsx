import * as PopoverPrimitive from '@radix-ui/react-popover';
import { forwardRef } from 'react';

import styles from './popover.module.scss';

import { classnames } from '@/utils';

export type PopoverProps = React.PropsWithChildren &
  PopoverPrimitive.PopperContentProps & {
    usePadding?: boolean;
    disableBaseStyles?: boolean;
  };

export const PopoverContent = forwardRef<HTMLDivElement, PopoverProps>(
  (_props, forwardedRef) => {
    const { children, className, usePadding, disableBaseStyles, ...props } =
      _props;

    const contentClassnames = classnames(styles.content, className, {
      [styles.contentPadding]: usePadding,
      [styles.contentBase]: !disableBaseStyles,
    });

    // note: the position of {...props} is important for default values
    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          sideOffset={5}
          {...props}
          ref={forwardedRef}
          className={contentClassnames}
        >
          {children}
          <PopoverPrimitive.Arrow />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    );
  }
);

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
