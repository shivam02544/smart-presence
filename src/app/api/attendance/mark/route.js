import dbConnect from "@/lib/db";
import AttendanceRecord from "@/models/AttendanceRecord";
import ClassSession from "@/models/ClassSession";
import User from "@/models/User";
import { verifyQRPayload } from "@/lib/qrEncrypt";
import { getSession } from "@/lib/auth";
import StudentProfile from "@/models/StudentProfile";
import { NextResponse } from "next/server";

/**
 * POST /api/attendance/mark
 *
 * Accepts either:
 *  - { sessionCode, deviceId, time }
 *  - { qrPayload, deviceId, time }
 * 
 * Auto-detect logged-in student from JWT (via request headers)
 */

export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json();
    const { sessionCode, qrPayload, deviceId, time } = body;

    // ---- 1) Identify user (student) ----
    const authSession = await getSession();

    if (!authSession || authSession.user.role !== 'STUDENT') {
      return NextResponse.json(
        { error: "Unauthenticated — login required." },
        { status: 401 }
      );
    }

    const student = await User.findById(authSession.user._id);

    if (!student)
      return NextResponse.json(
        { error: "Student account not found." },
        { status: 404 }
      );

    // ---- 2) Resolve Session ----
    let session;

    // If QR payload provided → verify
    if (qrPayload) {
      const result = verifyQRPayload(qrPayload);
      if (!result.valid) {
        return NextResponse.json(
          { error: result.reason || "Invalid or expired QR." },
          { status: 400 }
        );
      }
      session = await ClassSession.findById(result.sessionId);
    } else if (sessionCode) {
      // Look up session by session code
      session = await ClassSession.findOne({ sessionCode });
    } else {
      return NextResponse.json(
        { error: "Either sessionCode or qrPayload is required." },
        { status: 400 }
      );
    }

    if (!session)
      return NextResponse.json(
        { error: "Session not found or expired." },
        { status: 404 }
      );

    // ---- 3) Prevent duplicates ----
    const existing = await AttendanceRecord.findOne({
      sessionId: session._id,
      studentId: student._id,
    });

    if (existing)
      return NextResponse.json(
        { error: "Attendance already marked." },
        { status: 409 }
      );

    // ---- 4) Record attendance ----
    const userAgent = req.headers.get("user-agent") || "Unknown";
    const ipAddress = req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "Unknown";

    // Check for suspicious activity
    const flags = [];
    const previousRecords = await AttendanceRecord.find({ studentId: student._id });

    // Check if device was used by another student in this session
    const deviceUsed = await AttendanceRecord.findOne({
      sessionId: session._id,
      deviceId: deviceId,
      studentId: { $ne: student._id }
    });

    if (deviceUsed) {
      flags.push("SUSPICIOUS_DEVICE");
    }

    // Check if student has multiple devices registered
    const uniqueDevices = new Set(previousRecords.map(r => r.deviceId).filter(Boolean));
    if (uniqueDevices.size > 2 && !uniqueDevices.has(deviceId)) {
      flags.push("MULTIPLE_DEVICES");
    }

    const record = await AttendanceRecord.create({
      studentId: student._id,
      sessionId: session._id,
      deviceId,
      ipAddress,
      markedAt: time ? new Date(time) : new Date(),
      status: "PRESENT",
      markedBy: "STUDENT",
      flags,
    });

    // ---- 5) Fetch Profile & Format Response ----
    const profile = await StudentProfile.findOne({ userId: student._id });

    const formattedRecord = {
      sessionId: session._id,
      studentId: student._id,
      roll: profile?.rollNumber || student.email.split('@')[0],
      name: student.name,
      status: "PRESENT",
      device: deviceId.slice(0, 8) + "...",
      browser: userAgent.includes('Chrome') ? 'Chrome' : 'Other',
      ip: ipAddress,
      joinTime: new Date().toLocaleTimeString(),
      flags
    };

    return NextResponse.json({
      success: true,
      message: "Attendance marked successfully.",
      record: formattedRecord,
    });
  } catch (err) {
    console.error("Attendance Error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
