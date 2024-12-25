'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useMemo, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import EpisodeItem from './EpisodeItem';
import { Episodes } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { CustomDetailFilmType } from '@/types/customTypes';

export default function EpisodeForm({
  seasonId,
  newFilm,
  setNewFilm,
}: {
  seasonId: string;
  newFilm: CustomDetailFilmType;
  setNewFilm: (newFilm: any) => void;
}) {
  const currentSeason = newFilm.Seasons.find(
    (season) => season.Id === seasonId
  );
  const episodes = currentSeason ? currentSeason.Episodes : [];

  const addEpisode = () => {
    const newEpisode: Episodes = {
      Id: uuidv4(),
      Order: episodes.length + 1,
      Title: 'Tập mới',
      Summary: 'Tóm tắt tập mới',
      Source: '',
      Duration: 30,
      IsFree: false,
      SeasonId: '1',
      StillPath: '',
    };

    setNewFilm((prevFilm: any) => {
      const updatedSeasons = prevFilm.Seasons.map((season: any) => {
        if (season.Id === currentSeason?.Id) {
          return {
            ...season,
            Episodes: [...season.Episodes, newEpisode],
          };
        }
        return season;
      });

      // Ensure to include all properties of CustomDetailFilmType
      return {
        ...prevFilm,
        Seasons: updatedSeasons,
      };
    });
  };

  const removeEpisode = (id: string) => {
    setNewFilm((prevFilm: any) => {
      const updatedSeasons = prevFilm.Seasons.map((season: any) => {
        if (season.Id === currentSeason?.Id) {
          return {
            ...season,
            Episodes: season.Episodes.filter(
              (episode: any) => episode.Id !== id
            ),
          };
        }
        return season;
      });

      return {
        ...prevFilm,
        Seasons: updatedSeasons,
      };
    });
  };

  const updateEpisode = (
    id: string,
    field: string | number | symbol,
    value: string | boolean
  ) => {
    setNewFilm((prevFilm: any) => {
      const updatedSeasons = prevFilm.Seasons.map((season: any) => {
        if (season.Id === currentSeason?.Id) {
          return {
            ...season,
            Episodes: season.Episodes.map((episode: any) =>
              episode.Id === id ? { ...episode, [field]: value } : episode
            ),
          };
        }
        return season;
      });

      return {
        ...prevFilm,
        Seasons: updatedSeasons,
      };
    });
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(episodes);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update the order for all episodes
    const updatedItems = items.map((item, index) => ({
      ...item,
      Order: index + 1,
    }));

    setNewFilm((prevFilm: any) => {
      const updatedSeasons = prevFilm.Seasons.map((season: any) => {
        if (season.Id === currentSeason?.Id) {
          return {
            ...season,
            Episodes: updatedItems,
          };
        }
        return season;
      });

      return {
        ...prevFilm,
        Seasons: updatedSeasons,
      };
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Card className="bg-[#d4d7de42] border-[#d4d7ded4]">
        <CardContent className="p-5 space-y-6">
          <Droppable droppableId="episodes">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {episodes.map((episode, index) => (
                  <Draggable
                    key={episode.Id}
                    draggableId={episode.Id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <EpisodeItem
                          episode={episode}
                          onRemove={() => removeEpisode(episode.Id)}
                          onUpdate={(
                            field: string | number | symbol,
                            value: string | boolean
                          ) => updateEpisode(episode.Id, field, value)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <div className="flex items-center justify-center">
            <Button
              variant="outline"
              className="rounded-full bg-red-700 hover:bg-red-800"
              size="icon"
              onClick={addEpisode}
            >
              <Plus className="w-5 h-5 text-white" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </DragDropContext>
  );
}
