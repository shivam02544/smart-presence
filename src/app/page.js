'use client';

import Link from 'next/link';
import { ArrowRight, Shield, Zap, Smartphone, WifiOff, CheckCircle, Users, BarChart3, Sparkles } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { motion } from 'framer-motion';

export default function HomePage() {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: "easeOut" },
        },
    };

    const floatVariants = {
        animate: {
            y: [0, -15, 0],
            transition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
            },
        },
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#0D0D0E] text-gray-900 dark:text-white selection:bg-purple-500 selection:text-white overflow-x-hidden">
            <Navbar showUserMenu={false} />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Dynamic Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 0],
                            opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            x: [0, 50, 0],
                            opacity: [0.2, 0.4, 0.2]
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute top-[20%] -right-[10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl"
                    />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-center max-w-4xl mx-auto"
                    >
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 text-sm font-semibold mb-8 shadow-sm">
                            <Sparkles size={14} className="text-purple-600 dark:text-purple-400" />
                            <span>The Next Gen Attendance System</span>
                        </motion.div>

                        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight text-gray-900 dark:text-white drop-shadow-sm">
                            Attendance Made <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
                                Smart & Secure
                            </span>
                        </motion.h1>

                        <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
                            Eliminate proxies and save time with our intelligent QR-based attendance system.
                            <span className="hidden md:inline"> Designed for modern campuses.</span>
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/login" className="w-full sm:w-auto">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl font-bold text-lg shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 transition-all"
                                >
                                    Get Started Now <ArrowRight size={20} />
                                </motion.button>
                            </Link>
                            <Link href="#features" className="w-full sm:w-auto">
                                <motion.button
                                    whileHover={{ scale: 1.05, backgroundColor: "rgba(139, 92, 246, 0.1)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-transparent border-2 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white rounded-xl font-bold text-lg hover:border-purple-500 dark:hover:border-purple-500 transition-all"
                                >
                                    See Features
                                </motion.button>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Hero Visual / Dashboard Preview */}
                    <motion.div
                        variants={floatVariants}
                        animate="animate"
                        className="mt-24 relative mx-auto max-w-6xl"
                    >
                        <div className="relative rounded-2xl bg-gray-900/5 dark:bg-white/5 p-2 ring-1 ring-inset ring-gray-900/10 dark:ring-white/10 lg:rounded-3xl lg:p-4 backdrop-blur-sm">
                            <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121214]">
                                {/* Mock Dashboard UI */}
                                <div className="grid grid-cols-12 gap-0 h-[400px] md:h-[700px]">
                                    {/* Sidebar Mock */}
                                    <div className="hidden md:block col-span-2 border-r border-gray-200 dark:border-gray-800 p-6 space-y-6 bg-gray-50 dark:bg-[#0A0A0B]">
                                        <div className="flex items-center gap-3 mb-8">
                                            <div className="h-8 w-8 bg-purple-600 rounded-lg"></div>
                                            <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                        </div>
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div key={i} className="flex items-center gap-3 opacity-60">
                                                <div className="h-5 w-5 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                                <div className="h-3 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Main Content Mock */}
                                    <div className="col-span-12 md:col-span-10 p-8 bg-white dark:bg-[#0D0D0E]">
                                        <div className="flex justify-between items-center mb-10">
                                            <div>
                                                <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
                                                <div className="h-4 w-40 bg-gray-100 dark:bg-gray-900 rounded"></div>
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800"></div>
                                                <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900"></div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="h-40 bg-gray-50 dark:bg-[#121214] rounded-2xl border border-gray-100 dark:border-gray-800 p-6 flex flex-col justify-between group hover:border-purple-500/30 transition-colors">
                                                    <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-900/20 mb-2"></div>
                                                    <div>
                                                        <div className="h-8 w-16 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
                                                        <div className="h-4 w-24 bg-gray-100 dark:bg-gray-900 rounded"></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="h-80 bg-gray-50 dark:bg-[#121214] rounded-2xl border border-gray-100 dark:border-gray-800 p-8 flex items-center justify-center relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-purple-500/5"></div>
                                            <div className="text-center z-10">
                                                <motion.div
                                                    animate={{ scale: [1, 1.1, 1] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                    className="h-20 w-20 bg-purple-100 dark:bg-purple-900/30 rounded-full mx-auto mb-6 flex items-center justify-center"
                                                >
                                                    <BarChart3 className="text-purple-600 dark:text-purple-400" size={40} />
                                                </motion.div>
                                                <p className="text-gray-900 dark:text-white font-semibold text-lg">Real-time Analytics Dashboard</p>
                                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Live data visualization and reporting</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-32 bg-gray-50 dark:bg-[#121214] relative">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto mb-20"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">Everything you need</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            Powerful features built for students, teachers, and administrators.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Smartphone className="text-purple-600" size={28} />}
                            title="QR Code Attendance"
                            description="Dynamic, rotating QR codes that change every few seconds to prevent sharing and proxy attendance."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={<Shield className="text-blue-600" size={28} />}
                            title="Anti-Proxy Security"
                            description="Advanced device fingerprinting and IP validation ensures students are physically present in the class."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={<WifiOff className="text-amber-600" size={28} />}
                            title="Offline Capable"
                            description="No internet? No problem. CRs can mark attendance offline and sync automatically when back online."
                            delay={0.3}
                        />
                        <FeatureCard
                            icon={<BarChart3 className="text-green-600" size={28} />}
                            title="Real-time Insights"
                            description="Instant reports and analytics for teachers and admins to track attendance trends and performance."
                            delay={0.4}
                        />
                        <FeatureCard
                            icon={<Users className="text-pink-600" size={28} />}
                            title="Role-Based Access"
                            description="Dedicated dashboards for Admins, Teachers, CRs, and Students with tailored permissions and views."
                            delay={0.5}
                        />
                        <FeatureCard
                            icon={<Zap className="text-yellow-600" size={28} />}
                            title="Lightning Fast"
                            description="Built on Next.js for blazing fast performance and a smooth, app-like user experience."
                            delay={0.6}
                        />
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-32 bg-white dark:bg-[#0D0D0E]">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">How it works</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            Simple, fast, and secure attendance in 3 easy steps.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-purple-200 via-purple-400 to-purple-200 dark:from-purple-900 dark:via-purple-700 dark:to-purple-900 -z-10"></div>

                        <StepCard
                            number="1"
                            title="Teacher Starts Session"
                            description="Teacher logs in, selects a course, and projects a dynamic QR code on the screen."
                            delay={0.2}
                        />
                        <StepCard
                            number="2"
                            title="Students Scan QR"
                            description="Students scan the code using their registered device. Location and device are verified."
                            delay={0.4}
                        />
                        <StepCard
                            number="3"
                            title="Instant Confirmation"
                            description="Attendance is marked instantly. Teachers see live updates and proxies are flagged."
                            delay={0.6}
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 bg-purple-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="container mx-auto px-4 text-center relative z-10"
                >
                    <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to modernize your campus?</h2>
                    <p className="text-purple-100 text-xl md:text-2xl max-w-2xl mx-auto mb-12">
                        Join thousands of students and teachers using SmartPresence for a seamless attendance experience.
                    </p>
                    <Link href="/login">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-10 py-5 bg-white text-purple-900 rounded-xl font-bold text-xl shadow-2xl hover:bg-gray-100 transition-colors"
                        >
                            Get Started Now
                        </motion.button>
                    </Link>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-50 dark:bg-[#0D0D0E] border-t border-gray-200 dark:border-gray-800 py-16">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-600/20">
                                <Zap className="text-white" size={20} />
                            </div>
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">SmartPresence</span>
                        </div>
                        <div className="text-gray-500 dark:text-gray-400 font-medium">
                            &copy; {new Date().getFullYear()} SmartPresence. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            whileHover={{ y: -5 }}
            className="p-8 bg-white dark:bg-[#1A1A1C] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-purple-500/30 dark:hover:border-purple-500/30 transition-all group"
        >
            <div className="w-14 h-14 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">{title}</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                {description}
            </p>
        </motion.div>
    );
}

function StepCard({ number, title, description, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            className="text-center bg-white dark:bg-[#0D0D0E] p-8 rounded-3xl relative z-10"
        >
            <div className="w-20 h-20 bg-purple-600 text-white text-3xl font-bold rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-purple-600/30 transform rotate-3 hover:rotate-6 transition-transform duration-300">
                {number}
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                {description}
            </p>
        </motion.div>
    );
}
