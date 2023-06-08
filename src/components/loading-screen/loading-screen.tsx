import { Avatar } from '@material-tailwind/react';
import { useEffect, useState } from 'react';

import loadingMessages from './loading-messages';

// import styles from './loading-screen.module.css';
import logoSVG from '@/assets/logo.svg';

export function LoadingScreen() {
  // const [message, setMessage] = useState('');

  // useEffect(() => {
  //   setMessage(getLoadingMessage());
  // }, []);

  return (
    <div className="absolute inset-0 wh-full">
      <div className="flex items-center justify-center bg-base text-color wh-full">
        {/* <h1 className="text-4xl font-medium">{message}</h1> */}
        <Avatar src={logoSVG} alt="logo" size="xl" />
      </div>
    </div>
  );
}

export default LoadingScreen;

function getLoadingMessage() {
  const index = Math.floor(Math.random() * loadingMessages.length);
  return loadingMessages[index];
}
