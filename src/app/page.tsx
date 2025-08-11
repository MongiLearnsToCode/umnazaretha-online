'use client';

import { Player } from '@/components/player';
import { ProgramGuide } from '@/components/program-guide';
import { ComingUpNext } from '@/components/coming-up-next';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface ProgramSearchResult {
  id: string;
  title: string;
  description: string;
  genre: string;
}

export default function Home() {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<ProgramSearchResult[]>([]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length > 2) { // Only search if more than 2 characters
      const { data, error } = await supabase
        .from('programs')
        .select('id, title, description, genre')
        .ilike('title', `%${term}%`);

      if (error) {
        console.error('Error searching programs:', error);
      } else {
        setSearchResults(data as ProgramSearchResult[]);
      }
    } else {
      setSearchResults([]);
    }
  };

  // Placeholder video ID
  const currentVideoId = '0593969c91a868595beb6f7316159256';

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{t('welcome')}</h1>
        <div>
          <button onClick={() => changeLanguage('en')} className="mr-2 p-2 border rounded">English</button>
          <button onClick={() => changeLanguage('zu')} className="p-2 border rounded">isiZulu</button>
        </div>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Player videoId={currentVideoId} />
        </div>
        <div className="space-y-8">
          <Input
            type="text"
            placeholder="Search programs..."
            value={searchTerm}
            onChange={handleSearch}
            className="mb-4"
          />
          {searchResults.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Search Results</h2>
              {searchResults.map((program) => (
                <div key={program.id} className="p-4 border rounded-lg">
                  <p className="font-bold">{program.title}</p>
                  <p className="text-sm mt-2">{program.description}</p>
                  <p className="text-xs mt-2 capitalize">Genre: {program.genre.replace(/_/, ' ')}</p>
                </div>
              ))}
            </div>
          )}
          <ComingUpNext />
          <ProgramGuide />
        </div>
      </main>
    </div>
  );
}
