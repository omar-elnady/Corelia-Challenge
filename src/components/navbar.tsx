import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/redux/authSlice';
import type { RootState } from '@/redux/store';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Bell, User, LogOut } from 'lucide-react';
import logo from '@/assets/Corelia_RICOH_logo.svg';

export function Navbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state: RootState) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <nav className="bg-gray-200 px-4 sm:px-8 md:px-12 lg:px-20 py-2 sm:py-0 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <img src={logo} alt="Logo" className="h-12 sm:h-16 w-auto" />
            </div>

            <div className="flex items-center gap-3 sm:gap-6">
                <div className="relative hover:bg-transparent group">
                    <Bell className="!w-5 !h-5 sm:!w-6 sm:!h-6 cursor-pointer" />
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-600 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                        Notifications
                    </span>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="relative hover:bg-transparent group">
                            <div className="flex h-full w-full items-center justify-center rounded-full border">
                                <User className="!h-5 !w-5 sm:!h-6 sm:!w-6 text-black cursor-pointer" />
                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-600 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                                    User
                                </span>
                            </div>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{currentUser?.name || 'User'}</p>
                                <p className="text-xs leading-none text-muted-foreground">{currentUser?.email}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 cursor-pointer">
                            <LogOut className="mr-2 w-4 h-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    );
}
