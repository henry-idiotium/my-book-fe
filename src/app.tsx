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
import { Outlet, useLocation } from 'react-router-dom';

import styles from './app.module.scss';
import { selectAuth } from './stores';
import { useRefreshMutation } from './stores/auth/auth-api';

import { NavBar } from '@/components';
import { NavItemProps } from '@/components/nav-bar/nav-item/nav-item';
import { useThemeWatcher } from '@/hooks';
import { classes } from '@/utils';

export function App() {
  useThemeWatcher();
  const location = useLocation();
  const auth = useSelector(selectAuth);
  const [refresh, { isSuccess, isUninitialized }] = useRefreshMutation();

  useEffect(() => {
    if (isUninitialized && auth.token === '') refresh(undefined);
  }, [isSuccess, location.pathname]);

  const navItems = getNavItems();

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <div className={styles.navWrapper}>
          <NavBar scheme={navItems} />
        </div>
      </nav>

      <main>
        <Outlet />
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
