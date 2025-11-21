import { NextResponse } from 'next/server';
import { generateQRPayload } from '@/lib/qrEncrypt';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
        return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    try {
        const payload = generateQRPayload(sessionId);
        return NextResponse.json({ payload });
    } catch (error) {
        console.error('QR Generation Error:', error);
        return NextResponse.json({ error: 'Failed to generate QR' }, { status: 500 });
    }
}
