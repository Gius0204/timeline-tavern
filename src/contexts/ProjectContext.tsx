import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import { Project, Task, Section, Status, User, StatusColumn, Group, TimeEntry } from "@/types";

// Sample data for initial state
const initialUsers: User[] = [
  { id: "user1", name: "Barb Demo", avatar: "/avatars/barb.png" },
  { id: "user2", name: "Jessica Demo", avatar: "/avatars/jessica.png" },
  { id: "user3", name: "Landon Demo", avatar: "/avatars/landon.png" },
];

const initialStatuses: StatusColumn[] = [
  { id: "status1", name: "unstarted", color: "#94a3b8", order: 0 },
  { id: "status2", name: "in-progress", color: "#6c5ce7", order: 1 },
  { id: "status3", name: "completed", color: "#42d392", order: 2 },
  { id: "status4", name: "blocked", color: "#ff5252", order: 3 },
];

const initialSections: Section[] = [
  {
    id: "section1",
    name: "Marketing",
    order: 0,
    tasks: [
      {
        id: "task1",
        title: "Action 1",
        status: "in-progress",
        section: "section1",
        assignees: [initialUsers[0]],
        startDate: new Date(2025, 2, 21), // March 21, 2025
        dueDate: new Date(2025, 2, 26), // March 26, 2025
        subTasks: [],
        dependencies: [],
        notes: [],
        attachments: [],
        timeEntries: [],
      },
      {
        id: "task2",
        title: "Action 2",
        status: "in-progress",
        section: "section1",
        assignees: [initialUsers[1]],
        startDate: new Date(2025, 2, 28), // March 28, 2025
        dueDate: new Date(2025, 3, 3), // April 3, 2025
        subTasks: [],
        dependencies: ["task1"],
        notes: [],
        attachments: [],
        timeEntries: [],
      },
    ],
  },
  {
    id: "section2",
    name: "Okey v2",
    order: 1,
    tasks: [
      {
        id: "task3",
        title: "Action 2.1",
        status: "in-progress",
        section: "section2",
        assignees: [initialUsers[2]],
        startDate: new Date(2025, 2, 21), // March 21, 2025
        dueDate: new Date(2025, 2, 28), // March 28, 2025
        subTasks: [],
        dependencies: [],
        notes: [],
        attachments: [],
        timeEntries: [],
      },
    ],
  },
];

const initialProjects: Project[] = [
  {
    id: "project1",
    name: "Test Project",
    sections: initialSections,
    statusColumns: initialStatuses,
    dueDate: new Date(2025, 2, 21), // March 21, 2025
  },
  {
    id: "project2",
    name: "Simple Project",
    sections: [],
    statusColumns: initialStatuses,
    dueDate: new Date(2025, 3, 15), // April 15, 2025
  },
  {
    id: "project3",
    name: "Project Management",
    sections: [],
    statusColumns: initialStatuses,
    dueDate: new Date(2025, 4, 1), // May 1, 2025
  },
];

const initialGroups: Group[] = [
  {
    id: "group1",
    name: "Everyone",
    projects: ["project1", "project2", "project3"],
  },
];

// Define context type
interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  groups: Group[];
  users: User[];
  setCurrentProject: (projectId: string) => void;
  addProject: (project: Omit<Project, "id" | "sections" | "statusColumns">) => void;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  addTask: (task: Omit<Task, "id" | "subTasks" | "notes" | "attachments" | "timeEntries">) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, newSectionId: string, newStatus: Status) => void;
  addSection: (projectId: string, name: string) => void;
  updateSection: (sectionId: string, name: string) => void;
  deleteSection: (sectionId: string) => void;
  addStatusColumn: (projectId: string, name: Status, color: string) => void;
  updateStatusColumn: (statusId: string, name: Status, color: string) => void;
  deleteStatusColumn: (statusId: string) => void;
  addGroup: (name: string) => void;
  updateGroup: (groupId: string, name: string) => void;
  deleteGroup: (groupId: string) => void;
  addProjectToGroup: (projectId: string, groupId: string) => void;
  removeProjectFromGroup: (projectId: string, groupId: string) => void;
  addTimeEntry: (taskId: string, entry: Omit<TimeEntry, "id">) => void;
  getTasksByStatus: (projectId: string) => Record<Status, Task[]>;
  getTasksForGantt: (projectId: string) => Task[];
  getTasksForCalendar: (projectId: string, startDate: Date, endDate: Date) => Task[];
  getUserWorkloads: (startDate: Date, endDate: Date) => Record<string, Record<string, number>>;
}

