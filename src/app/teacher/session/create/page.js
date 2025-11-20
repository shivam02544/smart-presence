'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Play, Clock, BookOpen, Users } from 'lucide-react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

function CreateSessionPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState([]);
    const [batches, setBatches] = useState([]);

    const [formData, setFormData] = useState({
        subjectId: '',
        batchId: '',
        duration: 60,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const coursesRes = await fetch('/api/courses');
                if (coursesRes.ok) {
                    const coursesData = await coursesRes.json();
                    if (coursesData.success) {
                        setCourses(coursesData.courses || []);
                    }
                }

                const batchesRes = await fetch('/api/batches');
                if (batchesRes.ok) {
                    const batchesData = await batchesRes.json();
                    if (batchesData.success) {
                        setBatches(batchesData.batches || []);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            router.push(`/teacher/session/${data.session._id}`);
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 lg:p-8">
            <div className="max-w-[800px] mx-auto">
                {/* Back Link */}
                <Link 
                    href="/teacher/dashboard" 
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-700 mb-6 transition-colors group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
                    <span className="text-sm font-medium">Back to Dashboard</span>
                </Link>

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Start New Session
                    </h1>
                    <p className="text-gray-600">
                        Create a live attendance session for your class
                    </p>
                </div>

                {/* Form Card */}
                <Card>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Session Details Section */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900 pb-3 border-b border-gray-200">
                                Session Details
                            </h3>

                            {/* Subject/Course */}
                            <div>
                                {courses.length > 0 ? (
                                    <Input
                                        label="Subject / Course"
                                        variant="select"
                                        icon={<BookOpen size={18} />}
                                        value={formData.subjectId}
                                        onChange={e => setFormData({ ...formData, subjectId: e.target.value })}
                                        required
                                        options={[
                                            { value: '', label: 'Select a Course' },
                                            ...courses.map(course => ({
                                                value: course._id,
                                                label: `${course.code} - ${course.name}`
                                            }))
                                        ]}
                                    />
                                ) : (
                                    <Input
                                        label="Subject / Course"
                                        type="text"
                                        icon={<BookOpen size={18} />}
                                        placeholder="Enter Subject ID"
                                        value={formData.subjectId}
                                        onChange={e => setFormData({ ...formData, subjectId: e.target.value })}
                                        required
                                    />
                                )}
                            </div>

                            {/* Batch/Class */}
                            <div>
                                {batches.length > 0 ? (
                                    <Input
                                        label="Batch / Class"
                                        variant="select"
                                        icon={<Users size={18} />}
                                        value={formData.batchId}
                                        onChange={e => setFormData({ ...formData, batchId: e.target.value })}
                                        required
                                        options={[
                                            { value: '', label: 'Select a Batch' },
                                            ...batches.map(batch => ({
                                                value: batch._id,
                                                label: `${batch.name} - Section ${batch.section}`
                                            }))
                                        ]}
                                    />
                                ) : (
                                    <Input
                                        label="Batch / Class"
                                        type="text"
                                        icon={<Users size={18} />}
                                        placeholder="Enter Batch ID"
                                        value={formData.batchId}
                                        onChange={e => setFormData({ ...formData, batchId: e.target.value })}
                                        required
                                    />
                                )}
                            </div>
                        </div>

                        {/* Duration Section */}
                        <div className="space-y-6 pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Duration
                            </h3>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                    <Clock size={16} className="text-purple-700" />
                                    <span>Session Duration (minutes)</span>
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="10"
                                        max="180"
                                        step="5"
                                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-700"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                    />
                                    <div className="bg-purple-50 border border-purple-200 px-4 py-2 rounded-lg min-w-[80px] text-center">
                                        <span className="text-2xl font-bold text-purple-700">{formData.duration}</span>
                                        <span className="text-xs text-gray-600 ml-1">min</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
                            <Link href="/teacher/dashboard">
                                <Button variant="secondary" size="medium">
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                variant="primary"
                                size="medium"
                                isLoading={loading}
                                leftIcon={!loading && <Play size={18} />}
                            >
                                {loading ? 'Creating...' : 'Create & Start'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}

export default CreateSessionPage;
