import { NextResponse } from 'next/server';
import { PrismaClient, Films } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

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

export async function POST() {
  try {
    // Dữ liệu mẫu cho phim
    const dummyFilm = {
      Id: uuidv4(),
      Name: 'The Light Knight',
      Overview:
        'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
      BackdropPath: '/path/to/backdrop/dark-knight.jpg',
      PosterPath: '/path/to/poster/dark-knight.jpg',
      ContentRating: 'PG-13',
      ReleaseDate: new Date('2008-07-18'),

      /*       // Dữ liệu cho diễn viên
      Casts: {
        create: [
          {
            Id: uuidv4(),
            Character: 'Bruce Wayne / Batman',
            PersonId: uuidv4(), // Giả sử đã có Person với ID này
          },
          {
            Id: uuidv4(),
            Character: 'Joker',
            PersonId: uuidv4(), // Giả sử đã có Person với ID này
          },
        ],
      },

      // Dữ liệu cho đội sản xuất
      Crews: {
        create: [
          {
            Id: uuidv4(),
            Role: 'Director',
            PersonId: uuidv4(), // Giả sử đã có Person với ID này
          },
          {
            Id: uuidv4(),
            Role: 'Producer',
            PersonId: uuidv4(), // Giả sử đã có Person với ID này
          },
        ],
      },

      // Dữ liệu cho thể loại phim
      GenreFilms: {
        create: [
          {
            Id: uuidv4(),
            GenreId: uuidv4(), // Giả sử đã có Genre với ID này
          },
          {
            Id: uuidv4(),
            GenreId: uuidv4(), // Giả sử đã có Genre với ID này
          },
        ],
      }, */
    };

    // Tạo phim mới trong database
    const newFilm = await prisma.films.create({
      data: dummyFilm,
      // include: {
      //   Casts: true,
      //   Crews: true,
      //   GenreFilms: true,
      // },
    });

    return NextResponse.json(newFilm, { status: 200 });
  } catch (error) {
    console.error('Error creating film:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error },
      { status: 500 }
    );
  }
}
