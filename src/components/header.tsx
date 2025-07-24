import { Loader2, Search, Youtube } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface HeaderProps {
    query: string;
    setQuery: (query: string) => void;
    handleSearchSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    loading: boolean;
}

export default function Header({ query, setQuery, handleSearchSubmit, loading }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 sm:px-6 h-16 border-b shrink-0">
      <div className="flex items-center gap-2">
        <Youtube className="h-8 w-8 text-primary" />
        <h1 className="text-xl font-bold tracking-tight hidden sm:block">
          TubeTrack
        </h1>
      </div>
      <div className="flex-1 flex justify-center px-4 sm:px-8 md:px-16 lg:px-24">
        <form onSubmit={handleSearchSubmit} className="w-full max-w-2xl flex items-center">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by channel name, handle, or ID..."
            className="rounded-r-none focus:ring-0 text-base border-r-0"
            disabled={loading}
          />
          <Button type="submit" disabled={loading} className="rounded-l-none" variant="outline">
            {loading ? <Loader2 className="animate-spin" /> : <Search />}
          </Button>
        </form>
      </div>
      <div className="w-24">
        {/* Placeholder for user avatar or other actions */}
      </div>
    </header>
  );
}
