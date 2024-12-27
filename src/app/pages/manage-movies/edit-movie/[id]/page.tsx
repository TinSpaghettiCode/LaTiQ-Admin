// pages/manage-movies/edit-movie/[id].tsx
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { MultiStepMovieAddition } from '@/components/Movies/MultiStepMovieAddtion';
import { CustomDetailFilmType } from '@/types/customTypes';
import Loading from '@/components/Loading';

const EditMovie = () => {
  const params = useParams();
  const { id } = params;

  const [existingFilm, setExistingFilm] = useState<CustomDetailFilmType | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchFilm = async () => {
        try {
          const response = await fetch(`/api/Film/${id}`); // Gọi API để lấy thông tin phim
          if (!response.ok) {
            throw new Error('Failed to fetch film');
          }
          const data = await response.json();

          // Chuyển đổi dữ liệu về kiểu CustomDetailFilmType
          const transformedFilm: CustomDetailFilmType = {
            ...data,
            GenreFilms: data.GenreFilms.map(
              (genreFilm: any) => genreFilm.GenreId
            ), // Lưu GenreId
            Topics: data.TopicFilms.map((topicFilm: any) => topicFilm.TopicId), // Lưu TopicId
          };

          setExistingFilm(transformedFilm); // Lưu dữ liệu phim vào state
          console.log('dataaaa', data);
        } catch (error) {
          console.error('Error fetching film:', error);
        } finally {
          setLoading(false); // Đặt loading thành false sau khi hoàn thành
        }
      };

      fetchFilm();
    }
  }, [id]);

  if (loading) {
    return <Loading />; // Hiển thị loading khi đang lấy dữ liệu
  }

  if (!existingFilm) {
    return <div>Film not found</div>; // Hiển thị thông báo nếu không tìm thấy phim
  }

  return (
    <div>
      <MultiStepMovieAddition isEditMode={true} existingFilm={existingFilm} />
    </div>
  );
};

export default EditMovie;
