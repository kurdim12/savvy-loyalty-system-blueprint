
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, MapPin, Plus, User, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Reservation {
  id: string;
  user_id: string;
  table_id: string;
  reservation_date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  profiles: {
    first_name: string;
    last_name: string;
  };
}

export const TableReservations = () => {
  const { user } = useAuth();
  const [showReserveDialog, setShowReserveDialog] = useState(false);
  const [newReservation, setNewReservation] = useState({
    tableId: '',
    date: '',
    startTime: '',
    endTime: ''
  });
  const queryClient = useQueryClient();

  // Available tables (in a real app, this would come from the database)
  const availableTables = [
    { id: 'window-1', name: 'Window Table 1', capacity: 2, location: 'By the window' },
    { id: 'window-2', name: 'Window Table 2', capacity: 4, location: 'By the window' },
    { id: 'center-1', name: 'Center Table 1', capacity: 6, location: 'Center area' },
    { id: 'corner-cozy', name: 'Cozy Corner', capacity: 2, location: 'Quiet corner' },
    { id: 'counter-bar', name: 'Bar Counter', capacity: 3, location: 'Coffee bar' },
    { id: 'study-nook', name: 'Study Nook', capacity: 1, location: 'Private study area' }
  ];

  // Fetch user's reservations
  const { data: userReservations = [], isLoading } = useQuery({
    queryKey: ['table-reservations', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('table_reservations')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name
          )
        `)
        .eq('user_id', user.id)
        .gte('reservation_date', new Date().toISOString().split('T')[0])
        .order('reservation_date', { ascending: true });
      
      if (error) throw error;
      return data as Reservation[];
    },
    enabled: !!user?.id,
  });

  // Create reservation
  const createReservation = useMutation({
    mutationFn: async (reservationData: typeof newReservation) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('table_reservations')
        .insert({
          user_id: user.id,
          table_id: reservationData.tableId,
          reservation_date: reservationData.date,
          start_time: reservationData.startTime,
          end_time: reservationData.endTime,
          status: 'pending'
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Table reservation requested! You\'ll be notified once confirmed.');
      setNewReservation({
        tableId: '',
        date: '',
        startTime: '',
        endTime: ''
      });
      setShowReserveDialog(false);
      queryClient.invalidateQueries({ queryKey: ['table-reservations'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create reservation');
    }
  });

  // Cancel reservation
  const cancelReservation = useMutation({
    mutationFn: async (reservationId: string) => {
      const { error } = await supabase
        .from('table_reservations')
        .update({ status: 'cancelled' })
        .eq('id', reservationId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Reservation cancelled');
      queryClient.invalidateQueries({ queryKey: ['table-reservations'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to cancel reservation');
    }
  });

  const getTableInfo = (tableId: string) => {
    return availableTables.find(t => t.id === tableId) || { name: tableId, capacity: 1, location: 'Unknown' };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-[#8B4513]">
              <MapPin className="h-5 w-5" />
              Table Reservations
            </CardTitle>
            
            {user && (
              <Dialog open={showReserveDialog} onOpenChange={setShowReserveDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-[#8B4513] hover:bg-[#8B4513]/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Reserve Table
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Reserve a Table</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Select Table</label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={newReservation.tableId}
                        onChange={(e) => setNewReservation(prev => ({ ...prev, tableId: e.target.value }))}
                      >
                        <option value="">Choose a table...</option>
                        {availableTables.map((table) => (
                          <option key={table.id} value={table.id}>
                            {table.name} (Seats {table.capacity}) - {table.location}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Date</label>
                      <Input
                        type="date"
                        min={getTomorrowDate()}
                        value={newReservation.date}
                        onChange={(e) => setNewReservation(prev => ({ ...prev, date: e.target.value }))}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Start Time</label>
                        <Input
                          type="time"
                          value={newReservation.startTime}
                          onChange={(e) => setNewReservation(prev => ({ ...prev, startTime: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">End Time</label>
                        <Input
                          type="time"
                          value={newReservation.endTime}
                          onChange={(e) => setNewReservation(prev => ({ ...prev, endTime: e.target.value }))}
                        />
                      </div>
                    </div>
                    <Button
                      onClick={() => createReservation.mutate(newReservation)}
                      disabled={
                        createReservation.isPending || 
                        !newReservation.tableId || 
                        !newReservation.date || 
                        !newReservation.startTime || 
                        !newReservation.endTime
                      }
                      className="w-full bg-[#8B4513] hover:bg-[#8B4513]/90"
                    >
                      {createReservation.isPending ? 'Reserving...' : 'Reserve Table'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Reserve your favorite table in advance. Reservations are subject to approval.
          </p>
        </CardContent>
      </Card>

      {/* User's Reservations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#8B4513]">Your Reservations</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-muted-foreground py-4">Loading reservations...</p>
          ) : userReservations.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No upcoming reservations. Reserve a table to ensure your spot!
            </p>
          ) : (
            <div className="space-y-4">
              {userReservations.map((reservation) => {
                const tableInfo = getTableInfo(reservation.table_id);
                
                return (
                  <div key={reservation.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{tableInfo.name}</h4>
                          <Badge className={getStatusColor(reservation.status)}>
                            {reservation.status}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(reservation.reservation_date)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatTime(reservation.start_time)} - {formatTime(reservation.end_time)}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {tableInfo.location} • Seats {tableInfo.capacity}
                          </div>
                        </div>
                      </div>
                      
                      {reservation.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => cancelReservation.mutate(reservation.id)}
                          disabled={cancelReservation.isPending}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Tables Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#8B4513]">Available Tables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {availableTables.map((table) => (
              <div key={table.id} className="p-3 border rounded-lg">
                <h4 className="font-medium">{table.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Seats {table.capacity} • {table.location}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
