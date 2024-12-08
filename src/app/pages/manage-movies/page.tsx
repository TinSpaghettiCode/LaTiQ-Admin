import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ChevronDown, Edit3, Plus, Search, Trash2 } from 'lucide-react';
import { BiSolidCategory } from 'react-icons/bi';
import React from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Image from 'next/image';

// Movie poster data
const moviePosters = [
  '/rectangle-9.png',
  '/rectangle-9-2.png',
  '/rectangle-9-3.png',
  '/rectangle-9-4.png',
  '/rectangle-9-5.png',
  '/rectangle-9-6.png',
  '/rectangle-9-7.png',
  '/rectangle-9-8.png',
  '/rectangle-9-9.png',
  '/rectangle-9-10.png',
  '/rectangle-9-11.png',
  '/rectangle-9-12.png',
];

const MovieManager = () => {
  return (
    <div className="bg-white rounded-lg pb-4 shadow h-full">
      {/* Main Content */}
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
                className="h-[57px] w-[57px] bg-red-700 hover:bg-red-800 rounded-lg"
              >
                <BiSolidCategory className="w-8 h-8" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="h-[57px] w-[57px] border-movie-1-primary-primary rounded-lg mr-0"
              >
                <BsThreeDotsVertical className="w-8 h-8" />
              </Button>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-5 flex justify-end gap-2">
          <Button className="bg-red-700 hover:bg-red-800 gap-2">
            Thêm
            <Plus className="w-5 h-5" />
          </Button>
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-6">
          {moviePosters.map((poster, index) => (
            <Card
              key={index}
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
                    Tên phim ở đây
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieManager;
