import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Batch from '@/models/Batch';

export async function GET(request) {
    try {
        await dbConnect();
        const batches = await Batch.find({}).sort({ name: 1 });
        return NextResponse.json({ success: true, batches }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await dbConnect();
        const body = await request.json();

        if (!body.name || !body.section || !body.department || !body.year) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const batch = await Batch.create(body);
        return NextResponse.json({ success: true, batch }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

