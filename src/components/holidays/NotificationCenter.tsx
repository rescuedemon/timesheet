import React from 'react';

interface Entry {
  id: string;
  content: string;
  type: string;
  date: Date;
  reminders?: any;
  completed?: boolean;
  pinned?: boolean;
  archived?: boolean;
  mood?: string;
  tags?: string[];
  attachments?: string[];
  tasks?: any[];
  gratitude?: string[];
}

interface NotificationCenterProps {
  notifications: Entry[];
  setNotifications: React.Dispatch<React.SetStateAction<Entry[]>>;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ notifications, setNotifications }) => {
  if (notifications.length === 0) return null;

  const handleCloseNotification = (id: string) => {
    setNotifications(prev => prev.filter(entry => entry.id !== id));
  };

  const handleCloseAll = () => {
    setNotifications([]);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-4 max-w-sm">
      {notifications.length > 1 && (
        <div className="flex justify-end">
          <button 
            onClick={handleCloseAll}
            className="text-sm font-medium text-white bg-gray-700 hover:bg-gray-800 px-3 py-1 rounded-lg transition-colors"
          >
            Close All
          </button>
        </div>
      )}
      {notifications.map(entry => (
        <div key={entry.id} className="bg-blue-500 text-white p-4 rounded-lg shadow-xl animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold">Reminder</h3>
              <p className="text-sm">{entry.content || 'Reminder notification'}</p>
            </div>
            <button 
              className="ml-4 text-white hover:text-gray-200 text-lg"
              onClick={() => handleCloseNotification(entry.id)}
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationCenter;