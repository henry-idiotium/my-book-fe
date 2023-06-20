import * as DialogPrimitive from '@radix-ui/react-dialog';
import { forwardRef } from 'react';

import styles from './dialog.module.scss';

import { classnames } from '@/utils';

export type DialogProps = React.PropsWithChildren &
  Omit<React.HTMLAttributes<unknown>, 'className'> & {
    disablePadding?: boolean;
    classNames?: {
      container?: string;
      overlay?: string;
      content?: string;
    };
  };

export const DialogContent = forwardRef<HTMLDivElement, DialogProps>(
  (_props, forwardedRef) => {
    const { children, classNames, disablePadding, ...props } = _props;

    const portalClassnames = classnames(
      styles.container,
      classNames?.container
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
  }
);

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogTitle = DialogPrimitive.Title;
// export const DialogDescription = DialogPrimitive.Description;
