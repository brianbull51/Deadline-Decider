import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type AssignmentType = 'essay' | 'quiz' | 'project' | 'reading' | 'other';

export interface Assignment {
  id: string;
  courseName: string;
  assignmentName: string;
  dueDate: string; // ISO date string
  type: AssignmentType;
  notes?: string;
  completed: boolean;
  createdAt: string; // ISO date string
}

interface AssignmentContextType {
  assignments: Assignment[];
  addAssignment: (assignment: Omit<Assignment, 'id' | 'completed' | 'createdAt'>) => void;
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  toggleComplete: (id: string) => void;
}

const AssignmentContext = createContext<AssignmentContextType | undefined>(undefined);

const STORAGE_KEY = 'deadline-decider-assignments';

export function AssignmentProvider({ children }: { children: ReactNode }) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setAssignments(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse assignments', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
    }
  }, [assignments, isLoaded]);

  const addAssignment = (assignment: Omit<Assignment, 'id' | 'completed' | 'createdAt'>) => {
    const newAssignment: Assignment = {
      ...assignment,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setAssignments((prev) => [...prev, newAssignment]);
  };

  const updateAssignment = (id: string, updates: Partial<Assignment>) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const deleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  const toggleComplete = (id: string) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a))
    );
  };

  return (
    <AssignmentContext.Provider
      value={{
        assignments,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        toggleComplete,
      }}
    >
      {children}
    </AssignmentContext.Provider>
  );
}

export function useAssignments() {
  const context = useContext(AssignmentContext);
  if (context === undefined) {
    throw new Error('useAssignments must be used within an AssignmentProvider');
  }
  return context;
}
