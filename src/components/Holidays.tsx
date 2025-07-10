import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Plus, Trash2, Pin, Archive, Check, Copy, Download, Upload, Cloud, RefreshCw } from 'lucide-react';

interface Holiday {
  id: string;
  name: string;
  date: string;
}

interface PlannedLeave {
  id: string;
  name: string;
  employee: string;
  startDate: string;
  endDate: string;
}

interface Entry {
  id: string;
  content: string;
  type: EntryType;
  date: Date;
  reminders?: ReminderSettings;
  completed?: boolean;
  pinned?: boolean;
  archived?: boolean;
}

type EntryType = 'Diary' | 'Reminder' | 'Note to Yourself' | 'Meeting Notes' | 'Idea/Scratchpad' | 'Journal' | 'To-Do List' | 'Gratitude Log' | 'Dream Log' | 'Mood Tracker';

interface ReminderSettings {
  time: Date;
}

interface FilterOptions {
  type?: EntryType;
  date?: Date;
  status?: 'completed' | 'pending';
}

interface DiaryStats {
  entriesThisMonth: number;
  completedReminders: number;
}

const defaultHolidays: Holiday[] = [
  { id: '1', name: 'New Year\'s Day', date: '2025-01-01' },
  { id: '2', name: 'Republic Day', date: '2025-01-26' },
  { id: '3', name: 'Holi', date: '2025-03-14' },
  { id: '4', name: 'Good Friday', date: '2025-04-18' },
  { id: '5', name: 'Independence Day', date: '2025-08-15' },
  { id: '6', name: 'Gandhi Jayanti', date: '2025-10-02' },
  { id: '7', name: 'Diwali', date: '2025-10-20' },
  { id: '8', name: 'Christmas Day', date: '2025-12-25' },
];

