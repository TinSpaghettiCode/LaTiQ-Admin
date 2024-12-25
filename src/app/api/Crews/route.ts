import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST() {
  const dummyCrewData = {
    Id: uuidv4(), // UUID
    Role: 'Director', // Vai trò trong phim
    FilmId: 'c2ce00c5-4675-427c-9a21-6306cfcc44e1', // UUID của Films
    PersonId: 'e9b1c8d8-1234-4c12-b7e4-56789abcdef0', // UUID của Persons
    // FilmId: '',
    // PersonId: '',
  };
  try {
    const newCrew = await prisma.crews.create({
      data: dummyCrewData,
    });

    return NextResponse.json(newCrew, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error', details: error },
      { status: 500 }
    );
  }
}
