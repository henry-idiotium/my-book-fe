import {
  Dialog as MTDialog,
  DialogBody as MTDialogBody,
  DialogHeader as MTDialogHeader,
} from '@material-tailwind/react';
import { Fragment } from 'react';

export interface DialogTriggerArgs
  extends Pick<DialogProps, 'open' | 'handleOpen'> {
  toggle: () => void;
}
export interface DialogProps extends React.PropsWithChildren {
  open: boolean;
  handleOpen: React.Dispatch<React.SetStateAction<boolean>>;
  trigger: (args: DialogTriggerArgs) => React.ReactNode;
  header?: string;
}

export function Dialog({
  children,
  header,
  trigger,
  open,
  handleOpen,
}: DialogProps) {
  const toggle = () => handleOpen(!open);

  return (
    <Fragment>
      {trigger({ open, handleOpen, toggle })}

      <MTDialog open={open} handler={handleOpen}>
        {header ? <MTDialogHeader>{header}</MTDialogHeader> : undefined}
        <MTDialogBody>{children}</MTDialogBody>
      </MTDialog>
    </Fragment>
  );
}

export default Dialog;
