import { useState } from "react";
import { format, isBefore, isToday, addDays, isAfter, differenceInDays } from "date-fns";
import { Assignment, AssignmentType } from "@/contexts/AssignmentContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, BookOpen, PenTool, ClipboardList, AlertCircle, FileText, CheckCircle2 } from "lucide-react";

interface AssignmentCardProps {
  assignment: Assignment;
  onClick: (assignment: Assignment) => void;
}

const typeIcons: Record<AssignmentType, React.ReactNode> = {
  essay: <PenTool className="w-4 h-4" />,
  quiz: <ClipboardList className="w-4 h-4" />,
  project: <FileText className="w-4 h-4" />,
  reading: <BookOpen className="w-4 h-4" />,
  other: <AlertCircle className="w-4 h-4" />
};

export function AssignmentCard({ assignment, onClick }: AssignmentCardProps) {
  const dueDate = new Date(assignment.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let urgencyColor = "bg-slate-100 text-slate-800 border-slate-200";
  let countdownText = "";

  if (assignment.completed) {
    urgencyColor = "bg-green-50 text-green-800 border-green-200";
    countdownText = "Completed";
  } else if (isBefore(dueDate, today)) {
    urgencyColor = "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/30 dark:text-rose-200 dark:border-rose-900";
    const days = differenceInDays(today, dueDate);
    countdownText = `${days} day${days !== 1 ? 's' : ''} overdue`;
  } else if (isToday(dueDate)) {
    urgencyColor = "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/30 dark:text-amber-200 dark:border-amber-900";
    countdownText = "Due today";
  } else if (isBefore(dueDate, addDays(today, 8))) {
    urgencyColor = "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/30 dark:text-blue-200 dark:border-blue-900";
    const days = differenceInDays(dueDate, today);
    countdownText = `Due in ${days} day${days !== 1 ? 's' : ''}`;
  } else {
    urgencyColor = "bg-slate-50 text-slate-800 border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700";
    const days = differenceInDays(dueDate, today);
    countdownText = `Due in ${days} days`;
  }

  return (
    <Card 
      className={`cursor-pointer transition-all hover-elevate border-2 ${assignment.completed ? 'opacity-60 grayscale' : ''}`}
      onClick={() => onClick(assignment)}
      data-testid={`card-assignment-${assignment.id}`}
    >
      <CardContent className="p-4 flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1" data-testid={`text-course-${assignment.id}`}>
              {assignment.courseName}
            </span>
            <h3 className="font-bold text-lg leading-tight flex items-center gap-2" data-testid={`text-title-${assignment.id}`}>
              {assignment.completed && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              {assignment.assignmentName}
            </h3>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1.5 py-1 px-2.5 font-medium text-xs capitalize">
              {typeIcons[assignment.type]}
              {assignment.type}
            </Badge>
          </div>
          
          <div className={`text-xs font-bold px-2.5 py-1 rounded-md border flex items-center gap-1.5 ${urgencyColor}`}>
            <Calendar className="w-3.5 h-3.5" />
            {countdownText}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
