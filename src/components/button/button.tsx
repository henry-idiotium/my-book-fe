import { forwardRef } from 'react';

import styles from './button.module.scss';

import { useSelector } from '@/hooks';
import { selectThemeIsDark } from '@/stores';
import { Ripple, classnames } from '@/utils';

export type ButtonProps = React.PropsWithChildren &
  React.ButtonHTMLAttributes<unknown> & {
    disableRipple?: boolean;
    disableBaseStyles?: boolean;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (_props, ref) => {
    const { children, disableRipple, disableBaseStyles, ...props } = _props;

    const isDark = useSelector(selectThemeIsDark);

    const rippleEffect = !disableRipple ? new Ripple() : undefined;

    function handleMouseDown(e: React.MouseEvent) {
      const onMouseDown = props?.onMouseDown;

      if (!disableRipple && rippleEffect) {
        const mode = isDark ? 'light' : 'dark';
        rippleEffect?.create(e, mode);
      }
      if (onMouseDown) onMouseDown(e);
    }

    return (
      <button
        {...props}
        ref={ref}
        type={props.type ?? 'button'}
        className={classnames(styles.required, props.className, {
          [styles.base]: !disableBaseStyles,
        })}
        onMouseDown={handleMouseDown}
      >
        {children}
      </button>
    );
  }
);

export default Button;
