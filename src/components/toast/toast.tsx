import * as ToastPrimitive from '@radix-ui/react-toast';
import { forwardRef, useEffect } from 'react';

import { classnames } from '@/utils';

// todo: organize

type RootProps = ToastPrimitive.ToastProps;
const Root = forwardRef<HTMLLIElement, RootProps>((props, forwardedRef) => (
  <ToastPrimitive.Root
    {...props}
    ref={forwardedRef}
    duration={props.duration ?? 3000}
    className={classnames(
      props.className,
      'flex gap-x-5 rounded-lg bg-base px-[var(--viewport-padding)] py-3 drop-shadow-[rgb(var(--c-text-accent)/.8)_0_0_5px] [--viewport-padding:25px] data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[state=closed]:animate-[swipeOut_100ms_cubic-bezier(1,_.16,_0,_.3)] data-[state=open]:animate-[slideIn_125ms_cubic-bezier(0.16,_1,_.3,_1)] data-[swipe=end]:animate-[swipeOut_100ms_ease-out] data-[swipe=cancel]:transition-[transform_200ms_ease-out]',
    )}
  />
));

type ViewportProps = ToastPrimitive.ToastViewportProps & {
  offset?: number;
};
const Viewport = forwardRef<HTMLOListElement, ViewportProps>((_props, forwardedRef) => {
  const { offset = 0, ...props } = _props;

  useEffect(() => {
    document.documentElement.style.setProperty('--toast-offset', `${offset}px`);
  }, [offset]);

  return (
    <ToastPrimitive.Viewport
      {...props}
      ref={forwardedRef}
      className={classnames(
        props.className,
        'fixed bottom-[--toast-offset] left-1/2 z-[100] flex max-w-[100vw] -translate-x-1/2 -translate-y-1/2 list-none flex-col gap-3 py-2 outline-none',
      )}
    />
  );
});

type ProviderProps = ToastPrimitive.ToastProviderProps;
const Provider = (props: ProviderProps) => (
  <ToastPrimitive.Provider {...props} duration={props.duration ?? 3000} />
);

type CloseProps = ToastPrimitive.ToastCloseProps;
const Close = forwardRef<HTMLButtonElement, CloseProps>((props, forwardedRef) => (
  <ToastPrimitive.Close
    {...props}
    ref={forwardedRef}
    className={classnames(
      props.className,
      'rounded-md border border-color-accent/80 px-2 text-sm text-color-accent transition hover:bg-base-hover',
    )}
  />
));

export const Toast = Object.assign(Root, {
  Description: ToastPrimitive.Description,
  Action: ToastPrimitive.Action,
  Provider,
  Close,
  Viewport,
});
