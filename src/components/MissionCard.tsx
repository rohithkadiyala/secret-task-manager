import React from 'react';
import { Mission, THREAT_LEVELS } from '@/types/mission';
import { Button } from '@/components/ui/button';
import { Check, X, Target, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * MissionCard component displays a single mission/task
 * with spy-themed styling and interactive controls
 */
interface MissionCardProps {
  mission: Mission;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  index: number;
}

const MissionCard: React.FC<MissionCardProps> = ({
  mission,
  onComplete,
  onDelete,
  index,
}) => {
  const threatConfig = THREAT_LEVELS[mission.threatLevel];
  const isCompleted = mission.status === 'completed';

  return (
    <div
      className={cn(
        "group relative border bg-card/50 backdrop-blur-sm p-4 transition-all duration-300 hover:bg-card/80 animate-slide-in",
        isCompleted ? "border-muted opacity-60" : `border-border hover:border-primary/50`,
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Left accent bar */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1 transition-all duration-300",
          isCompleted ? "bg-success" : threatConfig.bgColor.replace('/20', '')
        )}
      />

      <div className="flex items-start gap-4 pl-3">
        {/* Mission status icon */}
        <div
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-sm border flex items-center justify-center transition-all",
            isCompleted
              ? "border-success bg-success/20"
              : `${threatConfig.borderColor} ${threatConfig.bgColor}`
          )}
        >
          {isCompleted ? (
            <Check className="w-5 h-5 text-success" />
          ) : (
            <Target className={cn("w-5 h-5", threatConfig.color)} />
          )}
        </div>

        {/* Mission details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {/* Threat level badge */}
            <span
              className={cn(
                "text-[10px] font-orbitron px-2 py-0.5 rounded-sm border uppercase tracking-wider",
                threatConfig.color,
                threatConfig.bgColor,
                threatConfig.borderColor
              )}
            >
              {threatConfig.label}
            </span>
            
            {/* Timestamp */}
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {mission.createdAt.toLocaleDateString()}
            </span>
          </div>

          {/* Mission codename */}
          <h3
            className={cn(
              "font-orbitron text-sm font-medium mb-1 transition-all",
              isCompleted ? "text-muted-foreground line-through" : "text-foreground"
            )}
          >
            {mission.codename}
          </h3>

          {/* Mission briefing */}
          {mission.briefing && (
            <p className="text-xs text-muted-foreground font-mono line-clamp-2">
              {mission.briefing}
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isCompleted && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onComplete(mission.id)}
              className="h-8 w-8 text-success hover:text-success hover:bg-success/20"
              title="Mark as completed"
            >
              <Check className="w-4 h-4" />
            </Button>
          )}
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDelete(mission.id)}
            className="h-8 w-8 text-accent hover:text-accent hover:bg-accent/20"
            title="Delete mission"
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

export default MissionCard;
