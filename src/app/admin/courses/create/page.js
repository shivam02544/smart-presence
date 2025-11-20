'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CreateCoursePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        department: '',
        semester: 1,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/courses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Failed to create course');

            router.push('/admin/courses');
            router.refresh();
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 max-w-2xl mx-auto animate-fade-in">
            <div className="mb-6 md:mb-8">
                <Link 
                    href="/admin/courses" 
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 mb-4 transition-colors group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
                    <span>Back to Courses</span>
                </Link>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Add New Course
                </h1>
                <p className="text-sm md:text-base text-gray-400">
                    Create a new course for your curriculum
                </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-black/40 backdrop-blur-xl p-6 md:p-8 rounded-2xl shadow-lg border border-purple-500/20 space-y-6 animate-slide-up purple-glow">
                <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">
                        Course Name
                    </label>
                    <input
                        required
                        type="text"
                        placeholder="e.g. Data Structures and Algorithms"
                        className="w-full px-4 py-3 rounded-xl border-2 border-purple-500/30 bg-black/40 backdrop-blur-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all duration-200 placeholder:text-gray-500 text-white"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-200 mb-2">
                            Course Code
                        </label>
                        <input
                            required
                            type="text"
                            placeholder="e.g. CS101"
                            className="w-full px-4 py-3 rounded-xl border-2 border-purple-500/30 bg-black/40 backdrop-blur-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all duration-200 placeholder:text-gray-500 text-white uppercase"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-200 mb-2">
                            Semester
                        </label>
                        <input
                            required
                            type="number"
                            min="1"
                            max="8"
                            className="w-full px-4 py-3 rounded-xl border-2 border-purple-500/30 bg-black/40 backdrop-blur-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all duration-200 text-white"
                            value={formData.semester}
                            onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) || 1 })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">
                        Department
                    </label>
                    <input
                        required
                        type="text"
                        placeholder="e.g. Computer Science"
                        className="w-full px-4 py-3 rounded-xl border-2 border-purple-500/30 bg-black/40 backdrop-blur-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all duration-200 placeholder:text-gray-500 text-white"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    />
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-purple-500/20">
                    <Link
                        href="/admin/courses"
                        className="px-6 py-3 text-center text-gray-300 bg-black/60 border border-purple-500/30 rounded-xl hover:bg-purple-500/10 transition-all duration-200 font-medium"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-500 hover:to-pink-500 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed font-semibold purple-glow"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>Saving...</span>
                            </>
                        ) : (
                            <span>Save Course</span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
