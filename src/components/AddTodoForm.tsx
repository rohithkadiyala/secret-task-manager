import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Todo } from '@/types/mission';
import { Plus, ChevronDown, Calendar } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface AddTodoFormProps {
  onAdd: (todo: Omit<Todo, 'id' | 'createdAt' | 'status'>) => void;
}

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'LOW', color: 'text-success' },
  { value: 'medium', label: 'MEDIUM', color: 'text-warning' },
  { value: 'high', label: 'HIGH', color: 'text-accent' },
  { value: 'critical', label: 'CRITICAL', color: 'text-accent' },
] as const;

const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAdd }) => {
  const [codename, setCodename] = useState('');
  const [briefing, setBriefing] = useState('');
  const [priority, setPriority] = useState<Todo['priority']>('medium');
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!codename.trim()) return;

    onAdd({
      codename: codename.trim().toUpperCase(),
      briefing: briefing.trim(),
      priority,
      dueDate,
    });

    // Reset form
    setCodename('');
    setBriefing('');
    setPriority('medium');
    setDueDate(undefined);
    setIsExpanded(false);
  };

  return (
    <div className="border border-border bg-card/50 backdrop-blur-sm">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm border border-primary/50 bg-primary/10 flex items-center justify-center">
            <Plus className="w-4 h-4 text-primary" />
          </div>
          <span className="font-orbitron text-sm text-foreground uppercase tracking-wider">
            New To-Do
          </span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isExpanded && (
        <form onSubmit={handleSubmit} className="p-4 pt-0 space-y-4 animate-fade-in">
          <div className="space-y-2">
            <label className="text-xs font-orbitron text-primary uppercase tracking-wider">
              Title
            </label>
            <Input
              value={codename}
              onChange={(e) => setCodename(e.target.value)}
              placeholder="Enter task title..."
              className="bg-background/50 uppercase"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-orbitron text-primary uppercase tracking-wider">
              Description (Optional)
            </label>
            <Input
              value={briefing}
              onChange={(e) => setBriefing(e.target.value)}
              placeholder="Enter task details..."
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-orbitron text-primary uppercase tracking-wider">
              Due Date (Optional)
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-mono",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : "Select due date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-orbitron text-primary uppercase tracking-wider">
              Priority Level
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PRIORITY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPriority(option.value)}
                  className={`
                    px-3 py-2 text-xs font-orbitron uppercase tracking-wider border transition-all
                    ${
                      priority === option.value
                        ? `${option.color} border-current bg-current/10`
                        : 'text-muted-foreground border-border hover:border-muted-foreground'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            variant="mission"
            className="w-full"
            disabled={!codename.trim()}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add To-Do
          </Button>
        </form>
      )}
    </div>
  );
};

export default AddTodoForm;
