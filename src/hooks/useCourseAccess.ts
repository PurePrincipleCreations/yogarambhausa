import { courses, type Course } from "@/data/courses";
import { isStaff, useAuthStore } from "@/stores/useAuthStore";

export type AccessibleCourse = Omit<Course, "price"> & {
  price: number | null;
  isGated: boolean;
};

/** True when the signed-in user owns the bundle (staff see everything). */
export function useOwnsCourse(slug: string) {
  return useAuthStore((s) => s.isAuthenticated && (isStaff(s.roles) || s.enrolledSlugs.includes(slug)));
}

export function useCourseAccess(courseId: string): AccessibleCourse | null {
  const course = courses.find((item) => item.id === courseId);
  const owns = useOwnsCourse(course?.slug ?? "");
  if (!course) return null;
  return {
    ...course,
    videos: owns ? course.videos : course.videos.slice(0, 2),
    isGated: !owns,
  };
}
