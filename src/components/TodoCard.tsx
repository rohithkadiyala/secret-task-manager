import React from 'react';
import { Todo, PRIORITY_LEVELS } from '@/types/mission';
import { Button } from '@/components/ui/button';
import { Check, X, Target, Clock, AlertTriangle, Pause, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/**
 * Calculates countdown text and urgency level for a due date
 */
const getCountdown = (dueDate: Date): { text: string; urgent: boolean; overdue: boolean } => {
  const now = new Date();
  const diff = dueDate.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (diff < 0) {
    const overdueDays = Math.abs(days);
    return { 
      text: overdueDays > 0 ? `${overdueDays}d overdue` : `${Math.abs(hours)}h overdue`, 
      urgent: true, 
      overdue: true 
    };
  }

  if (days === 0) {
    return { text: hours > 0 ? `${hours}h left` : 'Due now', urgent: true, overdue: false };
  }

  if (days <= 2) {
    return { text: `${days}d ${hours}h left`, urgent: true, overdue: false };
  }

  return { text: `${days} days left`, urgent: false, overdue: false };
};

interface TodoCardProps {
  todo: Todo;
  onStatusChange: (id: string, status: Todo['status']) => void;
  onDelete: (id: string) => void;
  index: number;
}

const TodoCard: React.FC<TodoCardProps> = ({
  todo,
  onStatusChange,
  onDelete,
  index,
}) => {
  const priorityConfig = PRIORITY_LEVELS[todo.priority];
  const isCompleted = todo.status === 'completed';
  const isInactive = todo.status === 'inactive';
  const countdown = todo.dueDate && !isCompleted ? getCountdown(todo.dueDate) : null;

  const getStatusIcon = () => {
    switch (todo.status) {
      case 'completed':
        return <Check className="w-5 h-5 text-success" />;
      case 'inactive':
        return <Pause className="w-5 h-5 text-muted-foreground" />;
      case 'active':
        return countdown?.overdue 
          ? <AlertTriangle className="w-5 h-5 text-accent animate-pulse" />
          : <Target className={cn("w-5 h-5", priorityConfig.color)} />;
      default:
        return <Target className={cn("w-5 h-5", priorityConfig.color)} />;
    }
  };

  const getStatusStyles = () => {
    if (isCompleted) return "border-success bg-success/20";
    if (isInactive) return "border-muted-foreground bg-muted/20";
    if (countdown?.overdue) return "border-accent bg-accent/20";
    return `${priorityConfig.borderColor} ${priorityConfig.bgColor}`;
  };

  return (
    <div
      className={cn(
        "group relative border bg-card/50 backdrop-blur-sm p-4 transition-all duration-300 hover:bg-card/80 animate-slide-in",
        isCompleted ? "border-muted opacity-60" : isInactive ? "border-muted opacity-70" : `border-border hover:border-primary/50`,
        countdown?.overdue && !isInactive && "border-accent/50"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Left accent bar */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1 transition-all duration-300",
          isCompleted ? "bg-success" : isInactive ? "bg-muted-foreground" : countdown?.overdue ? "bg-accent" : priorityConfig.bgColor.replace('/20', '')
        )}
      />

      <div className="flex items-start gap-4 pl-3">
        {/* Status icon */}
        <div
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-sm border flex items-center justify-center transition-all",
            getStatusStyles()
          )}
        >
          {getStatusIcon()}
        </div>

        {/* Mission details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {/* Priority badge */}
            <span
              className={cn(
                "text-[10px] font-orbitron px-2 py-0.5 rounded-sm border uppercase tracking-wider",
                priorityConfig.color,
                priorityConfig.bgColor,
                priorityConfig.borderColor
              )}
            >
              {priorityConfig.label}
            </span>

            {/* Status badge */}
            <span
              className={cn(
                "text-[10px] font-orbitron px-2 py-0.5 rounded-sm border uppercase tracking-wider",
                isCompleted ? "text-success bg-success/20 border-success/50" :
                isInactive ? "text-muted-foreground bg-muted/20 border-muted-foreground/50" :
                "text-primary bg-primary/20 border-primary/50"
              )}
            >
              {todo.status}
            </span>
            
            {/* Due date countdown */}
            {countdown && !isInactive && (
              <span 
                className={cn(
                  "text-[10px] font-orbitron px-2 py-0.5 rounded-sm border uppercase tracking-wider flex items-center gap-1",
                  countdown.overdue 
                    ? "text-accent bg-accent/20 border-accent" 
                    : countdown.urgent 
                      ? "text-warning bg-warning/20 border-warning/50"
                      : "text-muted-foreground bg-muted/20 border-border"
                )}
              >
                <Clock className="w-3 h-3" />
                {countdown.text}
              </span>
            )}
            
            {/* Created timestamp */}
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {todo.createdAt.toLocaleDateString()}
            </span>
          </div>

          {/* Mission codename */}
          <h3
            className={cn(
              "font-orbitron text-sm font-medium mb-1 transition-all",
              isCompleted ? "text-muted-foreground line-through" : isInactive ? "text-muted-foreground" : "text-foreground"
            )}
          >
            {todo.codename}
          </h3>

          {/* Mission briefing */}
          {todo.briefing && (
            <p className="text-xs text-muted-foreground font-mono line-clamp-2">
              {todo.briefing}
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Select 
            value={todo.status} 
            onValueChange={(value) => onStatusChange(todo.id, value as Todo['status'])}
          >
            <SelectTrigger className="w-[110px] h-8 text-[10px] font-orbitron">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inactive">
                <span className="flex items-center gap-2">
                  <Pause className="w-3 h-3" /> Inactive
                </span>
              </SelectItem>
              <SelectItem value="active">
                <span className="flex items-center gap-2">
                  <Play className="w-3 h-3" /> Active
                </span>
              </SelectItem>
              <SelectItem value="completed">
                <span className="flex items-center gap-2">
                  <Check className="w-3 h-3" /> Completed
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDelete(todo.id)}
            className="h-8 w-8 text-accent hover:text-accent hover:bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Delete"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Completed overlay */}
      {isCompleted && (
        <div className="absolute top-2 right-2 font-orbitron text-[10px] text-success uppercase tracking-wider">
          COMPLETED
        </div>
      )}
    </div>
  );
};

export default TodoCard;
