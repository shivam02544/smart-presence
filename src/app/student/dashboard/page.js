'use client';

import { Calendar, QrCode, BarChart3, ShieldCheck } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function StudentDashboard() {

  // TODO: Replace mock with real server data (API fetch or DB query)
  const user = {
    name: "Student Name",
    roll: "23CS001",
    attendanceRate: "92%",
    totalSessions: 128,
    present: 118,
    flagged: 2
  };

  const quickActions = [
    {
      title: 'Mark Attendance',
      icon: <QrCode size={20} />,
      link: '/student/mark',
      variant: 'gradient'
    },
    {
      title: 'Attendance History',
      icon: <BarChart3 size={20} />,
      link: '/student/history',
      variant: 'outline'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 space-y-10 animate-fade">

      {/* Header */}
      <section>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Welcome, {user.name.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Roll Number: {user.roll}
        </p>
      </section>

      {/* Statistics Row */}
      <div className="grid gap-6 md:grid-cols-3">

        <Card padding="lg" className="text-center">
          <p className="text-xs text-gray-500">Attendance Rate</p>
          <p className="text-4xl font-semibold text-purple-600 dark:text-purple-400 mt-2">
            {user.attendanceRate}
          </p>
        </Card>

        <Card padding="lg" className="text-center">
          <p className="text-xs text-gray-500">Present</p>
          <p className="text-3xl font-semibold mt-2">{user.present}</p>
          <p className="text-xs text-gray-500">{user.totalSessions} total</p>
        </Card>

        <Card padding="lg" className="text-center">
          <p className="text-xs text-gray-500">Flags (Proxy/Suspicious)</p>
          <p
            className={`text-3xl font-semibold mt-2 ${
              user.flagged > 0
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-emerald-600'
            }`}
          >
            {user.flagged}
          </p>
        </Card>

      </div>

      {/* Quick Actions */}
      <Card padding="lg" className="space-y-5">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Calendar size={18} className="text-purple-500" /> Quick Actions
        </h2>

        <div className="grid gap-3 sm:grid-cols-2">
          {quickActions.map((action, i) => (
            <a key={i} href={action.link}>
              <Button
                fullWidth
                size="lg"
                variant={action.variant}
                className="gap-2"
              >
                {action.icon} {action.title}
              </Button>
            </a>
          ))}
        </div>
      </Card>

      {/* Security Message */}
      <Card padding="lg" className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <ShieldCheck size={18} className="text-purple-500" /> Attendance Security
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          Your attendance is verified using your registered device and IP address.
          Switching devices may trigger proxy detection warnings. To avoid being flagged,
          always scan QR or mark attendance using the same registered device.
        </p>
      </Card>
    </div>
  );
}
