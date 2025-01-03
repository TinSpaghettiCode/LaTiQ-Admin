import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { X } from 'lucide-react';
import { Episodes } from '@prisma/client';
import { FileState, MultiFileDropzone } from '../MultiFileDropzone';
import { useEdgeStore } from '@/lib/edgestore';
import { Upload } from 'lucide-react';

interface EpisodeItemProps {
  episode: Episodes;
  onRemove: () => void;
  onUpdate: (field: string | number | symbol, value: string | boolean) => void;
  existingFiles?: { name: string; size: number; url: string }[];
}

export default function EpisodeItem({
  episode,
  onRemove,
  onUpdate,
}: EpisodeItemProps) {
  const [error, setError] = useState<string | null>(null); // Trạng thái để lưu thông báo lỗi
  const [confirmUploadVideo, setConfirmUploadVideo] = useState<boolean>(false);
  const [confirmUploadStill, setConfirmUploadStill] = useState<boolean>(false);

  // Quản lý video & ảnh tĩnh
  const [videoFileStates, setVideoFileStates] = useState<FileState[]>([]);
  const [stillPathStates, setStillPathStates] = useState<FileState[]>([]);

  // Hàm để lấy phần mở rộng từ loại MIME
  function getFileExtension(mimeType: string): string {
    switch (mimeType) {
      case 'video/mp4':
        return 'mp4';
      case 'image/jpeg':
        return 'jpg';
      case 'image/png':
        return 'png';
      // Thêm các loại MIME khác nếu cần
      default:
        return 'bin'; // Trả về 'bin' nếu không xác định được loại
    }
  }

  useEffect(() => {
    const loadFile = async (url: string, type: 'video' | 'image') => {
      const response = await fetch(url);
      const blob = await response.blob(); // Chuyển đổi phản hồi thành Blob
      const file = new File(
        [blob],
        `${type}_${episode.Order}.${getFileExtension(blob.type)}`, // Sử dụng hàm để lấy phần mở rộng từ loại MIME
        { type: blob.type } // Sử dụng loại MIME từ blob
      );
      return file;
    };

    // Tải video nếu có
    if (episode.Source) {
      loadFile(episode.Source, 'video').then((file) => {
        setVideoFileStates([{ file, key: episode.Id, progress: 'COMPLETE' }]);
      });
    }

    // Tải ảnh nếu có
    if (episode.StillPath) {
      loadFile(episode.StillPath, 'image').then((file) => {
        setStillPathStates([{ file, key: episode.Id, progress: 'COMPLETE' }]);
      });
    }
  }, [episode]);

  const { edgestore } = useEdgeStore();

  function updateFileProgress(
    key: string,
    progress: FileState['progress'],
    type: 'video' | 'still' // Tham số để xác định loại trạng thái tệp
  ) {
    if (type === 'video') {
      setVideoFileStates((videoFileStates: FileState[]) => {
        const newVideoFileStates = structuredClone(videoFileStates);
        const fileState = newVideoFileStates.find(
          (fileState) => fileState.key === key
        );
        if (fileState) {
          fileState.progress = progress;
        }
        return newVideoFileStates;
      });
    } else if (type === 'still') {
      setStillPathStates((stillPathStates: FileState[]) => {
        const newStillPathStates = structuredClone(stillPathStates);
        const fileState = newStillPathStates.find(
          (fileState) => fileState.key === key
        );
        if (fileState) {
          fileState.progress = progress;
        }
        return newStillPathStates;
      });
    }
  }

  const handleUpdate = (
    field: string | number | symbol,
    value: string | boolean
  ) => {
    // Kiểm tra các trường bắt buộc
    if (field === 'Title' && !value) {
      setError('Tiêu đề tập là bắt buộc.');
      return;
    }
    if (field === 'Summary' && !value) {
      setError('Phụ đề là bắt buộc.');
      return;
    }
    if (field === 'Duration') {
      const durationValue = Number(value); // Chuyển đổi giá trị thành số
      if (!value || isNaN(durationValue) || !Number.isInteger(durationValue)) {
        setError('Thời gian phải là một số nguyên và không được trống.');
        return;
      }
    }
    setError(null); // Xóa thông báo lỗi nếu tất cả các trường hợp đều hợp lệ
    onUpdate(field, value);
  };

  const handleUploadFiles = async (
    addedFiles: FileState[],
    type: 'video' | 'still'
  ) => {
    await Promise.all(
      addedFiles.map(async (addedFileState) => {
        try {
          const res = await edgestore.myPublicFiles.upload({
            file: addedFileState.file,
            options: {
              temporary: true,
            },
            onProgressChange: async (progress: number) => {
              updateFileProgress(addedFileState.key, progress, type); // Cập nhật tiến trình với loại tệp
              if (progress === 100) {
                // Chờ 1 giây để hiển thị thanh tiến trình ở 100%
                await new Promise((resolve) => setTimeout(resolve, 1000));
                updateFileProgress(addedFileState.key, 'COMPLETE', type); // Cập nhật trạng thái hoàn thành
              }
            },
          });

          if (type == 'still') {
            onUpdate('StillPath', res.url);
          } else {
            onUpdate('Source', res.url); // Cập nhật nguồn với URL đã tải lên
          }
        } catch (error) {
          updateFileProgress(addedFileState.key, 'ERROR', type); // Cập nhật trạng thái lỗi
          console.log(error, 'error upload video');
        }
      })
    );
  };

  return (
    <div>
      <div className="flex items-start gap-2.5">
        <div className="grid grid-cols-3 flex-1 gap-2.5 mt-2">
          <div>
            <span className="text-slate-500 text-sm">Tập phim</span>

            <Input
              className="h-[60px]"
              placeholder="Tiêu đề tập"
              value={episode.Title}
              onChange={(e) => handleUpdate('Title', e.target.value)}
            />
          </div>

          <div>
            <span className="text-slate-500 text-sm">Tóm tắt</span>
            <Input
              className="h-[60px]"
              placeholder="Phụ đề"
              value={episode.Summary}
              onChange={(e) => handleUpdate('Summary', e.target.value)}
            />
          </div>

          <div className="col-span-1 ">
            <span className="text-slate-500 text-sm">Thời lượng</span>
            <Input
              className="h-[60px]"
              placeholder="Thời lượng"
              value={episode.Duration}
              onChange={(e) => handleUpdate('Duration', e.target.value)}
            />
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-[60px] bg-movie-1-neutrals-neutrals100 hover:bg-slate-200"
          onClick={onRemove}
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}{' '}
      {/* Hiển thị thông báo lỗi */}
      <div className="flex items-center gap-2.5 mt-2.5">
        <span className="text-slate-500 text-sm pr-2">Upload phim</span>

        <MultiFileDropzone
          className="flex-grow min-h-[50px]"
          value={videoFileStates}
          onChange={(files) => {
            setVideoFileStates(files);
          }}
          dropzoneOptions={{
            maxFiles: 1,
            accept: {
              'video/mp4': ['.mp4'], // Only accept mp4 files
            },
          }}
        />

        {!confirmUploadVideo && (
          <Button
            className="ml-2 bg-red-700 hover:bg-red-800 rounded-sm"
            onClick={() => {
              setConfirmUploadVideo(true);
              handleUploadFiles(videoFileStates, 'video');
            }}
            disabled={videoFileStates.length === 0 || episode.Source !== ''}
          >
            <Upload className="w-5 h-5 text-white" />
          </Button>
        )}

        <div className="w-[237px] h-[60px] flex items-center justify-end gap-6">
          <span className="text-base opacity-80 ">Miễn phí</span>
          <Switch
            className="data-[state=checked]:bg-green-400"
            checked={episode.IsFree}
            onCheckedChange={(checked) => handleUpdate('IsFree', checked)}
          />
        </div>
      </div>
      <div className="flex items-center gap-2.5 mt-2.5">
        <span className="text-slate-500 text-sm">Upload ảnh</span>

        <MultiFileDropzone
          className="flex-grow min-h-[50px]"
          value={stillPathStates}
          onChange={(files) => {
            setStillPathStates(files);
          }}
          dropzoneOptions={{
            maxFiles: 1,
            accept: {
              'image/*': [],
            },
          }}
        />

        {!confirmUploadStill && (
          <Button
            className="ml-2 bg-red-700 hover:bg-red-800 rounded-sm"
            onClick={() => {
              setConfirmUploadStill(true);
              handleUploadFiles(stillPathStates, 'still');
            }}
            disabled={stillPathStates.length === 0 || episode.StillPath !== ''}
          >
            <Upload className="w-5 h-5 text-white" />
          </Button>
        )}
      </div>
      <Separator className="my-6 bg-neutral-300" />
    </div>
  );
}
