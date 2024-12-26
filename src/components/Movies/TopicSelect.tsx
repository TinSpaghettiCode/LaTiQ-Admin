'use client';

import * as React from 'react';
import { MultiSelect } from '@/components/ui/multi-select';
import { BookHeart } from 'lucide-react';
import { Topics } from '@prisma/client';

interface TopicSelectProps {
  value: string[];
  onChange: (values: string[]) => void;
  className?: string;
}

export function TopicSelect({ value, onChange }: TopicSelectProps) {
  const [topics, setTopics] = React.useState<Topics[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch('/api/Topics');
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setTopics(data);
        }
      } catch (error) {
        console.log(error, 'Error fetching topics');
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, [onChange]);

  if (loading) {
    return <div className="w-full h-9 bg-muted animate-pulse rounded-md" />;
  }

  const options = topics.map((topic) => ({
    value: topic.Id,
    label: topic.Name,
    icon: BookHeart,
  }));

  return (
    <MultiSelect
      options={options}
      defaultValue={value}
      onValueChange={onChange}
      placeholder="Chủ đề"
      variant="secondary"
      animation={2}
      maxCount={4}
    />
  );
}
