import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Mission } from '@/types/mission';
import MissionCard from '@/components/MissionCard';
import AddMissionForm from '@/components/AddMissionForm';
import { Button } from '@/components/ui/button';
import { LogOut, Shield, Target, CheckCircle, AlertTriangle } from 'lucide-react';

/**
 * Main dashboard component for mission control
 * Displays all missions and provides CRUD operations
 */
const Dashboard: React.FC = () => {
  const { agentId, logout } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([
    // Sample missions for demonstration
    {
      id: '1',
      codename: 'OPERATION NIGHTFALL',
      briefing: 'Retrieve classified documents from the embassy vault before dawn.',
      threatLevel: 'high',
      status: 'pending',
      createdAt: new Date(Date.now() - 86400000),
    },
    {
      id: '2',
      codename: 'OPERATION GHOST PROTOCOL',
      briefing: 'Establish secure communication channel with field agents.',
      threatLevel: 'medium',
      status: 'pending',
      createdAt: new Date(Date.now() - 172800000),
    },
    {
      id: '3',
      codename: 'OPERATION SILENT THUNDER',
      briefing: 'Neutralize surveillance equipment at the target location.',
      threatLevel: 'critical',
      status: 'pending',
      createdAt: new Date(),
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  /**
   * Adds a new mission to the list
   */
  const addMission = (missionData: Omit<Mission, 'id' | 'createdAt' | 'status'>) => {
    const newMission: Mission = {
      ...missionData,
      id: crypto.randomUUID(),
      status: 'pending',
      createdAt: new Date(),
    };
    setMissions([newMission, ...missions]);
  };

  /**
   * Marks a mission as completed
   */
  const completeMission = (id: string) => {
    setMissions(missions.map(m =>
      m.id === id
        ? { ...m, status: 'completed' as const, completedAt: new Date() }
        : m
    ));
  };

  /**
   * Deletes a mission from the list
   */
  const deleteMission = (id: string) => {
    setMissions(missions.filter(m => m.id !== id));
  };

  // Filter missions based on current filter
  const filteredMissions = missions.filter(m => {
    if (filter === 'active') return m.status !== 'completed';
    if (filter === 'completed') return m.status === 'completed';
    return true;
  });

  // Calculate statistics
  const stats = {
    total: missions.length,
    active: missions.filter(m => m.status !== 'completed').length,
    completed: missions.filter(m => m.status === 'completed').length,
    critical: missions.filter(m => m.threatLevel === 'critical' && m.status !== 'completed').length,
  };

  return (
    <div className="min-h-screen bg-background grid-bg">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and title */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border border-primary/50 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-orbitron text-lg font-bold text-foreground glow-text">
                  SHADOW OPS
                </h1>
                <p className="text-xs text-muted-foreground font-mono">
                  Mission Control Interface
                </p>
              </div>
            </div>

            {/* Agent info and logout */}
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

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Target className="w-5 h-5" />}
            label="Total Missions"
            value={stats.total}
            color="text-primary"
          />
          <StatCard
            icon={<AlertTriangle className="w-5 h-5" />}
            label="Active Ops"
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

        {/* Add mission form */}
        <div className="mb-6">
          <AddMissionForm onAdd={addMission} />
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-6">
          {(['all', 'active', 'completed'] as const).map((f) => (
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
          {filteredMissions.length > 0 ? (
            filteredMissions.map((mission, index) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                onComplete={completeMission}
                onDelete={deleteMission}
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
                Create a new mission to get started
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
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

/**
 * Statistics card component for the dashboard header
 */
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
