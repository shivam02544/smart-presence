import Link from 'next/link';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { Plus, Users } from 'lucide-react';
import UsersTable from '@/components/admin/UsersTable';
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
  const params = await searchParams;
  const search = params?.search ?? '';
  const role = params?.role ?? 'ALL';
  const sort = params?.sort ?? 'newest';

  const users = await getUsers({ search, role, sort });

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
          <UsersTable users={users} />
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
