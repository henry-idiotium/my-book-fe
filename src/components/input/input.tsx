import styles from './input.module.scss';

import { classes } from '@/utils';

export interface InputProps {
  id?: string;
  label?: string;
  type?: string;
  placeholder?: string;
  startIcon?: JSX.Element;
  endIcon?: JSX.Element;
  containerClass?: string;
  wrapperClass?: string;
  inputClass?: string;
  labelClass?: string;
}

export function Input({ type = 'text', ...props }: InputProps) {
  return (
    <div className={props.containerClass ?? styles.container}>
      <div className={props.wrapperClass ?? styles.wrapper}>
        {props.label ? (
          <label
            htmlFor={props.id}
            className={props.labelClass ?? styles.label}
          >
            {props.label}
          </label>
        ) : undefined}

        {props.startIcon}

        <input
          type={type}
          id={props.label ? props.id : undefined}
          placeholder={props.placeholder}
          className={props.inputClass ?? styles.input}
        />

        {props.endIcon}
      </div>
    </div>
  );
}

export default Input;
