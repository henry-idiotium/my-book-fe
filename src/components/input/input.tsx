import styles from './input.module.scss';

import { classes } from '@/utils';

export interface InputProps {
  id?: string;
  label?: string;
  type?: string;
  placeholder?: string;
  startIcon?: JSX.Element;
  endIcon?: JSX.Element;
  containerClassName?: string;
  wrapperClassName?: string;
  inputClassName?: string;
}

export function Input({ type = 'text', ...props }: InputProps) {
  return (
    <div className={classes(styles.container, props.containerClassName)}>
      <div className={classes(styles.wrapper, props.wrapperClassName)}>
        {props.label ? (
          <label htmlFor={props.id} className={styles.label}>
            {props.label}
          </label>
        ) : undefined}

        {props.startIcon}

        <input
          type={type}
          id={props.label ? props.id : undefined}
          placeholder={props.placeholder}
          className={classes(styles.input, props.inputClassName)}
        />

        {props.endIcon}
      </div>
    </div>
  );
}

export default Input;
