'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Edit, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Table from '@/components/composite/Table';
import { useToast } from '@/providers/toast-provider';
import { formatDate } from '@/lib/dateUtils';

export default function UsersTable({ users }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (userId, userName) => {
    if (!confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(userId);
    try {
      const res = await fetch(`/api/users?id=${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete user');

      showToast('User deleted successfully', 'success');
      router.refresh();
    } catch (error) {
      console.error('Delete error:', error);
      showToast(error.message || 'Failed to delete user', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (userId) => {
    window.location.href = `/admin/users/${userId}/edit`;
  };

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
          ADMIN: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
          TEACHER: 'bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800',
          CR: 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800',
          STUDENT: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
        };
        return (
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${roleColors[value] || roleColors.STUDENT
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
          {formatDate(value)}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: '_id',
      render: (id, row) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Edit size={16} />}
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(id);
            }}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Trash2 size={16} />}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(id, row.name);
            }}
            disabled={deletingId === id}
          >
            {deletingId === id ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      ),
    },
  ];

  return <Table columns={columns} data={users} responsive="scroll" />;
}
