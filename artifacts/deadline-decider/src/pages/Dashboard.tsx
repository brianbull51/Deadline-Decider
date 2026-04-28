import { useState, useMemo } from "react";
import { Link } from "wouter";
import { isBefore, isToday, addDays, isAfter } from "date-fns";
import { Clock, Home, CheckCircle2 } from "lucide-react";

import { useAssignments, Assignment } from "@/contexts/AssignmentContext";
import { AddAssignmentForm } from "@/components/AddAssignmentForm";
import { EditAssignmentDialog } from "@/components/EditAssignmentDialog";
import { AssignmentCard } from "@/components/AssignmentCard";
import { CourseFilter } from "@/components/CourseFilter";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { assignments } = useAssignments();
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  // Get unique courses
  const courses = useMemo(() => {
    const uniqueCourses = new Set(assignments.map(a => a.courseName));
    return Array.from(uniqueCourses).sort();
  }, [assignments]);

  // Filter assignments
  const filteredAssignments = useMemo(() => {
    let filtered = assignments;
    
    if (selectedCourse) {
      filtered = filtered.filter(a => a.courseName === selectedCourse);
    }
    
    if (!showCompleted) {
      filtered = filtered.filter(a => !a.completed);
    }

    return filtered;
  }, [assignments, selectedCourse, showCompleted]);

  // Group assignments
  const grouped = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = addDays(today, 8);

    const groups = {
      completed: [] as Assignment[],
      overdue: [] as Assignment[],
      today: [] as Assignment[],
      thisWeek: [] as Assignment[],
      later: [] as Assignment[]
    };

    filteredAssignments.forEach(a => {
      if (a.completed) {
        groups.completed.push(a);
        return;
      }

      const dueDate = new Date(a.dueDate);
      
      if (isBefore(dueDate, today)) {
        groups.overdue.push(a);
      } else if (isToday(dueDate)) {
        groups.today.push(a);
      } else if (isBefore(dueDate, nextWeek)) {
        groups.thisWeek.push(a);
      } else {
        groups.later.push(a);
      }
    });

    // Sort each group by due date ascending
    const sortByDate = (a: Assignment, b: Assignment) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    
    groups.overdue.sort(sortByDate);
    groups.today.sort(sortByDate);
    groups.thisWeek.sort(sortByDate);
    groups.later.sort(sortByDate);
    // Sort completed by most recently due first
    groups.completed.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());

    return groups;
  }, [filteredAssignments]);

  const handleCardClick = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsEditDialogOpen(true);
  };

  const hasAnyAssignments = assignments.length > 0;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <header className="px-6 py-4 border-b flex items-center justify-between bg-card sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <span className="font-bold text-lg tracking-tight">Deadline Decider</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="hidden sm:flex text-muted-foreground hover:text-foreground">
              <Home className="w-4 h-4 mr-2" /> Home
            </Button>
          </Link>
          <AddAssignmentForm />
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {!hasAnyAssignments ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center max-w-md mx-auto space-y-6">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-3xl font-bold">You're all caught up!</h2>
            <p className="text-muted-foreground text-lg">
              Looks like your desk is completely clear. When you get your next syllabus or assignment, add it here so you never forget.
            </p>
            <div className="pt-4">
              <AddAssignmentForm />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CourseFilter 
                courses={courses} 
                selectedCourse={selectedCourse} 
                onSelectCourse={setSelectedCourse} 
              />
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowCompleted(!showCompleted)}
                className="text-muted-foreground shrink-0"
              >
                {showCompleted ? "Hide Completed" : "Show Completed"}
              </Button>
            </div>

            {filteredAssignments.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                No active assignments for this filter.
              </div>
            ) : (
              <div className="space-y-12 pb-20">
                {grouped.overdue.length > 0 && (
                  <section>
                    <h2 className="text-xl font-bold text-rose-600 dark:text-rose-400 mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span> Overdue
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {grouped.overdue.map(a => (
                        <AssignmentCard key={a.id} assignment={a} onClick={handleCardClick} />
                      ))}
                    </div>
                  </section>
                )}

                {grouped.today.length > 0 && (
                  <section>
                    <h2 className="text-xl font-bold text-amber-600 dark:text-amber-500 mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span> Due Today
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {grouped.today.map(a => (
                        <AssignmentCard key={a.id} assignment={a} onClick={handleCardClick} />
                      ))}
                    </div>
                  </section>
                )}

                {grouped.thisWeek.length > 0 && (
                  <section>
                    <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span> Due This Week
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {grouped.thisWeek.map(a => (
                        <AssignmentCard key={a.id} assignment={a} onClick={handleCardClick} />
                      ))}
                    </div>
                  </section>
                )}

                {grouped.later.length > 0 && (
                  <section>
                    <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-slate-400"></span> Later
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {grouped.later.map(a => (
                        <AssignmentCard key={a.id} assignment={a} onClick={handleCardClick} />
                      ))}
                    </div>
                  </section>
                )}

                {showCompleted && grouped.completed.length > 0 && (
                  <section className="opacity-70">
                    <h2 className="text-xl font-bold text-green-700 dark:text-green-500 mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span> Completed
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {grouped.completed.map(a => (
                        <AssignmentCard key={a.id} assignment={a} onClick={handleCardClick} />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <EditAssignmentDialog 
        assignment={selectedAssignment}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </div>
  );
}
