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
import { CalendarIcon, ArrowLeft, X, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEdgeStore } from '@/lib/edgestore';
import { SingleImageDropzone } from '../SingleImageDropzone';
import { vi } from 'date-fns/locale';
import { GenreSelect } from './GenreSelect';
import { FileState, MultiFileDropzone } from '../MultiFileDropzone';
import { Switch } from '../ui/switch';
import { Episodes, Seasons } from '@prisma/client';
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

const steps = [
  { id: 1, title: 'Thông tin phim' },
  { id: 2, title: 'Tải phim lên' },
  { id: 3, title: 'Đội ngũ sản xuất' },
  { id: 4, title: 'Diễn viên tham gia' },
];

export function MultiStepMovieAddition() {
  // Film được tạo
  const [newFilm, setNewFilm] = useState<CustomDetailFilmType>({
    Id: uuidv4(),
    Name: '',
    Overview: '',
    BackdropPath: '',
    PosterPath: '',
    ContentRating: '',
    ReleaseDate: new Date(),
    GenreFilms: [],
    Seasons: [],
    Crews: [],
    Casts: [],
  });

  useEffect(() => {
    console.log(newFilm, 'newFilmmmm');
  });

  const [currentStep, setCurrentStep] = useState(1);
  // Variables for step 1
  const [backdropImage, setBackdropImage] = useState<File>();
  const [backdropUrl, setBackdropUrl] = useState<{
    url: string;
    thumbnailUrl: string | null;
  }>();
  const [posterImage, setPosterImage] = useState<File>();
  const [posterUrl, setPosterUrl] = useState<{
    url: string;
    thumbnailUrl: string | null;
  }>();
  const { edgestore } = useEdgeStore();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [date, setDate] = useState<Date>();
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
                backdropImage={backdropImage}
                setBackdropImage={setBackdropImage}
                backdropUrl={backdropUrl}
                setBackdropUrl={setBackdropUrl}
                posterImage={posterImage}
                setPosterImage={setPosterImage}
                posterUrl={posterUrl}
                setPosterUrl={setPosterUrl}
              />
              <MovieInfoForm
                date={date}
                setDate={setDate}
                selectedGenres={selectedGenres}
                setSelectedGenres={setSelectedGenres}
              />
              <MovieTypeSelection
                selectedType={selectedType}
                setSelectedType={setSelectedType}
              />
            </>
          )}
          {currentStep === 2 &&
            (selectedType === 'single' ? (
              <UploadMovieSingle
                fileStates={fileStates}
                setFileStates={setFileStates}
                edgestore={edgestore}
                episodes={episodes}
                setEpisodes={setEpisodes}
              />
            ) : (
              <UploadMovieSeries newFilm={newFilm} setNewFilm={setNewFilm} />
            ))}
          {currentStep === 3 && <ProductionTeam />}
          {currentStep === 4 && <CastMembers />}
          <div className="flex justify-between">
            {currentStep > 1 && (
              <Button onClick={prevStep} variant="outline">
                Quay lại
              </Button>
            )}
            <Button
              onClick={nextStep}
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
  backdropImage,
  setBackdropImage,
  backdropUrl,
  setBackdropUrl,
  posterImage,
  setPosterImage,
  posterUrl,
  setPosterUrl,
}: {
  backdropImage: File | undefined;
  setBackdropImage: (file: File) => void;
  backdropUrl: { url: string; thumbnailUrl: string | null } | undefined;
  setBackdropUrl: (url: { url: string; thumbnailUrl: string | null }) => void;
  posterImage: File | undefined;
  setPosterImage: (file: File) => void;
  posterUrl: { url: string; thumbnailUrl: string | null } | undefined;
  setPosterUrl: (url: { url: string; thumbnailUrl: string | null }) => void;
}) {
  useEffect(() => {
    if (backdropUrl) {
      console.log(backdropUrl, 'backdroppppp');
    }
  }, [backdropUrl]);

  return (
    <div className="space-y-6 mb-20">
      {/* <div
        className="relative h-[633.77px] bg-[#f1f1f1] rounded-[5px] flex flex-col items-center justify-center mb-8 cursor-pointer"
        onClick={async () => {
          if (backdropImage) {
            const res = await edgestore.myPublicImages.upload({
              file: backdropImage,
              onProgressChange: (progress) => {
                // you can use this to show a progress bar
                console.log(progress);
              },
            });

            // save data here
            setBackdropUrl({
              url: res.url,
              thumbnailUrl: 'thumbnailUrl' in res ? res.thumbnailUrl : '',
            });
          }
        }}
      >
        <input
          type="file"
          id="backdropUpload"
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            setBackdropImage(e.target.files?.[0]);
          }}
        />
        <img
          src={backdropImage}
          alt="Backdrop placeholder"
          className="w-[593px] h-[189px] mb-4"
        />
        <p className="text-lg">
          <span className="font-bold text-[#7a7474] underline">Nhấn</span>
          <span className="font-light"> để chọn Backdrop</span>
        </p>
      </div> */}
      <div className="relative h-[633.77px] bg-[#f1f1f1] rounded-[5px] flex flex-col items-center justify-center mb-8 cursor-pointer">
        <SingleImageDropzone
          width={800}
          height={600}
          value={backdropImage}
          onChange={(file?: File) => {
            if (file) {
              setBackdropImage(file);
            }
          }}
        />
        {/* Nút submit sẽ xử lý vấn đề này */}
        {/* <Button
          onClick={async () => {
            if (backdropImage) {
              const res = await edgestore.myPublicImages.upload({
                file: backdropImage,
                onProgressChange: (progress) => {
                  // you can use this to show a progress bar
                  console.log(progress);
                },
              });
              // you can run some server action or api here
              // to add the necessary data to your database
              setBackdropUrl({
                url: res.url,
                thumbnailUrl: 'thumbnailUrl' in res ? res.thumbnailUrl : '',
              });
            }
          }}
        >
          Upload
        </Button>
        {backdropUrl?.url && (
          <Link href={backdropUrl.url} target="_blank"></Link>
        )}
        {backdropUrl?.thumbnailUrl && (
          <Link href={backdropUrl.thumbnailUrl} target="_blank"></Link>
        )} */}
      </div>

      <div className="absolute left-[650px] top-[350px] w-[287.48px] h-[437.01px] bg-[#f1f1f1] rounded-[10px] border-8 border-white flex flex-col items-center justify-center">
        <SingleImageDropzone
          width={250}
          height={400}
          value={posterImage}
          onChange={(file?: File) => {
            if (file) {
              setPosterImage(file);
            }
          }}
        />
      </div>
    </div>
  );
}

