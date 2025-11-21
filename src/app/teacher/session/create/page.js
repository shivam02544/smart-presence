'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Users, Clock, QrCode, Info } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/composite/LoadingSpinner';
import { useToast } from '@/providers/toast-provider';
import { apiUrl } from '@/lib/api';

export default function CreateTeacherSession() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [form, setForm] = useState({
    course: '',
    batch: '',
    duration: '60',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, batchesRes] = await Promise.all([
          fetch(apiUrl('/api/courses')),
          fetch(apiUrl('/api/batches'))
        ]);

        const coursesData = await coursesRes.json();
        const batchesData = await batchesRes.json();

        if (coursesData.success) {
          setCourses(coursesData.courses || []);
        }
        if (batchesData.success) {
          setBatches(batchesData.batches || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        showToast('Failed to load courses/batches', 'error');
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(apiUrl('/api/sessions'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectId: form.course,
          batchId: form.batch,
          duration: parseInt(form.duration) || 60,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create session');
      }

      showToast('Session created successfully!', 'success');

      // Redirect to the session page
      if (data.session?._id) {
        router.push(`/teacher/session/${data.session._id}`);
      } else {
        router.push('/teacher/dashboard');
      }
    } catch (error) {
      console.error('Error creating session:', error);
      showToast(error.message || 'Failed to create session', 'error');
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

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
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <BookOpen size={18} className="inline mr-2" />
              Course
            </label>
            <select
              required
              value={form.course}
              onChange={(e) => setForm({ ...form, course: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111113] text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.name} ({course.code})
                </option>
              ))}
            </select>
            {courses.length === 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Copy a Course ID from Admin {'->'} Courses for now.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Users size={18} className="inline mr-2" />
              Batch
            </label>
            <select
              required
              value={form.batch}
              onChange={(e) => setForm({ ...form, batch: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111113] text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select a batch</option>
              {batches.map((batch) => (
                <option key={batch._id} value={batch._id}>
                  {batch.name} - {batch.section}
                </option>
              ))}
            </select>
            {batches.length === 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Copy a Batch ID from Admin {'->'} Batches for now.
              </p>
            )}
          </div>

          <Input
            label="Session Duration (Minutes)"
            type="number"
            placeholder="Default: 60"
            icon={<Clock size={18} />}
            required
            min="10"
            max="180"
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