import { NextResponse } from 'next/server';
import { PrismaClient, Genres } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const genres: Genres[] = await prisma.genres.findMany();

  return NextResponse.json(genres, { status: 200 });
}
