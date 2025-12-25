import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Todo } from '@/types/mission';
import { useToast } from '@/hooks/use-toast';

interface DatabaseMission {
  id: string;
  user_id: string;
  codename: string;
  briefing: string | null;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'inactive' | 'active' | 'completed';
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export function useMissions() {
  const [missions, setMissions] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const mapDatabaseToTodo = (dbMission: DatabaseMission): Todo => ({
    id: dbMission.id,
    codename: dbMission.codename,
    briefing: dbMission.briefing || '',
    priority: dbMission.priority,
    status: dbMission.status,
    dueDate: dbMission.due_date ? new Date(dbMission.due_date) : undefined,
    completedAt: dbMission.completed_at ? new Date(dbMission.completed_at) : undefined,
    createdAt: new Date(dbMission.created_at),
  });

  const fetchMissions = useCallback(async () => {
    if (!user) {
      setMissions([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedMissions = (data as DatabaseMission[]).map(mapDatabaseToTodo);
      setMissions(mappedMissions);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error fetching missions:', error);
      }
      toast({
        title: 'Error',
        description: 'Failed to load missions. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  const addMission = async (missionData: Omit<Todo, 'id' | 'createdAt' | 'status'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('missions')
        .insert({
          user_id: user.id,
          codename: missionData.codename,
          briefing: missionData.briefing || null,
          priority: missionData.priority,
          status: 'active',
          due_date: missionData.dueDate?.toISOString() || null,
        })
        .select()
        .single();

      if (error) throw error;

      const newMission = mapDatabaseToTodo(data as DatabaseMission);
      setMissions(prev => [newMission, ...prev]);
      
      toast({
        title: 'Mission Created',
        description: `${missionData.codename} has been added to your missions.`,
      });
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error adding mission:', error);
      }
      toast({
        title: 'Error',
        description: 'Failed to create mission. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const updateMissionStatus = async (id: string, status: Todo['status']) => {
    try {
      const updateData: { status: string; completed_at?: string | null } = { status };
      
      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      } else {
        updateData.completed_at = null;
      }

      const { error } = await supabase
        .from('missions')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      setMissions(prev => prev.map(m => 
        m.id === id 
          ? { ...m, status, completedAt: status === 'completed' ? new Date() : undefined }
          : m
      ));
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error updating mission:', error);
      }
      toast({
        title: 'Error',
        description: 'Failed to update mission status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const deleteMission = async (id: string) => {
    try {
      const { error } = await supabase
        .from('missions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMissions(prev => prev.filter(m => m.id !== id));
      
      toast({
        title: 'Mission Deleted',
        description: 'The mission has been removed.',
      });
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error deleting mission:', error);
      }
      toast({
        title: 'Error',
        description: 'Failed to delete mission. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return {
    missions,
    isLoading,
    addMission,
    updateMissionStatus,
    deleteMission,
    refetch: fetchMissions,
  };
}
