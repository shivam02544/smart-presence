'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, QrCode, Loader2, Smartphone, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function MarkAttendancePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [sessionCode, setSessionCode] = useState('');
    const [deviceId, setDeviceId] = useState('');
    const [status, setStatus] = useState(null); // 'success', 'error', or null
    const [message, setMessage] = useState('');

    useEffect(() => {
        let storedId = localStorage.getItem('sp_device_id');
        if (!storedId) {
            storedId = uuidv4();
            localStorage.setItem('sp_device_id', storedId);
        }
        setDeviceId(storedId);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);
        setMessage('');

        try {
            const res = await fetch('/api/attendance/mark', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionCode,
                    deviceId,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setStatus('success');
            setMessage('Attendance marked successfully!');
            
            // Redirect after showing success message
            setTimeout(() => {
                router.push('/student/dashboard');
            }, 2000);
        } catch (error) {
            setStatus('error');
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 lg:p-8 max-w-md mx-auto min-h-[calc(100vh-120px)] flex flex-col justify-center">
            {/* Page Header */}
            <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-700 to-purple-500 rounded-2xl mb-6 shadow-lg">
                    <QrCode className="text-white" size={40} />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Mark Attendance
                </h1>
                <p className="text-gray-600">
                    Enter the 6-digit code displayed by your teacher
                </p>
            </div>

            {/* Main Card */}
            <Card className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                            Session Code
                        </label>
                        <div className="relative">
                            <input
                                required
                                type="text"
                                maxLength="6"
                                placeholder="000000"
                                className="w-full px-6 py-4 text-center text-2xl tracking-[0.3em] font-mono rounded-lg border border-gray-300 bg-white focus:border-purple-700 focus:ring-2 focus:ring-purple-100 outline-none transition-all duration-200 placeholder:text-gray-400 text-gray-900"
                                value={sessionCode}
                                onChange={(e) => setSessionCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            Enter exactly 6 digits
                        </p>
                    </div>

                    {/* Status Messages */}
                    {status && (
                        <div className={`p-4 rounded-lg flex items-center gap-3 ${
                            status === 'success' 
                                ? 'bg-green-50 border border-green-200' 
                                : 'bg-red-50 border border-red-200'
                        }`}>
                            {status === 'success' ? (
                                <CheckCircle className="text-green-600" size={20} />
                            ) : (
                                <AlertCircle className="text-red-600" size={20} />
                            )}
                            <p className={`text-sm font-medium ${
                                status === 'success' ? 'text-green-800' : 'text-red-800'
                            }`}>
                                {message}
                            </p>
                        </div>
                    )}

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        disabled={loading || sessionCode.length !== 6}
                        leftIcon={loading ? <Loader2 size={20} className="animate-spin" /> : null}
                    >
                        {loading ? 'Marking Attendance...' : 'Submit Attendance'}
                    </Button>
                </form>

                {/* Device Info */}
                <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="w-2 h-2 bg-purple-700 rounded-full"></div>
                        <p className="text-xs text-gray-600">
                            Device: {deviceId.slice(0, 8)}...
                        </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        This device is securely bound to your account
                    </p>
                </div>
            </Card>

            {/* Back Link */}
            <div className="mt-6 text-center">
                <Link 
                    href="/student/dashboard" 
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-purple-700 transition-colors"
                >
                    <ArrowLeft size={16} />
                    <span>Back to Dashboard</span>
                </Link>
            </div>
        </div>
    );
}
