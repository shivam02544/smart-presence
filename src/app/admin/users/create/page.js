'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CreateUserPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState('STUDENT');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        department: '',
        rollNumber: '',
        batchId: '',
        employeeId: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, role }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            router.push('/admin/users');
            router.refresh();
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto animate-fade-in">
            <div className="mb-6 md:mb-8">
                <Link 
                    href="/admin/users" 
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 mb-4 transition-colors group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
                    <span>Back to Users</span>
                </Link>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Create New User
                </h1>
                <p className="text-sm md:text-base text-gray-400">
                    Add a new user to the system
                </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-black/40 backdrop-blur-xl p-6 md:p-8 rounded-2xl shadow-lg border border-purple-500/20 space-y-6 animate-slide-up purple-glow">
                {/* Role Selection */}
                <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-3">
                        User Role
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {['STUDENT', 'CR', 'TEACHER', 'ADMIN'].map((r) => (
                            <button
                                key={r}
                                type="button"
                                onClick={() => setRole(r)}
                                className={`py-3 px-4 text-sm font-semibold rounded-xl border-2 transition-all duration-200 ${
                                    role === r
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent shadow-lg shadow-purple-500/50 purple-glow'
                                        : 'bg-black/60 border-purple-500/30 text-gray-300 hover:border-purple-500 hover:bg-purple-500/10'
                                }`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Common Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-200 mb-2">
                            Full Name
                        </label>
                        <input
                            required
                            type="text"
                            placeholder="John Doe"
                            className="w-full px-4 py-3 rounded-xl border-2 border-purple-500/30 bg-black/40 backdrop-blur-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all duration-200 placeholder:text-gray-500 text-white"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-200 mb-2">
                            Email Address
                        </label>
                        <input
                            required
                            type="email"
                            placeholder="john@college.edu"
                            className="w-full px-4 py-3 rounded-xl border-2 border-purple-500/30 bg-black/40 backdrop-blur-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all duration-200 placeholder:text-gray-500 text-white"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-200 mb-2">
                            Password
                        </label>
                        <input
                            required
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-4 py-3 rounded-xl border-2 border-purple-500/30 bg-black/40 backdrop-blur-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all duration-200 placeholder:text-gray-500 text-white"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-200 mb-2">
                            Department
                        </label>
                        <input
                            type="text"
                            placeholder="Computer Science"
                            className="w-full px-4 py-3 rounded-xl border-2 border-purple-500/30 bg-black/40 backdrop-blur-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all duration-200 placeholder:text-gray-500 text-white"
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        />
                    </div>
                </div>

                {/* Role Specific Fields */}
                {(role === 'STUDENT' || role === 'CR') && (
                    <div className="pt-6 border-t border-purple-500/20">
                        <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></span>
                            Student Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-200 mb-2">
                                    Roll Number
                                </label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. CS2024001"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-purple-500/30 bg-black/40 backdrop-blur-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all duration-200 placeholder:text-gray-500 text-white"
                                    value={formData.rollNumber}
                                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-200 mb-2">
                                    Batch ID
                                </label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Enter Batch ID"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-purple-500/30 bg-black/40 backdrop-blur-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all duration-200 placeholder:text-gray-500 text-white"
                                    value={formData.batchId}
                                    onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {role === 'TEACHER' && (
                    <div className="pt-6 border-t border-purple-500/20">
                        <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></span>
                            Teacher Details
                        </h3>
                        <div>
                            <label className="block text-sm font-semibold text-gray-200 mb-2">
                                Employee ID
                            </label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. EMP2024001"
                                className="w-full px-4 py-3 rounded-xl border-2 border-purple-500/30 bg-black/40 backdrop-blur-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all duration-200 placeholder:text-gray-500 text-white"
                                value={formData.employeeId}
                                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                            />
                        </div>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-purple-500/20">
                    <Link
                        href="/admin/users"
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
                                <span>Creating...</span>
                            </>
                        ) : (
                            <span>Create User</span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
