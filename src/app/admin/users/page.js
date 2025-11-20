import Link from 'next/link';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import Table from '@/components/composite/Table';
import EmptyState from '@/components/composite/EmptyState';
import Button from '@/components/ui/Button';

export const dynamic = 'force-dynamic';

async function getUsers() {
    await dbConnect();
    const users = await User.find({}).sort({ createdAt: -1 }).limit(50);
    return users.map(user => ({
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
    }));
}

export default async function UsersPage() {
    const users = await getUsers();

    const columns = [
        {
            header: 'Name',
            accessor: 'name',
            render: (value) => (
                <span className="font-semibold text-gray-900">{value}</span>
            )
        },
        {
            header: 'Email',
            accessor: 'email',
            render: (value) => (
                <span className="text-gray-600">{value}</span>
            )
        },
        {
            header: 'Role',
            accessor: 'role',
            render: (value) => {
                const roleColors = {
                    ADMIN: 'bg-purple-100 text-purple-700 border-purple-200',
                    TEACHER: 'bg-pink-100 text-pink-700 border-pink-200',
                    CR: 'bg-violet-100 text-violet-700 border-violet-200',
                    STUDENT: 'bg-blue-100 text-blue-700 border-blue-200'
                };
                return (
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${roleColors[value] || roleColors.STUDENT}`}>
                        {value}
                    </span>
                );
            }
        },
        {
            header: 'Joined',
            accessor: 'createdAt',
            render: (value) => (
                <span className="text-gray-600">
                    {new Date(value).toLocaleDateString()}
                </span>
            )
        },
        {
            header: 'Actions',
            accessor: '_id',
            render: (value) => (
                <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" leftIcon={<Edit size={16} />}>
                        Edit
                    </Button>
                    <Button variant="ghost" size="sm" leftIcon={<Trash2 size={16} />} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        Delete
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="bg-gray-50 min-h-full p-4 md:p-6 lg:p-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        User Management
                    </h1>
                    <p className="text-gray-600">
                        Manage students, teachers, and admins
                    </p>
                </div>
                <Link href="/admin/users/create">
                    <Button variant="primary" leftIcon={<Plus size={18} />}>
                        Add User
                    </Button>
                </Link>
            </div>

            {/* Users Table */}
            {users.length > 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <Table 
                        columns={columns}
                        data={users}
                        responsive="scroll"
                    />
                </div>
            ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-8">
                    <EmptyState
                        icon={<Users />}
                        heading="No users found"
                        description="Get started by adding your first user to the system"
                        actionLabel="Add User"
                        actionHref="/admin/users/create"
                    />
                </div>
            )}
        </div>
    );
}
