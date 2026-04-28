import { Badge } from "@/components/ui/badge";

interface CourseFilterProps {
  courses: string[];
  selectedCourse: string | null;
  onSelectCourse: (course: string | null) => void;
}

export function CourseFilter({ courses, selectedCourse, onSelectCourse }: CourseFilterProps) {
  if (courses.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 items-center" data-testid="filter-courses">
      <span className="text-sm text-muted-foreground mr-2 font-medium">Filter:</span>
      <Badge
        variant={selectedCourse === null ? "default" : "outline"}
        className="cursor-pointer hover:bg-primary/90 transition-colors"
        onClick={() => onSelectCourse(null)}
        data-testid="filter-course-all"
      >
        All Courses
      </Badge>
      {courses.map((course) => (
        <Badge
          key={course}
          variant={selectedCourse === course ? "default" : "outline"}
          className="cursor-pointer hover:bg-primary/10 transition-colors"
          onClick={() => onSelectCourse(course === selectedCourse ? null : course)}
          data-testid={`filter-course-${course}`}
        >
          {course}
        </Badge>
      ))}
    </div>
  );
}
