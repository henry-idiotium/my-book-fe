import { BiPlus } from 'react-icons/bi';
import { FiFeather } from 'react-icons/fi';
import { HiOutlineDotsCircleHorizontal } from 'react-icons/hi';
import { Link } from 'react-router-dom';

import Account from './account/account';
import styles from './nav-bar.module.scss';
import NavItem, { NavItemProps } from './nav-item/nav-item';

import LogoSVG from '@/assets/logo.svg';
import { Avatar, Button } from '@/components';
import { useSelector } from '@/hooks';
import { selectAuth } from '@/stores';

export interface NavBarProps {
  scheme: NavItemProps[];
}

export function NavBar(props: NavBarProps) {
  const { scheme } = props;

  const { token } = useSelector(selectAuth);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.nav}>
          <div className={styles.navLogo}>
            <Link to="/home">
              <div className={styles.navLogoImg}>
                <img src={LogoSVG} alt="app logo" />
              </div>
            </Link>
          </div>

          <div className={styles.navMain}>
            {scheme.map((props, index) => (
              <NavItem key={index + 1} {...props} />
            ))}
          </div>

          {/* more button */}
          <Button
            disableBaseStyles
            className="w-fit rounded-full text-color hover:bg-base-focus"
            type="button"
          >
            <div className="py-2">
              <div className="flex w-fit items-center gap-4 px-3 text-xl">
                <div className="py-1">
                  <HiOutlineDotsCircleHorizontal className="wh-[26.25px]" />
                </div>
                <span className="pr-4 capitalize xl-max:hidden">More</span>
              </div>
            </div>
          </Button>

          {/* tweet button */}
          <Button
            disableBaseStyles
            className="my-5 rounded-full bg-accent text-base capitalize text-white transition wh-[52px] hover:bg-accent-focus/90 xl:w-[235px]"
          >
            <div className="relative flex items-center justify-center py-1 wh-full xl:hidden">
              <BiPlus className="absolute left-3 top-3 z-[2] stroke-2 wh-3" />
              <FiFeather className="absolute bottom-[14px] right-3 z-[2] stroke-2 wh-5" />
            </div>

            <span className="font-semibold xl-max:hidden">Tweet</span>
          </Button>
        </div>

        {token ? (
          <div className={styles.user}>
            <Account />
          </div>
        ) : undefined}
      </div>
    </div>
  );
}

export default NavBar;
