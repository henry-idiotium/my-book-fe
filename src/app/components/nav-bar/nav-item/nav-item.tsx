import { IconType } from 'react-icons';

export interface NavItemProps {
  icon: IconType;
  name: string;
  highlight?: boolean;
}

export function NavItem(props: NavItemProps) {
  const { icon: Icon, name } = props;

  return (
    <div className="py-3">
      <div className="w-full">
        <div className="flex w-fit items-center gap-3 px-3 text-xl">
          <div className="p-1">
            <Icon className="wh-[30px]" />
          </div>

          <span className="capitalize">{name}</span>
        </div>
      </div>
    </div>
  );
}

export default NavItem;
