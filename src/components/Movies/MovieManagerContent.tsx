'use client';

import React, { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ChevronDown, Edit3, Plus, Search, Trash2 } from 'lucide-react';
import { BiSolidCategory } from 'react-icons/bi';
import { MovieTable } from './MovieTable';
import { useRouter } from 'next/navigation';

// Movie poster data
// Movie data
const movieData = [
  {
    id: 1,
    name: 'Inception',
    isFree: false,
    genre: 'Sci-Fi',
    duration: '2h 28min',
    type: 'Movie',
    poster: '/rectangle-9.png',
  },
  {
    id: 2,
    name: 'The Shawshank Redemption',
    isFree: true,
    genre: 'Drama',
    duration: '2h 22min',
    type: 'Movie',
    poster: '/rectangle-9-2.png',
  },
  {
    id: 3,
    name: 'The Godfather',
    isFree: true,
    genre: 'Crime',
    duration: '2h 55min',
    type: 'Movie',
    poster: '/rectangle-9-3.png',
  },
  {
    id: 4,
    name: 'The Dark Knight',
    isFree: true,
    genre: 'Action',
    duration: '2h 32min',
    type: 'Movie',
    poster: '/rectangle-9-4.png',
  },
  {
    id: 5,
    name: 'Pulp Fiction',
    isFree: true,
    genre: 'Crime',
    duration: '2h 34min',
    type: 'Movie',
    poster: '/rectangle-9-5.png',
  },
  {
    id: 6,
    name: "Schindler's List",
    isFree: true,
    genre: 'Biography',
    duration: '3h 15min',
    type: 'Movie',
    poster: '/rectangle-9-6.png',
  },
  // Add more movie data here...
];

const MovieManagerContent: React.FC = () => {
  const [layout, setLayout] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  // Filter movies based on search query
  const filteredMovies = movieData.filter((movie) =>
    movie.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1">
      {/* Header */}
      <div className="h-[100px] px-6 flex items-center border-b justify-between lg:h-[80px] md:h-[70px]">
        <h1 className="text-sm flex-none lg:text-2xl md:text-xl font-bold mr-20 flex-shrink-0">
          Quản lý phim
        </h1>

        <div className="flex items-center gap-4 lg:gap-3 md:gap-2 flex-grow">
          {/* Search */}
          <div className="relative flex-grow min-w-[140px]">
            <Input
              placeholder="Tìm kiếm"
              className="h-[57px] rounded-xl w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              size="icon"
              className="absolute right-0 top-0 h-[57px] w-[57px] bg-red-700 hover:bg-red-800 rounded-[10px]"
            >
              <Search className="w-20 h-20" />
            </Button>
          </div>

          {/* Sort */}
          <Button
            variant="ghost"
            className="h-[57px] bg-admin-background rounded-[10px] gap-2 lg:h-[50px] md:h-[45px] flex-shrink"
          >
            <span className="text-[#7e7e7e]">Sắp xếp theo : </span>
            <span className="font-semibold text-[#3d3b41]">Mới nhất</span>
            <ChevronDown className="w-[18px] h-[18px]" />
          </Button>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 lg:gap-1 md:gap-0.5">
            <Button
              size="icon"
              className={`h-[57px] w-[57px] ${
                layout === 'grid'
                  ? 'bg-red-700 hover:bg-red-800'
                  : 'bg-gray-300 hover:bg-gray-400'
              } rounded-lg`}
              onClick={() => setLayout('grid')}
            >
              <BiSolidCategory className="w-8 h-8" />
            </Button>
            <Button
              size="icon"
              className={`h-[57px] w-[57px] ${
                layout === 'table'
                  ? 'bg-red-700 hover:bg-red-800'
                  : 'bg-gray-300 hover:bg-gray-400'
              } rounded-lg`}
              onClick={() => setLayout('table')}
            >
              <BsThreeDotsVertical className="w-8 h-8" />
            </Button>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="p-5 flex justify-end gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-red-700 hover:bg-red-800 gap-2">
              Thêm
              <Plus className="w-5 h-5 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[200px] right-0">
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => {
                router.push('/pages/manage-movies/add-movie');
              }}
            >
              Thêm phim mới
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => console.log('Thêm tập phim mới')}
            >
              Thêm tập phim mới
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="secondary"
          className="bg-gray-400 hover:bg-slate-500 text-white gap-2"
        >
          Chỉnh sửa
          <Edit3 className="w-5 h-5" />
        </Button>
        <Button
          size="icon"
          className="bg-gray-400 hover:bg-slate-500 w-[39px] h-[39px] mr-1"
        >
          <Trash2 className="w-6 h-6" />
        </Button>
      </div>

      {/* Movie Grid */}
      {layout === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-6">
          {filteredMovies.map((movie) => (
            <Card
              key={movie.id}
              className={`w-full rounded-lg overflow-hidden cursor-pointer hover:border-red-800 border-4`}
            >
              <CardContent className="p-0">
                <div className="">
                  <div className="relative w-full h-[calc(100% - 40px)]">
                    <Image
                      alt="movie-poster"
                      src="/images/movie-poster.png"
                      height={250}
                      width={250}
                    />
                  </div>

                  <span className="block text-base font-semibold py-2 ml-2">
                    {movie.name}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <MovieTable data={filteredMovies} />
      )}
    </div>
  );
};

export default MovieManagerContent;
