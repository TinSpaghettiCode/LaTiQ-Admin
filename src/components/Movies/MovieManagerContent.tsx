'use client';

import React, { useEffect, useState } from 'react';
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
import { useInView } from 'react-intersection-observer';

import * as Prisma from '@prisma/client';
import Loading from '../Loading';
import { useInfiniteQuery } from '@tanstack/react-query';
import { RiseLoader } from 'react-spinners';
import { CustomFilmType } from '@/types/customTypes';

const MovieManagerContent: React.FC = () => {
  const [layout, setLayout] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState<CustomFilmType[]>([]); // State để lưu trữ dữ liệu phim
  const router = useRouter();
  const { ref, inView } = useInView();
  const LIMIT = 10;

  // Tanstack react-query
  const { data, error, status, fetchNextPage, isFetching, hasNextPage } =
    useInfiniteQuery({
      queryKey: ['films'],
      queryFn: async ({ pageParam = 0 }) => {
        const response = await fetch(
          `/pages/api/Film?pageIndex=${pageParam}&pageSize=${LIMIT}`
        );

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        return lastPage.result.pageIndex + 1 <
          Math.ceil(lastPage.result.totalCount / LIMIT)
          ? lastPage.result.pageIndex + 1
          : undefined;
      },
    });

  const totalPages = data?.pages[0]?.result.totalCount
    ? Math.ceil(data.pages[0].result.totalCount / LIMIT)
    : 0;

  // Flatten data from pages
  useEffect(() => {
    if (data?.pages) {
      const allMovies = data.pages.flatMap((page) => page.result.items ?? []);
      setMovies(allMovies);
    }
  }, [data]);

  // Fetch next page khi end viewport
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  // Filter movies based on search query
  const filteredMovies = movies.filter((movie) =>
    movie.Name.toLowerCase().includes(searchQuery.toLowerCase())
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
      {status === 'pending' ? (
        <div className="flex justify-center items-center p-4">
          <Loading />
        </div>
      ) : status === 'error' ? (
        <div className="flex justify-center items-center p-4">
          <div>Error: {error?.message}</div>
        </div>
      ) : layout === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-6">
          {filteredMovies.map((movie: Prisma.Films, index: number) => (
            <Card
              key={`${movie.Id}-${index}`}
              className={`w-full rounded-lg overflow-hidden cursor-pointer hover:border-red-800 border-4`}
            >
              <CardContent className="p-0">
                <div className="">
                  <div className="relative w-full h-[calc(100% - 40px)]">
                    <Image
                      alt="movie-poster"
                      src={movie.PosterPath}
                      height={250}
                      width={250}
                    />
                  </div>

                  <span className="block text-base font-semibold py-2 ml-2 px-2">
                    {movie.Name}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
          <div ref={ref}></div> {/* Ref cho phần tử cuối cùng */}
        </div>
      ) : (
        <MovieTable
          data={movies}
          fetchNextPage={fetchNextPage}
          totalPages={totalPages}
          hasNextPage={hasNextPage}
          isFetching={isFetching}
        />
      )}

      {/* Hiển thị loading ở dưới cùng với layout là grid*/}
      {isFetching && status != 'pending' && layout === 'grid' && (
        <div className="flex justify-center items-center p-4">
          <RiseLoader color="#c0000d" />
        </div>
      )}
    </div>
  );
};

export default MovieManagerContent;
