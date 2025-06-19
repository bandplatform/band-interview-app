import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ProgramType } from '@prisma/client';

export async function GET() {
  try {
    const programs = await prisma.program.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(programs);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch programs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, rate } = body;

    if (!name || !type || rate === undefined) {
      return NextResponse.json(
        { error: 'Name, type, and rate are required' },
        { status: 400 }
      );
    }

    if (!Object.values(ProgramType).includes(type)) {
      return NextResponse.json(
        { error: 'Invalid program type. Must be PER_DOLLAR or PER_UNIT' },
        { status: 400 }
      );
    }

    const program = await prisma.program.create({
      data: {
        name,
        type,
        rate: parseFloat(rate),
      },
    });

    return NextResponse.json(program, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create program' },
      { status: 500 }
    );
  }
}