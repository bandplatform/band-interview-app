import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ProgramType } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid program ID' },
        { status: 400 }
      );
    }

    const program = await prisma.program.findUnique({
      where: { id },
    });

    if (!program) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(program);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch program' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid program ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, type, rate } = body;

    const updateData: any = {};
    
    if (name !== undefined) updateData.name = name;
    if (type !== undefined) {
      if (!Object.values(ProgramType).includes(type)) {
        return NextResponse.json(
          { error: 'Invalid program type. Must be PER_DOLLAR or PER_UNIT' },
          { status: 400 }
        );
      }
      updateData.type = type;
    }
    if (rate !== undefined) updateData.rate = parseFloat(rate);

    const program = await prisma.program.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(program);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update program' },
      { status: 500 }
    );
  }
}