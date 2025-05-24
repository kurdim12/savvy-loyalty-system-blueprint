
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDistance } from 'date-fns';

interface NotificationListProps {
  onClose: () => void;
}

export const NotificationList = ({ onClose }: NotificationListProps) => {
  const { notifications, isLoading, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  if (isLoading) {
    return <div className="p-4 text-center">Loading notifications...</div>;
  }

  return (
    <div className="max-h-96">
      <div className="p-3 border-b flex items-center justify-between">
        <h3 className="font-semibold">Notifications</h3>
        {unreadCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => markAllAsRead.mutate()}
            disabled={markAllAsRead.isPending}
          >
            Mark all read
          </Button>
        )}
      </div>
      
      <ScrollArea className="max-h-80">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No notifications yet
          </div>
        ) : (
          notifications.map((notification, index) => (
            <div key={notification.id}>
              <div 
                className={`p-3 hover:bg-gray-50 cursor-pointer ${
                  !notification.read ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
                onClick={() => {
                  if (!notification.read) {
                    markAsRead.mutate(notification.id);
                  }
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDistance(new Date(notification.created_at), new Date(), { addSuffix: true })}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1" />
                  )}
                </div>
              </div>
              {index < notifications.length - 1 && <Separator />}
            </div>
          ))
        )}
      </ScrollArea>
    </div>
  );
};
