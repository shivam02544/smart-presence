'use client';

import Link from 'next/link';
import Button from '@/components/ui/Button';
import Table from '@/components/composite/Table';
import { formatDate, formatTime } from '@/lib/dateUtils';

export default function SessionsTable({ sessions }) {
    const columns = [
        {
            header: 'Subject',
            accessor: 'subject',
            render: (_, row) => (
                <div>
                    <div className="font-semibold text-gray-900">
                        {row.subjectId?.name}
                    </div>
                    <div className="text-xs text-gray-500 md:hidden mt-1">
                        {row.batchId?.name} - {row.batchId?.section}
                    </div>
                </div>
            )
        },
        {
            header: 'Batch',
            accessor: 'batch',
            render: (_, row) => (
                <span className="text-gray-700">
                    {row.batchId?.name} - {row.batchId?.section}
                </span>
            )
        },
        {
            header: 'Date',
            accessor: 'date',
            render: (_, row) => (
                <div>
                    <div className="text-sm text-gray-900">
                        {formatDate(row.startTime)}
                    </div>
                    <div className="text-xs text-gray-500">
                        {formatTime(row.startTime)}
                    </div>
                </div>
            )
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (_, row) => (
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold
                    ${row.status === 'ACTIVE'
                        ? 'bg-success-50 text-success-600'
                        : 'bg-gray-100 text-gray-600'}`}>
                    {row.status}
                </span>
            )
        },
        {
            header: 'Action',
            accessor: 'action',
            render: (_, row) => (
                <div className="text-right">
                    <Link href={`/teacher/session/${row._id}`}>
                        <Button variant="ghost" size="sm">
                            View
                        </Button>
                    </Link>
                </div>
            )
        }
    ];

    return <Table columns={columns} data={sessions} />;
}
