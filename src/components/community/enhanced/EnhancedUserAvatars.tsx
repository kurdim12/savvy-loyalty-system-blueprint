
import { Coffee, Headphones, Laptop, MessageCircle, Sparkles } from 'lucide-react';

interface EnhancedUser {
  id: string;
  name: string;
  mood: string;
  activity: string;
  coffeePreference?: string;
  status: 'working' | 'chatting' | 'available' | 'focused';
  drinkType?: 'espresso' | 'latte' | 'cappuccino' | 'americano';
}

interface EnhancedUserAvatarsProps {
  users: EnhancedUser[];
  seatId: string;
  onUserHover: (user: EnhancedUser) => void;
}

export const EnhancedUserAvatars = ({ users, seatId, onUserHover }: EnhancedUserAvatarsProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'working': return Laptop;
      case 'chatting': return MessageCircle;
      case 'focused': return Headphones;
      default: return Coffee;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'working': return 'bg-blue-600 border-blue-300';
      case 'chatting': return 'bg-green-600 border-green-300';
      case 'focused': return 'bg-purple-600 border-purple-300';
      default: return 'bg-amber-600 border-amber-300';
    }
  };

  const getDrinkIcon = (drinkType?: string) => {
    return '☕'; // Could be expanded with specific drink emojis
  };

  return (
    <div className="flex flex-wrap gap-1">
      {users.slice(0, 4).map((user, index) => {
        const StatusIcon = getStatusIcon(user.status);
        
        return (
          <div
            key={user.id}
            className={`relative w-8 h-8 rounded-full flex items-center justify-center text-white border-2 cursor-pointer transition-all duration-300 hover:scale-110 ${getStatusColor(user.status)}`}
            onMouseEnter={() => onUserHover(user)}
            title={`${user.name} - ${user.activity}`}
          >
            {/* Main emoji/mood */}
            <span className="text-sm">{user.mood}</span>
            
            {/* Status indicator */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
              <StatusIcon className="h-2 w-2 text-gray-700" />
            </div>
            
            {/* Drink preference indicator */}
            {user.drinkType && (
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-amber-100 rounded-full flex items-center justify-center">
                <span className="text-xs">{getDrinkIcon(user.drinkType)}</span>
              </div>
            )}
            
            {/* Activity animation */}
            {user.status === 'chatting' && (
              <div className="absolute inset-0 rounded-full bg-green-400/30 animate-ping" />
            )}
            
            {user.status === 'available' && (
              <Sparkles className="absolute -top-2 -right-2 h-3 w-3 text-yellow-400 animate-pulse" />
            )}
          </div>
        );
      })}
      
      {users.length > 4 && (
        <div className="w-8 h-8 bg-gray-500/80 text-white rounded-full flex items-center justify-center text-xs border-2 border-gray-300">
          +{users.length - 4}
        </div>
      )}
    </div>
  );
};
