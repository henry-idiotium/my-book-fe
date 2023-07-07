import * as DialogPrimitive from '@radix-ui/react-dialog';
import { forwardRef } from 'react';

import { classnames } from '@/utils';

import styles from './dialog.module.scss';

type ContentProps = React.PropsWithChildren &
  Omit<React.HTMLAttributes<unknown>, 'className'> & {
    disablePadding?: boolean;
    classNames?: {
      container?: string;
      overlay?: string;
      content?: string;
    };
  };

const Content = forwardRef<HTMLDivElement, ContentProps>(
  (_props, forwardedRef) => {
    const { children, classNames, disablePadding, ...props } = _props;

    const portalClassnames = classnames(
      styles.container,
      classNames?.container,
    );
    const overlayClassnames = classnames(styles.overlay, classNames?.overlay);
    const contentClassnames = classnames(styles.content, classNames?.content, {
      [styles.contentPadding]: !disablePadding,
    });

    return (
      <DialogPrimitive.Portal className={portalClassnames}>
        <DialogPrimitive.Overlay className={overlayClassnames}>
          <DialogPrimitive.Content
            {...props}
            ref={forwardedRef}
            className={contentClassnames}
          >
            {children}
          </DialogPrimitive.Content>
        </DialogPrimitive.Overlay>
      </DialogPrimitive.Portal>
    );
  },
);

export const Dialog = Object.assign(DialogPrimitive.Root, {
  Trigger: DialogPrimitive.Trigger,
  // Description: DialogPrimitive.Description,
  Title: DialogPrimitive.Title,
  Content,
});
