'use client';

import { useEffect, useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { SearchResults } from './search-results';
import { useDebounce } from '@/hooks/use-debounce';
import { searchStreams } from '@/lib/twitch/api';
import type { Stream } from '@/types/streamer';

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    const search = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        setError(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const searchResults = await searchStreams(debouncedQuery);
        setResults(searchResults);
      } catch (error) {
        console.error('Error searching streams:', error);
        setError('Failed to search streams. Please try again.');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    search();
  }, [debouncedQuery]);

  const handleClose = () => {
    setOpen(false);
    setQuery('');
    setResults([]);
    setError(null);
  };

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="relative w-full max-w-xl cursor-pointer"
      >
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder="Search streams... (⌘K)"
          className="pl-8 cursor-pointer"
          onClick={() => setOpen(true)}
          readOnly
        />
      </div>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px] p-0">
          <DialogTitle className="sr-only">Search Streams</DialogTitle>
          <div className="border-b p-4">
            <Input
              type="search"
              placeholder="Search live streams..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-none focus-visible:ring-0"
              autoFocus
            />
          </div>
          <div className="max-h-[60vh] overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            )}
            
            {error && (
              <div className="p-4 text-center text-sm text-destructive">
                {error}
              </div>
            )}
            
            {!loading && !error && results.length === 0 && query.trim() && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No streams found
              </div>
            )}
            
            {!loading && !error && results.length > 0 && (
              <SearchResults results={results} onClose={handleClose} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}