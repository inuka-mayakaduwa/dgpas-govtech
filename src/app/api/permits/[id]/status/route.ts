import { NextRequest, NextResponse } from 'next/server';
import { updatePermitStatusSchema } from '@/validators/permitSchema';
import { permitService } from '@/services/permitService';
import { AppError } from '@/lib/errors';
import { z } from 'zod';

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();

        // Validation
        const { status } = updatePermitStatusSchema.parse(body);

        const updatedPermit = await permitService.updatePermitStatus(id, status);

        return NextResponse.json(updatedPermit);

    } catch (error: unknown) {
        // Handle Zod Validation Errors
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Validation Error', details: error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        // Handle our Custom App Errors (NotFoundError, ValidationError, etc.)
        if (error instanceof AppError) {
            return NextResponse.json(
                { error: error.message },
                { status: error.statusCode }
            );
        }

        // Fallback for unexpected system errors
        console.error('Unhandled Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}