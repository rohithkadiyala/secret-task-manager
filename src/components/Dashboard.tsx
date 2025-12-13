import React, { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Todo, SortOption } from '@/types/mission';
import TodoCard from '@/components/TodoCard';
import AddTodoForm from '@/components/AddTodoForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogOut, Shield, Target, CheckCircle, AlertTriangle, Search, ArrowUpDown, Pause } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Dashboard: React.FC = () => {
  const { agentId, logout } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: '1',
      codename: 'OPERATION NIGHTFALL',
      briefing: 'Retrieve classified documents from the embassy vault before dawn.',
      priority: 'high',
      status: 'active',
      createdAt: new Date(Date.now() - 86400000),
      dueDate: new Date(Date.now() + 86400000 * 2),
    },
    {
      id: '2',
      codename: 'OPERATION GHOST PROTOCOL',
      briefing: 'Establish secure communication channel with field agents.',
      priority: 'medium',
      status: 'inactive',
      createdAt: new Date(Date.now() - 172800000),
      dueDate: new Date(Date.now() + 86400000 * 5),
    },
    {
      id: '3',
      codename: 'OPERATION SILENT THUNDER',
      briefing: 'Neutralize surveillance equipment at the target location.',
      priority: 'critical',
      status: 'active',
      createdAt: new Date(),
      dueDate: new Date(Date.now() + 86400000),
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'inactive' | 'active' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('created');

  const addTodo = (todoData: Omit<Todo, 'id' | 'createdAt' | 'status'>) => {
    const newTodo: Todo = {
      ...todoData,
      id: crypto.randomUUID(),
      status: 'active',
      createdAt: new Date(),
    };
    setTodos([newTodo, ...todos]);
  };

  const changeStatus = (id: string, status: Todo['status']) => {
    setTodos(todos.map(t =>
      t.id === id
        ? { ...t, status, completedAt: status === 'completed' ? new Date() : undefined }
        : t
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  // Priority order for sorting
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };

  // Filter, search, and sort todos
  const processedTodos = useMemo(() => {
    let result = [...todos];

    // Filter by status
    if (filter === 'inactive') result = result.filter(t => t.status === 'inactive');
    if (filter === 'active') result = result.filter(t => t.status === 'active');
    if (filter === 'completed') result = result.filter(t => t.status === 'completed');

    // Search by codename or briefing
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(t =>
        t.codename.toLowerCase().includes(query) ||
        t.briefing.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.getTime() - b.dueDate.getTime();
        case 'priority':
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'name':
          return a.codename.localeCompare(b.codename);
        case 'created':
        default:
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });

    return result;
  }, [todos, filter, searchQuery, sortBy]);

  // Calculate statistics
  const stats = {
    total: todos.length,
    inactive: todos.filter(t => t.status === 'inactive').length,
    active: todos.filter(t => t.status === 'active').length,
    completed: todos.filter(t => t.status === 'completed').length,
    critical: todos.filter(t => t.priority === 'critical' && t.status === 'active').length,
  };

  const progressPercent = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  return (
    <div className="min-h-screen bg-background grid-bg">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border border-primary/50 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-orbitron text-lg font-bold text-foreground glow-text">
                  SECRET TASK
                </h1>
                <p className="text-xs text-muted-foreground font-mono">
                  Mission Control Interface
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  Active Agent
                </p>
                <p className="font-orbitron text-sm text-primary">
                  {agentId}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="text-muted-foreground hover:text-accent"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <StatCard
            icon={<Target className="w-5 h-5" />}
            label="Total Missions"
            value={stats.total}
            color="text-primary"
          />
          <StatCard
            icon={<Pause className="w-5 h-5" />}
            label="Inactive"
            value={stats.inactive}
            color="text-muted-foreground"
          />
          <StatCard
            icon={<AlertTriangle className="w-5 h-5" />}
            label="Active"
            value={stats.active}
            color="text-warning"
          />
          <StatCard
            icon={<CheckCircle className="w-5 h-5" />}
            label="Completed"
            value={stats.completed}
            color="text-success"
          />
          <StatCard
            icon={<AlertTriangle className="w-5 h-5" />}
            label="Critical"
            value={stats.critical}
            color="text-accent"
          />
        </div>

        {/* Progress bar */}
        <div className="mb-6 border border-border bg-card/50 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-orbitron text-primary uppercase tracking-wider">
              Overall Progress
            </span>
            <span className="text-xs font-orbitron text-foreground">
              {Math.round(progressPercent)}%
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {/* Add mission form */}
        <div className="mb-6">
          <AddTodoForm onAdd={addTodo} />
        </div>

        {/* Search and Sort controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search missions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-[160px] font-orbitron text-xs">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created">Date Created</SelectItem>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-6">
          {(['all', 'inactive', 'active', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`
                px-4 py-2 text-xs font-orbitron uppercase tracking-wider border transition-all
                ${
                  filter === f
                    ? 'text-primary border-primary bg-primary/10'
                    : 'text-muted-foreground border-border hover:border-muted-foreground'
                }
              `}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Mission list */}
        <div className="space-y-3">
          {processedTodos.length > 0 ? (
            processedTodos.map((todo, index) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                onStatusChange={changeStatus}
                onDelete={deleteTodo}
                index={index}
              />
            ))
          ) : (
            <div className="text-center py-12 border border-dashed border-border">
              <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="font-orbitron text-muted-foreground uppercase tracking-wider">
                No missions found
              </p>
              <p className="text-sm text-muted-foreground/60 mt-1 font-mono">
                {searchQuery ? 'Try a different search term' : 'Create a new mission to get started'}
              </p>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-border py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground font-mono">
            ⚠ CLASSIFIED - LEVEL 5 CLEARANCE REQUIRED
          </p>
        </div>
      </footer>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => (
  <div className="border border-border bg-card/50 backdrop-blur-sm p-4">
    <div className="flex items-center gap-3">
      <div className={`${color}`}>{icon}</div>
      <div>
        <p className="text-2xl font-orbitron font-bold text-foreground">
          {value}
        </p>
        <p className="text-xs text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
      </div>
    </div>
  </div>
);

export default Dashboard;
