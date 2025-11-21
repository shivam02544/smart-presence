"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, Lock, Bell, Palette, Save } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { apiUrl } from "@/lib/api";

export default function TeacherSettingsPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        notifications: {
            email: true,
            sms: false,
        },
        theme: "light",
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch(apiUrl('/api/teachers/profile'));
            const data = await res.json();
            if (data.success) {
                setFormData(prev => ({
                    ...prev,
                    name: data.data.name || '',
                    email: data.data.email || '',
                    phone: data.data.phone || ''
                }));
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleProfileUpdate = async () => {
        try {
            const res = await fetch(apiUrl('/api/teachers/profile'), {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone
                })
            });

            const data = await res.json();
            if (res.ok) {
                alert('Profile updated successfully!');
            } else {
                alert(data.error || 'Failed to update profile');
            }
        } catch (error) {
            alert('Error updating profile');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('New passwords do not match!');
            return;
        }

        try {
            const res = await fetch(apiUrl('/api/teachers/password'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            const data = await res.json();
            if (res.ok) {
                alert('Password updated successfully!');
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                alert(data.error || 'Failed to update password');
            }
        } catch (error) {
            alert('Error updating password');
        }
    };

    return (
        <div className="space-y-8 animate-fade max-w-4xl">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Settings
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Manage your account settings and preferences
                </p>
            </div>

            {/* Profile Information */}
            <Card>
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <User size={20} /> Profile Information
                    </h2>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium mb-2">Name</label>
                            <Input
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                placeholder="Full Name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                placeholder="Email Address"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Phone Number
                        </label>
                        <Input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) =>
                                setFormData({ ...formData, phone: e.target.value })
                            }
                            placeholder="Phone Number"
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button variant="primary" onClick={handleProfileUpdate}>
                            <Save size={18} className="mr-2" /> Save Changes
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Change Password */}
            <Card>
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Lock size={20} /> Change Password
                    </h2>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Current Password
                        </label>
                        <Input
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) =>
                                setPasswordData({
                                    ...passwordData,
                                    currentPassword: e.target.value,
                                })
                            }
                            placeholder="Enter current password"
                        />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                New Password
                            </label>
                            <Input
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) =>
                                    setPasswordData({
                                        ...passwordData,
                                        newPassword: e.target.value,
                                    })
                                }
                                placeholder="Enter new password"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Confirm Password
                            </label>
                            <Input
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) =>
                                    setPasswordData({
                                        ...passwordData,
                                        confirmPassword: e.target.value,
                                    })
                                }
                                placeholder="Confirm new password"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button variant="primary" onClick={handlePasswordChange}>
                            <Lock size={18} className="mr-2" /> Update Password
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Notification Preferences */}
            <Card>
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Bell size={20} /> Notification Preferences
                    </h2>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-sm text-gray-500">
                                Receive attendance alerts via email
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.notifications.email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        notifications: {
                                            ...formData.notifications,
                                            email: e.target.checked,
                                        },
                                    })
                                }
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                        </label>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">SMS Notifications</p>
                            <p className="text-sm text-gray-500">
                                Receive session updates via SMS
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.notifications.sms}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        notifications: {
                                            ...formData.notifications,
                                            sms: e.target.checked,
                                        },
                                    })
                                }
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                        </label>
                    </div>
                </div>
            </Card>

            {/* Theme Preference */}
            <Card>
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Palette size={20} /> Appearance
                    </h2>
                </div>
                <div className="p-6">
                    <p className="text-sm text-gray-500 mb-4">
                        Theme preference is controlled by the toggle in the header
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <div
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.theme === "light"
                                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                                : "border-gray-200 dark:border-gray-700"
                                }`}
                            onClick={() => setFormData({ ...formData, theme: "light" })}
                        >
                            <div className="bg-white rounded-lg p-3 mb-2 border border-gray-200">
                                <div className="h-2 bg-gray-200 rounded mb-2"></div>
                                <div className="h-2 bg-gray-100 rounded"></div>
                            </div>
                            <p className="font-medium text-center">Light</p>
                        </div>
                        <div
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.theme === "dark"
                                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                                : "border-gray-200 dark:border-gray-700"
                                }`}
                            onClick={() => setFormData({ ...formData, theme: "dark" })}
                        >
                            <div className="bg-gray-900 rounded-lg p-3 mb-2 border border-gray-700">
                                <div className="h-2 bg-gray-700 rounded mb-2"></div>
                                <div className="h-2 bg-gray-800 rounded"></div>
                            </div>
                            <p className="font-medium text-center">Dark</p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
