import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mission } from '@/types/mission';
import { Plus, ChevronDown } from 'lucide-react';

/**
 * Form component for adding new missions
 * Includes codename, briefing, and threat level selection
 */
interface AddMissionFormProps {
  onAdd: (mission: Omit<Mission, 'id' | 'createdAt' | 'status'>) => void;
}

const THREAT_OPTIONS = [
  { value: 'low', label: 'LOW', color: 'text-success' },
  { value: 'medium', label: 'MEDIUM', color: 'text-warning' },
  { value: 'high', label: 'HIGH', color: 'text-accent' },
  { value: 'critical', label: 'CRITICAL', color: 'text-accent' },
] as const;

const AddMissionForm: React.FC<AddMissionFormProps> = ({ onAdd }) => {
  const [codename, setCodename] = useState('');
  const [briefing, setBriefing] = useState('');
  const [threatLevel, setThreatLevel] = useState<Mission['threatLevel']>('medium');
  const [isExpanded, setIsExpanded] = useState(false);

  /**
   * Handles form submission and creates new mission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!codename.trim()) return;

    onAdd({
      codename: codename.trim().toUpperCase(),
      briefing: briefing.trim(),
      threatLevel,
    });

    // Reset form
    setCodename('');
    setBriefing('');
    setThreatLevel('medium');
    setIsExpanded(false);
  };

  return (
    <div className="border border-border bg-card/50 backdrop-blur-sm">
      {/* Header bar */}
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
            New Mission
          </span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Expandable form */}
      {isExpanded && (
        <form onSubmit={handleSubmit} className="p-4 pt-0 space-y-4 animate-fade-in">
          {/* Codename input */}
          <div className="space-y-2">
            <label className="text-xs font-orbitron text-primary uppercase tracking-wider">
              Operation Codename
            </label>
            <Input
              value={codename}
              onChange={(e) => setCodename(e.target.value)}
              placeholder="Enter mission codename..."
              className="bg-background/50 uppercase"
              autoFocus
            />
          </div>

          {/* Briefing input */}
          <div className="space-y-2">
            <label className="text-xs font-orbitron text-primary uppercase tracking-wider">
              Mission Briefing (Optional)
            </label>
            <Input
              value={briefing}
              onChange={(e) => setBriefing(e.target.value)}
              placeholder="Enter mission details..."
              className="bg-background/50"
            />
          </div>

          {/* Threat level selection */}
          <div className="space-y-2">
            <label className="text-xs font-orbitron text-primary uppercase tracking-wider">
              Threat Level
            </label>
            <div className="grid grid-cols-4 gap-2">
              {THREAT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setThreatLevel(option.value)}
                  className={`
                    px-3 py-2 text-xs font-orbitron uppercase tracking-wider border transition-all
                    ${
                      threatLevel === option.value
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

          {/* Submit button */}
          <Button
            type="submit"
            variant="mission"
            className="w-full"
            disabled={!codename.trim()}
          >
            <Plus className="w-4 h-4 mr-2" />
            Initialize Mission
          </Button>
        </form>
      )}
    </div>
  );
};

export default AddMissionForm;
