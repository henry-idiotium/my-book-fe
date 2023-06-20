import styles from './loading-screen.module.scss';

import logoSVG from '@/assets/logo.svg';

export function LoadingScreen() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <img src={logoSVG} alt="logo" className={styles.img} />
      </div>
    </div>
  );
}

export default LoadingScreen;
