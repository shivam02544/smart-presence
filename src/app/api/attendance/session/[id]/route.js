import dbConnect from '@/lib/db';
import AttendanceRecord from '@/models/AttendanceRecord';
import User from '@/models/User';
import ClassSession from '@/models/ClassSession';
import StudentProfile from '@/models/StudentProfile';

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { id: sessionId } = await params;

    const records = await AttendanceRecord.find({ sessionId })
      .populate({
        path: 'studentId',
        model: User,
        select: 'name email',
      })
      .populate({
        path: 'sessionId',
        model: ClassSession,
      })
      .sort({ createdAt: -1 })
      .lean();

    // Get student profiles for roll numbers
    const studentIds = records.map(r => r.studentId?._id).filter(Boolean);
    const profiles = await StudentProfile.find({ userId: { $in: studentIds } })
      .lean();
    const profileMap = new Map(profiles.map(p => [p.userId.toString(), p]));

    const formatted = records.map((rec) => {
      const profile = profileMap.get(rec.studentId?._id?.toString());
      const userAgent = rec.meta?.userAgent || 'Unknown';
      const browser = userAgent.includes('Chrome') ? 'Chrome' :
        userAgent.includes('Firefox') ? 'Firefox' :
          userAgent.includes('Safari') ? 'Safari' :
            userAgent.includes('Edge') ? 'Edge' : 'Unknown';

      return {
        roll: profile?.rollNumber || rec.studentId?.email?.split('@')[0] || '-',
        name: rec.studentId?.name || 'Unknown',
        joinTime: rec.markedAt ? new Date(rec.markedAt).toLocaleTimeString() : '-',
        leaveTime: rec.leaveTime ? new Date(rec.leaveTime).toLocaleTimeString() : null,
        device: rec.deviceId ? `${rec.deviceId.slice(0, 8)}...` : 'Unknown',
        browser: browser,
        ip: rec.ipAddress || 'Unknown',
        flags: rec.flags || [],
        status: rec.status || 'PRESENT',
      };
    });

    return Response.json({ success: true, records: formatted });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
