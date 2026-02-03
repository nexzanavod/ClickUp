import type { DashboardData } from "../types/clickup";
import { StatCard } from "./StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  Calendar, 
  Clock, 
  Users, 
  Tag, 
  AlertCircle, 
  CheckCircle2,
  ArrowLeft,
  ExternalLink,
  ListChecks,
  TrendingUp,
  Target,
  Zap,
  Activity,
  Award,
  Sparkles,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { useState } from "react";

interface DashboardProps {
  data: DashboardData;
  onBack: () => void;
}

export function Dashboard({ data, onBack }: DashboardProps) {
  const tasks = data.tasks || [];
  const [expandedChecklists, setExpandedChecklists] = useState<Record<string, boolean>>({});
  const [expandedTaskChecklists, setExpandedTaskChecklists] = useState<Record<string, boolean>>({});
  
  const toggleChecklist = (checklistId: string) => {
    setExpandedChecklists(prev => ({
      ...prev,
      [checklistId]: !prev[checklistId]
    }));
  };

  const toggleTaskChecklists = (taskId: string) => {
    setExpandedTaskChecklists(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };
  
  // Format time in hours
  const formatTime = (milliseconds: number | null) => {
    if (!milliseconds) return "N/A";
    const hours = milliseconds / (1000 * 60 * 60);
    return `${hours.toFixed(1)}h`;
  };

  // Format date
  const formatDate = (timestamp: string | null) => {
    if (!timestamp) return "Not set";
    return new Date(parseInt(timestamp)).toLocaleDateString();
  };

  // Calculate status distribution from all tasks
  const statusCounts: Record<string, number> = {};
  tasks.forEach(task => {
    const status = task.status.status;
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });
  
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value,
    color: tasks.find(t => t.status.status === name)?.status.color || '#3b82f6',
  }));

  // Calculate subtask status distribution (completed vs incomplete)
  const totalSubtasks = tasks.reduce((acc, t) => 
    acc + (t.checklists?.reduce((sum, cl) => sum + cl.resolved + cl.unresolved, 0) || 0), 0
  );
  const completedSubtasks = tasks.reduce((acc, t) => 
    acc + (t.checklists?.reduce((sum, cl) => sum + cl.resolved, 0) || 0), 0
  );
  const incompleteSubtasks = totalSubtasks - completedSubtasks;

  const subtaskStatusData = [
    { name: 'Completed', value: completedSubtasks, color: '#10b981' },
    { name: 'In Progress', value: incompleteSubtasks, color: '#f59e0b' }
  ].filter(item => item.value > 0);

  // Calculate priority distribution
  const priorityCounts: Record<string, number> = { 'No Priority': 0 };
  tasks.forEach(task => {
    const priority = task.priority?.priority || 'No Priority';
    priorityCounts[priority] = (priorityCounts[priority] || 0) + 1;
  });
  
  const priorityData = Object.entries(priorityCounts).map(([name, count]) => ({
    name,
    count,
    color: name === 'No Priority' ? '#9ca3af' : '#ef4444',
  }));

  // Calculate assignee workload
  const assigneeCounts: Record<string, number> = { 'Unassigned': 0 };
  tasks.forEach(task => {
    if (task.assignees && task.assignees.length > 0) {
      task.assignees.forEach(assignee => {
        assigneeCounts[assignee.username] = (assigneeCounts[assignee.username] || 0) + 1;
      });
    } else {
      assigneeCounts['Unassigned']++;
    }
  });
  
  const assigneeData = Object.entries(assigneeCounts).map(([name, tasks]) => ({
    name,
    tasks,
  }));

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4"];
  
  // Enhanced color palette for visual richness
  const GRADIENT_COLORS = {
    blue: "from-blue-500 to-cyan-500",
    green: "from-green-500 to-emerald-500",
    purple: "from-purple-500 to-pink-500",
    orange: "from-orange-500 to-red-500",
    indigo: "from-indigo-500 to-purple-500",
    rose: "from-rose-500 to-pink-500",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-purple-50 to-fuchsia-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Animated Header with Gradient */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 p-8 shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="secondary" 
                size="icon" 
                onClick={onBack}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/40"
              >
                <ArrowLeft className="h-5 w-5 text-white" />
              </Button>
              <div>
                <div className="flex items-center gap-3">
                  <Sparkles className="h-8 w-8 text-yellow-300 animate-pulse" />
                  <h1 className="text-4xl font-bold text-white drop-shadow-lg">{data.taskName}</h1>
                </div>
                <p className="text-white/90 mt-2 text-lg font-medium">Task List Analytics Dashboard</p>
              </div>
            </div>
            <a href={data.url} target="_blank" rel="noopener noreferrer">
              <Button className="bg-white text-purple-600 hover:bg-white/90 shadow-lg font-semibold">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in ClickUp
              </Button>
            </a>
          </div>
        </div>

        {/* Colorful Stats Grid with Gradients */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-6 shadow-lg transform hover:scale-105 transition-transform">
            <div className="absolute top-0 right-0 -mt-4 -mr-4">
              <div className="h-24 w-24 rounded-full bg-white/10 backdrop-blur-sm"></div>
            </div>
            <ListChecks className="h-12 w-12 text-white mb-4 relative z-10" />
            <div className="relative z-10">
              <p className="text-white/80 text-sm font-medium uppercase tracking-wide">Task Statistics</p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white/90 text-xs">Main Tasks:</span>
                  <span className="text-2xl font-bold text-white">{tasks.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/90 text-xs">Total Checklists:</span>
                  <span className="text-xl font-bold text-white">
                    {tasks.reduce((acc, t) => acc + (t.checklists?.length || 0), 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/90 text-xs">All Subtasks:</span>
                  <span className="text-xl font-bold text-white">
                    {tasks.reduce((acc, t) => 
                      acc + (t.checklists?.reduce((sum, cl) => sum + cl.resolved + cl.unresolved, 0) || 0), 0
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/20">
                  <span className="text-white/90 text-xs">Completed:</span>
                  <span className="text-xl font-bold text-green-200">
                    {tasks.reduce((acc, t) => 
                      acc + (t.checklists?.reduce((sum, cl) => sum + cl.resolved, 0) || 0), 0
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 p-6 shadow-lg transform hover:scale-105 transition-transform">
            <div className="absolute top-0 right-0 -mt-4 -mr-4">
              <div className="h-24 w-24 rounded-full bg-white/10 backdrop-blur-sm"></div>
            </div>
            <CheckCircle2 className="h-12 w-12 text-white mb-4 relative z-10" />
            <div className="relative z-10">
              <p className="text-white/80 text-sm font-medium uppercase tracking-wide">Progress Overview</p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white/90 text-xs">Overall Status:</span>
                  <span className="text-lg font-bold text-white truncate ml-2">{data.status}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/20">
                  <span className="text-white/90 text-xs">Completion:</span>
                  <span className="text-2xl font-bold text-white">
                    {(() => {
                      const total = tasks.reduce((acc, t) => 
                        acc + (t.checklists?.reduce((sum, cl) => sum + cl.resolved + cl.unresolved, 0) || 0), 0
                      );
                      const completed = tasks.reduce((acc, t) => 
                        acc + (t.checklists?.reduce((sum, cl) => sum + cl.resolved, 0) || 0), 0
                      );
                      return total > 0 ? `${Math.round((completed / total) * 100)}%` : '0%';
                    })()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 p-6 shadow-lg transform hover:scale-105 transition-transform">
            <div className="absolute top-0 right-0 -mt-4 -mr-4">
              <div className="h-24 w-24 rounded-full bg-white/10 backdrop-blur-sm"></div>
            </div>
            <Users className="h-12 w-12 text-white mb-4 relative z-10" />
            <div className="relative z-10">
              <p className="text-white/80 text-sm font-medium uppercase tracking-wide">Assigned Members</p>
              <p className="text-5xl font-bold text-white mt-2">
                {(() => {
                  const uniqueAssignees = new Set<string>();
                  tasks.forEach(task => {
                    task.checklists?.forEach(checklist => {
                      checklist.items?.forEach(item => {
                        if (item.assignee?.username) {
                          uniqueAssignees.add(item.assignee.username);
                        }
                      });
                    });
                  });
                  return uniqueAssignees.size;
                })()}
              </p>
              <p className="text-white/70 text-sm mt-2">
                {(() => {
                  const assignees = new Set<string>();
                  tasks.forEach(task => {
                    task.checklists?.forEach(checklist => {
                      checklist.items?.forEach(item => {
                        if (item.assignee?.username) {
                          assignees.add(item.assignee.username);
                        }
                      });
                    });
                  });
                  const names = Array.from(assignees).slice(0, 2);
                  return names.length > 0 ? names.join(", ") + (assignees.size > 2 ? "..." : "") : "No assignments";
                })()}
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-500 to-red-500 p-6 shadow-lg transform hover:scale-105 transition-transform">
            <div className="absolute top-0 right-0 -mt-4 -mr-4">
              <div className="h-24 w-24 rounded-full bg-white/10 backdrop-blur-sm"></div>
            </div>
            <Target className="h-12 w-12 text-white mb-4 relative z-10" />
            <div className="relative z-10">
              <p className="text-white/80 text-sm font-medium uppercase tracking-wide">Task Status</p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white/90 text-xs">Active Tasks:</span>
                  <span className="text-2xl font-bold text-white">{tasks.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/90 text-xs">With Checklists:</span>
                  <span className="text-xl font-bold text-white">
                    {tasks.filter(t => t.checklists && t.checklists.length > 0).length}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/20">
                  <span className="text-white/90 text-xs">Avg Progress:</span>
                  <span className="text-xl font-bold text-yellow-200">
                    {(() => {
                      const tasksWithChecklists = tasks.filter(t => t.checklists && t.checklists.length > 0);
                      if (tasksWithChecklists.length === 0) return '0%';
                      const avgProgress = tasksWithChecklists.reduce((acc, t) => {
                        const total = t.checklists.reduce((sum, cl) => sum + cl.resolved + cl.unresolved, 0);
                        const completed = t.checklists.reduce((sum, cl) => sum + cl.resolved, 0);
                        return acc + (total > 0 ? (completed / total) * 100 : 0);
                      }, 0) / tasksWithChecklists.length;
                      return `${Math.round(avgProgress)}%`;
                    })()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vibrant Charts Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Colorful Status Distribution */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                <CardTitle>Subtask Status Distribution</CardTitle>
              </div>
              <CardDescription className="text-white/80">Completed vs In Progress subtasks</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px] pt-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subtaskStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent, value }) => `${name}: ${value} (${percent ? (percent * 100).toFixed(0) : 0}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    strokeWidth={3}
                    stroke="#fff"
                  >
                    {subtaskStatusData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      borderRadius: '8px',
                      border: '2px solid #8b5cf6',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gradient Priority Bar Chart */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-600 text-white">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <CardTitle>Priority Distribution</CardTitle>
              </div>
              <CardDescription className="text-white/80">Tasks by priority level</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px] pt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData}>
                  <defs>
                    <linearGradient id="colorPriority" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.7}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="name" stroke="#666" style={{ fontSize: '12px', fontWeight: 600 }} />
                  <YAxis stroke="#666" style={{ fontSize: '12px', fontWeight: 600 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      borderRadius: '8px',
                      border: '2px solid #ec4899',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar 
                    dataKey="count" 
                    fill="url(#colorPriority)" 
                    radius={[12, 12, 0, 0]}
                    strokeWidth={2}
                    stroke="#fff"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Rainbow Team Workload Chart */}
          <Card className="md:col-span-2 border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                <CardTitle>Team Workload Distribution</CardTitle>
              </div>
              <CardDescription className="text-white/80">Task distribution across team members</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px] pt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={assigneeData}>
                  <defs>
                    <linearGradient id="colorTeam" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.7}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="name" stroke="#666" style={{ fontSize: '12px', fontWeight: 600 }} />
                  <YAxis stroke="#666" style={{ fontSize: '12px', fontWeight: 600 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      borderRadius: '8px',
                      border: '2px solid #06b6d4',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar 
                    dataKey="tasks" 
                    fill="url(#colorTeam)" 
                    radius={[12, 12, 0, 0]}
                    strokeWidth={2}
                    stroke="#fff"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Colorful Task Cards */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Award className="h-6 w-6" />
                  <CardTitle className="text-2xl">All Tasks ({tasks.length})</CardTitle>
                </div>
                <CardDescription className="text-white/80 mt-1">Complete list of tasks with full details</CardDescription>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 font-bold text-2xl">
                {tasks.length}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {tasks.map((task, index) => {
                // Cycle through gradient colors for each task
                const gradientIndex = index % 6;
                const gradients = [
                  "from-blue-500 to-cyan-500",
                  "from-purple-500 to-pink-500",
                  "from-green-500 to-emerald-500",
                  "from-orange-500 to-red-500",
                  "from-indigo-500 to-purple-500",
                  "from-rose-500 to-pink-500"
                ];
                
                return (
                  <Card 
                    key={task.id} 
                    className="border-2 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                    style={{ borderLeftWidth: '6px', borderLeftColor: task.status.color }}
                  >
                    <div className={`h-2 bg-gradient-to-r ${gradients[gradientIndex]}`}></div>
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-xl flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-sm shadow-lg">
                              {index + 1}
                            </span>
                            <a 
                              href={task.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:text-purple-600 hover:underline transition-colors"
                            >
                              {task.name}
                            </a>
                          </CardTitle>
                          {task.text_content && (
                            <CardDescription className="mt-3 text-sm line-clamp-2 bg-white/60 p-3 rounded-lg border border-gray-200">
                              {task.text_content}
                            </CardDescription>
                          )}
                        </div>
                        <Badge 
                          className="ml-4 px-4 py-2 text-sm font-semibold shadow-md"
                          style={{ 
                            backgroundColor: task.status.color,
                            color: '#fff',
                            border: `2px solid ${task.status.color}`
                          }}
                        >
                          {task.status.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="bg-white p-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg border-2 border-blue-200">
                          <div className="flex items-center gap-2 text-blue-700 mb-2">
                            <Users className="h-5 w-5" />
                            <span className="font-bold text-sm">Creator</span>
                          </div>
                          <p className="font-semibold text-gray-800">{task.creator.username}</p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border-2 border-purple-200">
                          <div className="flex items-center gap-2 text-purple-700 mb-2">
                            <Users className="h-5 w-5" />
                            <span className="font-bold text-sm">Assignees</span>
                          </div>
                          <p className="font-semibold text-gray-800">{task.assignees?.length > 0 ? task.assignees.map(a => a.username).join(", ") : "None"}</p>
                        </div>
                        <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-lg border-2 border-orange-200">
                          <div className="flex items-center gap-2 text-orange-700 mb-2">
                            <Zap className="h-5 w-5" />
                            <span className="font-bold text-sm">Priority</span>
                          </div>
                          <p className="font-semibold text-gray-800">{task.priority?.priority || "None"}</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border-2 border-green-200">
                          <div className="flex items-center gap-2 text-green-700 mb-2">
                            <Calendar className="h-5 w-5" />
                            <span className="font-bold text-sm">Created</span>
                          </div>
                          <p className="font-semibold text-gray-800">{formatDate(task.date_created)}</p>
                        </div>
                      </div>
                      
                      {task.checklists && task.checklists.length > 0 && (
                        <div className="mt-6 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200">
                          <div 
                            className="flex items-center justify-between mb-4 cursor-pointer hover:bg-indigo-100/50 -m-5 p-5 rounded-t-xl transition-colors"
                            onClick={() => toggleTaskChecklists(task.id)}
                          >
                            <div className="flex items-center gap-2">
                              {expandedTaskChecklists[task.id] ? (
                                <ChevronDown className="h-5 w-5 text-indigo-600" />
                              ) : (
                                <ChevronRight className="h-5 w-5 text-indigo-600" />
                              )}
                              <ListChecks className="h-5 w-5 text-indigo-600" />
                              <span className="text-base font-bold text-indigo-900">Checklists ({task.checklists.length})</span>
                            </div>
                            <Badge variant="outline" className="bg-indigo-600 text-white border-0">
                              {task.checklists.reduce((acc, cl) => acc + cl.resolved, 0)}/
                              {task.checklists.reduce((acc, cl) => acc + cl.resolved + cl.unresolved, 0)}
                            </Badge>
                          </div>
                          
                          {expandedTaskChecklists[task.id] && (
                            <div className="space-y-4">
                              {task.checklists.map((checklist) => {
                                const progress = (checklist.resolved / (checklist.resolved + checklist.unresolved)) * 100;
                                const isExpanded = expandedChecklists[checklist.id] ?? false;
                                
                                return (
                                  <div key={checklist.id} className="bg-white rounded-lg p-4 shadow-sm border border-indigo-100">
                                    <div 
                                      className="flex items-center justify-between mb-3 cursor-pointer hover:bg-indigo-50 -m-4 p-4 rounded-t-lg transition-colors"
                                      onClick={() => toggleChecklist(checklist.id)}
                                    >
                                      <div className="flex items-center gap-2 flex-1">
                                        {isExpanded ? (
                                          <ChevronDown className="h-4 w-4 text-indigo-600" />
                                        ) : (
                                          <ChevronRight className="h-4 w-4 text-indigo-600" />
                                        )}
                                        <span className="text-sm font-semibold text-gray-800">{checklist.name}</span>
                                      </div>
                                      <Badge 
                                        variant="outline" 
                                        className="text-xs font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-white border-0"
                                      >
                                        {checklist.resolved}/{checklist.resolved + checklist.unresolved}
                                      </Badge>
                                    </div>
                                    <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner mb-3">
                                      <div 
                                        className="absolute h-full bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 rounded-full transition-all duration-500 shadow-lg"
                                        style={{ width: `${progress}%` }}
                                      >
                                        <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                                      </div>
                                    </div>
                                    <p className="text-xs text-gray-600 mb-3 font-semibold">{progress.toFixed(0)}% Complete</p>
                                    
                                    {/* Checklist Items (Subtasks) - Collapsible */}
                                    {isExpanded && checklist.items && checklist.items.length > 0 && (
                                      <div className="space-y-2 mt-3 pl-2 border-l-2 border-indigo-200">
                                        {checklist.items.map((item) => (
                                          <div key={item.id} className="flex items-start justify-between gap-2 pl-2">
                                            <div className="flex items-start gap-2 flex-1">
                                              {item.assignee && (
                                                <div className="flex items-center gap-1 mt-0.5">
                                                  <Users className="h-3 w-3 text-purple-500" />
                                                  <span className="text-xs text-purple-600 font-medium">
                                                    {item.assignee.username || 'Assigned'}
                                                  </span>
                                                </div>
                                              )}
                                              <div className={`mt-1 flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center ${
                                                item.resolved 
                                                  ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-500' 
                                                  : 'bg-white border-gray-300'
                                              }`}>
                                                {item.resolved && (
                                                  <CheckCircle2 className="h-3 w-3 text-white" />
                                                )}
                                              </div>
                                              <span className={`text-xs ${
                                                item.resolved 
                                                  ? 'text-gray-500 line-through' 
                                                  : 'text-gray-700'
                                              }`}>
                                                {item.name}
                                              </span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {task.tags && task.tags.length > 0 && (
                        <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200">
                          <div className="flex items-center gap-2 mb-3">
                            <Tag className="h-5 w-5 text-orange-600" />
                            <span className="font-bold text-orange-900">Tags</span>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            {task.tags.map((tag, idx) => {
                              const tagColors = [
                                "from-pink-500 to-rose-500",
                                "from-purple-500 to-indigo-500",
                                "from-blue-500 to-cyan-500",
                                "from-green-500 to-teal-500",
                                "from-yellow-500 to-orange-500",
                                "from-red-500 to-pink-500"
                              ];
                              return (
                                <Badge 
                                  key={idx} 
                                  className={`px-3 py-1 text-xs font-bold bg-gradient-to-r ${tagColors[idx % tagColors.length]} text-white shadow-md border-0`}
                                >
                                  {tag}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
