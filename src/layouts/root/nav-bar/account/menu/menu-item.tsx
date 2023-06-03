import { IconType } from 'react-icons';

interface MenuItemProps {
  icon: IconType;
  content: string;
  onClick?: () => void;
}

export function MenuItem({ icon: Icon, content, onClick }: MenuItemProps) {
  return (
    <button
      type="button"
      className="w-full py-2 text-color hover:bg-base-focus"
      onClick={onClick}
    >
      <div className="flex w-fit items-center gap-4 px-3 text-xl">
        <div className="py-1">
          <Icon />
        </div>

        <span className="text-base">{content}</span>
      </div>
    </button>
  );
}

export default MenuItem;