function MovieInfoForm({
  date,
  setDate,
  selectedGenres,
  setSelectedGenres,
}: {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  selectedGenres: string[];
  setSelectedGenres: (genres: string[]) => void;
}) {
  useEffect(() => {
    console.log(selectedGenres);
  }, [selectedGenres]);

  return (
    <div className="space-y-4">
      <Input placeholder="Tên phim" />
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              format(date, 'dd/MM/yyyy', { locale: vi })
            ) : (
              <span>Ngày phát hành</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
            locale={vi}
          />
        </PopoverContent>
      </Popover>
      <Textarea placeholder="Tổng quan" />

      <GenreSelect onChange={setSelectedGenres} />
    </div>
  );
}

function MovieTypeSelection({
  selectedType,
  setSelectedType,
}: {
  selectedType: 'single' | 'series';
  setSelectedType: (type: 'single' | 'series') => void;
}) {
  return (
    <div className="flex gap-4">
      <div
        className={`flex-1 p-4 rounded-md shadow border cursor-pointer transition-all duration-200 ${
          selectedType === 'single'
            ? 'bg-[#ffefe7] border-[#da9687]'
            : 'border-gray-200 hover:border-[#da9687]'
        }`}
        onClick={() => setSelectedType('single')}
      >
        <div className="p-2 bg-[#ff606b] rounded-lg w-fit">
          {/* Add your icon here */}
        </div>
        <h3 className="mt-3 text-base font-semibold text-[#0a090b]">Phim lẻ</h3>
        <p className="text-sm text-[#4f4d55]">Phim chỉ có một tập.</p>
      </div>

      <div
        className={`flex-1 p-4 rounded-md shadow border cursor-pointer transition-all duration-200 ${
          selectedType === 'series'
            ? 'bg-[#ffefe7] border-[#da9687]'
            : 'border-gray-200 hover:border-[#da9687]'
        }`}
        onClick={() => setSelectedType('series')}
      >
        <div className="p-2 bg-[#ff606b] rounded-lg w-fit">
          {/* Add your icon here */}
        </div>
        <h3 className="mt-3 text-base font-semibold text-[#0a090b]">Phim bộ</h3>
        <p className="text-sm text-[#4f4d55]">
          Loại phim dài tập, thường chia thành nhiều mùa.
        </p>
      </div>
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    if (!newSeasonName) return; // Prevent adding empty season names
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

function ProductionTeam() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Đội ngũ sản xuất</h2>
      <Input placeholder="Đạo diễn" />
      <Input placeholder="Nhà sản xuất" />
      <Input placeholder="Biên kịch" />
    </div>
  );
}

function CastMembers() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Diễn viên tham gia</h2>
      <Input placeholder="Diễn viên 1" />
      <Input placeholder="Diễn viên 2" />
      <Input placeholder="Diễn viên 3" />
      <Button variant="outline">Thêm diễn viên</Button>
    </div>
  );
}
