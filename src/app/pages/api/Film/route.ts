import { NextResponse } from 'next/server';
import { PrismaClient, Films } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pageIndex = parseInt(searchParams.get('pageIndex') || '0', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);

  // Lấy tổng số phim
  const totalCount = await prisma.films.count();

  // Lấy danh sách phim với phân trang
  const films: Films[] = await prisma.films.findMany({
    skip: pageIndex * pageSize,
    take: pageSize,
    include: {
      GenreFilms: {
        include: {
          Genres: true,
        },
      },
    },
  });

  const response = {
    succeeded: true,
    result: {
      totalCount: totalCount,
      items: films, // Trả về danh sách phim với kiểu Films
      pageIndex: pageIndex,
      pageSize: pageSize,
    },
    errors: [],
  };

  return NextResponse.json(response);
}
