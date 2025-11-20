import dbConnect from "@/lib/db";
import AttendanceRecord from "@/models/AttendanceRecord";
import User from "@/models/User";
import ClassSession from "@/models/ClassSession";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    if (!start || !end) {
      return Response.json(
        { success: false, error: "Missing date range." },
        { status: 400 }
      );
    }

    const records = await AttendanceRecord.find({
      markedAt: {
        $gte: new Date(start),
        $lte: new Date(end),
      },
    })
      .populate({ path: "studentId", model: User, select: "name rollNo" })
      .populate({ path: "sessionId", model: ClassSession })
      .sort({ markedAt: -1 })
      .lean();

    const formatted = records.map((rec) => ({
      name: rec.studentId?.name || "Unknown",
      roll: rec.studentId?.rollNo || "-",
      course: rec.sessionId?.course || "Unknown",
      status:
        rec.flags && rec.flags.length > 0
          ? "FLAGGED"
          : rec.status || "PRESENT",
      time: rec.markedAt ? new Date(rec.markedAt).toLocaleString() : "-",
      device: rec.deviceInfo || "Unknown",
      ip: rec.ipAddress || "Unknown",
    }));

    return Response.json({ success: true, data: formatted });
  } catch (err) {
    console.error(err);
    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
