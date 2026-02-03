export interface ClickUpUser {
  id: number;
  username: string;
  email: string;
  color: string;
  profilePicture: string | null;
}

export interface ClickUpStatus {
  id: string;
  status: string;
  color: string;
  orderindex: number;
  type: string;
}

export interface ClickUpPriority {
  id: string;
  priority: string;
  color: string;
  orderindex: string;
}

export interface ClickUpChecklistItem {
  id: string;
  name: string;
  orderindex: number;
  assignee: any | null;
  group_assignee: any | null;
  resolved: boolean;
  parent: string | null;
  date_created: string;
  children: any[];
}

export interface ClickUpChecklist {
  id: string;
  task_id: string;
  name: string;
  date_created: string;
  orderindex: number;
  creator: number;
  resolved: number;
  unresolved: number;
  items: ClickUpChecklistItem[];
}

export interface ClickUpTask {
  id: string;
  name: string;
  description: string;
  text_content?: string;
  status: ClickUpStatus;
  orderindex: string;
  date_created: string;
  date_updated: string;
  date_closed: string | null;
  date_done: string | null;
  archived: boolean;
  creator: ClickUpUser;
  assignees: ClickUpUser[];
  watchers: ClickUpUser[];
  checklists: ClickUpChecklist[];
  tags: string[];
  parent: string | null;
  priority: ClickUpPriority | null;
  due_date: string | null;
  start_date: string | null;
  points: number | null;
  time_estimate: number | null;
  time_spent: number | null;
  custom_fields: any[];
  dependencies: any[];
  linked_tasks: any[];
  team_id: string;
  url: string;
  permission_level: string;
  list: {
    id: string;
    name: string;
    access: boolean;
  };
  project: {
    id: string;
    name: string;
    hidden: boolean;
    access: boolean;
  };
  folder: {
    id: string;
    name: string;
    hidden: boolean;
    access: boolean;
  };
  space: {
    id: string;
  };
}

export interface ClickUpTaskResponse {
  task: ClickUpTask;
}

export interface DashboardData {
  taskId: string;
  taskName: string;
  status: string;
  priority: string | null;
  assignees: string[];
  timeEstimate: number | null;
  timeSpent: number | null;
  dueDate: string | null;
  creator: string;
  dateCreated: string;
  dateUpdated: string;
  tags: string[];
  url: string;
  tasks?: ClickUpTask[]; // Optional array of all tasks
}

export interface StatusDistribution {
  name: string;
  value: number;
  color: string;
}

export interface PriorityDistribution {
  name: string;
  count: number;
  color: string;
}

export interface AssigneeWorkload {
  name: string;
  tasks: number;
}
