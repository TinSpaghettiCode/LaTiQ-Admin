import * as Prisma from '@prisma/client';

export type CustomFilmType = Prisma.Films & {
  GenreFilms: {
    Genres: { Name: string };
  }[];
};
