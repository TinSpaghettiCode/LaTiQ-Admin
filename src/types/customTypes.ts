import * as Prisma from '@prisma/client';

export type CustomFilmType = Prisma.Films & {
  GenreFilms: {
    Genres: { Name: string };
  }[];
};

export type CustomDetailFilmType = Prisma.Films & {
  Seasons: (Prisma.Seasons & {
    Episodes: Prisma.Episodes[];
  })[];

  GenreFilms: {
    Genres: {
      Id: string;
      Name: string;
    };
  }[];

  Casts: {
    Character: string;
    Persons: {
      Id: string;
      Name: string;
      Gender: number;
      Popularity: number | null;
      ProfilePath: string | null;
      Biography: string | null;
      KnownForDepartment: string | null;
      Dob: Date | null;
    };
  }[];

  Crews: {
    Role: string;
    Persons: {
      Id: string;
      Name: string;
      Gender: number;
      Popularity: number | null;
      ProfilePath: string | null;
      Biography: string | null;
      KnownForDepartment: string | null;
      Dob: Date | null;
    };
  }[];
};
