import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CustomFilmType } from '@/types/customTypes';
import Loading from '../Loading';
import { format } from 'date-fns';

interface MovieTableProps {
  data: CustomFilmType[];
  fetchNextPage: () => void;
  hasNextPage: boolean;
  totalPages: number;
  isFetching: boolean;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  return (
    <div className="flex justify-end mt-4">
      <Button
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="mr-2 w-24 bg-red-700 hover:bg-red-800"
      >
        Trang trước
      </Button>
      <span className="mx-2">
        Trang {currentPage} trên {totalPages}
      </span>
      <Button
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="ml-2 w-24 bg-red-700 hover:bg-red-800"
      >
        Trang sau
      </Button>
    </div>
  );
};

export const MovieTable: React.FC<MovieTableProps> = ({
  data,
  fetchNextPage,
  hasNextPage,
  totalPages,
  isFetching,
}) => {
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const handleRowClick = (id: string) => {
    setSelectedRow(id);
  };

  const handlePageChange = (page: number) => {
    if (page < 1) return; // Kiểm tra giới hạn trang
    setCurrentPage(page);

    // Kiểm tra xem có dữ liệu cho trang tiếp theo không
    if (page > currentPage) {
      if (hasNextPage) {
        fetchNextPage(); // Fetch next page if moving to the next page and has next page
      }
    }
  };

  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 flex flex-col min-h-[400px] justify-between">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/12">STT</TableHead>
            <TableHead className="w-2/12">Id</TableHead>
            <TableHead className="w-3/12">Tên phim</TableHead>
            <TableHead className="w-1/12">Đánh giá</TableHead>
            <TableHead className="w-2/12">Thời gian</TableHead>
            <TableHead className="w-3/12">Thể loại</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isFetching ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                <Loading /> {/* Hiển thị loading */}
              </TableCell>
            </TableRow>
          ) : (
            paginatedData.map((movie, index) => (
              <TableRow
                key={movie.Id} // Sử dụng Id từ dữ liệu API
                onClick={() => handleRowClick(movie.Id)}
                className={`cursor-pointer ${
                  selectedRow === movie.Id
                    ? 'bg-slate-300 hover:bg-slate-400'
                    : ''
                }`}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{movie.Id}</TableCell>
                <TableCell>{movie.Name}</TableCell>
                <TableCell>{movie.ContentRating}</TableCell>
                <TableCell>
                  {movie.ReleaseDate
                    ? format(new Date(movie.ReleaseDate), 'dd/MM/yyyy')
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  {movie.GenreFilms?.map(
                    (genreFilm) => genreFilm.Genres.Name // Lấy trực tiếp Name từ Genres
                  ).join(', ') || 'N/A'}
                </TableCell>
              </TableRow>
            ))
          )}
          {/* Fill empty rows to ensure 5 rows are always displayed */}
          {/* {Array.from({ length: itemsPerPage - paginatedData.length }).map(
            (_, index) => (
              <TableRow key={`empty-${index}`}>
                <TableCell colSpan={5}>&nbsp;</TableCell>
              </TableRow>
            )
          )} */}
        </TableBody>
      </Table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
