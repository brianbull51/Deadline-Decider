import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Trash2, CheckCircle2, Circle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useAssignments, Assignment } from "@/contexts/AssignmentContext";

const formSchema = z.object({
  courseName: z.string().min(1, "Course name is required").max(50),
  assignmentName: z.string().min(1, "Assignment name is required").max(100),
  dueDate: z.date({
    required_error: "A due date is required.",
  }),
  type: z.enum(["essay", "quiz", "project", "reading", "other"] as const),
  notes: z.string().max(500).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditAssignmentDialogProps {
  assignment: Assignment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditAssignmentDialog({ assignment, open, onOpenChange }: EditAssignmentDialogProps) {
  const { updateAssignment, deleteAssignment, toggleComplete } = useAssignments();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseName: "",
      assignmentName: "",
      notes: "",
      type: "essay",
      dueDate: new Date(),
    },
  });

  useEffect(() => {
    if (assignment) {
      form.reset({
        courseName: assignment.courseName,
        assignmentName: assignment.assignmentName,
        notes: assignment.notes || "",
        type: assignment.type,
        dueDate: new Date(assignment.dueDate),
      });
    }
  }, [assignment, form]);

  if (!assignment) return null;

  function onSubmit(values: FormValues) {
    if (!assignment) return;
    updateAssignment(assignment.id, {
      courseName: values.courseName,
      assignmentName: values.assignmentName,
      dueDate: values.dueDate.toISOString(),
      type: values.type,
      notes: values.notes || "",
    });
    onOpenChange(false);
  }

  function handleDelete() {
    if (!assignment) return;
    deleteAssignment(assignment.id);
    onOpenChange(false);
  }

  function handleToggleComplete() {
    if (!assignment) return;
    toggleComplete(assignment.id);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" data-testid="dialog-edit-assignment">
        <DialogHeader>
          <div className="flex items-center justify-between mt-2 mb-2">
            <DialogTitle>Edit Assignment</DialogTitle>
            <Button 
              type="button" 
              variant={assignment.completed ? "outline" : "secondary"}
              size="sm"
              className={cn("flex items-center gap-2", assignment.completed && "text-green-600 border-green-200")}
              onClick={handleToggleComplete}
              data-testid="button-toggle-complete"
            >
              {assignment.completed ? (
                <><CheckCircle2 className="w-4 h-4" /> Mark Incomplete</>
              ) : (
                <><Circle className="w-4 h-4" /> Mark Complete</>
              )}
            </Button>
          </div>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
            <FormField
              control={form.control}
              name="courseName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. CS 101" {...field} data-testid="input-edit-course" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="assignmentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignment Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Final Essay" {...field} data-testid="input-edit-assignment" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col mt-2">
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            data-testid="input-edit-date"
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-edit-type">
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="essay">Essay</SelectItem>
                        <SelectItem value="quiz">Quiz/Exam</SelectItem>
                        <SelectItem value="project">Project</SelectItem>
                        <SelectItem value="reading">Reading</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add any extra details, links, or requirements here."
                      className="resize-none"
                      {...field}
                      data-testid="input-edit-notes"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex items-center justify-between pt-4 border-t">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive" size="sm" data-testid="button-delete-assignment">
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Assignment</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this assignment? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button type="submit" data-testid="button-save-edit">Save Changes</Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
