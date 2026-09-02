import { courses, type Course } from "@/data/courses";
import { useAuthStore } from "@/stores/useAuthStore";

export type AccessibleCourse = Omit<Course, "price"> & {
  price: number | null;
  isGated: boolean;
};

export function useCourseAccess(courseId: string): AccessibleCourse | null {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const course = courses.find((item) => item.id === courseId);

  if (!course) return null;

  return {
    ...course,
    price: isAuthenticated ? course.price : null,
    videos: isAuthenticated ? course.videos : course.videos.slice(0, 2),
    isGated: !isAuthenticated,
  };
}