// Create context
const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Provider component
export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>("project1");
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [users] = useState<User[]>(initialUsers);

  const currentProject = useMemo(() => {
    return projects.find((p) => p.id === currentProjectId) || null;
  }, [projects, currentProjectId]);

  const setCurrentProject = useCallback((projectId: string) => {
    setCurrentProjectId(projectId);
  }, []);

  const addProject = useCallback(
    (project: Omit<Project, "id" | "sections" | "statusColumns">) => {
      const newProject: Project = {
        ...project,
        id: `project${Date.now()}`,
        sections: [],
        statusColumns: initialStatuses,
      };
      setProjects((prev) => [...prev, newProject]);
    },
    []
  );

  const updateProject = useCallback((project: Project) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === project.id ? project : p))
    );
  }, []);

  const deleteProject = useCallback((projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    // Also remove from groups
    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        projects: g.projects.filter((p) => p !== projectId),
      }))
    );
  }, []);

  const addTask = useCallback(
    (task: Omit<Task, "id" | "subTasks" | "notes" | "attachments" | "timeEntries">) => {
      const newTask: Task = {
        ...task,
        id: `task${Date.now()}`,
        subTasks: [],
        notes: [],
        attachments: [],
        timeEntries: [],
      };

      setProjects((prev) =>
        prev.map((project) => {
          if (project.id === currentProjectId) {
            return {
              ...project,
              sections: project.sections.map((section) => {
                if (section.id === task.section) {
                  return {
                    ...section,
                    tasks: [...section.tasks, newTask],
                  };
                }
                return section;
              }),
            };
          }
          return project;
        })
      );
    },
    [currentProjectId]
  );

  const updateTask = useCallback((task: Task) => {
    setProjects((prev) =>
      prev.map((project) => ({
        ...project,
        sections: project.sections.map((section) => ({
          ...section,
          tasks: section.tasks.map((t) => (t.id === task.id ? task : t)),
        })),
      }))
    );
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setProjects((prev) =>
      prev.map((project) => ({
        ...project,
        sections: project.sections.map((section) => ({
          ...section,
          tasks: section.tasks.filter((t) => t.id !== taskId),
        })),
      }))
    );
  }, []);

  const moveTask = useCallback(
    (taskId: string, newSectionId: string, newStatus: Status) => {
      let taskToMove: Task | null = null;
      let oldSectionId: string | null = null;

      // Find the task and its section
      projects.forEach((project) => {
        project.sections.forEach((section) => {
          const task = section.tasks.find((t) => t.id === taskId);
          if (task) {
            taskToMove = { ...task };
            oldSectionId = section.id;
          }
        });
      });

      if (!taskToMove || !oldSectionId) return;

      // Update task with new section and status
      const updatedTask = { ...taskToMove, section: newSectionId, status: newStatus };

      setProjects((prev) =>
        prev.map((project) => ({
          ...project,
          sections: project.sections.map((section) => {
            // Remove from old section
            if (section.id === oldSectionId) {
              return {
                ...section,
                tasks: section.tasks.filter((t) => t.id !== taskId),
              };
            }
            // Add to new section
            if (section.id === newSectionId) {
              return {
                ...section,
                tasks: [...section.tasks, updatedTask],
              };
            }
            return section;
          }),
        }))
      );
    },
    [projects]
  );

  const addSection = useCallback(
    (projectId: string, name: string) => {
      const newSection: Section = {
        id: `section${Date.now()}`,
        name,
        tasks: [],
        order: projects.find((p) => p.id === projectId)?.sections.length || 0,
      };

      setProjects((prev) =>
        prev.map((project) => {
          if (project.id === projectId) {
            return {
              ...project,
              sections: [...project.sections, newSection],
            };
          }
          return project;
        })
      );
    },
    [projects]
  );

  const updateSection = useCallback((sectionId: string, name: string) => {
    setProjects((prev) =>
      prev.map((project) => ({
        ...project,
        sections: project.sections.map((section) =>
          section.id === sectionId ? { ...section, name } : section
        ),
      }))
    );
  }, []);

  const deleteSection = useCallback((sectionId: string) => {
    setProjects((prev) =>
      prev.map((project) => ({
        ...project,
        sections: project.sections.filter((s) => s.id !== sectionId),
      }))
    );
  }, []);

  const addStatusColumn = useCallback(
    (projectId: string, name: Status, color: string) => {
      const project = projects.find((p) => p.id === projectId);
      if (!project) return;

      const newStatus: StatusColumn = {
        id: `status${Date.now()}`,
        name,
        color,
        order: project.statusColumns.length,
      };

      setProjects((prev) =>
        prev.map((p) => {
          if (p.id === projectId) {
            return {
              ...p,
              statusColumns: [...p.statusColumns, newStatus],
            };
          }
          return p;
        })
      );
    },
    [projects]
  );

  const updateStatusColumn = useCallback(
    (statusId: string, name: Status, color: string) => {
      setProjects((prev) =>
        prev.map((project) => ({
          ...project,
          statusColumns: project.statusColumns.map((status) =>
            status.id === statusId ? { ...status, name, color } : status
          ),
        }))
      );
    },
    []
  );

  const deleteStatusColumn = useCallback((statusId: string) => {
    setProjects((prev) =>
      prev.map((project) => ({
        ...project,
        statusColumns: project.statusColumns.filter((s) => s.id !== statusId),
      }))
    );
  }, []);

  const addGroup = useCallback((name: string) => {
    const newGroup: Group = {
      id: `group${Date.now()}`,
      name,
      projects: [],
    };
    setGroups((prev) => [...prev, newGroup]);
  }, []);

  const updateGroup = useCallback((groupId: string, name: string) => {
    setGroups((prev) =>
      prev.map((group) => (group.id === groupId ? { ...group, name } : group))
    );
  }, []);

  const deleteGroup = useCallback((groupId: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
  }, []);

  const addProjectToGroup = useCallback((projectId: string, groupId: string) => {
    setGroups((prev) =>
      prev.map((group) => {
        if (group.id === groupId && !group.projects.includes(projectId)) {
          return {
            ...group,
            projects: [...group.projects, projectId],
          };
        }
        return group;
      })
    );
  }, []);

  const removeProjectFromGroup = useCallback(
    (projectId: string, groupId: string) => {
      setGroups((prev) =>
        prev.map((group) => {
          if (group.id === groupId) {
            return {
              ...group,
              projects: group.projects.filter((p) => p !== projectId),
            };
          }
          return group;
        })
      );
    },
    []
  );

  const addTimeEntry = useCallback(
    (taskId: string, entry: Omit<TimeEntry, "id">) => {
      const newEntry: TimeEntry = {
        ...entry,
        id: `time${Date.now()}`,
      };

      setProjects((prev) =>
        prev.map((project) => ({
          ...project,
          sections: project.sections.map((section) => ({
            ...section,
            tasks: section.tasks.map((task) => {
              if (task.id === taskId) {
                return {
                  ...task,
                  timeEntries: [...(task.timeEntries || []), newEntry],
                };
              }
              return task;
            }),
          })),
        }))
      );
    },
    []
  );

  const getTasksByStatus = useCallback(
    (projectId: string) => {
      const project = projects.find((p) => p.id === projectId);
      if (!project) return {} as Record<Status, Task[]>;

      const result: Record<Status, Task[]> = {};

      // Initialize with empty arrays for all status columns
      project.statusColumns.forEach((status) => {
        result[status.name] = [];
      });

      // Add tasks to their respective status
      project.sections.forEach((section) => {
        section.tasks.forEach((task) => {
          if (result[task.status]) {
            result[task.status].push(task);
          } else {
            // Handle tasks with statuses not in statusColumns
            result[task.status] = [task];
          }
        });
      });

      return result;
    },
    [projects]
  );

  const getTasksForGantt = useCallback(
    (projectId: string) => {
      const project = projects.find((p) => p.id === projectId);
      if (!project) return [];

      return project.sections.flatMap((section) => section.tasks);
    },
    [projects]
  );

  const getTasksForCalendar = useCallback(
    (projectId: string, startDate: Date, endDate: Date) => {
      const project = projects.find((p) => p.id === projectId);
      if (!project) return [];

      return project.sections
        .flatMap((section) => section.tasks)
        .filter((task) => {
          if (!task.startDate || !task.dueDate) return false;
          return (
            (task.startDate >= startDate && task.startDate <= endDate) ||
            (task.dueDate >= startDate && task.dueDate <= endDate) ||
            (task.startDate <= startDate && task.dueDate >= endDate)
          );
        });
    },
    [projects]
  );

  const getUserWorkloads = useCallback(
    (startDate: Date, endDate: Date) => {
      const workloads: Record<string, Record<string, number>> = {};

      // Initialize workloads for all users and dates
      users.forEach((user) => {
        workloads[user.id] = {};
        
        // Create date range
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          const dateStr = currentDate.toISOString().split('T')[0];
          workloads[user.id][dateStr] = 0;
          currentDate.setDate(currentDate.getDate() + 1);
        }
      });

      // Sum up hours for each user and date
      projects.forEach((project) => {
        project.sections.forEach((section) => {
          section.tasks.forEach((task) => {
            if (task.timeEntries) {
              task.timeEntries.forEach((entry) => {
                const dateStr = entry.date.toISOString().split('T')[0];
                if (entry.date >= startDate && entry.date <= endDate) {
                  if (workloads[entry.user.id]) {
                    workloads[entry.user.id][dateStr] = 
                      (workloads[entry.user.id][dateStr] || 0) + entry.hours;
                  }
                }
              });
            }
          });
        });
      });

      return workloads;
    },
    [projects, users]
  );

  const value = {
    projects,
    currentProject,
    groups,
    users,
    setCurrentProject,
    addProject,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    addSection,
    updateSection,
    deleteSection,
    addStatusColumn,
    updateStatusColumn,
    deleteStatusColumn,
    addGroup,
    updateGroup,
    deleteGroup,
    addProjectToGroup,
    removeProjectFromGroup,
    addTimeEntry,
    getTasksByStatus,
    getTasksForGantt,
    getTasksForCalendar,
    getUserWorkloads,
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};

// Custom hook to use the context
export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};
