import dbConnect from '@/lib/db';
import AttendanceRecord from '@/models/AttendanceRecord';
import User from '@/models/User';
import ClassSession from '@/models/ClassSession';

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { id: sessionId } = params;

    const records = await AttendanceRecord.find({ sessionId })
      .populate({
        path: 'studentId',
        model: User,
        select: 'name rollNo email',
      })
      .populate({
        path: 'sessionId',
        model: ClassSession,
      })
      .sort({ createdAt: -1 })
      .lean();

    const formatted = records.map((rec) => ({
      roll: rec.studentId?.rollNo || '-',
      name: rec.studentId?.name || 'Unknown',
      joinTime: rec.markedAt ? new Date(rec.markedAt).toLocaleTimeString() : '-',
      leaveTime: rec.leaveTime ? new Date(rec.leaveTime).toLocaleTimeString() : null,
      device: rec.deviceInfo || 'Unknown',
      browser: rec.browser || 'Unknown',
      ip: rec.ipAddress || 'Unknown',
      flags: rec.flags || [],
      status: rec.status || 'UNKNOWN',
    }));

    return Response.json({ success: true, records: formatted });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
