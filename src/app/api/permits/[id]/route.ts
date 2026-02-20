import { NextRequest, NextResponse } from 'next/server';
import { permitService } from '@/services/permitService';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Await params as per Next.js App Router rules
        const { id } = await params;

        const permit = await permitService.getPermit(id);

        if (!permit) {
            return NextResponse.json({ error: 'Permit not found' }, { status: 404 });
        }

        return NextResponse.json(permit);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
