import { Films } from '@prisma/client';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { params } = context;
  const { id } = params;

  const film: Films | null = await prisma.films.findFirst({
    where: {
      Id: id,
    },
    include: {
      Seasons: {
        include: {
          Episodes: true,
        },
      },
      Casts: {
        include: {
          Persons: true,
        },
      },
      Crews: {
        include: {
          Persons: true,
        },
      },
      GenreFilms: {
        include: {
          Genres: true,
        },
      },
      TopicFilms: {
        include: {
          Topics: true,
        },
      },
    },
  });

  if (!film) {
    return NextResponse.json({ message: 'Film not found' }, { status: 404 });
  }

  return NextResponse.json(film, { status: 200 });
}
