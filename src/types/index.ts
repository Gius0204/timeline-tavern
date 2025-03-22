
export type Status = 'unstarted' | 'in-progress' | 'completed' | 'blocked' | string;

export interface User {
  id: string;
  name: string;
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: Status;
  startDate?: Date;
  dueDate?: Date;
  assignees: User[];
  section: string;
  labels?: string[];
  dependencies?: string[];
  subTasks?: SubTask[];
  notes?: Note[];
  attachments?: Attachment[];
  timeEntries?: TimeEntry[];
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  assignees?: User[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  createdBy: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface TimeEntry {
  id: string;
  user: User;
  date: Date;
  hours: number;
  description?: string;
}

export interface Section {
  id: string;
  name: string;
  tasks: Task[];
  order: number;
}

export interface Project {
  id: string;
  name: string;
  sections: Section[];
  statusColumns: StatusColumn[];
  dueDate?: Date;
}

export interface StatusColumn {
  id: string;
  name: Status;
  color: string;
  order: number;
}

export interface Group {
  id: string;
  name: string;
  projects: string[]; // project ids
}

export interface ViewType {
  id: string;
  name: string;
  icon: string;
  component: React.ComponentType<any>;
}

export interface TimeSheetEntry {
  userId: string;
  taskId: string;
  date: Date;
  hours: number;
}

export interface WorkloadData {
  user: User;
  dates: {
    date: Date;
    hours: number;
    tasks: Task[];
  }[];
}
