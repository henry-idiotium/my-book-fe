import * as AvatarPrimitive from '@radix-ui/react-avatar';

import { classnames } from '@/utils';

import styles from './avatar.module.scss';

type AvatarProps = Omit<Partial<HTMLImageElement>, 'className'> & {
  src: string;
  username: string;
  classNames?: {
    container?: string;
    img?: string;
    fallback?: string;
  };
};

export function Avatar(props: AvatarProps) {
  const { src, classNames, username, alt } = props;

  const containerClassnames = classnames(
    classNames?.container,
    styles.container,
  );
  const imgClassnames = classnames(classNames?.img, styles.img);
  const fallbackClassnames = classnames(classNames?.fallback, styles.fallback);

  return (
    <AvatarPrimitive.Root className={containerClassnames}>
      <AvatarPrimitive.Image
        className={imgClassnames}
        src={src}
        alt={alt ?? `profile image of ${username}`}
      />

      <AvatarPrimitive.Fallback className={fallbackClassnames} delayMs={600}>
        {getInitials(username)}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}
export default Avatar;

function getInitials(name: string) {
  const initials = name.match(/\b\w/g)?.join('').toUpperCase();
  return initials;
}
