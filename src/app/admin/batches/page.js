'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Users } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { useToast } from '@/providers/toast-provider';
import { apiUrl } from '@/lib/api';

export default function AdminBatchesPage() {
    const { showToast } = useToast();
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [creating, setCreating] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        section: '',
        department: '',
        year: new Date().getFullYear(),
    });

    useEffect(() => {
        fetchBatches();
    }, []);

    const fetchBatches = async () => {
        try {
            const res = await fetch(apiUrl('/api/batches'));
            const data = await res.json();
            if (data.success) {
                setBatches(data.batches);
            }
        } catch (error) {
            console.error('Failed to fetch batches:', error);
            showToast('Failed to load batches', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCreating(true);

        try {
            const res = await fetch(apiUrl('/api/batches'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to create batch');

            showToast('Batch created successfully', 'success');
            setBatches([...batches, data.batch]);
            setShowModal(false);
            setFormData({
                name: '',
                section: '',
                department: '',
                year: new Date().getFullYear(),
            });
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            setCreating(false);
        }
    };

    const filteredBatches = batches.filter(
        (batch) =>
            batch.name.toLowerCase().includes(search.toLowerCase()) ||
            batch.department.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 space-y-10 animate-fade">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Batches</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Manage student batches and sections.
                    </p>
                </div>
                <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
                    <Plus size={18} /> Add Batch
                </Button>
            </div>

            <Card padding="none" className="overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                    <Input
                        placeholder="Search batches..."
                        icon={<Search size={18} />}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-sm"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-3">Batch Name</th>
                                <th className="px-6 py-3">Section</th>
                                <th className="px-6 py-3">Department</th>
                                <th className="px-6 py-3">Year</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        Loading batches...
                                    </td>
                                </tr>
                            ) : filteredBatches.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        No batches found.
                                    </td>
                                </tr>
                            ) : (
                                filteredBatches.map((batch) => (
                                    <tr key={batch._id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                                        <td className="px-6 py-3 font-medium">{batch.name}</td>
                                        <td className="px-6 py-3">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                                                {batch.section}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3">{batch.department}</td>
                                        <td className="px-6 py-3">{batch.year}</td>
                                        <td className="px-6 py-3 text-right">
                                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                                                <Trash2 size={16} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-[#111113] rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                            <h2 className="text-lg font-semibold">Create New Batch</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <Input
                                label="Batch Name"
                                placeholder="e.g. MCA 2024-2026"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Section"
                                    placeholder="e.g. A"
                                    required
                                    value={formData.section}
                                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                                />
                                <Input
                                    label="Year"
                                    type="number"
                                    required
                                    value={formData.year}
                                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                />
                            </div>
                            <Input
                                label="Department"
                                placeholder="e.g. Computer Science"
                                required
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            />

                            <div className="flex justify-end gap-3 mt-6">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" isLoading={creating}>
                                    Create Batch
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
