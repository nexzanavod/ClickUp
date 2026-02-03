import axios from 'axios';
import type { ClickUpTask, DashboardData } from '../types/clickup';

const CLICKUP_API_BASE_URL = 'https://api.clickup.com/api/v2';

export class ClickUpService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Fetch tasks from a ClickUp list
   */
  async getTasks(listId: string): Promise<ClickUpTask[]> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': this.apiKey,
      };
      
      const response = await axios.get<{ tasks: ClickUpTask[] }>(
        `${CLICKUP_API_BASE_URL}/list/${listId}/task`,
        { headers }
      );
      
      if (response.data.tasks && response.data.tasks.length > 0) {
        return response.data.tasks;
      }
      throw new Error('No tasks found in this list');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.err || 
          error.response?.data?.message || 
          error.response?.data?.ECODE ||
          `Failed to fetch tasks from ClickUp (Status: ${error.response?.status})`;
        throw new Error(errorMessage);
      }
      throw error;
    }
  }

  /**
   * Transform multiple tasks into aggregated dashboard data
   */
  transformTasksData(tasks: ClickUpTask[]): DashboardData {
    // Use the list name from first task
    const listName = tasks[0]?.list?.name || 'Unknown List';
    const totalTasks = tasks.length;
    
    // Aggregate assignees
    const allAssignees = new Set<string>();
    tasks.forEach(task => {
      task.assignees?.forEach(assignee => allAssignees.add(assignee.username));
    });
    
    // Aggregate time
    const totalTimeEstimate = tasks.reduce((sum, task) => sum + (task.time_estimate || 0), 0);
    const totalTimeSpent = tasks.reduce((sum, task) => sum + (task.time_spent || 0), 0);
    
    // Get most common status
    const statuses = tasks.map(t => t.status.status);
    const statusCounts: Record<string, number> = {};
    statuses.forEach(s => statusCounts[s] = (statusCounts[s] || 0) + 1);
    const mostCommonStatus = Object.keys(statusCounts).reduce((a, b) => 
      statusCounts[a] > statusCounts[b] ? a : b
    );
    
    // Get most common priority
    const priorities = tasks.filter(t => t.priority).map(t => t.priority!.priority);
    const priorityCounts: Record<string, number> = {};
    priorities.forEach(p => priorityCounts[p] = (priorityCounts[p] || 0) + 1);
    const mostCommonPriority = priorities.length > 0 
      ? Object.keys(priorityCounts).reduce((a, b) => 
          priorityCounts[a] > priorityCounts[b] ? a : b
        )
      : null;
    
    return {
      taskId: tasks[0]?.list?.id || 'unknown',
      taskName: `${listName} (${totalTasks} tasks)`,
      status: mostCommonStatus,
      priority: mostCommonPriority,
      assignees: Array.from(allAssignees),
      timeEstimate: totalTimeEstimate,
      timeSpent: totalTimeSpent,
      dueDate: null,
      creator: tasks[0]?.creator?.username || 'Unknown',
      dateCreated: tasks[0]?.date_created || '',
      dateUpdated: tasks[0]?.date_updated || '',
      tags: [],
      url: tasks[0]?.list?.id ? `https://app.clickup.com/t/${tasks[0].list.id}` : '',
      tasks: tasks, // Include all tasks for detailed view
    };
  }
}

