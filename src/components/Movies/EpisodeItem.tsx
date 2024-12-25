import React, { useState } from 'react';
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
  const [confirmUploaded, setConfirmUploaded] = useState<boolean>(false);

  // Quản lý video
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const { edgestore } = useEdgeStore();

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
    setError(null); // Xóa thông báo lỗi nếu tất cả các trường hợp đều hợp lệ
    onUpdate(field, value);
  };

  const handleUploadFiles = async (addedFiles: FileState[]) => {
    await Promise.all(
      addedFiles.map(async (addedFileState) => {
        try {
          const res = await edgestore.myPublicFiles.upload({
            file: addedFileState.file,
            options: {
              temporary: true,
            },
            onProgressChange: async (progress: number) => {
              updateFileProgress(addedFileState.key, progress);
              if (progress === 100) {
                // wait 1 second to set it to complete
                // so that the user can see the progress bar at 100%
                await new Promise((resolve) => setTimeout(resolve, 1000));
                updateFileProgress(addedFileState.key, 'COMPLETE');
              }
            },
          });

          onUpdate('Source', res.url);
        } catch (error) {
          updateFileProgress(addedFileState.key, 'ERROR');
          console.log(error, 'error upload video');
        }
      })
    );
  };

  return (
    <div>
      <div className="flex items-start gap-2.5">
        <div className="grid grid-cols-3 flex-1 gap-2.5">
          <Input
            className="h-[60px]"
            placeholder="Tiêu đề tập"
            value={episode.Title}
            onChange={(e) => handleUpdate('Title', e.target.value)}
          />
          <Input
            className="h-[60px] col-span-2"
            placeholder="Phụ đề"
            value={episode.Summary}
            onChange={(e) => handleUpdate('Summary', e.target.value)}
          />
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
        <MultiFileDropzone
          className="flex-grow min-h-[50px]"
          value={fileStates}
          onChange={(files) => {
            setFileStates(files);
          }}
          dropzoneOptions={{
            maxFiles: 1,
            accept: {
              'video/mp4': ['.mp4'], // Only accept mp4 files
            },
          }}
        />

        {!confirmUploaded && (
          <Button
            className="ml-2 bg-red-700 hover:bg-red-800 rounded-sm"
            onClick={() => {
              setConfirmUploaded(true);
              handleUploadFiles(fileStates);
            }}
            disabled={fileStates.length === 0}
          >
            <Upload className="w-5 h-5 text-white" />
          </Button>
        )}

        <div className="w-[237px] h-[60px] flex items-center justify-end gap-6">
          <span className="text-base opacity-80 ">Trả phí</span>
          <Switch
            className="data-[state=checked]:bg-green-400"
            checked={episode.IsFree}
            onCheckedChange={(checked) => handleUpdate('IsFree', checked)}
          />
        </div>
      </div>
      <Separator className="my-6 bg-neutral-300" />
    </div>
  );
}
