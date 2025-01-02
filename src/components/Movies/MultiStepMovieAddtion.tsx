/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, ArrowLeft, X, Plus, CircleUser } from 'lucide-react';
import { useEdgeStore } from '@/lib/edgestore';
import { SingleImageDropzone } from '../SingleImageDropzone';
import { vi } from 'date-fns/locale';
import { GenreSelect } from './GenreSelect';
import { FileState, MultiFileDropzone } from '../MultiFileDropzone';
import { Switch } from '../ui/switch';
import { Episodes, Persons, Seasons } from '@prisma/client';
import EpisodeForm from './EpisodeForm';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { v4 as uuidv4 } from 'uuid';
import { CustomDetailFilmType } from '@/types/customTypes';
import { MultiSelect } from '../ui/multi-select';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import Link from 'next/link';
import { TopicSelect } from './TopicSelect';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const steps = [
  { id: 1, title: 'Thông tin phim' },
  { id: 2, title: 'Tải phim lên' },
  { id: 3, title: 'Đội ngũ sản xuất' },
  { id: 4, title: 'Diễn viên tham gia' },
];

export function MultiStepMovieAddition({
  isEditMode = false,
  existingFilm,
}: {
  isEditMode?: boolean;
  existingFilm?: CustomDetailFilmType;
}) {
  // Film được tạo
  const [newFilm, setNewFilm] = useState<CustomDetailFilmType>(
    isEditMode && existingFilm
      ? existingFilm
      : {
          Id: uuidv4(),
          Name: '',
          Overview: '',
          BackdropPath: '',
          PosterPath: '',
          ContentRating: '',
          ReleaseDate: new Date(),
          GenreFilms: [],
          Topics: [],
          Seasons: [],
          Crews: [],
          Casts: [],
        }
  );

  useEffect(() => {
    console.log(newFilm, 'newFilmmmm');
  }, [newFilm]);

  const [currentStep, setCurrentStep] = useState(1);
  // Variables for step 1
  const { edgestore } = useEdgeStore();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<'single' | 'series'>(
    'single'
  );

  // Variables for step 2
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const [episodes, setEpisodes] = useState<Episodes[]>([
    {
      Id: '1',
      Order: 1,
      Title: '',
      IsFree: false,
      Source: '',
      Duration: 0,
      StillPath: '',
      SeasonId: '1',
      Summary: '',
    },
  ]);

  // Variables for step 3
  const [persons, setPersons] = useState<Persons[]>([]);
  const [selectedCrews, setSelectedCrews] = useState<string[]>(
    newFilm.Crews.map((crew) => crew.Persons.Id)
  );
  const [selectedCasts, setSelectedCasts] = useState<string[]>(
    newFilm.Casts.map((cast) => cast.Persons.Id)
  );

  useEffect(() => {
    console.log(selectedCasts, 'selectedCasts');
  }, [selectedCasts]);

  const router = useRouter();

  useEffect(() => {
    const fetchPersons = async () => {
      try {
        const res = await fetch(`/api/Person`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setPersons(data);
        }
      } catch (error) {
        console.log(error, 'Error fetch persons');
      }
    };
    fetchPersons();
    console.log('fetch personsssss');
  }, []);

  useEffect(() => {
    console.log(episodes, 'episodes');
  }, [episodes]);

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar currentStep={currentStep} />
      <main className="flex-1 border-l border-[#d4d7de]">
        <div className="p-6 border-b border-[#d4d7de]">
          <h1 className="text-2xl font-medium text-center">
            {steps[currentStep - 1].title}
          </h1>
        </div>
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="p-6 space-y-6"
        >
          {currentStep === 1 && (
            <>
              <MovieImageUpload
                edgestore={edgestore}
                newFilm={newFilm}
                setNewFilm={setNewFilm}
              />
              <MovieInfoForm newFilm={newFilm} setNewFilm={setNewFilm} />
              {/* <MovieTypeSelection
                selectedType={selectedType}
                setSelectedType={setSelectedType}
              /> */}
            </>
          )}
          {currentStep === 2 && (
            <UploadMovieSeries newFilm={newFilm} setNewFilm={setNewFilm} />
          )}
          {currentStep === 3 && (
            <ProductionTeam
              newFilm={newFilm}
              setNewFilm={setNewFilm}
              persons={persons}
              selectedPersons={selectedCrews}
              setSelectedPersons={setSelectedCrews}
            />
          )}
          {currentStep === 4 && (
            <CastMembers
              newFilm={newFilm}
              setNewFilm={setNewFilm}
              persons={persons}
              selectedPersons={selectedCasts}
              setSelectedPersons={setSelectedCasts}
            />
          )}
          <div className="flex justify-between">
            {currentStep > 1 && (
              <Button onClick={prevStep} variant="outline">
                Quay lại
              </Button>
            )}
            <Button
              onClick={async () => {
                if (currentStep === steps.length) {
                  // Gọi API POST tại bước cuối
                  try {
                    const payload = JSON.stringify({
                      id: newFilm.Id, // ID phim
                      name: newFilm.Name, // Tên phim
                      overview: newFilm.Overview, // Tổng quan
                      posterPath: newFilm.PosterPath, // Đường dẫn poster
                      backdropPath: newFilm.BackdropPath, // Đường dẫn backdrop
                      contentRating: newFilm.ContentRating || '19', // Xếp hạng nội dung (có thể đặt giá trị mặc định)
                      releaseDate: format(
                        newFilm.ReleaseDate || new Date(),
                        'yyyy-MM-dd'
                      ), // Ngày phát hành (định dạng lại)
                      seasons: newFilm.Seasons.map((season) => ({
                        name: season.Name, // Tên mùa
                        filmId: season.FilmId, // ID phim
                        film: null,
                        episodes: season.Episodes.map((episode) => ({
                          id: episode.Id, // ID tập
                          order: episode.Order, // Thứ tự tập
                          title: episode.Title, // Tiêu đề tập
                          summary: episode.Summary, // Tóm tắt tập
                          source: episode.Source, // Đường dẫn video
                          duration: episode.Duration, // Thời gian
                          stillPath: episode.StillPath, // Đường dẫn still
                          isFree: episode.IsFree, // Có miễn phí không
                          seasonId: season.Id, // ID mùa
                          season: null,
                        })),
                      })),
                      genreFilms: newFilm.GenreFilms.map((id) => ({ id })), // Chuyển đổi thành mảng đối tượng
                      topicFilms: newFilm.Topics.map((id) => ({ id })), // Chuyển đổi thành mảng đối tượng
                      casts: newFilm.Casts.map((cast) => ({
                        character: cast.Character, // Nhân vật
                        personId: cast.Persons.Id, // ID người
                      })),
                      crews: newFilm.Crews.map((crew) => ({
                        role: crew.Role, // Vai trò
                        personId: crew.Persons.Id, // ID người
                      })),
                    });
                    console.log(payload, 'payloaddddd');
                    // Sử dụng toast.promise để hiển thị thông báo
                    const accessToken = localStorage.getItem('accessToken');

                    const data = await toast.promise(
                      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Film`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${accessToken}`,
                        },
                        body: payload,
                      }).then((response) => {
                        if (!response.ok) {
                          throw new Error('Network response was not ok');
                        }
                        return response.json();
                      }),
                      {
                        loading: 'Đang gửi dữ liệu...',
                        success: (data) => {
                          console.log('API response:', data);
                          router.push('/pages/manage-movies');
                          return 'Gửi dữ liệu thành công!';
                        },
                        error: (error) => {
                          console.error('Error calling API:', error);
                          return 'Gửi dữ liệu thất bại!';
                        },
                      }
                    );
                  } catch (error) {
                    console.error('Error calling API:', error);
                    // Xử lý lỗi nếu cần
                  }
                } else {
                  nextStep(); // Chuyển sang bước tiếp theo nếu không phải bước cuối
                }
              }}
              className="bg-[#c0000d] hover:bg-[#a0000b] text-white ml-auto"
            >
              {currentStep === steps.length ? 'Hoàn thành' : 'Tiếp tục'}
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function Sidebar({ currentStep }: { currentStep: number }) {
  const router = useRouter();

  return (
    <div className="w-[360px] border-r border-[#d4d7de] p-6">
      {/* Header */}
      <div className="flex items-center gap-6 pb-6 mb-6 border-b border-[#b2b2b2]">
        <div
          className="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-slate-200 rounded-lg"
          onClick={() => {
            router.back();
          }}
        >
          <ArrowLeft className="w-6 h-6 text-[#0a090b]" />
        </div>
        <h2 className="text-2xl font-medium text-[#0a090b]">Thêm phim mới</h2>
      </div>

      {/* Steps */}
      <div className="relative pl-[52px]">
        {/* Vertical Line */}
        <div className="absolute left-4 top-[10px] bottom-[10px] w-[2px] bg-[#e5e7eb]">
          <motion.div
            className="absolute top-0 left-0 w-full bg-[#c0000d]"
            style={{
              height: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
            initial={{ height: 0 }}
            animate={{
              height: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>

        {/* Steps List */}
        <div className="flex flex-col gap-8">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center gap-4 relative">
              {/* Step Circle */}
              <motion.div
                className={cn(
                  'absolute -left-[52px] w-8 h-8 rounded-full flex items-center justify-center text-base font-bold origin-center',
                  currentStep === step.id
                    ? 'bg-[#c0000d] text-white'
                    : 'border-2 border-[#c0000d] text-[#c0000d] bg-white'
                )}
                initial={false}
                animate={{
                  scale: currentStep === step.id ? 1.1 : 1, // Reduced scale factor
                  backgroundColor:
                    currentStep === step.id ? '#c0000d' : '#ffffff',
                  color: currentStep === step.id ? '#ffffff' : '#c0000d',
                }}
                transition={{ duration: 0.2 }}
              >
                {step.id}
              </motion.div>

              {/* Step Title */}
              <span
                className={cn(
                  'text-base font-medium transition-colors duration-200',
                  currentStep === step.id ? 'text-[#303030]' : 'text-[#686868]'
                )}
              >
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MovieImageUpload({
  edgestore,
  newFilm,
  setNewFilm,
}: {
  edgestore: any;
  newFilm: any;
  setNewFilm: (film: any) => void;
}) {
  const [progress, setProgress] = useState(0);
  const [confirmUploaded, setConfirmUploaded] = useState<boolean>(false);
  const [backdropImage, setBackdropImage] = useState<File | null>(null);
  const [posterImage, setPosterImage] = useState<File | null>(null);

  useEffect(() => {
    if (newFilm.BackdropPath) {
      // Chuyển đổi URL thành File (nếu cần)
      fetch(newFilm.BackdropPath)
        .then((response) => response.blob())
        .then((blob) => {
          const file = new File([blob], 'backdrop.png', { type: blob.type });
          setBackdropImage(file);
        });
    }
    if (newFilm.PosterPath) {
      fetch(newFilm.PosterPath)
        .then((response) => response.blob())
        .then((blob) => {
          const file = new File([blob], 'poster.png', { type: blob.type });
          setPosterImage(file);
        });
    }
  }, [newFilm]);

  return (
    <div className="space-y-6 mb-20">
      <div className="relative h-[633.77px] bg-[#f1f1f1] rounded-[5px] flex flex-col items-center justify-center mb-8 cursor-pointer">
        <SingleImageDropzone
          width={800}
          height={600}
          value={backdropImage ? backdropImage : undefined}
          onChange={(file: any) => {
            setBackdropImage(file);
          }}
        />
      </div>

      <div className="absolute left-[650px] top-[350px] w-[287.48px] h-[437.01px] bg-[#f1f1f1] rounded-[10px] border-8 border-white flex flex-col items-center justify-center">
        <SingleImageDropzone
          width={250}
          height={400}
          value={posterImage ? posterImage : undefined}
          onChange={(file: any) => {
            setPosterImage(file);
          }}
        />
      </div>

      <div className="flex flex-col justify-end gap-y-4 items-end">
        <div className="h-[8px] w-80 border rounded overflow-hidden">
          <div
            className="h-full bg-red-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <Button
          disabled={confirmUploaded}
          className="bg-red-700 hover:bg-red-800"
          onClick={async () => {
            setConfirmUploaded(true);

            if (backdropImage) {
              const res = await edgestore.myPublicImages.upload({
                file: backdropImage,
                onProgressChange: (progress: any) => {
                  setProgress(progress);
                },
              });
              setNewFilm((prevFilm: any) => ({
                ...prevFilm,
                BackdropPath: res.url, // Giả sử res.url chứa URL của hình ảnh đã tải lên
              }));
            }

            if (posterImage) {
              const res = await edgestore.myPublicImages.upload({
                file: posterImage,
                onProgressChange: (progress: any) => {
                  console.log(progress);
                },
              });
              setNewFilm((prevFilm: any) => ({
                ...prevFilm,
                PosterPath: res.url,
              }));
            }
          }}
        >
          Xác nhận
        </Button>
      </div>
    </div>
  );
}

function MovieInfoForm({
  // date,
  // setDate,
  // selectedGenres,
  // setSelectedGenres,
  newFilm,
  setNewFilm,
}: {
  newFilm: any;
  setNewFilm: (film: any) => void;
}) {
  const [date, setDate] = useState<Date>();

  return (
    <div className="space-y-4">
      <Input
        placeholder="Tên phim"
        onChange={(e) =>
          setNewFilm((prevFilm: any) => ({
            ...prevFilm,
            Name: e.target.value, // Cập nhật newFilm.Name với giá trị từ Input
          }))
        }
        value={newFilm.Name}
      />

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left font-normal',
              newFilm.releaseDate && 'text-muted-foreground' // Thay đổi từ date sang newFilm.releaseDate
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? ( // Sử dụng newFilm.releaseDate để kiểm tra
              format(date, 'dd/MM/yyyy', { locale: vi }) // Hiển thị ngày đã định dạng
            ) : (
              <span>Ngày phát hành</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(selectedDate) => {
              setDate(selectedDate); // Cập nhật state date
              setNewFilm((prevFilm: any) => ({
                ...prevFilm,
                ReleaseDate: selectedDate, // Cập nhật newFilm.releaseDate với ngày đã chọn
              }));
            }}
            initialFocus
            locale={vi}
          />
        </PopoverContent>
      </Popover>

      <Textarea
        placeholder="Tổng quan"
        onChange={(e) =>
          setNewFilm((prevFilm: any) => ({
            ...prevFilm,
            Overview: e.target.value, // Cập nhật newFilm.Overview với giá trị từ Textarea
          }))
        }
        value={newFilm.Overview}
      />

      <Input
        placeholder="Đánh giá nội dung"
        onChange={(e) =>
          setNewFilm((prevFilm: any) => ({
            ...prevFilm,
            ContentRating: e.target.value, // Cập nhật newFilm.Name với giá trị từ Input
          }))
        }
        value={newFilm.ContentRating}
      />

      <GenreSelect
        value={newFilm.GenreFilms}
        onChange={(genres) => {
          setNewFilm((prevFilm: any) => ({
            ...prevFilm,
            GenreFilms: genres,
          }));
        }}
      />

      <TopicSelect
        value={newFilm.Topics}
        onChange={(topics) => {
          setNewFilm((prevFilm: any) => ({
            ...prevFilm,
            Topics: topics,
          }));
        }}
      />
    </div>
  );
}

function UploadMovieSingle({
  fileStates,
  setFileStates,
  edgestore,
  episodes,
  setEpisodes,
}: {
  fileStates: FileState[];
  setFileStates: (fileStates: FileState[]) => void;
  edgestore: any;
  episodes: Episodes[];
  setEpisodes: (episode: Episodes[]) => void;
}) {
  function updateFileProgress(key: string, progress: FileState['progress']) {
    setFileStates((fileStates: FileState[]) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key
      );
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
    });
  }

  return (
    <div className="flex flex-col space-y-4 items-center justify-center">
      <img
        className="w-[200px] h-[200px]"
        alt="Glossy"
        src="/images/glossy.png"
      />
      <div className="flex flex-row w-full items-center space-x-6">
        <div className="w-3/4">
          <MultiFileDropzone
            value={fileStates}
            onChange={(files) => {
              setFileStates(files);
            }}
            dropzoneOptions={{ maxFiles: 1 }}
            // onFilesAdded={async (addedFiles) => {
            //   setFileStates([...fileStates, ...addedFiles]);
            //   await Promise.all(
            //     addedFiles.map(async (addedFileState) => {
            //       try {
            //         const res = await edgestore.myPublicFiles.upload({
            //           file: addedFileState.file,
            //           options: {
            //             temporary: true,
            //           },
            //           onProgressChange: async (progress: number) => {
            //             updateFileProgress(addedFileState.key, progress);
            //             if (progress === 100) {
            //               // wait 1 second to set it to complete
            //               // so that the user can see the progress bar at 100%
            //               await new Promise((resolve) =>
            //                 setTimeout(resolve, 1000)
            //               );
            //               updateFileProgress(addedFileState.key, 'COMPLETE');
            //             }
            //           },
            //         });
            //         console.log(res, 'ressssss');
            //       } catch (err) {
            //         updateFileProgress(addedFileState.key, 'ERROR');
            //       }
            //     })
            //   );
            // }}
          />
        </div>

        <div className="flex flex-col w-1/4">
          <p>Cần trả phí để xem</p>
          <Switch
            checked={episodes[0]?.IsFree ?? false}
            onCheckedChange={(checked) => {
              if (episodes.length > 0) {
                const updatedEpisodes = [...episodes];
                updatedEpisodes[0] = { ...updatedEpisodes[0], IsFree: checked };
                setEpisodes(updatedEpisodes);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

function UploadMovieSeries({
  newFilm,
  setNewFilm,
}: {
  newFilm: CustomDetailFilmType;
  setNewFilm: (film: any) => void;
}) {
  const [newSeasonName, setNewSeasonName] = useState('');
  const [currentSeasonId, setCurrentSeasonId] = useState(
    newFilm.Seasons[0]?.Id || ''
  );

  // Thêm mùa mới
  const addSeason = () => {
    const newSeason = {
      Id: uuidv4(),
      Order: newFilm.Seasons.length + 1,
      Name: newSeasonName,
      FilmId: newFilm.Id,
      Episodes: [], // Initialize with an empty array for episodes
    };

    setNewFilm((prevFilm: any) => ({
      ...prevFilm,
      Seasons: [...prevFilm.Seasons, newSeason],
    }));
    setNewSeasonName(''); // Clear the input after adding
  };

  // Xóa mùa
  const removeSeason = (seasonId: string) => {
    setNewFilm((prevFilm: any) => ({
      ...prevFilm,
      Seasons: prevFilm.Seasons.filter((season: any) => season.Id !== seasonId),
    }));
    // Reset current season ID if the removed season was selected
    if (currentSeasonId === seasonId) {
      setCurrentSeasonId(newFilm.Seasons[0]?.Id || ''); // Set to first season or empty
    }
  };

  // Cập nhật tên mùa
  const updateSeasonName = (seasonId: string, newName: string) => {
    setNewFilm((prevFilm: any) => ({
      ...prevFilm,
      Seasons: prevFilm.Seasons.map((season: any) =>
        season.Id === seasonId ? { ...season, Name: newName } : season
      ),
    }));
  };

  return (
    <main className="bg-white p-6">
      <header className="mb-12">
        <h1 className="text-2xl font-medium text-center text-global-neutral-grey-1300">
          Thêm bộ phim mới
        </h1>
      </header>

      <div className="max-w-[881px] mx-auto space-y-6">
        {/* Input for New Season */}
        <div className="flex items-start gap-2.5">
          <Input
            className="h-[60px] flex-1"
            placeholder="Tên mùa mới"
            value={newSeasonName}
            onChange={(e) => setNewSeasonName(e.target.value)} // Update the new season name state
          />
          <Button
            className="h-[60px] bg-red-700 hover:bg-red-800 text-white text-xl font-normal"
            size="lg"
            onClick={addSeason} // Call addSeason on button click
          >
            <span>Thêm mùa mới</span>
            <Plus className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Select for Existing Seasons */}
        <div className="flex items-start gap-2.5">
          <Select
            value={currentSeasonId}
            onValueChange={(seasonId) => setCurrentSeasonId(seasonId)} // Update the current season ID
          >
            <SelectTrigger className="h-[60px] flex-1">
              <SelectValue placeholder="Chọn mùa" />
            </SelectTrigger>
            <SelectContent>
              {newFilm.Seasons.map((season) => (
                <SelectItem key={season.Id} value={season.Id}>
                  {season.Name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="icon"
            className="h-[60px] bg-movie-1-neutrals-neutrals100"
            onClick={() => removeSeason(currentSeasonId)} // Call removeSeason on button click
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Episode Form for Selected Season */}
        {newFilm.Seasons.map((season) => {
          if (season.Id === currentSeasonId) {
            return (
              <EpisodeForm
                key={season.Id}
                newFilm={newFilm}
                setNewFilm={setNewFilm}
                seasonId={season.Id}
              />
            );
          }
          return null; // Return null for other seasons
        })}
      </div>
    </main>
  );
}

function ProductionTeam({
  persons,
  newFilm,
  setNewFilm,
  selectedPersons,
  setSelectedPersons,
}: {
  persons: Persons[];
  newFilm: CustomDetailFilmType;
  setNewFilm: (film: any) => void;
  selectedPersons: string[];
  setSelectedPersons: (persons: string[]) => void;
}) {
  useEffect(() => {
    // Update newFilm.Crews when selectedPersons changes
    const updatedCrews = selectedPersons.map((personId) => {
      const existingCrew = newFilm.Crews.find(
        (crew) => crew.Persons.Id === personId
      );
      return existingCrew || { Persons: { Id: personId }, Role: '' };
    });

    setNewFilm((prevFilm: any) => ({
      ...prevFilm,
      Crews: updatedCrews,
    }));
  }, [selectedPersons, setNewFilm]);

  const options = persons.map((person) => ({
    value: person.Id,
    label: person.Name,
    icon: CircleUser,
  }));

  const handleRoleChange = (personId: string, role: string) => {
    setNewFilm((prevFilm: any) => {
      const updatedCrews = prevFilm.Crews.map((crew: any) =>
        crew.Persons.Id === personId ? { ...crew, Role: role } : crew
      );
      return { ...prevFilm, Crews: updatedCrews };
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Đội ngũ sản xuất</h2>
      <MultiSelect
        options={options}
        onValueChange={setSelectedPersons}
        placeholder="Chọn người tham gia"
        variant="secondary"
        animation={2}
        maxCount={5}
        value={selectedPersons}
      />

      {newFilm.Crews.map((crew) => {
        const person = persons.find((p) => p.Id === crew.Persons.Id);
        return person ? (
          <div
            key={person.Id}
            className="flex items-center space-between justify-items-start"
          >
            <Avatar>
              <AvatarImage src={person.ProfilePath ?? ''} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className="font-medium flex-grow min-w-40 ml-4">
              {person.Name}
            </span>
            <Input
              className="flex-grow-0"
              placeholder="Vai trò"
              onChange={(e) => handleRoleChange(person.Id, e.target.value)}
              value={crew.Role || ''}
            />
          </div>
        ) : null;
      })}
    </div>
  );
}

function CastMembers({
  persons,
  newFilm,
  setNewFilm,
  selectedPersons,
  setSelectedPersons,
}: {
  persons: Persons[];
  newFilm: CustomDetailFilmType;
  setNewFilm: (film: any) => void;
  selectedPersons: string[];
  setSelectedPersons: (persons: string[]) => void;
}) {
  useEffect(() => {
    // Update newFilm.Casts when selectedPersons changes
    const updatedCasts = selectedPersons.map((personId) => {
      const existingCast = newFilm.Casts.find(
        (cast) => cast.Persons.Id === personId
      );
      return existingCast || { Persons: { Id: personId }, Character: '' };
    });

    setNewFilm((prevFilm: any) => ({
      ...prevFilm,
      Casts: updatedCasts,
    }));
  }, [selectedPersons, setNewFilm]);

  const options = persons.map((person) => ({
    value: person.Id,
    label: person.Name,
    icon: CircleUser,
  }));

  const handleCharacterChange = (personId: string, character: string) => {
    setNewFilm((prevFilm: any) => {
      const updatedCasts = prevFilm.Casts.map((cast: any) =>
        cast.Persons.Id === personId ? { ...cast, Character: character } : cast
      );
      return { ...prevFilm, Casts: updatedCasts };
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Diễn viên tham gia</h2>
      <MultiSelect
        options={options}
        onValueChange={setSelectedPersons}
        placeholder="Chọn người tham gia"
        variant="secondary"
        animation={2}
        maxCount={5}
        value={selectedPersons}
      />

      {newFilm.Casts.map((cast) => {
        const person = persons.find((p) => p.Id === cast.Persons.Id);
        return person ? (
          <div
            key={person.Id}
            className="flex items-center space-between justify-items-start"
          >
            <Avatar>
              <AvatarImage src={person.ProfilePath ?? ''} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className="font-medium flex-grow min-w-40 ml-4">
              {person.Name}
            </span>
            <Input
              className="flex-grow-0"
              placeholder="Nhân vật"
              onChange={(e) => handleCharacterChange(person.Id, e.target.value)}
              value={cast.Character || ''}
            />
          </div>
        ) : null;
      })}
    </div>
  );
}
