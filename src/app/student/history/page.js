import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import AttendanceRecord from '@/models/AttendanceRecord';
import ClassSession from '@/models/ClassSession';
import Course from '@/models/Course';
import Card from '@/components/ui/Card';

export const dynamic = 'force-dynamic';

async function getHistory(studentId) {
  await dbConnect();

  const records = await AttendanceRecord.find({ studentId })
    .populate({
      path: 'sessionId',
      model: ClassSession,
      populate: {
        path: 'subjectId',
        model: Course,
      },
    })
    .sort({ createdAt: -1 })
    .lean();

  return records.map((rec) => ({
    id: rec._id.toString(),
    date: rec.createdAt,
    status: rec.status, // PRESENT / ABSENT / LATE / EXCUSED
    flags: rec.flags || [],
    deviceId: rec.deviceId || null,
    ipAddress: rec.ipAddress || 'N/A',
    subject:
      rec.sessionId?.subjectId?.name ||
      rec.sessionId?.subjectId?.code ||
      'Unknown Subject',
    time: rec.markedAt ? rec.markedAt.toLocaleTimeString() : '',
  }));
}

export default async function StudentHistoryPage() {
  const session = await getSession();
  const records = await getHistory(session.user._id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <header className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Attendance History
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Past sessions marked using your registered device.
        </p>
      </header>

      {/* Empty State */}
      {records.length === 0 && (
        <Card className="p-10 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No attendance records found yet.
          </p>
        </Card>
      )}

      {records.length > 0 && (
        <>
          {/* Mobile Cards */}
          <div className="space-y-4 md:hidden">
            {records.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 dark:border-gray-800 p-4 rounded-xl bg-white dark:bg-[#111113] shadow-sm"
              >
                <div className="flex justify-between items-center mb-1">
                  <p className="font-medium text-sm">{item.subject}</p>
                  <StatusBadge status={item.status} flags={item.flags} />
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {new Date(item.date).toLocaleDateString()} · {item.time}
                </p>

                <p className="text-[11px] text-gray-500 mt-2">
                  Device: {item.deviceId ? `${item.deviceId.slice(0, 12)}...` : 'Unknown'}
                </p>
                <p className="text-[11px] text-gray-500">
                  IP: {item.ipAddress}
                </p>

                {item.flags?.length > 0 && (
                  <p className="mt-2 text-[11px] text-amber-600">
                    Flags: {item.flags.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 dark:bg-[#0f0f11]">
                <tr className="text-left text-xs uppercase text-gray-500 tracking-wide">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Device</th>
                  <th className="py-3 px-4">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {records.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 dark:hover:bg-[#151518] text-sm"
                  >
                    <td className="px-4 py-3">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">{item.subject}</td>
                    <td className="px-4 py-3">{item.time}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={item.status} flags={item.flags} />
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-gray-500">
                      {item.deviceId ? `${item.deviceId.slice(0, 14)}...` : 'Unknown'}
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-gray-500">
                      {item.ipAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function StatusBadge({ status, flags }) {
  const isFlagged = flags && flags.length > 0;
  const base = 'px-2 py-1 rounded-full text-xs font-semibold';

  if (isFlagged) {
    return (
      <span className={`${base} bg-amber-600/15 text-amber-700`}>
        Proxy / Flagged
      </span>
    );
  }

  if (status === 'PRESENT') {
    return (
      <span className={`${base} bg-emerald-600/15 text-emerald-700`}>
        Present
      </span>
    );
  }

  if (status === 'LATE') {
    return (
      <span className={`${base} bg-blue-600/15 text-blue-700`}>
        Late
      </span>
    );
  }

  if (status === 'EXCUSED') {
    return (
      <span className={`${base} bg-indigo-600/15 text-indigo-700`}>
        Excused
      </span>
    );
  }

  return (
    <span className={`${base} bg-red-600/15 text-red-700`}>
      Absent
    </span>
  );
}
