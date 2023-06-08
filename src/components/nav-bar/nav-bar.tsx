import { Avatar } from '@material-tailwind/react';
import { BiPlus } from 'react-icons/bi';
import { FiFeather } from 'react-icons/fi';
import { HiOutlineDotsCircleHorizontal } from 'react-icons/hi';
import { Link } from 'react-router-dom';

import Account from './account/account';
import styles from './nav-bar.module.scss';
import NavItem, { NavItemProps } from './nav-item/nav-item';

import LogoSVG from '@/assets/logo.svg';

export interface NavBarProps {
  scheme: NavItemProps[];
}

export function NavBar(props: NavBarProps) {
  const { scheme } = props;

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.nav}>
          <div className={styles.logo}>
            <Link to="/home">
              <div className={styles.logoImg}>
                <Avatar src={LogoSVG} alt="app logo" />
              </div>
            </Link>
          </div>

          <div className={styles.navMain}>
            {scheme.map(({ to, name, icon, activeIcon }, index) => (
              <NavItem
                key={index + 1}
                icon={icon}
                activeIcon={activeIcon}
                name={name}
                to={to}
              />
            ))}
          </div>

          {/* more button */}
          <button className="mt-3 w-fit text-color" type="button">
            <div className="rounded-full py-2 hover:bg-base-focus">
              <div className="flex w-fit items-center gap-4 px-3 text-xl">
                <div className="py-1">
                  <HiOutlineDotsCircleHorizontal className="wh-[26.25px]" />
                </div>
                <span className="pr-4 capitalize <xl:hidden">More</span>
              </div>
            </div>
          </button>

          {/* tweet button */}
          <button
            type="button"
            className="my-4 h-[52px] w-[52px] rounded-full bg-accent text-white hover:bg-accent-focus xl:w-[235px]"
          >
            <div className="relative z-0 flex items-center justify-center py-1 wh-full xl:hidden">
              <BiPlus className="absolute left-3 top-3 z-[2] stroke-2 wh-3" />
              <FiFeather className="absolute bottom-[14px] right-3 z-[2] stroke-2 wh-5" />
            </div>

            <span className="font-semibold <xl:hidden">Tweet</span>
          </button>
        </div>

        <div className={styles.user}>
          <Account />
        </div>
      </div>
    </div>
  );
}

export default NavBar;
