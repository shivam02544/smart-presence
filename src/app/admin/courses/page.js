import Link from "next/link";
import dbConnect from "@/lib/db";
import Course from "@/models/Course";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/composite/EmptyState";
import CoursesTable from "@/components/admin/CoursesTable";
import Card from "@/components/ui/Card";
import { BookOpen, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

async function getCourses({ search, dept, sort }) {
  await dbConnect();

  const query = {};

  if (dept && dept !== "ALL") query.department = dept;

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { code: { $regex: search, $options: "i" } },
    ];
  }

  let sortRule = { createdAt: -1 };

  if (sort === "oldest") sortRule = { createdAt: 1 };
  if (sort === "name-asc") sortRule = { name: 1 };
  if (sort === "name-desc") sortRule = { name: -1 };

  const courses = await Course.find(query).sort(sortRule).limit(200).lean();

  return courses.map((c) => ({
    id: c._id.toString(),
    code: c.code,
    name: c.name,
    department: c.department || "N/A",
    semester: c.semester || "-",
    createdAt: c.createdAt,
  }));
}

export default async function CoursesPage({ searchParams }) {
  const params = await searchParams;
  const search = params?.search ?? "";
  const dept = params?.dept ?? "ALL";
  const sort = params?.sort ?? "newest";

  const courses = await getCourses({ search, dept, sort });

  const hasCourses = courses.length > 0;

  const departments = [
    "ALL",
    "Computer Science",
    "IT",
    "BCA",
    "ECE",
    "Mechanical",
    "Civil",
    "Management",
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 space-y-10 animate-fade">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Courses
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage and organize program courses.
          </p>
        </div>

        <Link href="/admin/courses/create">
          <Button variant="gradient" leftIcon={<Plus size={18} />}>
            Add Course
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <form className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" method="GET">
        
        {/* Search */}
        <input
          type="text"
          name="search"
          placeholder="Search course name or code..."
          defaultValue={search}
          className="w-full sm:max-w-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111113] px-4 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring focus:ring-purple-500/40"
        />

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <select
            name="dept"
            defaultValue={dept}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111113] px-3 py-2 text-sm"
          >
            {departments.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>

          <select
            name="sort"
            defaultValue={sort}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111113] px-3 py-2 text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name-asc">A → Z</option>
            <option value="name-desc">Z → A</option>
          </select>

          <Button type="submit" size="sm" variant="outline">
            Apply
          </Button>
        </div>
      </form>

      {/* Table or Empty */}
      {hasCourses ? (
        <Card padding="lg" className="overflow-hidden">
          <CoursesTable courses={courses} />
        </Card>
      ) : (
        <Card padding="lg">
          <EmptyState
            icon={<BookOpen size={24} />}
            heading="No courses found"
            description="Add a new course to begin managing subjects."
            actionLabel="Create Course"
            actionHref="/admin/courses/create"
          />
        </Card>
      )}
    </div>
  );
}
