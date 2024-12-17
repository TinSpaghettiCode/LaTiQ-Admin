'use client';

import React, { useEffect, useRef, useState } from 'react';
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

import * as Prisma from '@prisma/client';
import Loading from '../Loading';

const MovieManagerContent: React.FC = () => {
  const [layout, setLayout] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState<Prisma.Films[]>([]); // State để lưu trữ dữ liệu phim
  const [pageIndex, setPageIndex] = useState(0); // State để quản lý chỉ số trang
  const pageSize = 12; // Số lượng phim mỗi lần fetch
  const [loading, setLoading] = useState(false); // State để quản lý trạng thái loading
  const router = useRouter();
  const observer = useRef<IntersectionObserver | null>(null); // Ref để lưu trữ observer
  const lastMovieElementRef = useRef<HTMLDivElement | null>(null);
  const [totalMovies, setTotalMovies] = useState(0);

  // Gọi API khi component được mount
  // Gọi API khi component được mount
  useEffect(() => {
    const fetchMovies = async () => {
      if (loading) return; // Ngăn không cho gọi fetch khi đang loading
      setLoading(true);
      const response = await fetch(
        `/pages/api/Film?pageIndex=${pageIndex}&pageSize=${pageSize}`
      );
      const data = await response.json();

      if (data.succeeded) {
        const fetchedMovies = data.result.items;
        setMovies((prevMovies: Prisma.Films[]) => [
          ...prevMovies,
          ...fetchedMovies,
        ]);
        setTotalMovies(data.result.totalCount);
      }

      setLoading(false);
    };

    fetchMovies();
  }, [pageIndex, loading]); // Gọi lại khi pageIndex thay đổi

  useEffect(() => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    const callback = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        // Kiểm tra xem pageIndex có nhỏ hơn pageIndex tối đa không
        const maxPageIndex = Math.ceil(totalMovies / pageSize) - 1; // Tính pageIndex tối đa
        if (pageIndex < maxPageIndex) {
          setPageIndex((prevIndex) => prevIndex + 1);
        }
      }
    };

    observer.current = new IntersectionObserver(callback);
    if (lastMovieElementRef.current) {
      observer.current.observe(lastMovieElementRef.current);
    }
  }, [loading, lastMovieElementRef, totalMovies, pageIndex]);

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
      {layout === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-6">
          {filteredMovies.map((movie: Prisma.Films, index: number) => (
            <Card
              key={movie.Id}
              className={`w-full rounded-lg overflow-hidden cursor-pointer hover:border-red-800 border-4`}
              ref={
                index === filteredMovies.length - 1 ? lastMovieElementRef : null
              } // Gán ref cho phần tử cuối cùng
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
        </div>
      ) : (
        // <MovieTable data={filteredMovies} />
        <Loading />
      )}

      {/* Hiển thị loading ở dưới cùng */}
      {loading && (
        <div className="flex justify-center items-center p-4">
          <Loading />
        </div>
      )}
    </div>
  );
};

export default MovieManagerContent;
