import * as PopoverPrimitive from '@radix-ui/react-popover';
import { forwardRef } from 'react';

import { classnames } from '@/utils';

import styles from './popover.module.scss';

type PopoverContentProps = PopoverPrimitive.PopperContentProps &
  React.PropsWithChildren & {
    usePadding?: boolean;
    disableBaseStyles?: boolean;
  };

const Content = forwardRef<HTMLDivElement, PopoverContentProps>(
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
  },
);

export const Popover = Object.assign(PopoverPrimitive.Root, {
  Content,
  Trigger: PopoverPrimitive.Trigger,
});
export default Popover;
