import { NextRequest, NextResponse } from 'next/server';
import { createPermitSchema } from '@/validators/permitSchema';
import { permitService } from '@/services/permitService';
import { PermitStatus } from '@/types';
import { AppError } from '@/lib/errors';
import { z } from 'zod';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const validatedData = createPermitSchema.parse(body);

        const permit = await permitService.createPermit(validatedData);

        return NextResponse.json(permit, { status: 201 });
    } catch (error: unknown) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Validation Error', details: error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        // Handle custom application errors
        if (error instanceof AppError) {
            return NextResponse.json({ error: error.message }, { status: error.statusCode });
        }

        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const rawStatus = searchParams.getAll('status');
        const validStatuses = rawStatus
            .flatMap(s => s.split(','))
            .filter((s): s is PermitStatus => Object.values(PermitStatus).includes(s as PermitStatus));

        const statusFilter = validStatuses.length > 0
            ? (validStatuses.length === 1 ? validStatuses[0] : validStatuses)
            : undefined;

        const permits = await permitService.listPermits(statusFilter);
        return NextResponse.json(permits);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch permits' }, { status: 500 });
    }
}