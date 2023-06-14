import { Avatar } from '@material-tailwind/react';

import styles from './loading-screen.module.scss';

import logoSVG from '@/assets/logo.svg';

export function LoadingScreen() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Avatar src={logoSVG} alt="logo" size="xl" />
      </div>
    </div>
  );
}

export default LoadingScreen;
