import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { forwardRef } from 'react';

import { classnames } from '@/utils';

type ContentProps = AlertDialogPrimitive.DialogContentProps;
const Content = forwardRef<HTMLDivElement, ContentProps>((props, forwardedRef) => (
  <AlertDialogPrimitive.Portal>
    <AlertDialogPrimitive.Overlay className="fixed inset-0 bg-overlay/40" />
    <AlertDialogPrimitive.Content
      {...props}
      ref={forwardedRef}
      className={classnames(
        'fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-base bg-base p-7 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none',
        props.className,
      )}
    />
  </AlertDialogPrimitive.Portal>
));

type TitleProps = AlertDialogPrimitive.DialogTitleProps;
const Title = forwardRef<HTMLDivElement, TitleProps>((props, forwardedRef) => (
  <AlertDialogPrimitive.Title
    {...props}
    ref={forwardedRef}
    className={classnames('py-1 text-xl font-semibold', props.className)}
  />
));

type DescriptionProps = AlertDialogPrimitive.DialogDescriptionProps;
const Description = forwardRef<HTMLDivElement, DescriptionProps>((props, forwardedRef) => (
  <AlertDialogPrimitive.Description
    {...props}
    ref={forwardedRef}
    className={classnames('py-1 text-color-accent', props.className)}
  />
));

type TriggerProps = AlertDialogPrimitive.DialogTriggerProps;
const Trigger = forwardRef<HTMLButtonElement, TriggerProps>((props, forwardedRef) => (
  <AlertDialogPrimitive.Trigger
    {...props}
    ref={forwardedRef}
    className={classnames('py-1', props.className)}
  />
));

export const AlertDialog = Object.assign(AlertDialogPrimitive.Root, {
  Cancel: AlertDialogPrimitive.Cancel,
  Action: AlertDialogPrimitive.Action,
  Trigger,
  Description,
  Content,
  Title,
});

AlertDialog.displayName = 'AlertDialog';
AlertDialog.Trigger.displayName = 'AlertDialog.Trigger';
AlertDialog.Title.displayName = 'AlertDialog.Title';
AlertDialog.Content.displayName = 'AlertDialog.Content';
AlertDialog.Description.displayName = 'AlertDialog.Description';
AlertDialog.Cancel.displayName = 'AlertDialog.Cancel';
AlertDialog.Action.displayName = 'AlertDialog.Action';

export default AlertDialog;