const Holidays: React.FC = () => {
  const [holidays, setHolidays] = useState<Holiday[]>(defaultHolidays);
  const [plannedLeaves, setPlannedLeaves] = useState<PlannedLeave[]>([]);
  const [showPlannedLeaves, setShowPlannedLeaves] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isAddingLeave, setIsAddingLeave] = useState(false);
  const [newLeave, setNewLeave] = useState({ name: '', employee: '', startDate: '', endDate: '' });
  const [showHolidaysDialog, setShowHolidaysDialog] = useState(false);
  const [holidaysViewMonth, setHolidaysViewMonth] = useState<Date | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selectedDateForEntries, setSelectedDateForEntries] = useState<Date | null>(null);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // Progress bar settings
  const [isAnimationEnabled, setIsAnimationEnabled] = useState(() => {
    const saved = localStorage.getItem('progressbar-enabled');
    return saved ? JSON.parse(saved) : false;
  });
  const [progressBarColor, setProgressBarColor] = useState(() => {
    const saved = localStorage.getItem('progressbar-color');
    return saved || '#10b981';
  });

  // Softer color function
  const createSofterColor = (hex: string, softenFactor = 0.5) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const blendR = Math.round(r * softenFactor + 245 * (1 - softenFactor));
    const blendG = Math.round(g * softenFactor + 245 * (1 - softenFactor));
    const blendB = Math.round(b * softenFactor + 245 * (1 - softenFactor));
    return `rgb(${blendR}, ${blendG}, ${blendB})`;
  };

  // Text color based on luminance
  const getTextColor = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6 ? '#374151' : '#f9fafb';
  };

  // Container styles
  const containerBgColor = useMemo(() => {
    return isAnimationEnabled ? createSofterColor(progressBarColor, 0.5) : '#1f2937';
  }, [isAnimationEnabled, progressBarColor]);

  const containerTextColor = useMemo(() => {
    return isAnimationEnabled ? getTextColor(progressBarColor) : '#ffffff';
  }, [isAnimationEnabled, progressBarColor]);

  // Event listeners
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'progressbar-color' && e.newValue) setProgressBarColor(e.newValue);
      if (e.key === 'progressbar-enabled' && e.newValue !== null) setIsAnimationEnabled(JSON.parse(e.newValue));
    };

    const handleSettingsChange = () => {
      const savedColor = localStorage.getItem('progressbar-color');
      if (savedColor) setProgressBarColor(savedColor);
      const savedEnabled = localStorage.getItem('progressbar-enabled');
      setIsAnimationEnabled(savedEnabled ? JSON.parse(savedEnabled) : false);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('settings-changed', handleSettingsChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('settings-changed', handleSettingsChange);
    };
  }, []);

  // Helper functions
  const getHolidayDates = () => holidays.map(holiday => new Date(holiday.date));
  const getHolidaysForMonth = (month: Date) => {
    return holidays.filter(holiday => {
      const holidayDate = new Date(holiday.date);
      return holidayDate.getMonth() === month.getMonth() && holidayDate.getFullYear() === month.getFullYear();
    });
  };
  const getPlannedLeaveDates = () => {
    const dates: Date[] = [];
    plannedLeaves.forEach(leave => {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        dates.push(new Date(date));
      }
    });
    return dates;
  };

  const handleAddPlannedLeave = () => {
    if (newLeave.name && newLeave.employee && newLeave.startDate && newLeave.endDate) {
      const leave: PlannedLeave = { id: Date.now().toString(), ...newLeave };
      setPlannedLeaves([...plannedLeaves, leave]);
      setNewLeave({ name: '', employee: '', startDate: '', endDate: '' });
      setIsAddingLeave(false);
    }
  };

  const handleRemovePlannedLeave = (leaveId: string) => {
    setPlannedLeaves(plannedLeaves.filter(leave => leave.id !== leaveId));
  };

  const handleRemoveHoliday = (holidayId: string) => {
    setHolidays(holidays.filter(holiday => holiday.id !== holidayId));
  };

  const nextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  const prevMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  // Core Functions
  const saveEntry = async (content: string, type: EntryType, date: Date, reminders?: ReminderSettings) => {
    const id = Date.now().toString();
    const entry: Entry = { id, content, type, date, reminders };
    setEntries([...entries, entry]);
  };

  const deleteEntry = async (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const getEntries = async (date?: Date) => {
    if (date) {
      return entries.filter(entry => isSameDay(entry.date, date));
    }
    return entries;
  };

  const updateEntry = async (id: string, updatedFields: Partial<Entry>) => {
    setEntries(entries.map(entry => (entry.id === id ? { ...entry, ...updatedFields } : entry)));
  };

  // Additional Functional Features
  const setReminder = async (id: string, reminderTime: Date) => {
    const reminderSettings: ReminderSettings = { time: reminderTime };
    await updateEntry(id, { reminders: reminderSettings });
  };

  const getReminderSettings = async (id: string) => {
    const entry = entries.find(entry => entry.id === id);
    return entry?.reminders;
  };

  const markAsCompleted = async (id: string) => {
    await updateEntry(id, { completed: true });
  };

  const duplicateEntry = async (id: string) => {
    const entry = entries.find(entry => entry.id === id);
    if (entry) {
      const newEntry = { ...entry, id: Date.now().toString() };
      setEntries([...entries, newEntry]);
      return newEntry.id;
    }
    throw new Error('Entry not found');
  };

  // Utility & Navigation
  const searchEntries = async (query: string, filters?: FilterOptions) => {
    let filteredEntries = entries.filter(entry => entry.content.toLowerCase().includes(query.toLowerCase()));
    if (filters) {
      if (filters.type) filteredEntries = filteredEntries.filter(entry => entry.type === filters.type);
      if (filters.date) filteredEntries = filteredEntries.filter(entry => isSameDay(entry.date, filters.date));
      if (filters.status) filteredEntries = filteredEntries.filter(entry => entry.completed === (filters.status === 'completed'));
    }
    return filteredEntries;
  };

  const exportEntries = async (format: 'pdf' | 'txt' | 'md', dateRange?: [Date, Date]) => {
    let filteredEntries = entries;
    if (dateRange) {
      filteredEntries = entries.filter(entry => entry.date >= dateRange[0] && entry.date <= dateRange[1]);
    }
    const content = filteredEntries.map(entry => `${entry.date.toDateString()}: ${entry.content}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const file = new File([blob], `entries.${format}`, { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download = `entries.${format}`;
    link.click();
    return file;
  };

  const importEntries = async (file: File) => {
    const content = await file.text();
    const newEntries = content.split('\n').map(line => {
      const [dateStr, ...contentParts] = line.split(':');
      const date = new Date(dateStr);
      const content = contentParts.join(':');
      return { id: Date.now().toString(), content, type: 'Note to Yourself' as EntryType, date };
    });
    setEntries([...entries, ...newEntries]);
  };

  const syncWithCloud = async () => {
    console.log('Syncing with cloud...');
    // Implement cloud sync logic here
  };

  const restoreFromBackup = async (backupId: string) => {
    console.log(`Restoring from backup ${backupId}...`);
    // Implement backup restore logic here
  };

  // Optional Features
  const pinEntry = async (id: string) => {
    await updateEntry(id, { pinned: true });
  };

  const archiveEntry = async (id: string) => {
    await updateEntry(id, { archived: true });
  };

  const toggleDarkMode = (enabled: boolean) => {
    setDarkMode(enabled);
    document.body.classList.toggle('dark', enabled);
  };

  const getStats = async (): Promise<DiaryStats> => {
    const thisMonth = new Date().getMonth();
    const entriesThisMonth = entries.filter(entry => entry.date.getMonth() === thisMonth).length;
    const completedReminders = entries.filter(entry => entry.completed && entry.type === 'Reminder').length;
    return { entriesThisMonth, completedReminders };
  };

  // Calendar UI Component
  const CalendarUI = ({ month }: { month: Date }) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date: Date) => {
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
      return firstDay === 0 ? 6 : firstDay - 1;
    };

    const handleDateClick = (day: number) => {
      const clickedDate = new Date(month.getFullYear(), month.getMonth(), day);
      setSelectedDateForEntries(clickedDate);
    };

    const renderCalendarDays = () => {
      const daysInMonth = getDaysInMonth(month);
      const firstDay = getFirstDayOfMonth(month);
      const days = [];
      const holidayDates = getHolidayDates();
      const leaveDates = getPlannedLeaveDates();

      for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="w-12 h-12"></div>);
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(month.getFullYear(), month.getMonth(), day);
        const hasEntries = entries.some(entry => isSameDay(entry.date, date));
        const isToday = date.toDateString() === new Date().toDateString();
        const isHoliday = holidayDates.some(d => d.toDateString() === date.toDateString());
        const isLeave = showPlannedLeaves && leaveDates.some(d => d.toDateString() === date.toDateString());
        const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;

        let className = "w-12 h-12 flex items-center justify-center rounded-lg font-semibold cursor-pointer transition-all duration-200 text-xl relative";
        if (isWeekend) className += " bg-gray-100 text-gray-500 hover:bg-gray-200";
        else className += " hover:bg-gray-100 text-gray-700";
        if (isToday) className += " bg-blue-500 text-white hover:bg-blue-600";
        else if (isSelected) className += " bg-gray-700 text-white";
        else if (isHoliday) className += " bg-red-500 text-white hover:bg-red-600";
        else if (isLeave) className += " bg-green-500 text-white hover:bg-green-600";

        const dotColor = isToday || isSelected || isHoliday || isLeave ? 'white' : 'black';

        days.push(
          <div key={day} onClick={() => handleDateClick(day)} className={className}>
            {hasEntries && (
              <div
                className={`w-2 h-2 rounded-full ${dotColor === 'white' ? 'bg-white' : 'bg-black'} blink absolute top-1 left-1`}
              ></div>
            )}
            {day}
          </div>
        );
      }

      return days;
    };

    return (
      <div className="w-full">
        <style>
          {`
            @keyframes blink {
              0% { opacity: 1; }
              50% { opacity: 0; }
              100% { opacity: 1; }
            }
            .blink {
              animation: blink 1s infinite;
            }
          `}
        </style>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6" style={{ backgroundColor: containerBgColor, color: containerTextColor }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar size={20} />
                <span className="text-lg font-bold">Calendar</span>
              </div>
              <div className="flex items-center gap-6">
                <button
                  onClick={prevMonth}
                  className="w-9 h-9 rounded-lg bg-white bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition-all font-bold text-lg"
                  style={{ color: containerTextColor }}
                >
                  ‹
                </button>
                <div className="text-xl font-bold min-w-48 text-center">
                  {months[month.getMonth()]} {month.getFullYear()}
                </div>
                <button
                  onClick={nextMonth}
                  className="w-9 h-9 rounded-lg bg-white bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition-all font-bold text-lg"
                  style={{ color: containerTextColor }}
                >
                  ›
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-7 gap-2 mb-4">
              {daysOfWeek.map((day, index) => (
                <div key={day} className={`w-12 text-center font-bold py-2 text-lg ${index >= 5 ? 'text-gray-400' : 'text-gray-600'}`}>
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {renderCalendarDays()}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Entry Popup Component
  const EntryPopup = ({ date }: { date: Date }) => {
    const [newEntry, setNewEntry] = useState({ content: '', type: 'Note to Yourself' as EntryType, reminderTime: '' });
    const dayEntries = entries.filter(entry => isSameDay(entry.date, date) && !entry.archived).sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

    const handleSaveEntry = async () => {
      if (newEntry.content) {
        const reminders = newEntry.reminderTime ? { time: new Date(newEntry.reminderTime) } : undefined;
        await saveEntry(newEntry.content, newEntry.type, date, reminders);
        setNewEntry({ content: '', type: 'Note to Yourself', reminderTime: '' });
      }
    };

    const handleEditEntry = async (entry: Entry) => {
      if (editingEntry && editingEntry.id === entry.id) {
        await updateEntry(entry.id, { content: editingEntry.content, type: editingEntry.type });
        setEditingEntry(null);
      } else {
        setEditingEntry(entry);
      }
    };

    const handleSearch = async () => {
      const results = await searchEntries(searchQuery);
      console.log('Search results:', results);
    };

    const handleExport = async () => {
      await exportEntries('txt', [date, date]);
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        importEntries(e.target.files[0]);
      }
    };

    return (
      <DialogContent className={`sm:max-w-[600px] bg-white text-black rounded-lg shadow-2xl p-6 ${darkMode ? 'dark:bg-gray-800 dark:text-white' : ''}`}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Entries for {date.toLocaleDateString()}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* New Entry Form */}
          <div className="space-y-2">
            <Label htmlFor="content">New Entry</Label>
            <Input
              id="content"
              value={newEntry.content}
              onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
              placeholder="Enter your note or reminder"
            />
            <Select
              value={newEntry.type}
              onValueChange={(value) => setNewEntry({ ...newEntry, type: value as EntryType })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {['Diary', 'Reminder', 'Note to Yourself', 'Meeting Notes', 'Idea/Scratchpad', 'Journal', 'To-Do List', 'Gratitude Log', 'Dream Log', 'Mood Tracker'].map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="datetime-local"
              value={newEntry.reminderTime}
              onChange={(e) => setNewEntry({ ...newEntry, reminderTime: e.target.value })}
              placeholder="Set reminder"
            />
            <Button onClick={handleSaveEntry} className="w-full bg-black text-white hover:bg-gray-800">Save Entry</Button>
          </div>

          {/* Existing Entries */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {dayEntries.map(entry => (
              <div key={entry.id} className="flex items-center justify-between p-2 border-b">
                {editingEntry && editingEntry.id === entry.id ? (
                  <>
                    <Input
                      value={editingEntry.content}
                      onChange={(e) => setEditingEntry({ ...editingEntry, content: e.target.value })}
                    />
                    <Select
                      value={editingEntry.type}
                      onValueChange={(value) => setEditingEntry({ ...editingEntry, type: value as EntryType })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {['Diary', 'Reminder', 'Note to Yourself', 'Meeting Notes', 'Idea/Scratchpad', 'Journal', 'To-Do List', 'Gratitude Log', 'Dream Log', 'Mood Tracker'].map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </>
                ) : (
                  <div className="flex-1">
                    <span className={entry.completed ? 'line-through text-gray-500' : ''}>{entry.content}</span>
                    <span className="text-sm text-gray-500 ml-2">({entry.type})</span>
                    {entry.pinned && <Pin size={14} className="inline ml-2" />}
                  </div>
                )}
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => handleEditEntry(entry)}>{editingEntry?.id === entry.id ? 'Save' : 'Edit'}</Button>
                  <Button size="sm" variant="ghost" onClick={() => deleteEntry(entry.id)}><Trash2 size={14} /></Button>
                  <Button size="sm" variant="ghost" onClick={() => markAsCompleted(entry.id)}><Check size={14} /></Button>
                  <Button size="sm" variant="ghost" onClick={() => duplicateEntry(entry.id)}><Copy size={14} /></Button>
                  <Button size="sm" variant="ghost" onClick={() => pinEntry(entry.id)}><Pin size={14} /></Button>
                  <Button size="sm" variant="ghost" onClick={() => archiveEntry(entry.id)}><Archive size={14} /></Button>
                </div>
              </div>
            ))}
          </div>

          {/* Utility & Navigation */}
          <div className="space-y-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search entries..."
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <div className="flex gap-2">
              <Button onClick={handleExport}><Download size={14} className="mr-2" /> Export</Button>
              <label className="flex items-center px-4 py-2 bg-black text-white rounded cursor-pointer hover:bg-gray-800">
                <Upload size={14} className="mr-2" /> Import
                <input type="file" className="hidden" onChange={handleImport} />
              </label>
              <Button onClick={syncWithCloud}><Cloud size={14} className="mr-2" /> Sync</Button>
              <Button onClick={() => restoreFromBackup('backup1')}><RefreshCw size={14} className="mr-2" /> Restore</Button>
            </div>
            <Button onClick={() => toggleDarkMode(!darkMode)} className="w-full">
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </Button>
            <Button onClick={async () => console.log(await getStats())} className="w-full">View Stats</Button>
          </div>
        </div>
      </DialogContent>
    );
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-gray-50 to-white text-black'} p-6 font-sans`} style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <div className="max-w-7xl mx-auto">
        {/* Top Navigation */}
        <div className="px-6 py-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4"></div>
            <div className="flex items-center gap-4">
              <button
                style={{ backgroundColor: '#1f2937', color: '#ffffff' }}
                className="px-4 py-2 rounded-full text-sm font-semibold transition-all hover:brightness-95"
                onClick={() => setShowPlannedLeaves(!showPlannedLeaves)}
              >
                📅 Planned Leaves
              </button>
              <button
                style={{ backgroundColor: '#1f2937', color: '#ffffff' }}
                className="px-4 py-2 rounded-full text-sm font-semibold transition-all hover:brightness-95"
                onClick={() => setShowHolidaysDialog(true)}
              >
                📅 Holidays
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <CalendarUI month={currentMonth} />
          
          {/* Bottom Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Holidays Section */}
            {getHolidaysForMonth(currentMonth).length > 0 && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b" style={{ backgroundColor: containerBgColor, color: containerTextColor }}>
                  <h3 className="text-lg font-bold">Public Holidays</h3>
                </div>
                <div className="p-6" style={{ color: isAnimationEnabled ? '#1f2937' : '#ffffff' }}>
                  {getHolidaysForMonth(currentMonth).map(holiday => (
                    <div key={holiday.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div>
                        <h4 className="font-bold">{holiday.name}</h4>
                        <p className="text-sm font-medium">
                          {new Date(holiday.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <button
                        className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                        onClick={() => handleRemoveHoliday(holiday.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Planned Leaves Section */}
            {showPlannedLeaves && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b flex items-center justify-between" style={{ backgroundColor: containerBgColor, color: containerTextColor }}>
                  <h3 className="text-lg font-bold">Planned Leaves</h3>
                  <Dialog open={isAddingLeave} onOpenChange={setIsAddingLeave}>
                    <DialogTrigger asChild>
                      <button className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold hover:bg-green-700 transition-all flex items-center gap-1">
                        <Plus size={14} />
                        Add Leave
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-white text-black">
                      <DialogHeader>
                        <DialogTitle className="font-bold">Add Planned Leave</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label htmlFor="leave-name" className="font-semibold">Leave Name</Label>
                          <Input
                            id="leave-name"
                            value={newLeave.name}
                            onChange={(e) => setNewLeave({...newLeave, name: e.target.value})}
                            placeholder="e.g., Annual Leave"
                            className="font-medium"
                          />
                        </div>
                        <div>
                          <Label htmlFor="employee" className="font-semibold">Employee</Label>
                          <Input
                            id="employee"
                            value={newLeave.employee}
                            onChange={(e) => setNewLeave({...newLeave, employee: e.target.value})}
                            placeholder="Employee name"
                            className="font-medium"
                          />
                        </div>
                        <div>
                          <Label htmlFor="startDate" className="font-semibold">Start Date</Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={newLeave.startDate}
                            onChange={(e) => setNewLeave({...newLeave, startDate: e.target.value})}
                            className="font-medium"
                          />
                        </div>
                        <div>
                          <Label htmlFor="endDate" className="font-semibold">End Date</Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={newLeave.endDate}
                            onChange={(e) => setNewLeave({...newLeave, endDate: e.target.value})}
                            className="font-medium"
                          />
                        </div>
                        <Button
                          onClick={handleAddPlannedLeave}
                          className="w-full bg-green-600 hover:bg-green-700 font-semibold"
                        >
                          Add Leave
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="p-6" style={{ color: isAnimationEnabled ? '#1f2937' : '#ffffff' }}>
                  {plannedLeaves.length > 0 ? (
                    plannedLeaves.map(leave => (
                      <div key={leave.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                        <div>
                          <h4 className="font-bold">{leave.name}</h4>
                          <p className="text-sm font-medium">
                            {leave.employee} • {new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                          onClick={() => handleRemovePlannedLeave(leave.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">📅</div>
                      <p className="font-medium">No planned leaves added yet</p>
                      <p className="text-sm font-medium">Click "Add Leave" to create one</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Entries Dialog */}
        <Dialog open={selectedDateForEntries !== null} onOpenChange={() => setSelectedDateForEntries(null)}>
          {selectedDateForEntries && <EntryPopup date={selectedDateForEntries} />}
        </Dialog>
      </div>
    </div>
  );
};

export default Holidays;