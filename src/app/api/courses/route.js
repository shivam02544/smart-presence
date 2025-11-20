import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Course from '@/models/Course';

export async function GET(request) {
    try {
        await dbConnect();
        const courses = await Course.find({}).sort({ code: 1 });
        return NextResponse.json({ success: true, courses }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await dbConnect();
        const body = await request.json();

        if (!body.name || !body.code || !body.department || !body.semester) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const course = await Course.create(body);
        return NextResponse.json({ success: true, course }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
