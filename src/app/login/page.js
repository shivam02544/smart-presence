'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ShieldCheck } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

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
            if (!res.ok) throw new Error(data.error || 'Login failed');

            router.push(data.redirectUrl);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br 
            from-[#0E0E10] via-[#131318] to-[#1A1A1F] p-6">
            
            <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[420px] backdrop-blur-lg bg-white/10
                border border-white/15 rounded-2xl shadow-2xl p-8 text-white"
            >
                {/* Logo */}
                <div className="text-center mb-10">
                    <div className="mx-auto w-16 h-16 rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 
                        flex items-center justify-center shadow-xl">
                        <ShieldCheck size={32} className="text-white" />
                    </div>

                    <h1 className="mt-5 text-3xl font-semibold tracking-tight">
                        SmartPresence
                    </h1>
                    <p className="text-gray-300 text-sm mt-1">
                        Secure Attendance Authentication
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-3 rounded-lg text-sm bg-red-500/10 border border-red-500 text-red-300"
                        >
                            {error}
                        </motion.div>
                    )}

                    <Input
                        label="Email"
                        type="email"
                        placeholder="you@example.com"
                        icon={<Mail size={18} />}
                        required
                        variant="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="text-white"
                    />

                    <Input
                        label="Password"
                        placeholder="••••••••"
                        type="password"
                        variant="password"
                        icon={<Lock size={18} />}
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        size="large"
                        variant="primary"
                        isLoading={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>

                {/* Extra */}
                <div className="text-center text-gray-400 text-xs mt-6">
                    Secured with HTTP-only JWT Authentication
                </div>
            </motion.div>

            {/* Demo Panel */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="absolute bottom-4 text-xs text-gray-300 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10"
            >
                Demo accounts → admin@example.com | teacher@example.com | password: password123
            </motion.div>
        </div>
    );
}
