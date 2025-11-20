import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-purple-900/20 to-black p-4 text-center animate-fade-in">
            <div className="max-w-md w-full">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl mb-6 shadow-xl shadow-red-500/25">
                    <ShieldAlert className="text-white" size={48} />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    Access Denied
                </h1>
                <p className="text-base text-gray-300 mb-8 leading-relaxed">
                    You do not have permission to access this page. Please contact your administrator if you believe this is an error.
                </p>
                <Link 
                    href="/login" 
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-500 hover:to-pink-500 active:scale-95 transition-all duration-200 shadow-lg shadow-purple-500/50 font-semibold purple-glow"
                >
                    Return to Login
                </Link>
            </div>
        </div>
    );
}
