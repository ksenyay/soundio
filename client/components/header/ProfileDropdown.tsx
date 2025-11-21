import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CurrentUser } from "@/types/types";
import { User } from "lucide-react";
import Link from "next/link";

type ProfileDropdownProps = {
  signout: () => void;
  user: CurrentUser;
};

const ProfileDropdown = (props: ProfileDropdownProps) => {
  const { signout, user } = props;

  return (
    <Popover>
      <PopoverTrigger>
        <div className="flex bg-accent p-2 px-2 rounded-4xl items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-105">
          <User className="w-5 h-5 text-white" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0 mt-2 bg-background border border-neutral-700 rounded-xl shadow-lg">
        <div className="flex flex-col text-sm">
          <div className="px-4 py-3 border-b border-neutral-700 font-semibold text-foreground">
            {user.username}
          </div>
          <Link href="/profile">
            <button className="text-foreground hover:bg-white/10 px-4 py-2 transition-colors text-left w-full">
              Profile
            </button>
          </Link>

          <button
            onClick={signout}
            className="text-red-400 hover:bg-red-500/10 px-4 py-2 transition-colors text-left w-full"
          >
            Sign out
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ProfileDropdown;
