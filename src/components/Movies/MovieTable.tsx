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
import * as Prisma from '@prisma/client';

interface MovieTableProps {
  data: Prisma.Films[]; // Dữ liệu phim
  currentPage: number; // Trang hiện tại
  totalPages: number; // Tổng số trang
  onPageChange: (page: number) => void; // Hàm để thay đổi trang
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
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const itemsPerPage = 5;

  const handleRowClick = (id: string) => {
    setSelectedRow(id);
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
            <TableHead>Tên phim</TableHead>
            <TableHead>Miễn phí</TableHead>
            <TableHead>Thể loại</TableHead>
            <TableHead>Thời gian</TableHead>
            <TableHead className="text-right">Loại phim</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((movie) => (
            <TableRow
              key={movie.Id} // Sử dụng Id từ dữ liệu API
              onClick={() => handleRowClick(movie.Id)}
              className={`cursor-pointer ${
                selectedRow === movie.Id
                  ? 'bg-slate-300 hover:bg-slate-400'
                  : ''
              }`}
            >
              <TableCell>{movie.Name}</TableCell>
              <TableCell>{movie.isFree ? 'Có' : 'Không'}</TableCell>
              <TableCell>{movie.genre}</TableCell>
              <TableCell>{movie.duration}</TableCell>
              <TableCell className="text-right">{movie.type}</TableCell>
            </TableRow>
          ))}
          {/* Fill empty rows to ensure 5 rows are always displayed */}
          {Array.from({ length: itemsPerPage - paginatedData.length }).map(
            (_, index) => (
              <TableRow key={`empty-${index}`}>
                <TableCell colSpan={5}>&nbsp;</TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};
