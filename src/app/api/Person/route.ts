// import { v4 as uuidv4 } from 'uuid';

import { Persons, PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { GET } from '../Film/route';

const prisma = new PrismaClient();

export async function POST() {
  const dummyPersonData = {
    Id: 'e9b1c8d8-1234-4c12-b7e4-56789abcdef0', // UUID
    Name: 'John Doe',
    Gender: 1, // 1: Male, 2: Female, etc.
    Popularity: 8.5,
    ProfilePath: '/images/john_doe.jpg',
    Biography: 'John Doe is an actor known for his remarkable performances.',
    KnownForDepartment: 'Acting',
    Dob: new Date('1985-06-15'), // Date of birth
  };
  try {
    const newPerson = await prisma.persons.create({
      data: dummyPersonData,
    });

    return NextResponse.json(newPerson, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error', details: error },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const persons: Persons[] = await prisma.persons.findMany();
    return NextResponse.json(persons, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error', details: error },
      { status: 500 }
    );
  }
}
