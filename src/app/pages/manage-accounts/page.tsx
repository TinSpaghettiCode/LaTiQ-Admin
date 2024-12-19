'use client';

import Loading from '@/components/Loading';
import * as Prisma from '@prisma/client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const AccountManager = () => {
  const LIMIT = 15;
  const { data, error, status, fetchNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['films'],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await fetch(
        `/pages/api/Film?pageIndex=${pageParam}&pageSize=${LIMIT}`
      );

      console.log('fetch Page lan thu ', pageParam + 1);
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

  const [films, setFilms] = useState<Prisma.Films[]>([]);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  useEffect(() => {
    console.log(films, 'films');
  }, [films]);

  useEffect(() => {
    if (data?.pages) {
      const allFilms = data.pages.flatMap((page) => page.result.items ?? []);
      setFilms(allFilms);
    }
  }, [data]);

  return (
    <div className="bg-white rounded-lg pb-4 shadow h-[200vh]">
      {status === 'pending' ? (
        <Loading />
      ) : status === 'error' ? (
        <div>Error: {error?.message}</div>
      ) : (
        <div className="flex flex-col gap-2 py-6">
          {films?.map((film, filmIndex) => {
            return (
              <div
                key={film?.Id} // Use film.Id as the key for each film
                className="p-4 border-b bg-gray-700 rounded-sm min-h-[50px]"
              >
                {film.Name} & {filmIndex}
              </div>
            );
          })}
        </div>
      )}
      {isFetching && <Loading />}
      <div ref={ref}></div>
    </div>
  );
};

//   return <div>Account</div>;
// };
export default AccountManager;
