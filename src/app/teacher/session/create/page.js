'use client';

import { useState } from 'react';
import { BookOpen, Users, Clock, QrCode, Info } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

export default function CreateTeacherSession() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    course: '',
    section: '',
    duration: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setLoading(false);
    alert('Session Created (Hook backend)');
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade space-y-10">
      
      {/* Header */}
      <section>
        <h1 className="text-3xl font-semibold tracking-tight">
          Create Attendance Session
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Generate a secure session with QR validation and device lock.
        </p>
      </section>

      {/* Form Section */}
      <Card padding="lg" className="space-y-6">
        
        {/* QR Placeholder Box */}
        <div className="border border-gray-200 dark:border-gray-800 rounded-xl py-10 px-6 text-center bg-gray-50 dark:bg-[#111113]">
          <div className="mx-auto w-24 h-24 rounded-xl bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
            <QrCode size={42} className="text-gray-500" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            QR will generate after session is created.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Course Name"
            placeholder="Eg: Operating System"
            icon={<BookOpen size={18} />}
            required
            value={form.course}
            onChange={(e) => setForm({ ...form, course: e.target.value })}
          />

          <Input
            label="Class Section"
            placeholder="Eg: CSE-3A, MCA-1"
            icon={<Users size={18} />}
            required
            value={form.section}
            onChange={(e) => setForm({ ...form, section: e.target.value })}
          />

          <Input
            label="Session Duration (Minutes)"
            type="number"
            placeholder="Default: 10"
            icon={<Clock size={18} />}
            required
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
          />

          <Button
            type="submit"
            fullWidth
            size="lg"
            variant="gradient"
            isLoading={loading}
            className="mt-4"
          >
            Create Session
          </Button>
        </form>
      </Card>

      {/* Information Box */}
      <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-5 bg-white/50 dark:bg-[#111113]/40">
        <p className="flex items-center gap-2 text-sm font-medium mb-2">
          <Info size={16} className="text-purple-500" />
          Session Guidelines
        </p>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4 list-disc">
          <li>Students must scan using their registered device.</li>
          <li>The QR rotates automatically for security.</li>
          <li>You may reopen or close an existing session at any time.</li>
          <li>Proxy attempts are automatically flagged.</li>
        </ul>
      </div>

    </div>
  );
}