import { PrismaClient, Topics } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();
export async function GET() {
  try {
    const topics: Topics[] = await prisma.topics.findMany();
    return NextResponse.json(topics, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error', details: error },
      { status: 500 }
    );
  }
}
