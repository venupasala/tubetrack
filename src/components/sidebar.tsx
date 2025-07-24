import { Home, Flame, Clapperboard, Library } from 'lucide-react';
import { Button } from './ui/button';

const SidebarItem = ({ icon: Icon, label }: { icon: React.ElementType, label: string }) => (
    <Button variant="ghost" className="w-full justify-start gap-3 px-4">
        <Icon className="w-6 h-6" />
        <span className="text-base">{label}</span>
    </Button>
);

export default function Sidebar() {
    return (
        <aside className="w-64 border-r p-4 hidden lg:flex flex-col gap-2">
            <SidebarItem icon={Home} label="Home" />
            <SidebarItem icon={Flame} label="Trending" />
            <SidebarItem icon={Clapperboard} label="Subscriptions" />
            <SidebarItem icon={Library} label="Library" />
        </aside>
    );
}
