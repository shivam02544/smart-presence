'use client';

import Table from '@/components/composite/Table';
import { formatDate } from '@/lib/dateUtils';

export default function CoursesTable({ courses }) {
  const columns = [
    {
      header: "Code",
      accessor: "code",
      render: (value) => <span className="font-mono font-semibold text-gray-900 dark:text-gray-100">{value}</span>,
    },
    {
      header: "Course Name",
      accessor: "name",
      render: (value) => <span className="font-semibold text-gray-900 dark:text-gray-100">{value}</span>,
    },
    {
      header: "Department",
      accessor: "department",
      render: (value) => <span className="text-gray-600 dark:text-gray-300">{value}</span>,
    },
    {
      header: "Semester",
      accessor: "semester",
      render: (value) => <span className="text-gray-600 dark:text-gray-300">{value}</span>,
    },
    {
      header: "Created",
      accessor: "createdAt",
      render: (value) => (
        <span className="text-gray-600 dark:text-gray-300">
          {formatDate(value)}
        </span>
      ),
    },
  ];

  return <Table data={courses} columns={columns} responsive="scroll" />;
}

