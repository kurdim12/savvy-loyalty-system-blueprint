
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Connection {
  id: string;
  connected_user_id: string;
  connection_type: string;
  first_met_at: string;
  shared_experiences: string[];
  notes: string;
  connected_user: {
    first_name: string;
    last_name: string;
    avatar_url: string;
    current_mood: string;
    favorite_coffee_origin: string;
  };
}

export const ConnectionsView = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);

  useEffect(() => {
    if (user) {
      fetchConnections();
    }
  }, [user]);

  const fetchConnections = async () => {
    try {
      const { data, error } = await supabase
        .from('user_connections')
        .select(`
          *,
          connected_user:profiles!user_connections_connected_user_id_fkey(
            first_name,
            last_name,
            avatar_url,
            current_mood,
            favorite_coffee_origin
          )
        `)
        .eq('user_id', user?.id)
        .order('first_met_at', { ascending: false });

      if (error) throw error;
      setConnections(data || []);
    } catch (error) {
      console.error('Error fetching connections:', error);
    }
  };

  const getConnectionIcon = (type: string) => {
    switch (type) {
      case 'friend': return <Heart className="h-4 w-4" />;
      case 'mentor': return <Users className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getConnectionColor = (type: string) => {
    switch (type) {
      case 'friend': return 'bg-pink-100 text-pink-800';
      case 'mentor': return 'bg-blue-100 text-blue-800';
      case 'mentee': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="border-[#8B4513]/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#8B4513]">
          <Users className="h-5 w-5" />
          Meaningful Connections
        </CardTitle>
        <CardDescription className="text-[#6F4E37]">
          People you've connected with through the coffee community
        </CardDescription>
      </CardHeader>
      <CardContent>
        {connections.length > 0 ? (
          <div className="space-y-4">
            {connections.map((connection) => (
              <div key={connection.id} className="border rounded-lg p-4 border-[#8B4513]/20">
                <div className="flex items-start gap-4">
                  <img
                    src={connection.connected_user.avatar_url || '/placeholder.svg'}
                    alt="Connection Avatar"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-[#8B4513]">
                        {connection.connected_user.first_name} {connection.connected_user.last_name}
                      </h4>
                      <Badge className={getConnectionColor(connection.connection_type)}>
                        {getConnectionIcon(connection.connection_type)}
                        <span className="ml-1 capitalize">{connection.connection_type}</span>
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2 mb-2 text-sm text-[#6F4E37]">
                      {connection.connected_user.current_mood && (
                        <span>Mood: {connection.connected_user.current_mood}</span>
                      )}
                      {connection.connected_user.favorite_coffee_origin && (
                        <span>• Loves: {connection.connected_user.favorite_coffee_origin} coffee</span>
                      )}
                    </div>

                    {connection.shared_experiences && connection.shared_experiences.length > 0 && (
                      <div className="flex gap-1 mb-2">
                        {connection.shared_experiences.map((experience, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {experience}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {connection.notes && (
                      <p className="text-sm text-[#6F4E37] mb-2">{connection.notes}</p>
                    )}

                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Met on {new Date(connection.first_met_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-[#8B4513]/30 mx-auto mb-4" />
            <p className="text-[#6F4E37]">
              No connections yet. Start conversations in the community to build meaningful relationships!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
