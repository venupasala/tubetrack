import { Youtube } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex items-center justify-between px-4 sm:px-6 h-16 border-b shrink-0">
      <div className="flex items-center gap-2">
        <Youtube className="h-8 w-8 text-primary" />
        <h1 className="text-xl font-bold tracking-tight">
          TubeTrack
        </h1>
      </div>
      <div className="flex items-center gap-4">
        {/* Placeholder for future actions like user avatar */}
      </div>
    </header>
  );
}
