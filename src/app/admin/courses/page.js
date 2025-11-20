import Link from 'next/link';
import dbConnect from '@/lib/db';
import Course from '@/models/Course';
import { Plus, BookOpen, Edit, Trash2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/composite/EmptyState';

export const dynamic = 'force-dynamic';

async function getCourses() {
    await dbConnect();
    const courses = await Course.find({}).sort({ createdAt: -1 });
    return courses.map(course => ({
        _id: course._id.toString(),
        name: course.name,
        code: course.code,
        department: course.department,
        semester: course.semester
    }));
}

export default async function CoursesPage() {
    const courses = await getCourses();

    return (
        <div className="bg-gray-50 min-h-full p-4 md:p-6 lg:p-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Course Management
                    </h1>
                    <p className="text-gray-600">
                        Manage subjects and curriculum
                    </p>
                </div>
                <Link href="/admin/courses/create">
                    <Button variant="primary" leftIcon={<Plus size={18} />}>
                        Add Course
                    </Button>
                </Link>
            </div>

            {/* Courses Grid */}
            {courses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <Card 
                            key={course._id}
                            hover={true}
                            padding="default"
                            className="flex flex-col"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full text-purple-700 transition-transform duration-200 group-hover:scale-110">
                                    <BookOpen size={24} />
                                </div>
                                <span className="text-xs font-semibold px-2.5 py-1 bg-purple-100 text-purple-700 rounded-lg border border-purple-200">
                                    Sem {course.semester}
                                </span>
                            </div>
                            
                            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                                {course.name}
                            </h3>
                            
                            <p className="text-sm text-gray-600 mb-4">
                                {course.code} • {course.department}
                            </p>

                            <div className="flex items-center gap-2 pt-4 mt-auto border-t border-gray-200">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    leftIcon={<Edit size={16} />} 
                                    className="text-purple-700 hover:text-purple-800 hover:bg-purple-50 flex-1"
                                >
                                    Edit
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    leftIcon={<Trash2 size={16} />} 
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1"
                                >
                                    Delete
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-8">
                    <EmptyState
                        icon={<BookOpen />}
                        heading="No courses found"
                        description="Get started by adding your first course to the system"
                        actionLabel="Add Course"
                        actionHref="/admin/courses/create"
                    />
                </div>
            )}
        </div>
    );
}
