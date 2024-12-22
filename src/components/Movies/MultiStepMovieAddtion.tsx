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
import { CalendarIcon, ArrowLeft, Link } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEdgeStore } from '@/lib/edgestore';
import { SingleImageDropzone } from '../SingleImageDropzone';

const steps = [
  { id: 1, title: 'Thông tin phim' },
  { id: 2, title: 'Tải phim lên' },
  { id: 3, title: 'Đội ngũ sản xuất' },
  { id: 4, title: 'Diễn viên tham gia' },
];

export function MultiStepMovieAddition() {
  const [currentStep, setCurrentStep] = useState(1);
  const [date, setDate] = useState<Date>();

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
              <MovieImageUpload />
              <MovieInfoForm date={date} setDate={setDate} />
              <MovieTypeSelection />
            </>
          )}
          {currentStep === 2 && <UploadMovie />}
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

function MovieImageUpload() {
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
          onChange={(file) => {
            setBackdropImage(file);
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
          onChange={(file) => {
            setPosterImage(file);
          }}
        />
      </div>
    </div>
  );
}

function MovieInfoForm({
  date,
  setDate,
}: {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}) {
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
            {date ? format(date, 'PPP') : <span>Ngày phát hành</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <Textarea placeholder="Tổng quan" />
      <Input placeholder="Thể loại" />
    </div>
  );
}

function MovieTypeSelection() {
  const [selectedType, setSelectedType] = useState<'single' | 'series'>(
    'single'
  );

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

function UploadMovie() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Tải phim lên</h2>
      <Input type="file" accept="video/*" />
      <p className="text-sm text-gray-500">
        Hỗ trợ các định dạng: MP4, AVI, MKV (tối đa 5GB)
      </p>
    </div>
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
