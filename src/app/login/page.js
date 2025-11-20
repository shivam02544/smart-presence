'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Mail, Lock } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || 'Login failed');
            }

            router.push(data.redirectUrl);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="w-full max-w-[400px]">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl mb-4 shadow-lg">
                        <Sparkles className="text-white" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        SmartPresence
                    </h1>
                    <p className="text-gray-600 text-sm">
                        Intelligent Attendance Management System
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                        Sign In
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        <Input
                            label="Email Address"
                            type="email"
                            variant="email"
                            placeholder="your.email@example.com"
                            icon={<Mail size={18} />}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />

                        <Input
                            label="Password"
                            variant="password"
                            placeholder="Enter your password"
                            icon={<Lock size={18} />}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            size="large"
                            fullWidth
                            isLoading={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                        <p className="text-xs text-gray-500">
                            Secure authentication powered by JWT
                        </p>
                    </div>
                </div>

                {/* Demo Credentials */}
                <div className="mt-6 bg-gray-100 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 text-center mb-3 font-semibold uppercase tracking-wide">
                        Demo Credentials
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                            <p className="text-gray-600 mb-1 font-medium">Admin</p>
                            <p className="text-gray-900 font-mono text-[11px]">admin@example.com</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                            <p className="text-gray-600 mb-1 font-medium">Teacher</p>
                            <p className="text-gray-900 font-mono text-[11px]">teacher@example.com</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-200 col-span-2">
                            <p className="text-gray-600 mb-1 font-medium">Password (all accounts)</p>
                            <p className="text-gray-900 font-mono text-[11px]">password123</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
