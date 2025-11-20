import Link from 'next/link';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import Table from '@/components/composite/Table';
import EmptyState from '@/components/composite/EmptyState';
import Button from '@/components/ui/Button';

export const dynamic = 'force-dynamic';

async function getUsers({ search, role, sort }) {
  await dbConnect();

  const query = {};

  if (role && role !== 'ALL') {
    query.role = role;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  let sortObj = { createdAt: -1 }; // default: newest

  if (sort === 'oldest') sortObj = { createdAt: 1 };
  else if (sort === 'name-asc') sortObj = { name: 1 };
  else if (sort === 'name-desc') sortObj = { name: -1 };

  const users = await User.find(query).sort(sortObj).limit(100);

  return users.map((user) => ({
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  }));
}

export default async function UsersPage({ searchParams }) {
  const search = searchParams?.search ?? '';
  const role = searchParams?.role ?? 'ALL';
  const sort = searchParams?.sort ?? 'newest';

  const users = await getUsers({ search, role, sort });

  const columns = [
    {
      header: 'Name',
      accessor: 'name',
      render: (value) => (
        <span className="font-semibold text-gray-900 dark:text-gray-100">
          {value}
        </span>
      ),
    },
    {
      header: 'Email',
      accessor: 'email',
      render: (value) => (
        <span className="text-gray-600 dark:text-gray-300">{value}</span>
      ),
    },
    {
      header: 'Role',
      accessor: 'role',
      render: (value) => {
        const roleColors = {
          ADMIN: 'bg-purple-100 text-purple-700 border-purple-200',
          TEACHER: 'bg-pink-100 text-pink-700 border-pink-200',
          CR: 'bg-violet-100 text-violet-700 border-violet-200',
          STUDENT: 'bg-blue-100 text-blue-700 border-blue-200',
        };
        return (
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${
              roleColors[value] || roleColors.STUDENT
            }`}
          >
            {value}
          </span>
        );
      },
    },
    {
      header: 'Joined',
      accessor: 'createdAt',
      render: (value) => (
        <span className="text-gray-600 dark:text-gray-300">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: '_id',
      render: (id) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" leftIcon={<Edit size={16} />}>
            Edit
          </Button>
          <Button variant="ghost" size="sm" leftIcon={<Trash2 size={16} />}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const hasUsers = users && users.length > 0;

  return (
    <div className="bg-gray-50 dark:bg-[#020617] min-h-full p-4 md:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 mb-1">
            User Management
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage students, teachers, CRs, and admins in one place.
          </p>
        </div>
        <Link href="/admin/users/create">
          <Button variant="gradient" leftIcon={<Plus size={18} />}>
            Add User
          </Button>
        </Link>
      </div>

      {/* Filters Bar */}
      <form
        className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
        method="GET"
      >
        {/* Search */}
        <div className="w-full md:max-w-sm">
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search by name or email..."
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111113] px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/60"
          />
        </div>

        {/* Right-side filters */}
        <div className="flex flex-wrap gap-3">
          <select
            name="role"
            defaultValue={role}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111113] px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/60"
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="TEACHER">Teacher</option>
            <option value="CR">CR</option>
            <option value="STUDENT">Student</option>
          </select>

          <select
            name="sort"
            defaultValue={sort}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111113] px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/60"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="name-asc">Name A → Z</option>
            <option value="name-desc">Name Z → A</option>
          </select>

          <Button type="submit" variant="outline" size="sm">
            Apply
          </Button>
        </div>
      </form>

      {/* Users Table / Empty */}
      {hasUsers ? (
        <div className="bg-white dark:bg-[#050816] rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
          <Table columns={columns} data={users} responsive="scroll" />
        </div>
      ) : (
        <div className="bg-white dark:bg-[#050816] rounded-lg border border-gray-200 dark:border-gray-800 p-8">
          <EmptyState
            icon={<Users />}
            heading="No users found"
            description="Get started by adding your first user to the system."
            actionLabel="Add User"
            actionHref="/admin/users/create"
          />
        </div>
      )}
    </div>
  );
}
