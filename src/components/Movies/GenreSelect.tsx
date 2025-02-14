'use client';

import * as React from 'react';
import { MultiSelect } from '@/components/ui/multi-select';
import { Film } from 'lucide-react';
import { Genres } from '@prisma/client';

interface GenreSelectProps {
  value: string[];
  onChange: (values: string[]) => void;
  className?: string;
}

export function GenreSelect({ value, onChange }: GenreSelectProps) {
  const [genres, setGenres] = React.useState<Genres[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch('/api/Genres');
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setGenres(data);
        }
      } catch (error) {
        console.log(error, 'Error fetching genres');
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, [onChange]);

  if (loading) {
    return <div className="w-full h-9 bg-muted animate-pulse rounded-md" />;
  }

  const options = genres.map((genre) => ({
    value: genre.Id,
    label: genre.Name,
    icon: Film,
  }));

  return (
    <MultiSelect
      options={options}
      defaultValue={value}
      onValueChange={onChange}
      placeholder="Thể loại"
      variant="secondary"
      animation={2}
      maxCount={5}
    />
  );
}
