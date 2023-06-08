import { useEffect } from 'react';
import { IconBaseProps } from 'react-icons';
import { AiFillHome, AiOutlineHome } from 'react-icons/ai';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { HiOutlineUser, HiUser } from 'react-icons/hi';
import { LuHash } from 'react-icons/lu';
import {
  RiFileListFill,
  RiFileListLine,
  RiMessage3Fill,
  RiMessage3Line,
} from 'react-icons/ri';
import { TbBell, TbBellFilled } from 'react-icons/tb';
import { useSelector } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import styles from './app.module.scss';
import router from './pages/router';
import { selectAuth } from './stores';
import { useRefreshMutation } from './stores/auth/auth-api';

import { NavItemProps } from '@/components/nav-bar/nav-item/nav-item';
import { useThemeWatcher } from '@/hooks';
import { classes } from '@/utils';

export function App() {
  useThemeWatcher();
  const { token } = useSelector(selectAuth);
  const [refresh, { isUninitialized, isLoading }] = useRefreshMutation();

  useEffect(() => {
    if (!token) refresh(undefined);
  }, []);

  // todo refactor
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navItems = getNavItems();

  if ((!token && isUninitialized) || isLoading) return <div>loading...</div>;

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <RouterProvider router={router} />
      </main>
    </div>
  );
}

export default App;

function getNavItems() {
  const navItems: NavItemProps[] = [
    { name: 'home', icon: AiOutlineHome, activeIcon: AiFillHome },
    {
      name: 'explore',
      icon: LuHash,
      activeIcon: (props: IconBaseProps) => (
        <LuHash
          className={classes(props.className, 'storke-[1.5]')}
          {...props}
        />
      ),
    },
    { name: 'notifications', icon: TbBell, activeIcon: TbBellFilled },
    { name: 'messages', icon: RiMessage3Line, activeIcon: RiMessage3Fill },
    { name: 'lists', icon: RiFileListLine, activeIcon: RiFileListFill },
    { name: 'bookmarks', icon: FaRegBookmark, activeIcon: FaBookmark },
    { name: 'profile', icon: HiOutlineUser, activeIcon: HiUser },
  ];

  return navItems;
}
